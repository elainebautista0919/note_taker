// Variables
const noteTitle = $(".note-title");
const noteText = $(".note-text");
const noteList = $(".list-container .list-group");
const newNoteBtn = $(".new-note-btn");
const saveNoteBtn = $(".save-note-btn");

//Track notes in textarea
const activeNote = {};

// Get notes from DB
const getNotes = () =>
  fetch('/api/notes/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Save note to DB
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Delete note from DB
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json',},
  });

// Display notes
const renderActiveNote = () => {
    hide(saveNoteBtn);

    if (activeNote.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = activeNote.title;
        noteText.value = activeNote.text;
    } else {
        noteTitle.setAttribute('readonly', false);
        noteText.setAttribute('readonly', false);
        noteTitle.value = '';
        noteText.value = '';
    }
};

// Get note from input, save to DB and update display
const handleNoteSave = () => {
    const newNote = {
        title: noteTitle.value,
        text: noteText.value,
    };

    saveNote(newNote).then(function (data){
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Delete clicked note
const handleNoteDelete = (event) => {
    event.stopPropagation();

    const note = event.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
        activeNote = {};}

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderActiveNote();
    });
};

// Display activeNote
const handleNoteView = (event) => {
    event.preventDefault();
    activeNote = JSON.parse(event.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
};
  
// Allow user to enter a new note
const handleNewNoteView = (event) => {
    activeNote = {};
    renderActiveNote ();
};

const handleRenderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
        hide(saveNoteBtn);
    } else {
        show(saveNoteBtn);
    }
};

// Render list of note titles
const renderNoteList = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
      noteList.forEach((el) => (el.innerHTML = ''));
    }

    let noteListItems = [];

    const createLi = (text, delBtn = true) => {
        const liEl = document.createElement('li');
        liEl.classList.add('list-group-item');

        const spanEl = document.createElement('span');
        spanEl.innerText = text;
        spanEl.addEventListener('click', handleNoteView);

        liEl.append(spanEl);

        if (delBtn) {
            const delBtnEl = document.createElement('i');
            delBtnEl.classList.add(
                'fas',
                'fa-trash-alt',
                'float-right',
                'text-danger',
                'delete-note');
            delBtnEl.addEventListener('click', handleNoteDelete);

            liEl.append(delBtnEl);
        }

        return liEl;
    };

    if (jsonNotes.length === 0) {
        noteListItems.push(createLi('No Saved Notes', false));
    }

    jsonNotes.forEach((note) => {
        const li = createLi(note.title);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => noteList[0].append(note));
      }
    };

// Get notes and display
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    noteTitle.addEventListener('keyup', handleRenderSaveBtn);
    noteText.addEventListener('keyup', handleRenderSaveBtn);
  }
  
// Render initial list of notes
  getAndRenderNotes();