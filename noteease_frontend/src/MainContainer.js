import React, { useState } from 'react';
import { useTheme } from './App';

const initialCategories = ['All', 'Personal', 'Work', 'Ideas', 'Archive'];

function getNoteSnippet(content) {
  const txt = (content || '').replace(/\n/g, ' ');
  return txt.length > 60 ? txt.substr(0, 60) + '...' : txt;
}

// PUBLIC_INTERFACE
function MainContainer() {
  /**
   * The main NoteEase container component implementing:
   * - Note list with title/snippet
   * - Floating action button for adding a note
   * - Modal for create/edit
   * - Search bar and category filter chips
   */
  const { theme, toggleTheme } = useTheme();
  // State
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [categories, setCategories] = useState(initialCategories);

  // Handlers
  function handleAddClick() {
    setEditingNote(null);
    setShowEditor(true);
  }
  function handleEditClick(note) {
    setEditingNote(note);
    setShowEditor(true);
  }
  function handleDeleteClick(id) {
    setNotes(notes.filter(n => n.id !== id));
  }
  function handleSaveNote(note) {
    if (note.id) {
      setNotes(notes.map(n => n.id === note.id ? note : n));
    } else {
      note.id = Date.now();
      setNotes([{ ...note }, ...notes]);
      if (!categories.includes(note.category)) {
        setCategories([...categories, note.category]);
      }
    }
    setShowEditor(false);
    setEditingNote(null);
  }
  function handleSearchChange(e) { setSearch(e.target.value); }
  function handleCategorySelect(cat) { setCategory(cat); }

  // Filter notes
  const filtered = notes.filter(n => {
    const matchesCat = (category === 'All' || n.category === category);
    const matchesText = (n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesText;
  });

  // Inline SVG for theme toggle
  const ThemeIcon = theme === 'dark'
    ? (
      <svg width="20" height="20" style={{ marginRight: 7 }} viewBox="0 0 20 20" fill="none"><path d="M6.5 3.591A7 7 0 1 0 16 13.491C13.568 13.855 11.145 12.817 9.44 11.052C7.698 9.249 6.813 6.74 6.5 3.591Z" fill="#FFC23C"/><circle cx="10" cy="10" r="9.5" stroke="#e6a415" strokeDasharray="1 2" /></svg>
    )
    : (
      <svg width="20" height="20" style={{ marginRight: 6 }} viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="5.5" fill="#f5e944" stroke="#cab200" /></svg>
    );

  return (
    <div
      className={theme === 'dark' ? 'theme-dark' : 'theme-light'}
      style={{
        paddingTop: 84,
        minHeight: '100vh',
        background: 'var(--secondary)',
        transition: 'background 0.25s'
      }}
    >
      <div
        style={{
          maxWidth: 740, margin: '0 auto', padding: '0 24px',
          background: 'var(--secondary)', minHeight: '84vh'
        }}
      >
        {/* Theme toggle button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 7, marginBottom: 5 }}>
          <button
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: '1px solid var(--border-color)',
              borderRadius: 25,
              color: 'var(--text-color)',
              padding: '4px 15px 4px 8px',
              fontSize: 15,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'inherit',
              fontWeight: 500
            }}
          >
            {ThemeIcon}
            {theme === 'dark' ? 'Dark' : 'Light'} mode
          </button>
        </div>

        {/* Search */}
        <div style={{ margin: '32px 0 12px 0' }}>
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search notes..."
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 8,
              border: `1px solid var(--primary)40`,
              fontSize: 17,
              outline: 'none',
              marginBottom: 10,
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
            }}
          />
        </div>
        {/* Category Chips */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              style={{
                background: category === cat ? 'var(--chip-selected)' : 'var(--chip-bg)',
                color: category === cat ? '#fff' : (theme === 'dark' ? '#cbe2ff' : '#384657'),
                border: '1px solid ' + (category === cat ? 'var(--primary)' : 'var(--chip-border)'),
                borderRadius: 999,
                padding: '7px 20px',
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: 'none',
                outline: 'none',
                fontWeight: 500,
                transition: 'background .18s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Note List */}
        <div>
          {filtered.length === 0 && (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: 44 }}>
              No notes found.
            </div>
          )}
          {filtered.map((note) => (
            <div
              key={note.id}
              style={{
                background: 'var(--notecard-bg)',
                border: '1px solid var(--notecard-border)',
                borderRadius: 8,
                padding: '18px 25px 14px 18px',
                marginBottom: 17,
                display: 'flex',
                alignItems: 'start',
                gap: 18,
                cursor: 'pointer',
                boxShadow: '0 2px 6px 0 #0002',
                transition: 'box-shadow 0.13s'
              }}
              onClick={() => handleEditClick(note)}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 18,
                  color: 'var(--primary)',
                  marginBottom: 4,
                  lineHeight: 1.32
                }}>{note.title || <span style={{ color: 'var(--text-secondary)' }}>Untitled</span>}</div>
                <div style={{
                  fontSize: 15,
                  color: 'var(--text-secondary)'
                }}>{getNoteSnippet(note.content)}</div>
                {note.category && note.category !== 'All' && (
                  <div style={{
                    marginTop: 7,
                    display: 'inline-block',
                    fontSize: 13,
                    padding: '2px 13px',
                    background: 'var(--chip-bg)',
                    color: 'var(--primary)',
                    borderRadius: 999,
                    border: '1px solid var(--primary)40'
                  }}>{note.category}</div>
                )}
              </div>
              <button
                title="Delete"
                style={{
                  background: 'transparent',
                  color: '#f44',
                  border: 'none',
                  fontSize: 21,
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  padding: '2px 10px',
                  marginTop: 2
                }}
                onClick={e => { e.stopPropagation(); handleDeleteClick(note.id); }}
              >🗑️</button>
            </div>
          ))}
        </div>
        {/* Note Editor Modal */}
        {showEditor && (
          <NoteEditor
            note={editingNote}
            categories={categories}
            onCancel={() => { setShowEditor(false); setEditingNote(null); }}
            onSave={handleSaveNote}
            theme={theme}
          />
        )}
      </div>
      {/* Floating Add Button */}
      <button
        aria-label="Add Note"
        style={{
          position: 'fixed', right: 40, bottom: 34, zIndex: 200,
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--fab-bg)', color: 'var(--fab-color)',
          border: 'none', fontSize: 34, boxShadow: '0 3px 16px 0 #0002',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={handleAddClick}
      >＋</button>
    </div>
  );
}

