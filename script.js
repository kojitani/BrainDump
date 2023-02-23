const newBtn = document.querySelector('.new-btn');
const searchBtn = document.querySelector('.search-btn');
const sortBtn = document.querySelector('.sort-btn');
const btnContainers = document.querySelectorAll('.btn-container');

const newBtnDescription = document.querySelector('.new-description');
const searchBtnDescription = document.querySelector('.search-description');
const sortBtnDescription = document.querySelector('.sort-description');

const noteTitle = document.querySelector('.note-title');
const noteHeader = document.querySelector('.note-header');
const noteBody = document.querySelector('.note-body');
newBtn.addEventListener('click', e => {
  console.log(e.target.closest('#new-btn'));
});
searchBtn.addEventListener('click', e => {
  console.log(e.target.closest('#search-btn'));
});
sortBtn.addEventListener('click', e => {
  console.log(e.target.closest('#sort-btn'));
});

class Notes {
  date = String(new Date()).slice(0, 24);
  id = Date.now() + '';
  constructor(title, header, body) {
    this.title = title;
    this.header = header;
    this.body = body;
  }
}
// const test1 = new Notes(
//   'Untitled',
//   'Test 1',
//   'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita vel odit mollitia sunt quibusdam, reprehenderit saepe totam, nesciunt eaque numquam excepturi dolorem aspernatur repudiandae ratione quo quisquam veniam quos ipsum n',
//   832317371
// );

const noteContainer = document.querySelector('.notes-container');
const notesTitles = document.querySelector('.notes-titles');
const titleList = document.querySelectorAll('.note-title');
const delBtns = document.querySelectorAll('del-btn');
const titleBars = document.querySelectorAll('#title-bar');
class App {
  #notes = [];

  constructor() {
    this._getLocalStorage();

    this._noteResize();
    newBtn.addEventListener('click', this._newNote.bind(this));
    noteContainer.addEventListener('input', this._noteResize);
    noteContainer.addEventListener('keypress', this._headerEnterKey);
    noteHeader.addEventListener('input', this._noteUpdateTitle);
    notesTitles.addEventListener('click', this._clickNote.bind(this));
    noteHeader.addEventListener('input', this._updateNoteData.bind(this));
    noteBody.addEventListener('input', this._updateNoteData.bind(this));
    notesTitles.addEventListener('click', this._deleteNote.bind(this));
  }

