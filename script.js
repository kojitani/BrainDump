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
  id = (Date.now() + '').slice(-10);
  #notes = [];
  constructor(title, header, body) {
    this.title = title;
    this.header = header;
    this.body = body;
  }
}
const note = new Notes('title', 'test', 'Im gonna kms tonight');

console.log(note);
const noteContainer = document.querySelector('.notes-container');
const notesTitles = document.querySelector('.notes-titles');
const titleList = document.querySelectorAll('.note-title');

class App {
  constructor() {
    this._noteResize();
    newBtn.addEventListener('click', this._newNote.bind(this));
    noteContainer.addEventListener('input', this._noteResize);
    noteHeader.addEventListener('input', this._noteTitle);
  }
  _newNote() {
    noteBody.value = '';
    noteBody.blur();
    noteHeader.value = 'Untitled';
    noteHeader.select();
    this._newTitle();
  }
  _newTitle() {
    document
      .querySelectorAll('.note-title')
      .forEach(title => title.classList.remove('note--active'));
    notesTitles.insertAdjacentHTML(
      'afterbegin',
      `<li class="note-title note--active">Untitled</li>`
    );
  }
  _noteTitle() {
    document.querySelector('.note--active').textContent = noteHeader.value;
  }
  _noteResize() {
    noteHeader.style.height = 'auto';
    noteHeader.style.height = noteHeader.scrollHeight + 'px';
    noteBody.style.height = 'auto';
    noteBody.style.height = noteBody.scrollHeight + 'px';
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
