import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { tagApi } from '../api/tagApi';
import type { TagResponse } from '../api/tagApi';
import toast from 'react-hot-toast';

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTagsUpdated: () => void;
}

const COLORS = [
  '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF33A8', 
  '#33FFF5', '#FFBD33', '#8C33FF', '#FF3333', '#33FF8C', '#5733FF'
];

export const TagManagerModal: React.FC<TagManagerModalProps> = ({ isOpen, onClose, onTagsUpdated }) => {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const data = await tagApi.getAllTags();
      setTags(data);
    } catch (err) {
      toast.error('Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await tagApi.updateTag(editingId, { name, color });
        toast.success('Tag updated');
      } else {
        await tagApi.createTag({ name, color });
        toast.success('Tag created');
      }
      setName('');
      setColor(COLORS[0]);
      setEditingId(null);
      loadTags();
      onTagsUpdated();
    } catch (err: any) {
      toast.error(err.response?.data || 'Failed to save tag');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;
    try {
      await tagApi.deleteTag(id);
      toast.success('Tag deleted');
      loadTags();
      onTagsUpdated();
    } catch (err) {
      toast.error('Failed to delete tag');
    }
  };

  const startEdit = (tag: TagResponse) => {
    setEditingId(tag.id);
    setName(tag.name);
    setColor(tag.color);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Manage Tags</h2>
          <button className="action-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Tag Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ flex: 1, minWidth: 150 }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {COLORS.slice(0, 5).map(c => (
                <div 
                  key={c} 
                  onClick={() => setColor(c)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', backgroundColor: c, cursor: 'pointer',
                    border: color === c ? '2px solid var(--text-primary)' : '2px solid transparent'
                  }}
                />
              ))}
              <input 
                 type="color" 
                 value={color} 
                 onChange={(e) => setColor(e.target.value)}
                 style={{ width: 28, height: 28, padding: 0, border: 'none', cursor: 'pointer' }}
              />
            </div>
            <button className="btn-primary sm" onClick={handleSave} disabled={loading || !name.trim()}>
              {editingId ? <><Save size={16} /> Update</> : <><Plus size={16} /> Add</>}
            </button>
            {editingId && (
              <button className="btn-secondary sm" onClick={() => { setEditingId(null); setName(''); }}>Cancel</button>
            )}
          </div>

          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {tags.length === 0 && !loading && (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No tags found. Create one above!</p>
            )}
            {tags.map(tag => (
              <div key={tag.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                <span className="tag-pill" style={{ backgroundColor: tag.color, color: '#fff' }}>#{tag.name}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="action-btn" onClick={() => startEdit(tag)}><Edit2 size={16} /></button>
                  <button className="action-btn danger" onClick={() => handleDelete(tag.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
