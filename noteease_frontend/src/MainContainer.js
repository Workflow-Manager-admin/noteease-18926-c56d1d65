import React, { useState } from 'react';

// Colors and theme from requirements
const COLORS = {
  primary: '#4A90E2',
  secondary: '#FFFFFF',
  accent: '#F5A623',
  chipBg: '#e8f1fa',
  chipBorder: '#d0d7e2',
  chipSelected: '#4A90E2',
  fabBg: '#F5A623',
  fabColor: '#fff',
};

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

  return (
    <div style={{ paddingTop: 84, minHeight: '100vh', background: COLORS.secondary }}>
      <div style={{
        maxWidth: 740, margin: '0 auto', padding: '0 24px',
        background: COLORS.secondary, minHeight: '84vh'
      }}>
        {/* Search */}
        <div style={{ margin: '32px 0 12px 0' }}>
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search notes..."
            style={{
              width: '100%', padding: '12px 16px',
              borderRadius: 8, border: `1px solid ${COLORS.primary}40`,
              fontSize: 17, outline: 'none', marginBottom: 10,
              background: '#f7fafd'
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
                background: category === cat ? COLORS.chipSelected : COLORS.chipBg,
                color: category === cat ? '#fff' : '#384657',
                border: '1px solid ' + (category === cat ? COLORS.primary : COLORS.chipBorder),
                borderRadius: 999, padding: '7px 20px', fontSize: 14,
                cursor: 'pointer', boxShadow: 'none', outline: 'none', fontWeight: 500
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        {/* Note List */}
        <div>
          {filtered.length === 0 && (
            <div style={{ color: '#bbb', textAlign: 'center', marginTop: 44 }}>
              No notes found.
            </div>
          )}
          {filtered.map((note) => (
            <div
              key={note.id}
              style={{
                background: '#f9fbfc', border: `1px solid #e3e3ed`,
                borderRadius: 8, padding: '18px 25px 14px 18px',
                marginBottom: 17, display: 'flex', alignItems: 'start', gap: 18,
                cursor: 'pointer', boxShadow: '0 2px 6px 0 #0002',
                transition: 'box-shadow 0.13s'
              }}
              onClick={() => handleEditClick(note)}
            >
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 600, fontSize: 18, color: COLORS.primary,
                  marginBottom: 4, lineHeight: 1.32
                }}>{note.title || <span style={{ color: '#bbb' }}>Untitled</span>}</div>
                <div style={{
                  fontSize: 15, color: '#4e5a6e'
                }}>{getNoteSnippet(note.content)}</div>
                {note.category && note.category !== 'All' && (
                  <div style={{
                    marginTop: 7, display: 'inline-block', fontSize: 13,
                    padding: '2px 13px', background: COLORS.chipBg,
                    color: COLORS.primary, borderRadius: 999,
                    border: `1px solid ${COLORS.primary}40`
                  }}>{note.category}</div>
                )}
              </div>
              <button
                title="Delete"
                style={{
                  background: 'transparent',
                  color: '#f44',
                  border: 'none', fontSize: 21,
                  cursor: 'pointer', alignSelf: 'flex-start',
                  padding: '2px 10px', marginTop: 2
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
          />
        )}
      </div>
      {/* Floating Add Button */}
      <button
        aria-label="Add Note"
        style={{
          position: 'fixed', right: 40, bottom: 34, zIndex: 200,
          width: 64, height: 64, borderRadius: '50%',
          background: COLORS.fabBg, color: COLORS.fabColor,
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
function NoteEditor({ note, categories, onCancel, onSave }) {
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
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: '#2227', zIndex: 1000, display: 'flex', alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff', color: '#232a36', borderRadius: 13,
          minWidth: 290, maxWidth: 420, width: '95vw', boxShadow: '0 8px 48px 2px #0003',
          padding: '30px 24px 21px 24px', display: 'flex', flexDirection: 'column',
          gap: 9
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 7, color: COLORS.primary }}>
          {note ? 'Edit Note' : 'New Note'}
        </div>
        <input
          placeholder="Title"
          value={title}
          autoFocus
          onChange={e => setTitle(e.target.value)}
          style={{ fontSize: 18, padding: '7px 11px', marginBottom: 6, borderRadius: 5, border: '1px solid #b6cdf8' }}
        />
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={{
            fontSize: 16, minHeight: 90, resize: 'vertical', padding: '7px 11px',
            borderRadius: 5, border: '1px solid #e3e3ed', marginBottom: 7
          }}
        />
        <div style={{ marginBottom: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: COLORS.accent, marginRight: 6 }}>
            Category:
          </span>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{
            fontSize: 15, borderRadius: 5, border: '1px solid #ead09b', padding: '2px 8px'
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
              style={{ fontSize: 14, borderRadius: 4, border: '1px solid #b6cdf8', padding: '1px 6px', width: 72, marginRight: 2 }}
            />
            <button onClick={handleNewCat} style={{
              background: COLORS.primary,
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
            style={{ background: COLORS.primary, color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default MainContainer;
