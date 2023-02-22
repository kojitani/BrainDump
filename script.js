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

class Notes {
  date = new Date();
  id = (Date.now() + '').slice(-10);

  constructor(title, header, body) {
    this.title = title;
    this.header = header;
    this.body = body;
  }
}
const note = new Notes('title', 'test', 'Im gonna kms tonight');

console.log(note);
const noteContainer = document.querySelector('.notes-container');
class App {
  constructor() {
    newBtn.addEventListener('click', this._newNote);
    noteContainer.addEventListener('input', this._noteResize);
  }

  _newNote(e) {
    if (e.target.closest('#new-btn')) {
      noteHeader.textContent = 'Untitled';
      noteBody.textContent = '';
      noteHeader.select();
    }
  }
  _noteResize(e) {
    if (e.target.classList.contains('note-header')) {
      noteHeader.style.height = 'auto';
      noteHeader.style.height = noteHeader.scrollHeight + 'px';
    } else {
      noteBody.style.height = 'auto';
      noteBody.style.height = noteBody.scrollHeight + 'px';
    }
  }
}
const app = new App();
