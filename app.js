
function initApp(){
    //check if notes exist in localstorage, if not initialize empty array
    if(!localStorage.getItem('notes')){
        localStorage.setItem('notes', JSON.stringify([])); //converting object to json
    }
}

function addNote(e){
    e.preventDefault();

    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const category = document.getElementById('noteCategory').value;
    const color = document.getElementById('noteColor').value;

    //create new note object
    const newNote = {
        _id: Date.now().toString(),
        title: title,
        content: content,
        category: category,
        color: color,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }

    //get existing notes from localstorage
    let notes = [];
    try{
        const noteData = localStorage.getItem('notes');
        if(noteData){
            notes = JSON.parse(noteData);
        }
    }catch (error){
        notes = [];
        localStorage.setItem('notes',JSON.stringify([]));
    }

    //add the new note to the array
    notes.push(newNote);

    //save back to localstorage
    localStorage.setItem('notes', JSON.stringify(notes));

    document.getElementById('noteForm').reset();

    loadNotes();
    alert('Note saved successfully');
}

document.addEventListener('DOMContentLoaded', function(){
    initApp();

    //event listners
    document.getElementById('noteForm').addEventListener('submit', addNote);

    loadNotes();
});

function loadNotes(filter = 'all'){
    const notes = JSON.parse(localStorage.getItem('notes'));
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    //chech if there are no notes
    if(notes.length === 0){
        notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-sticky-note"></i>
                <h3>No Notes Available</h3>
                <p>Create Your first note to get started!</p>
            </div>
        `;
        return;
    }

    let filteredNotes = notes;
    if(filter !== 'all'){
        filteredNotes = notes.filter(note => note.category === filter);
    }

    filteredNotes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note-item';
        noteElement.style.borderLeftColor = note.color;

        const noteDate = new Date(note.createdAt).toLocaleString();

        noteElement.innerHTML = `
            <div class="note-header">
                <div class="note-title">${note.title}</div>
                <div class="note-category">${note.category}</div>
            </div>
            <div class="note-content">${note.content}</div>
            <div class="note-footer">
                <div class="note-date">${noteDate}</div>
                <div class="note-actions">
                    <button onclick="editNote('${note._id}')"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteNote('${note._id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        notesList.appendChild(noteElement);
    })
}

function editNote(noteId){

}

function deleteNote(noteId){
    if(confirm('Are you sure you want to delete this note?')){
        const notes = JSON.parse(localStorage.getItem('notes'));

        const updatedNotes = notes.filter(note => note._id !== noteId);
        localStorage.setItem('notes', JSON.stringify(updatedNotes));
        loadNotes();
    }
}