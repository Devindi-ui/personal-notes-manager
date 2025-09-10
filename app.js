import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNSyFbJf5cFzVAfvLRCgoqqxzDmxv0eXs",
  authDomain: "notesapp-5fc7a.firebaseapp.com",
  projectId: "notesapp-5fc7a",
  storageBucket: "notesapp-5fc7a.firebasestorage.app",
  messagingSenderId: "116587544575",
  appId: "1:116587544575:web:97740927af07f21dd2f1ca",
  measurementId: "G-NXH1V2KPRG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();

document.addEventListener("DOMContentLoaded", function () {
  initApp();

  //event listners
  document.getElementById("noteForm").addEventListener("submit", addNote);
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", filterNotes);
  });

  loadNotes();
});

function initApp() {}

async function addNote(e) {
  e.preventDefault();

  const title = document.getElementById("noteTitle").value;
  const content = document.getElementById("noteContent").value;
  const category = document.getElementById("noteCategory").value;
  const color = document.getElementById("noteColor").value;

  //create new note object
  const newNote = {
    title: title,
    content: content,
    category: category,
    color: color,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  //Add a new document to the notes collection
  try {
    const docRef = await addDoc(collection(db, "notes"), newNote);
    document.getElementById("noteForm").reset();
    loadNotes();
    alert("Note saved successfully");
  } catch (error) {
    alert("Error saving note, Please try again");
    console.error("Error adding note: ".error);
  }
}

async function loadNotes(filter = "all") {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "notes"));
    const notes = [];

    querySnapshot.forEach((doc) => {
      notes.push({
        _id: doc.id,
        ...doc.data(),
      });
    });
    //check if there are no notes
    if (notes.length === 0) {
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
    if (filter !== "all") {
      filteredNotes = notes.filter((note) => note.category === filter);
    }

    filteredNotes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note-item";
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
                    <button class="edit-btn" data-id="${note._id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${note._id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

      notesList.appendChild(noteElement);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function(){
        editNote(this.getAttribute('data-id'));
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function(){
        editNote(this.getAttribute('data-id'));
      });
    });

  } catch (error) {
    console.error("Error loading notes: ", error);
    notesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Notes</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
  }
}

async function editNote(noteId) {
  try {
    const querySnapshot = await getDocs(collection(db, "notes"));
    let noteToEdit = null;

    querySnapshot.forEach((doc) => {
        if (doc.id === noteId) {
            noteToEdit = {
                _id: doc.id,
                ...doc.data()
            };
        }
    });

    if (noteToEdit) {
    document.getElementById("noteTitle").value = noteToEdit.title;
    document.getElementById("noteContent").value = noteToEdit.content;
    document.getElementById("noteCategory").value = noteToEdit.category;
    document.getElementById("noteColor").value = noteToEdit.color;

    await deleteNote(noteId);
  }

  } catch (error) {
    console.error("Error loading note to editing: ", error);
    alert('Error loading note to editing');
  }

}

async function deleteNote(noteId) {
  if (confirm('Are you sure want to delete this note?')){
    try {
        await deleteDoc(doc(db, "notes", noteId));
        loadNotes();
    } catch (error) {
        console.error("Error deleting note: ", error);
        alert('Error deleting note.please try again');
    }
  }
  
}

function filterNotes() {
  //update active button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  this.classList.add("active");

  const filter = this.getAttribute("data-filter");
  loadNotes(filter);
}

window.editNote = editNote;
window.deleteNote = deleteNote;