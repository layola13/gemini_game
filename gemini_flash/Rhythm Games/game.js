const noteLane = document.getElementById('note-lane');
const keyArea = document.getElementById('key-area');
const music = document.getElementById('music');

const notes = [
    { time: 1000, key: 1 },
    { time: 2000, key: 2 },
    { time: 3000, key: 3 },
    { time: 4000, key: 4 }
];

let currentNoteIndex = 0;

function createNote(note) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.style.left = `${note.key * 100}px`;
  noteLane.appendChild(noteElement);
  return noteElement;
}

function updateNotePosition(noteElement, time) {
  const elapsedTime = time - note.time;
  noteElement.style.bottom = `${elapsedTime / 10}px`;
}

function handleKeyPress(event) {
  const keyPressed = parseInt(event.key);
  const currentNote = notes[currentNoteIndex];

  if (keyPressed === currentNote.key) {
    const noteElement = document.querySelector('.note');
    noteElement.remove();
    currentNoteIndex++;
  }
}

function gameLoop(time) {
  requestAnimationFrame(gameLoop);

  const noteElements = document.querySelectorAll('.note');
  noteElements.forEach(noteElement => {
    const note = notes[currentNoteIndex];
    updateNotePosition(noteElement, time);
  });

  if (currentNoteIndex < notes.length) {
    const currentNote = notes[currentNoteIndex];
    if (time > currentNote.time) {
      const noteElement = createNote(currentNote);
      currentNoteIndex++;
    }
  }
}

// Start the game
music.addEventListener('play', () => {
  requestAnimationFrame(gameLoop);
});

// Listen for key presses
window.addEventListener('keydown', handleKeyPress);