// Note Editor: Modal for create/edit
function NoteEditor({ note, categories, onCancel, onSave, theme }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'Personal');
  const [catInput, setCatInput] = useState('');
  // PUBLIC_INTERFACE
  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;
    onSave({
      ...(note || {}),
      title: title.trim(),
      content,
      category: category
    });
  }
  function handleNewCat(e) {
    e.preventDefault();
    if (catInput && !categories.includes(catInput)) {
      setCategory(catInput);
      setCatInput('');
    }
  }
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        background: theme === 'dark' ? '#232936cc' : '#2227',
        zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: 'var(--modal-bg)', color: 'var(--modal-text)', borderRadius: 13,
          minWidth: 290, maxWidth: 420, width: '95vw', boxShadow: '0 8px 48px 2px #0003',
          padding: '30px 24px 21px 24px', display: 'flex', flexDirection: 'column',
          gap: 9
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 7, color: 'var(--primary)' }}>
          {note ? 'Edit Note' : 'New Note'}
        </div>
        <input
          placeholder="Title"
          value={title}
          autoFocus
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: 18, padding: '7px 11px', marginBottom: 6, borderRadius: 5, border: '1px solid var(--primary)' }}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            fontSize: 16, minHeight: 90, resize: 'vertical', padding: '7px 11px',
            borderRadius: 5, border: '1px solid var(--notecard-border)', marginBottom: 7,
            background: 'var(--secondary)', color: 'var(--text-color)'
          }}
        />
        <div style={{ marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--accent)', marginRight: 6 }}>
            Category:
          </span>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{
            fontSize: 15, borderRadius: 5, border: '1px solid #ead09b', padding: '2px 8px',
            background: 'var(--secondary)', color: 'var(--text-color)'
          }}>
            {categories.filter(c => c !== 'All').map((cat) =>
              <option key={cat} value={cat}>{cat}</option>
            )}
            {(!categories.includes(category) && category) && (
              <option value={category}>{category}</option>
            )}
          </select>
          <span style={{ marginLeft: 8 }}>
            <input
              value={catInput}
              onChange={e => setCatInput(e.target.value)}
              placeholder="New"
              style={{
                fontSize: 14, borderRadius: 4, border: '1px solid var(--primary)', padding: '1px 6px', width: 72, marginRight: 2,
                background: 'var(--input-bg)', color: 'var(--text-color)'
              }}
            />
            <button onClick={handleNewCat} style={{
              background: 'var(--primary)',
              color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, padding: '2px 9px', cursor: 'pointer'
            }}>Add</button>
          </span>
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button type="button"
            style={{ background: '#adb8be', color: '#fff', border: 'none', borderRadius: 4, padding: '7px 17px', cursor: 'pointer' }}
            onClick={onCancel}
          >Cancel</button>
          <button type="submit"
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default MainContainer;
