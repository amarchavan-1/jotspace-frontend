import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Book, Trash, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { NoteCard } from '../components/NoteCard';
import { NoteModal } from '../components/NoteModal';
import { SearchFilter } from '../components/SearchFilter';
import type { SearchCriteria } from '../components/SearchFilter';
import { searchService } from '../api/search';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string; color: string }[];
}

export const Dashboard: React.FC = () => {
  const { user, logoutState } = useAuth();
  
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'all' | 'trash'>('all');
  const [currentCriteria, setCurrentCriteria] = useState<SearchCriteria>({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [savingLoading, setSavingLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      if (view === 'trash') {
        const response = await searchService.getTrashNotes();
        setNotes(response.content || []);
      } else {
        const response = await searchService.searchNotes(currentCriteria);
        setNotes(response.content || []);
      }
    } catch (error) {
      console.error("Failed to fetch notes", error);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [view, currentCriteria]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAdvancedSearch = (criteria: SearchCriteria) => {
    setCurrentCriteria(criteria);
  };



  const handleCreateOrUpdate = async (noteData: {title: string, content: string, tagIds: string[]}, id?: string) => {
    setSavingLoading(true);
    try {
      if (id) {
        await apiClient.put(`/notes/${id}`, noteData);
        toast.success("Note updated");
      } else {
        await apiClient.post('/notes', noteData);
        toast.success("Note created");
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = 'Failed to save note.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.errors) {
           errorMessage = Object.values(err.response.data.errors).join(', ');
        }
      }
      toast.error(errorMessage);
    } finally {
      setSavingLoading(false);
    }
  };

  const handleDelete = async (id: string, permanent: boolean) => {
    try {
      if (permanent) {
        await apiClient.delete(`/notes/${id}/permanent`);
        toast.success("Note permanently deleted");
      } else {
        await apiClient.delete(`/notes/${id}`);
        toast.success("Moved to trash");
      }
      fetchNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete note");
    }
  };

  const openNewModal = () => {
    setSelectedNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="app-logo">
            <Book size={24} color="var(--apple-blue)" />
            JotSpace
          </div>
          <button onClick={toggleTheme} className="action-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1 }}>
          <button 
            className={`nav-item w-full ${view === 'all' ? 'active' : ''}`}
            onClick={() => { setView('all'); setCurrentCriteria({}); }}
            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
          >
            <Book size={18} />
            All Notes
          </button>
          
          <button 
            className={`nav-item w-full ${view === 'trash' ? 'active' : ''}`}
            onClick={() => { setView('trash'); setCurrentCriteria({}); }}
            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
          >
            <Trash size={18} />
            Trash
          </button>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {user?.name || user?.email}
          </div>
          <button 
            className="nav-item danger" 
            onClick={logoutState}
            style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header" style={{ height: 'auto', padding: '1rem 2rem', flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: view !== 'trash' ? '1rem' : '0' }}>
            {view !== 'trash' && (
              <button className="btn-primary sm" onClick={openNewModal}>
                <Plus size={18} />
                New Note
              </button>
            )}
          </div>
          {view !== 'trash' && (
            <SearchFilter onSearch={handleAdvancedSearch} isLoading={loading} />
          )}
        </header>

        <main className="content-area">
          <div style={{ marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
              {view === 'all' ? (Object.keys(currentCriteria).length ? 'Search Results' : 'All Notes') : 'Trash'}
            </h1>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <div className="spinner" style={{ borderColor: 'var(--apple-blue)', borderTopColor: 'transparent' }} />
            </div>
          ) : notes.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', marginBottom: '1rem' }}>
                {view === 'trash' ? <Trash size={32} /> : <Book size={32} />}
              </div>
              <h3>No notes found</h3>
              <p style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>
                {view === 'trash' ? 'Your trash is empty' : 'Create a new note to get started'}
              </p>
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  isTrash={view === 'trash'} 
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <NoteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedNote}
        onSave={handleCreateOrUpdate}
        loading={savingLoading}
      />
    </div>
  );
};
