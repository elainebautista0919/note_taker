// Variables
let noteTitle;
let noteText;
let noteList;
let saveNoteButton;
let newNoteButton;

if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector ('.note-title');
    noteText = document.querySelector ('.note-text');
    noteList = document.querySelector ('.list-container .list-group');
    saveNoteButton = document.querySelector ('.save-note-button');
    newNoteButton = document.querySelector ('.new-note-button');
}