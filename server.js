const express = require('express');
const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const app = express();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Post
app.post('/api/notes', (request, response) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);
        let userNote = request.body;
        userNote.id = Math.floor(Math.random() * 1000);
        notes.push(userNote);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err, data) => {
        response.json(userNote);
    });
    });
});

// Delete
app.delete('/api/notes/:id', (request, response) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        const newNotes = notes.filter(note => note.id !== parseInt (reqest.params.id));

    fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err, data) => { 
        response.json({msg: 'Success'});
    });
    });
});

// Get
app.get('/api/notes/:id', (request, response) => {
    response.json(notes[request.params.id]);
});

app.get('/api/notes', (request, response) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);
        response.json(notes);
    });
});

app.get('/notes', (request, response) => {
    response.sendFile(path.join (__dirname, '/notes.html'))
});

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, '/index.html'));
});

// Server listening
app.listen(PORT, () => {
    console.log(`App is listening on PORT: ${PORT}`);
});