const newBtn = document.querySelector('.new-btn');
const searchBtn = document.querySelector('.search-btn');
const sortBtn = document.querySelector('.sort-btn');
const delBtns = document.querySelectorAll('del-btn');
const btnContainers = document.querySelectorAll('.btn-container');

const newBtnDescription = document.querySelector('.new-description');
const searchBtnDescription = document.querySelector('.search-description');
const sortBtnDescription = document.querySelector('.sort-description');

const noteTitle = document.querySelector('.note-title');
const noteHeader = document.querySelector('.note-header');
const noteBody = document.querySelector('.note-body');
const noteContainer = document.querySelector('.notes-container');
const notesTitles = document.querySelector('.notes-titles');

const titleList = document.querySelectorAll('.note-title');
const titleBars = document.querySelectorAll('#title-bar');
const overlay = document.querySelector('.overlay');
const sortOptions = document.querySelector('.sort-options');
const body = document.querySelector('body');
class Notes {
  date = String(new Date()).slice(0, 24);
  id = Date.now() + '';
  constructor(title, header, body) {
    this.title = title;
    this.header = header;
    this.body = body;
  }
}

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
    sortBtn.addEventListener('click', this._showSortOptions);
    body.addEventListener('click', this._chooseSortOptions.bind(this));
  }

  _setNew() {
    noteBody.value = '';
    noteBody.blur();
    noteHeader.value = 'Untitled';
    noteHeader.focus();
    noteHeader.select();
  }
  _newNote() {
    this._removeHidden();
    this._setNew();
    const note = new Notes('Untitled', 'Untitled', '');
    this._noteActiveReset();
    console.log(this.#notes);
    this._addNote(note);

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
      notesTitles.insertAdjacentHTML(
        'afterbegin',
        `<div class='title-bar' id='title-bar'><li class="note-title ${
          i === this.#notes.length - 1 ? 'note--active' : ''
        }" id="note-title" 
          data-id="${note.id}">${note.title}</li>
          <img class="del-btn" src="trash-1_bold.svg"/>
          <div class="date-container">
              Last modified at ${note.date}
         <br/>Created at ${String(new Date(Number(note.id))).slice(0, 24)}
          </div>
          </div>`
      );

      noteHeader.value = note.header;
      noteBody.value = note.body;
      this._removeHidden();
      this._noteResize();
      noteBody.blur();
      noteBody.focus();
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
    console.log(Date.parse(lastModify));
    const creationDate = String(new Date(Number(note.id))).slice(0, 24);
    note.date = lastModify;
    const noteTarget = document
      .querySelector('.note--active')
      .closest('#title-bar').children[2];
    noteTarget.innerHTML = `Last modified at ${lastModify}<br>Created at ${creationDate}`;
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
  _showSortOptions() {
    sortOptions.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }
  _chooseSortOptions(e) {
    if (e.target.classList.contains('overlay')) {
      sortOptions.classList.add('hidden');
      overlay.classList.add('hidden');
    }
    if (e.target.classList.contains('sort-modified')) {
      this._sortByLastModified();
    }
    if (e.target.classList.contains('sort-creation')) {
      this._sortByCreationDate();
    }
  }
  _sortByLastModified() {
    const sortLastModifiedArr = this.#notes.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
    this._refreshNotesList();
  }
  _sortByCreationDate() {
    const sortCreationDateArr = this.#notes.sort(
      (a, b) => new Date(Number(a.id)) - new Date(Number(b.id))
    );
    this._refreshNotesList();
  }
  _refreshNotesList() {
    this._setLocalStorage();
    location.reload();
  }
  _searchFunction() {}
}

const app = new App();
