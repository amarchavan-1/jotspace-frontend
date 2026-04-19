import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const TagManagerModal = React.lazy(() => import('./TagManagerModal').then(module => ({ default: module.TagManagerModal })));

interface Note {
  id?: string;
  title: string;
  content: string;
  tags?: { id: string; name: string; color: string }[];
}

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: {title: string, content: string, tagIds: string[]}, id?: string) => void;
  initialData?: Note | null;
  loading: boolean;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose, onSave, initialData, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<{ id: string; name: string; color: string }[]>([]);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [editorKey, setEditorKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  const loadTags = async () => {
    try {
      // Dynamic import to avoid circular dependency issues if any
      const { tagApi } = await import('../api/tagApi');
      const tags = await tagApi.getAllTags();
      setAvailableTags(tags);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setEditorKey(Date.now().toString());
      if (initialData) {
        setTitle(initialData.title || '');
        setContent(initialData.content || '');
        setSelectedTagIds(initialData.tags?.map(t => t.id) || []);
      } else {
        setTitle('');
        setContent('');
        setSelectedTagIds([]);
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title || !title.trim()) {
      toast.error("Note title is required!");
      return;
    }
    
    const isQuillEmpty = !content || content.replace(/<(.|\n)*?>/g, '').trim().length === 0;
    if (isQuillEmpty) {
      toast.error("Note content is required!");
      return;
    }

    onSave({ title: title.trim(), content, tagIds: selectedTagIds }, initialData?.id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <input 
            type="text" 
            className="title-input" 
            placeholder="Note Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button className="action-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div className="quill-wrapper">
            <ReactQuill 
              key={editorKey}
              theme="snow"
              value={content}
              onChange={setContent}
              readOnly={loading}
              placeholder="Start typing your note here..."
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link', 'clean']
                ]
              }}
            />
          </div>
          
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tags</label>
              <button 
                className="btn-secondary sm" 
                onClick={() => setIsTagManagerOpen(true)}
                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              >
                Manage Tags
              </button>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {availableTags.map(tag => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTagIds(selectedTagIds.filter(id => id !== tag.id));
                      } else {
                        setSelectedTagIds([...selectedTagIds, tag.id]);
                      }
                    }}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      backgroundColor: isSelected ? tag.color : 'transparent',
                      color: isSelected ? '#fff' : 'var(--text-primary)',
                      border: `1px solid ${tag.color}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    #{tag.name}
                  </button>
                );
              })}
              {availableTags.length === 0 && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No tags available. Click manage to create some!</div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn-primary sm" onClick={handleSave} disabled={loading || !title?.trim()}>
            {loading ? <div className="spinner" style={{width: 16, height: 16, borderWidth: 2}}/> : (
              <>
                <Save size={16} />
                Save Note
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Import lazily or just render here if imported at top */}
      {isTagManagerOpen && (
        <React.Suspense fallback={<div />}>
          <TagManagerModal isOpen={isTagManagerOpen} onClose={() => setIsTagManagerOpen(false)} onTagsUpdated={loadTags} />
        </React.Suspense>
      )}
    </div>
  );
};