  _setNew() {
    noteBody.value = '';
    noteBody.blur();
    noteHeader.value = 'Untitled';
    noteHeader.select();
  }
  _newNote() {
    this._removeHidden();
    this._setNew();
    const note = new Notes('Untitled', 'Untitled', '');
    this._noteActiveReset();
    console.log(this.#notes);
    this._addNote(note);

    // SET LOCAL STORAGE
    this.#notes.push(note);
    this._setLocalStorage();
  }
  _addNote(note) {
    notesTitles.insertAdjacentHTML(
      'afterbegin',
      `<div class='title-bar' id='title-bar'><li class="note-title 
      note--active" id="note-title" 
      data-id="${note.id}">${note.title}</li>
      <img class="del-btn" src="trash-1_bold.svg"/>
      <div class="date-container">
          Last modified at ${note.date}
     <br/>Created at ${note.date}
      </div>
      </div>`
    );
  }
  _loadNotes() {
    this.#notes.forEach((note, i) => {
      if (i === this.#notes.length - 1) {
        notesTitles.insertAdjacentHTML(
          'afterbegin',
          `<div class='title-bar' id='title-bar'><li class="note-title note--active" id="note-title" 
          data-id="${note.id}">${note.title}</li>
          <img class="del-btn" src="trash-1_bold.svg"/>
          <div class="date-container">
              Last modified at ${note.date}
         <br/>Created at ${String(new Date(Number(note.id))).slice(0, 24)}
          </div>
          </div>`
        );
        this._removeHidden();
        noteHeader.value = note.header;
        noteBody.value = note.body;
        noteBody.focus();
      } else {
        notesTitles.insertAdjacentHTML(
          'afterbegin',
          `<div class='title-bar' id='title-bar'><li class="note-title" id="note-title" 
          data-id="${note.id}">${note.title}</li>
          <img class="del-btn" src="trash-1_bold.svg"/>
          <div class="date-container">
              Last modified at ${note.date}
         <br/>Created at ${String(new Date(Number(note.id))).slice(0, 24)}
          </div>
          </div>`
        );
      }
    });
  }
  _clickNote(e) {
    const noteTarget = e.target.closest('#note-title');
    if (!noteTarget) return;
    this._noteActiveReset();
    this._removeHidden();
    noteTarget.classList.add('note--active');
    // FIND THE ACTIVE NOTE AND UPDATE VALUES
    const note = this.#notes.find(
      note => String(note.id) === noteTarget.dataset.id
    );
    noteBody.value = note.body;
    noteHeader.value = note.header;
    this._noteResize();
    noteBody.focus();
  }
  _noteActiveReset() {
    document
      .querySelectorAll('.note-title')
      .forEach(title => title.classList.remove('note--active'));
  }
  _noteUpdateTitle() {
    document.querySelector('.note--active').textContent = noteHeader.value;
  }
  _noteResize() {
    noteHeader.style.height = 'auto';
    noteHeader.style.height = noteHeader.scrollHeight + 'px';
    noteBody.style.height = 'auto';
    noteBody.style.height = noteBody.scrollHeight + 'px';
  }
  _deleteNote(e) {
    if (!e.target.classList.contains('del-btn')) return;
    const noteTarget = e.target.closest('#title-bar').children[0].dataset.id;

    this.#notes.forEach((note, i) =>
      String(note.id) === noteTarget ? this.#notes.splice(i, 1) : note
    );
    this._setLocalStorage();
    e.target.closest('#title-bar').remove();
    noteHeader.classList.add('note--hidden');
    noteBody.classList.add('note--hidden');
  }
  _removeHidden() {
    noteHeader.classList.remove('note--hidden');
    noteBody.classList.remove('note--hidden');
  }
  _headerEnterKey(e) {
    if (!e.target.classList.contains('note-header')) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      noteBody.focus();
    }
  }
  _updateNoteData() {
    const noteTarget = document.querySelector('.note--active').dataset.id;
    const note = this.#notes.find(note => String(note.id) === noteTarget);

    note.body = noteBody.value;
    note.header = note.title = noteHeader.value;
    this._modifiedDate(note);
    this._setLocalStorage();
  }
  _modifiedDate(note) {
    const lastModify = String(new Date()).slice(0, 24);
    const creationDate = String(new Date(Number(note.id))).slice(0, 24);
    note.date = lastModify;
    const noteTarget = document
      .querySelector('.note--active')
      .closest('#title-bar').children[2];
    noteTarget.innerHTML = `Last modified at ${lastModify} <br>Created at ${creationDate}`;
    this._setLocalStorage();
  }
  _setLocalStorage() {
    chrome.storage.local.set({ notes: JSON.stringify(this.#notes) });
  }
  _getLocalStorage() {
    chrome.storage.local.get(['notes']).then(result => {
      const notes = JSON.parse(result.notes);
      if (!notes) return;
      notes.forEach(note => this.#notes.push(note));
      console.log(notes);
      this._loadNotes();
    });
  }
  _searchFunction() {}
  _sortByLastModified() {}
  _sortByCreationDate() {}
  _sortAlphabeticallyAscending() {}
  _sortAlphabeticallyDescending() {}
}

const app = new App();

btnContainers.forEach(btn =>
  btn.addEventListener('mouseenter', e => {
    if (e.target.classList.contains('new-btn'))
      newBtnDescription.classList.remove('hidden');
    if (e.target.classList.contains('search-btn'))
      searchBtnDescription.classList.remove('hidden');
    if (e.target.classList.contains('sort-btn'))
      sortBtnDescription.classList.remove('hidden');
  })
);
btnContainers.forEach(btn =>
  btn.addEventListener('mouseleave', e => {
    if (e.target.classList.contains('new-btn'))
      newBtnDescription.classList.add('hidden');
    if (e.target.classList.contains('search-btn'))
      searchBtnDescription.classList.add('hidden');
    if (e.target.classList.contains('sort-btn'))
      sortBtnDescription.classList.add('hidden');
  })
);
