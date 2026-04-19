import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: { id: string; name: string; color: string }[];
  createdAt: string;
  updatedAt: string;
}

interface NoteCardProps {
  note: Note;
  isTrash: boolean;
  onEdit: (note: Note) => void;
  onDelete: (id: string, permanent: boolean) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, isTrash, onEdit, onDelete }) => {
  const formattedDate = new Date(note.updatedAt || note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="note-card animate-fade-in" onClick={() => !isTrash && onEdit(note)}>
      <h3 className="note-title">{note.title}</h3>
      <div 
        className="note-content" 
        dangerouslySetInnerHTML={{ __html: note.content || '' }} 
        style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 4, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      />

      {note.tags && note.tags.length > 0 && (
        <div className="tag-list">
          {note.tags.map((tag, idx) => (
            <span 
              key={tag.id || idx} 
              className="tag-pill"
              style={{ backgroundColor: tag.color, color: '#fff' }}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="note-footer">
        <span>{formattedDate}</span>
        <div className="note-actions" onClick={(e) => e.stopPropagation()}>
          {!isTrash ? (
            <>
              <button className="action-btn" onClick={() => onEdit(note)} title="Edit Note">
                <Edit2 size={16} />
              </button>
              <button className="action-btn danger" onClick={() => onDelete(note.id, false)} title="Move to Trash">
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              {/* <button className="action-btn" onClick={() => onRestore(note.id)} title="Restore Note">
                <RotateCcw size={16} />
              </button> */}
              <button className="action-btn danger" onClick={() => onDelete(note.id, true)} title="Delete Permanently">
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
