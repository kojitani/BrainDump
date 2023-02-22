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
  noteHeader.focus();
});
searchBtn.addEventListener('click', e => {
  console.log(e.target.closest('#search-btn'));
});
sortBtn.addEventListener('click', e => {
  console.log(e.target.closest('#sort-btn'));
});

class Notes {
  date = new Date();
  id = Date.now() + '';
  constructor(title, header, body) {
    this.title = title;
    this.header = header;
    this.body = body;
  }
}
const test1 = new Notes(
  'Untitled',
  'Test 1',
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita vel odit mollitia sunt quibusdam, reprehenderit saepe totam, nesciunt eaque numquam excepturi dolorem aspernatur repudiandae ratione quo quisquam veniam quos ipsum n',
  832317371
);

const noteContainer = document.querySelector('.notes-container');
const notesTitles = document.querySelector('.notes-titles');
const titleList = document.querySelectorAll('.note-title');
const delBtns = document.querySelectorAll('del-btn');

class App {
  #notes = [];

  constructor() {
    this._loadNotes();
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

  _newNote() {
    this._removeHidden();
    this._setNew();
    const note = new Notes('Untitled', 'Untitled', '');
    this.#notes.push(note);
    this._noteActiveReset();
    console.log(this.#notes);
    notesTitles.insertAdjacentHTML(
      'afterbegin',
      `<div class='title-bar' id='title-bar'><li class="note-title note--active" id="note-title" data-id="${note.id}">${note.title}</li><img class="del-btn" src="trash-1_bold.svg" />
      </div>`
    );
  }
  _setNew() {
    noteBody.value = '';
    noteBody.blur();
    noteHeader.value = 'Untitled';
    noteHeader.select();
  }
  _loadNotes() {
    this.#notes.forEach(note => {
      notesTitles.insertAdjacentHTML(
        'afterbegin',
        `<li class="note-title" id="note-title" data-id="${note.id}">${note.title}</li>`
      );
      // noteBody.value = note.body;
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
  _updateNoteData() {
    const noteTarget = document.querySelector('.note--active').dataset.id;
    const note = this.#notes.find(note => String(note.id) === noteTarget);

    note.body = noteBody.value;
    note.header = note.title = noteHeader.value;
    console.log(note.header, note.body);
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
    e.target.closest('#title-bar').remove();
    console.log(this.#notes);
    noteHeader.classList.add('note--hidden');
    noteBody.classList.add('note--hidden');
  }
  _removeHidden() {
    noteHeader.classList.remove('note--hidden');
    noteBody.classList.remove('note--hidden');
  }
  _headerEnterKey(e) {
    if (e.target.classList.contains('note-header')) {
      if (e.key === 'Enter') {
        e.preventDefault();
        noteBody.focus();
      }
    }
  }
}

const app = new App();

btnContainers.forEach(btn =>
  btn.addEventListener('mouseenter', e => {
    console.log(e.target);
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
