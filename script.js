const newBtn = document.querySelector('.new-btn');
const sortBtn = document.querySelector('.sort-btn');
const settingsBtn = document.querySelector('.settings-btn');
const delBtns = document.querySelectorAll('del-btn');
const btnContainers = document.querySelectorAll('.btn-container');

const newBtnDescription = document.querySelector('.new-description');
const sortBtnDescription = document.querySelector('.sort-description');

const noteTitle = document.querySelector('.note-title');
const noteHeader = document.querySelector('.note-header');
const noteBody = document.querySelector('.note-body');
const noteContainer = document.querySelector('.notes-container');
const notesTitles = document.querySelector('.notes-titles');

const titleList = document.querySelectorAll('.note-title');
const titleBars = document.querySelectorAll('#title-bar');
const overlay = document.querySelector('.overlay');
const body = document.querySelector('body');
const html = document.querySelector('html');

const searchBar = document.querySelector('.search-bar');
const searchBarCancel = document.querySelector('.cancel-btn');

const sortOptions = document.querySelector('.sort-options');
const sortModified = document.querySelector('.sort-modified');
const sortCreation = document.querySelector('.sort-creation');

const settingsBox = document.querySelector('.settings-box');
const settingsOverlay = document.querySelector('.settings-overlay');
const closeBtn = document.querySelector('.close-btn');
const importBtn = document.querySelector('.import-btn');
const exportBtn = document.querySelector('.export-btn');
const importFile = document.querySelector('.import-file');
const fontSlider = document.querySelector('.font-slider');
const noteHeaderFontSize = Number(
  window.getComputedStyle(noteHeader).getPropertyValue('font-size').slice(0, -2)
);
const noteBodyFontSize = Number(
  window.getComputedStyle(noteBody).getPropertyValue('font-size').slice(0, -2)
);
noteBody.style.tabSize = '4';

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
  #order;
  #fontSize;
  #noteInnerHTML;
  #indentType;
  #sortLastModifiedDate = () =>
    this.#notes.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  #sortCreationDate = () =>
    this.#notes.sort((a, b) => new Date(Number(a.id)) - new Date(Number(b.id)));

  constructor() {
    this._getSortingOrder();
    this._getFontSettings();
    this._getLocalStorage();
    noteContainer.addEventListener('input', this._noteResize);
    noteContainer.addEventListener('keypress', this._headerEnterKey);
    noteBody.addEventListener('keydown', this._indentationEvent.bind(this));
    noteHeader.addEventListener('input', this._noteUpdateTitle);
    notesTitles.addEventListener('click', this._clickNote.bind(this));
    noteHeader.addEventListener('input', this._updateNoteData.bind(this));
    noteBody.addEventListener('input', this._updateNoteData.bind(this));
    notesTitles.addEventListener('click', this._deleteNote.bind(this));
    body.addEventListener('click', this._hideOverlays.bind(this));
    searchBar.addEventListener('input', this._searchFunction.bind(this));
    searchBarCancel.addEventListener('click', this._cancelSearch.bind(this));

    newBtn.addEventListener('click', this._newNote.bind(this));
    sortBtn.addEventListener('click', this._showSortOptions);
    settingsBtn.addEventListener('click', this._openSettings);
    closeBtn.addEventListener('click', this._closeSettings);
    importBtn.addEventListener('click', this._importNotes.bind(this));
    exportBtn.addEventListener('click', this._exportNotes.bind(this));
    fontSlider.addEventListener('input', this._changeFontSize.bind(this));
  }

  _setNew() {
    noteBody.value = '';
    noteBody.blur();
    noteHeader.value = 'Untitled';
    noteHeader.focus();
    noteHeader.select();
  }
  _newNote() {
    this._removeNoteHidden();
    this._setNew();
    this._noteResize();
    const note = new Notes('Untitled', 'Untitled', '');
    this._noteActiveReset();
    console.log(this.#notes);
    this._addNote(note);

    this.#notes.push(note);
    this._setLocalStorage();
  }
  _noteInsertHTML(note, i = undefined) {
    this.#noteInnerHTML = `<div class='title-bar' id='title-bar'>
      
    <li class="note-title ${
      i === this.#notes.length - 1 || i === undefined ? 'note--active' : ''
    }" id="note-title" 
    data-id="${note.id}">${note.title}</li> 
    <div class='del-btn-container' title='Delete this note'>
    <img class="del-btn"  src="images/trash.svg"/>
    </div>
    <div class="date-container">
        Last modified at ${note.date}
    <br/>Created at ${
      i === undefined
        ? note.date
        : String(new Date(Number(note.id))).slice(0, 24)
    }
    </div>
    </div>`;
  }
  _addNote(note) {
    this._noteInsertHTML(note);
    notesTitles.insertAdjacentHTML('afterbegin', this.#noteInnerHTML);
  }
  _loadNotes() {
    this.#notes.forEach((note, i) => {
      this._noteInsertHTML(note, i);
      notesTitles.insertAdjacentHTML('afterbegin', this.#noteInnerHTML);
      noteHeader.value = note.header;
      noteBody.value = note.body;

      setTimeout(() => {
        this._removeNoteHidden();
        this._noteResize();
        noteBody.blur();
        noteBody.focus();
      }, 100);
    });
  }
  _clickNote(e) {
    const noteTarget = e.target.closest('#note-title');
    if (!noteTarget) return;
    this._noteActiveReset();
    this._removeNoteHidden();
    noteTarget.classList.add('note--active');

    const note = this.#notes.find(
      note => String(note.id) === noteTarget.dataset.id
    );
    noteBody.value = note.body;
    noteHeader.value = note.header;
    this._noteResize();
    noteBody.blur();
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
    const currentNote = e.target.closest('#title-bar').children[0];
    if (currentNote.classList.contains('note--active')) this._addNoteHidden();
    this.#notes.forEach((note, i) =>
      String(note.id) === noteTarget ? this.#notes.splice(i, 1) : note
    );
    this._setLocalStorage();
    this._deleteNoteAnimation(e);
  }
  _deleteNoteAnimation(e) {
    e.target.closest('#title-bar').style.transform = 'translateX(300%)';
    setTimeout(() => {
      e.target.closest('#title-bar').remove();
    }, 300);
  }
  _addNoteHidden() {
    noteHeader.classList.add('note--hidden');
    noteBody.classList.add('note--hidden');
  }
  _removeNoteHidden() {
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
  _indent(type) {
    const selectionStart = noteBody.selectionStart;
    noteBody.value =
      noteBody.value.substring(0, noteBody.selectionStart) +
      `${type === 'tab' ? '\t' : '\n' + '\t'}` +
      noteBody.value.substring(noteBody.selectionEnd);
    noteBody.blur();
    noteBody.focus();
    noteBody.selectionEnd = selectionStart + (type === 'enter' ? 2 : 1);
  }
  _indentationEvent(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      this.#indentType = 'tab';
      this._indent(this.#indentType);
      this._noteResize();
    }
    if (e.key === 'Enter') {
      const currentLine = noteBody.value
        .substring(0, noteBody.selectionStart)
        .lastIndexOf('\n');
      const indented = noteBody.value
        .substring(currentLine, currentLine + 2)
        .includes('\t');
      if (indented) {
        e.preventDefault();
        this.#indentType = 'enter';
        this._indent(this.#indentType);
        this._noteResize();
      }
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
    noteTarget.innerHTML = `Last modified at ${lastModify}<br>Created at ${creationDate}`;

    this.#order === 'lastModified'
      ? this.#sortLastModifiedDate()
      : this.#sortCreationDate();
  }
  _setLocalStorage() {
    chrome.storage.local.set({ notes: JSON.stringify(this.#notes) });
  }
  _getLocalStorage() {
    chrome.storage.local.get(['notes']).then(result => {
      if (!result.notes) return;
      const notes = JSON.parse(result.notes);
      notes.forEach(note => this.#notes.push(note));
      this._loadNotes();
    });
  }
  _showSortOptions() {
    sortOptions.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  _hideOverlays(e) {
    if (e.target.classList.contains('overlay')) {
      sortOptions.classList.add('hidden');
      overlay.classList.add('hidden');
    }
    if (e.target.classList.contains('sort-modified'))
      this._sortByLastModified();

    if (e.target.classList.contains('sort-creation'))
      this._sortByCreationDate();
  }

  _setSortingOrder(order) {
    chrome.storage.local.set({ sortOrder: order });
    this.#order = order;
  }
  _getSortingOrder() {
    chrome.storage.local.get(['sortOrder']).then(result => {
      if (!result.sortOrder) return;
      this.#order = result.sortOrder;
      if (result.sortOrder === 'lastModified') {
        this.#sortLastModifiedDate();
        sortModified.classList.add('sort--active');
      }
      if (result.sortOrder === 'creationDate') {
        this.#sortCreationDate();
        sortCreation.classList.add('sort--active');
      }
    });
  }
  _sortByLastModified() {
    this._setSortingOrder('lastModified');
    this.#sortLastModifiedDate();
    this._refreshNotesList();
  }
  _sortByCreationDate() {
    this._setSortingOrder('creationDate');
    this.#sortCreationDate();
    this._refreshNotesList();
  }
  _refreshNotesList() {
    this._setLocalStorage();
    location.reload();
  }
  _openSettings() {
    settingsBox.classList.remove('hidden');
    settingsOverlay.classList.remove('hidden');
  }
  _closeSettings() {
    settingsBox.classList.add('hidden');
    settingsOverlay.classList.add('hidden');
  }
  _updateFontSize() {
    noteHeader.style.fontSize = noteHeaderFontSize + this.#fontSize + 'px';
    noteBody.style.fontSize = noteBodyFontSize + this.#fontSize + 'px';
    this._noteResize();
  }
  _changeFontSize(e) {
    this._setFontSettings(Number(e.target.value));
    this._updateFontSize();
  }
  _setFontSettings(size) {
    chrome.storage.local.set({ fontSize: size });
    this.#fontSize = size;
  }
  _getFontSettings() {
    chrome.storage.local.get('fontSize').then(result => {
      if (!result.fontSize) return;
      this.#fontSize = result.fontSize;
      fontSlider.value = result.fontSize;
      this._updateFontSize();
    });
  }
  _importNotes() {
    importFile.click();

    importFile.addEventListener('change', () => {
      const noteFile = new FileReader();
      noteFile.readAsText(importFile.files[0]);
      noteFile.addEventListener('load', () => {
        const newNotes = JSON.parse(noteFile.result);

        const uniqueIDs = [];
        this.#notes.forEach(note => uniqueIDs.push(note.id));
        newNotes.forEach(note =>
          uniqueIDs.includes(note.id) ? note : this.#notes.push(note)
        );
        this._setLocalStorage();
        location.reload();
      });
    });
  }
  _exportNotes() {
    const exportNotes = JSON.stringify(this.#notes, null, 4);

    const vLink = document.createElement('a'),
      vBlob = new Blob([exportNotes], { type: 'octet/stream' }),
      vName = 'brain-dump-notes-backup.json',
      vUrl = window.URL.createObjectURL(vBlob);
    vLink.setAttribute('href', vUrl);
    vLink.setAttribute('download', vName);
    vLink.click();
  }

  _searchFunction(e) {
    const searchKeywords = e.target.value.toLowerCase();
    const titleContainers = document.querySelectorAll('#title-bar');
    this._noteActiveReset();
    this._addNoteHidden();
    searchBarCancel.style.visibility = 'visible';
    const filteredNotes = this.#notes.filter(note => {
      if (
        note.header.toLowerCase().includes(searchKeywords) ||
        note.body.toLowerCase().includes(searchKeywords)
      )
        return note;
    });
    this._searchItemDisplay(titleContainers, filteredNotes);
  }
  _searchItemDisplay(titleContainers, filteredNotes) {
    titleContainers.forEach(container => (container.style.display = 'none'));
    filteredNotes.forEach(note =>
      titleContainers.forEach(container => {
        if (note.id === container.children[0].dataset.id)
          container.style.display = 'flex';
      })
    );
    if (searchBar.value === '') this._searchBarDefault();
  }
  _cancelSearch() {
    searchBar.value = '';
    this._searchBarDefault();
  }
  _searchBarDefault() {
    const titleContainers = document.querySelectorAll('#title-bar');
    titleContainers.forEach(container => (container.style.display = 'flex'));
    searchBarCancel.style.visibility = 'hidden';
  }
}
const app = new App();
