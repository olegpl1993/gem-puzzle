import './index.css';
import sound from './sound.mp3';

const gemPuzzle = document.createElement('div');
gemPuzzle.classList.add('gemPuzzle');
document.body.appendChild(gemPuzzle);

// строка с кнопками ---------------------------------------------------------

const buttonLine = document.createElement('div');
buttonLine.classList.add('gemPuzzle__buttonLine');
gemPuzzle.appendChild(buttonLine);

const buttonStart = document.createElement('div');
buttonStart.classList.add('gemPuzzle__button');
buttonStart.textContent = 'Restart';
buttonLine.appendChild(buttonStart);

const buttonSound = document.createElement('div');
buttonSound.classList.add('gemPuzzle__button');
buttonSound.classList.add('_active');
buttonSound.textContent = 'Sound';
buttonLine.appendChild(buttonSound);

const buttonSave = document.createElement('div');
buttonSave.classList.add('gemPuzzle__button');
buttonSave.textContent = 'Save';
buttonLine.appendChild(buttonSave);

const buttonLoad = document.createElement('div');
buttonLoad.classList.add('gemPuzzle__button');
buttonLoad.textContent = 'Load';
buttonLine.appendChild(buttonLoad);

const buttonResults = document.createElement('div');
buttonResults.classList.add('gemPuzzle__button');
buttonResults.textContent = 'Results';
buttonLine.appendChild(buttonResults);

// строка с ходами и временем ---------------------------------------------------

const statLine = document.createElement('div');
statLine.classList.add('gemPuzzle__statLine');
gemPuzzle.appendChild(statLine);

const movesBox = document.createElement('div');
movesBox.classList.add('gemPuzzle__movesBox');
statLine.appendChild(movesBox);

const movesText = document.createElement('div');
movesText.classList.add('gemPuzzle__movesText');
movesText.textContent = 'Moves:';
movesBox.appendChild(movesText);

const movesNum = document.createElement('div');
movesNum.classList.add('gemPuzzle__movesNum');
movesNum.textContent = '0';
movesBox.appendChild(movesNum);

const timeBox = document.createElement('div');
timeBox.classList.add('gemPuzzle__timeBox');
statLine.appendChild(timeBox);

const timeText = document.createElement('div');
timeText.classList.add('gemPuzzle__timeText');
timeText.textContent = 'Time:';
timeBox.appendChild(timeText);

const timeNum = document.createElement('div');
timeNum.classList.add('gemPuzzle__timeNum');
timeNum.textContent = '0:00';
timeBox.appendChild(timeNum);

// игровое поле -----------------------------------------------------------------

const gameBox = document.createElement('div');
gameBox.classList.add('gemPuzzle__gameBox');
gemPuzzle.appendChild(gameBox);

// поп-ап победа ----------------------------------------------------------------
const popupWin = document.createElement('div');
popupWin.classList.add('gemPuzzle__popupWin');
gemPuzzle.appendChild(popupWin);

// поп-ап результаты ------------------------------------------------------------
const popupRes = document.createElement('div');
popupRes.classList.add('gemPuzzle__popupRes');
gemPuzzle.appendChild(popupRes);

// строка выбора размера --------------------------------------------------------

const choiceLine = document.createElement('div');
choiceLine.classList.add('gemPuzzle__choiceLine');
gemPuzzle.appendChild(choiceLine);

const choiseText = document.createElement('div');
choiseText.classList.add('gemPuzzle__choiseText');
choiseText.textContent = 'Size:';
choiceLine.appendChild(choiseText);

const button3x3 = document.createElement('div');
button3x3.classList.add('gemPuzzle__button');
button3x3.textContent = '3x3';
choiceLine.appendChild(button3x3);

const button4x4 = document.createElement('div');
button4x4.classList.add('gemPuzzle__button');
button4x4.classList.add('_active');
button4x4.textContent = '4x4';
choiceLine.appendChild(button4x4);

const button5x5 = document.createElement('div');
button5x5.classList.add('gemPuzzle__button');
button5x5.textContent = '5x5';
choiceLine.appendChild(button5x5);

const button6x6 = document.createElement('div');
button6x6.classList.add('gemPuzzle__button');
button6x6.textContent = '6x6';
choiceLine.appendChild(button6x6);

const button7x7 = document.createElement('div');
button7x7.classList.add('gemPuzzle__button');
button7x7.textContent = '7x7';
choiceLine.appendChild(button7x7);

const button8x8 = document.createElement('div');
button8x8.classList.add('gemPuzzle__button');
button8x8.textContent = '8x8';
choiceLine.appendChild(button8x8);

// ----------------------------------------------------------------------------
let cells = [{ left: 0, top: 0, value: 0 }]; // массив информации о ячейках
let results = []; // результаты игры
let timer; // таймер времени (setInterval)
let gameSet = { // настройки текущей игры
  moves: 0, // количество шагов
  time: 0, // время текущей игры в секундах
  gameBoxSize: 400, // размеры игрового поля
  cellSize: 100, // шырина и высота ячейки
  cellInLine: 4, // количество ячеек в ряду
  cellquantity: 15, // количество ячеек
};

// сохранение результатов в LS ---------------------------------------------------
function setResults() { // сохранение в local storage
  localStorage.setItem('gemPuzzleResults', JSON.stringify(results)); // строка из массива
}
window.addEventListener('beforeunload', setResults); // сохранение в local storage перед закрытием страницы

function getResults() { // загрузка из local storage
  if (localStorage.getItem('gemPuzzleResults')) {
    results = JSON.parse(localStorage.getItem('gemPuzzleResults')); // массив из строки
  }
}
window.addEventListener('load', getResults); // загрузка из local storage при обновлении страницы

// форматирует секунды в часы/минуты/секунды (128 => 2:08) ------------------------
function getTimeCodeFromNum(num) {
  if (Number.isNaN(num)) { // если получает NaN
    return '0:00';
  }
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;
  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(seconds % 60).padStart(2, 0)}`;
}

// результаты --------------------------------------------------------------------
function saveResults() { // сохранение в массив results
  results.unshift({
    sCell: gameSet.cellInLine,
    sTime: gameSet.time,
    sMoves: gameSet.moves,
  });
  if (results.length > 10) results.pop(); // если массив больше 10 результатов последний удаляем
}

function openResults() {
  popupRes.innerHTML += '<div>Last games<div>';
  results.forEach((obj, index) => {
    popupRes.innerHTML += `<div>${index + 1}. Size ${obj.sCell}x${obj.sCell} time ${getTimeCodeFromNum(obj.sTime)} moves ${obj.sMoves}</div>`;
  });
  popupRes.classList.add('_active');
}
function closeResults() {
  popupRes.classList.remove('_active');
  popupRes.innerHTML = '';
}
buttonResults.addEventListener('click', openResults);
popupRes.addEventListener('click', closeResults);

// адаптив размера поля ---------------------------------------------------------
function resize() {
  const cWidth = window.innerWidth; // ширина экрана
  if (cWidth < 600) {
    gameSet.gameBoxSize = cWidth - 6; // размеры игрового поля
  } else {
    gameSet.gameBoxSize = 594; // размеры игрового поля
  }
  gameBox.style.width = `${gameSet.gameBoxSize}px`;
  gameBox.style.height = `${gameSet.gameBoxSize}px`;
  gameSet.cellSize = gameSet.gameBoxSize / gameSet.cellInLine; // изменение размер ячейки
}

// звук для перемещения ячейки --------------------------------------------------
function moveSound() {
  if (buttonSound.classList.contains('_active')) { // проверка включеного звука
    const audio = new Audio(sound); // создает обьект музыки
    audio.play(); // проигрывание
  }
}
buttonSound.addEventListener('click', () => { // актив для кнопки звука
  buttonSound.classList.toggle('_active');
});

// таймер --------------------------------------------------------------------------
function startTimer() {
  timer = setInterval(() => {
    gameSet.time += 1;
    timeNum.textContent = getTimeCodeFromNum(gameSet.time);
  }, 1000);
}
function stopTimer() {
  clearInterval(timer); // остановка таймера
  gameSet.time = 0; // сбрасываем таймер
  timeNum.textContent = '0:00';
}

// сброс счетчика шагов -----------------------------------------------------------
function clearMoves() {
  gameSet.moves = 0;
  movesNum.textContent = gameSet.moves;
}

// проверка победы ----------------------------------------------------------------
function checkWin() {
  // если ячейка не на своем месте срабатывает return
  for (let i = 1; i <= gameSet.cellquantity; i += 1) {
    if (cells[i].value !== cells[i].top * gameSet.cellInLine + cells[i].left + 1) {
      return;
    }
  }
  setTimeout(() => {
    popupWin.textContent = `Hooray! You solved the puzzle in ${getTimeCodeFromNum(gameSet.time)} and ${gameSet.moves} moves!`;
    popupWin.classList.add('_active');
    saveResults(); // сохранение результата в массив results
    clearMoves(); // сброс счетчика шагов
    stopTimer(); // остановка и сброс таймера
    while (gameBox.firstChild) gameBox.removeChild(gameBox.firstChild); // очищаем узел gameBox
  }, 200);
}

// меняет местами нажатую и пустую ячейки ------------------------------------------
function move(i) {
  const cell = cells[i]; // определяем текущую ячейку по индексу
  const empty = cells[0]; // пустая ячейка

  // проверка условия что ячейки находятся рядом (разница в 1 по одному из напралений)
  if (Math.abs(empty.left - cell.left) + Math.abs(empty.top - cell.top) === 1) {
    // переставляем нажатую ячейку на место пустой
    cell.element.style.left = `${empty.left * gameSet.cellSize}px`;
    cell.element.style.top = `${empty.top * gameSet.cellSize}px`;

    // меняем ячейки местами
    const timeLeft = empty.left; // временная переменаня для координат пустой ячейки
    const timeTop = empty.top;
    empty.left = cell.left;
    empty.top = cell.top;
    cell.left = timeLeft;
    cell.top = timeTop;

    // увеличиваем счетчик шагов
    gameSet.moves += 1;
    movesNum.textContent = gameSet.moves;

    moveSound(); // звук перемещения ячейки
    checkWin(); // проверка победы
  }
}

// создает решаемый массив --------------------------------------------------------
function createTrueArr() {
  for (; ;) { // безконечный цикл пока не сформирует решаеммый массив
    const arr = [...Array(gameSet.cellquantity).keys()]
      .map((num) => num + 1)
      .sort(() => Math.random() - 0.5);
    let sum = gameSet.cellquantity % 2; // не четный массив начинаем с 1, если четный 0
    for (let i = 0; i < arr.length; i += 1) {
      for (let n = i; n < arr.length; n += 1) {
        if (arr[n] < arr[i]) sum += 1;
      }
    }
    if (sum % 2 === 0) return arr; // если итоговая сумма четная массив коректный
  }
}

// перетягивание элемента -------------------------------------------------
let target; // блок над которым держат элемент
let currentCell; // текущая премещаемая ячейка
function dragStart(i) {
  currentCell = i; // определяет номер текущей перемещаемой ячейки
}
function drop(i) { // после отпускания удержанного элемента
  if (target === gameBox) move(i);
  target = undefined;
  gameBox.classList.remove('_active');
  gameBox.classList.remove('_deactive');
}
function dragOver(e) { // удерживание элемента над игровым полем
  e.preventDefault();
  target = e.target;
  const cell = cells[currentCell]; // определяем текущую ячейку по индексу
  const empty = cells[0]; // пустая ячейка
  // проверка условия что ячейки находятся рядом (разница в 1 по одному из напралений)
  if (Math.abs(empty.left - cell.left) + Math.abs(empty.top - cell.top) === 1
    && target === gameBox) { // проверка удержания над иговым полем
    gameBox.classList.add('_active');
    gameBox.classList.remove('_deactive');
  } else {
    gameBox.classList.remove('_active');
    gameBox.classList.add('_deactive');
  }
}
gameBox.addEventListener('dragover', (e) => { dragOver(e); });

// заполнение поле ячейками --------------------------------------------------------
function create() {
  // массив чисел от 1 до N в случайном порядке (для заполнения ячеек)
  const numbers = createTrueArr();
  for (let i = 1; i <= gameSet.cellquantity; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('gemPuzzle__cell');
    const value = numbers[i - 1]; // число для текущей ячейки
    cell.textContent = value;
    cell.style.width = `${gameSet.cellSize}px`;
    cell.style.height = `${gameSet.cellSize}px`;
    const left = i % gameSet.cellInLine; // номер ячейки слева
    const top = (i - left) / gameSet.cellInLine; // номер ячейки сверху
    // устанавливает ячейку на нужну позицию
    cell.style.left = `${left * gameSet.cellSize}px`;
    cell.style.top = `${top * gameSet.cellSize}px`;
    gameBox.appendChild(cell);
    // зааписывает ячейки и их позтции в массив
    cells.push({
      left: left,
      top: top,
      element: cell,
      value: value,
    });
    cell.draggable = 'true';
    cell.addEventListener('dragend', () => { drop(i); });
    cell.addEventListener('dragstart', () => { dragStart(i); });
    cell.addEventListener('click', () => move(i));
  }
}

// кнопка старта -------------------------------------------------------------------
function startGame() {
  resize(); // обновляет размеры игрового поля
  popupWin.classList.remove('_active'); // скрывает победный поп-ап
  // сбрасывает все параметры игры
  cells = [{ left: 0, top: 0, value: 0 }]; // очищаем массив
  while (gameBox.firstChild) gameBox.removeChild(gameBox.firstChild); // очищаем узел gameBox
  clearMoves(); // сброс счетчика шагов
  stopTimer(); // остановка и сброс таймера
  startTimer(); // запускает таймер
  create(); // заполнение поле ячейками
}
buttonStart.addEventListener('click', startGame);

// выбор количества ячеек ------------------------------------------------------------
function offActiv() { // убирает актив со всех кнопок
  button3x3.classList.remove('_active');
  button4x4.classList.remove('_active');
  button5x5.classList.remove('_active');
  button6x6.classList.remove('_active');
  button7x7.classList.remove('_active');
  button8x8.classList.remove('_active');
}

// переключение размера поля ---------------------------------------------------------
function changeCellInLine(button) {
  if (button === button3x3) {
    offActiv(); // убирает актив со всех кнопок
    button3x3.classList.add('_active'); // добавляет актив выбранной кнопке
    gameSet.cellInLine = 3;
    gameSet.cellquantity = 8;
    startGame(); // перезапуск игры
  }
  if (button === button4x4) {
    offActiv();
    button4x4.classList.add('_active');
    gameSet.cellInLine = 4;
    gameSet.cellquantity = 15;
    startGame();
  }
  if (button === button5x5) {
    offActiv();
    button5x5.classList.add('_active');
    gameSet.cellInLine = 5;
    gameSet.cellquantity = 24;
    startGame();
  }
  if (button === button6x6) {
    offActiv();
    button6x6.classList.add('_active');
    gameSet.cellInLine = 6;
    gameSet.cellquantity = 35;
    startGame();
  }
  if (button === button7x7) {
    offActiv();
    button7x7.classList.add('_active');
    gameSet.cellInLine = 7;
    gameSet.cellquantity = 48;
    startGame();
  }
  if (button === button8x8) {
    offActiv();
    button8x8.classList.add('_active');
    gameSet.cellInLine = 8;
    gameSet.cellquantity = 63;
    startGame();
  }
}
choiceLine.childNodes.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    changeCellInLine(e.target);
  });
});

// обновление игрового поля ----------------------------------------------------------
function updateGameBox() {
  while (gameBox.firstChild) gameBox.removeChild(gameBox.firstChild); // очищаем узел gameBox
  resize(); // обновляет размеры игрового поля
  for (let i = 1; i <= gameSet.cellquantity; i += 1) {
    const cell = document.createElement('div');
    cell.classList.add('gemPuzzle__cell');
    const value = cells[i].value; // число для текущей ячейки
    cell.textContent = value;
    cell.style.width = `${gameSet.cellSize}px`;
    cell.style.height = `${gameSet.cellSize}px`;
    const left = cells[i].left; // номер ячейки слева
    const top = cells[i].top; // номер ячейки сверху
    // устанавливает ячейку на нужну позицию
    cell.style.left = `${left * gameSet.cellSize}px`;
    cell.style.top = `${top * gameSet.cellSize}px`;
    gameBox.appendChild(cell);
    // зааписывает ячейки и их позтции в массив
    cells[i] = {
      left: left,
      top: top,
      element: cell,
      value: value,
    };
    cell.draggable = 'true';
    cell.addEventListener('dragend', () => { drop(i); });
    cell.addEventListener('dragstart', () => { dragStart(i); });
    cell.addEventListener('click', () => move(i));
  }
}

// сохранение текущей игры в LS ---------------------------------------------------
function saveGame() { // сохранение в local storage
  localStorage.setItem('gemPuzzleCells', JSON.stringify(cells)); // строка из массива
  localStorage.setItem('gemPuzzleGameSet', JSON.stringify(gameSet)); // строка из массива
}
buttonSave.addEventListener('click', saveGame);

function loadGame() { // загрузка из local storage
  if (localStorage.getItem('gemPuzzleCells') && localStorage.getItem('gemPuzzleGameSet')) {
    cells = JSON.parse(localStorage.getItem('gemPuzzleCells')); // массив из строки
    gameSet = JSON.parse(localStorage.getItem('gemPuzzleGameSet')); // массив из строки
  }
  offActiv(); // убирает актив со всех кнопок
  if (gameSet.cellInLine === 3) button3x3.classList.add('_active'); // добавляет актив выбранной кнопке
  if (gameSet.cellInLine === 4) button4x4.classList.add('_active');
  if (gameSet.cellInLine === 5) button5x5.classList.add('_active');
  if (gameSet.cellInLine === 6) button6x6.classList.add('_active');
  if (gameSet.cellInLine === 7) button7x7.classList.add('_active');
  if (gameSet.cellInLine === 8) button8x8.classList.add('_active');
  movesNum.textContent = gameSet.moves; // востанавливаем счетчик шагов
  updateGameBox(); // обновляет игровое поле
}
buttonLoad.addEventListener('click', loadGame);

// запуск и перезапуск игры -------------------------------------------------------------
popupWin.addEventListener('click', startGame); // клик по окну победного поп-ап
window.addEventListener('load', startGame); // запуск игры при первой загрузке
window.addEventListener('resize', updateGameBox); // перезапускает игру при изменении размера поля
// ---------------------------------------------------------------------------------------
