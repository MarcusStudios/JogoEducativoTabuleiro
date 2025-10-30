export const $ = (s) => document.querySelector(s);

export const screens = {
  start: $('#start-screen'),
  board: $('#board-screen'),
  problem: $('#problem-screen'),
  ods: $('#ods-screen'),
  result: $('#result-screen'),
  final: $('#final-screen')
};

// Constantes de layout do tabuleiro para fácil manutenção
const BOARD_SPACE_SIZE = 70;
const BOARD_HORIZONTAL_GAP = 10;

export function showScreen(screenName) {
  Object.values(screens).forEach(s => {
    s.classList.remove('active');
  });
  screens[screenName].classList.add('active');
}

export function animateCount(el, to) {
  let from = parseInt(el.textContent) || 0;
  if (from === to) return;
  const duration = 500;
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    const current = from + (to - from) * progress;
    el.textContent = Math.round(current);

    if (frame === totalFrames) clearInterval(counter);
  }, frameDuration);
}

export function renderOptions(containerSelector, items, htmlFn, clickFn) {
  const list = $(containerSelector);
  list.innerHTML = '';
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'option';
    div.innerHTML = htmlFn(item);
    div.onclick = () => clickFn(item);
    div.style.animationDelay = `${index * 50}ms`;
    list.appendChild(div);
  });
}

export function updateProblemScreen(biome) {
  $('#biome-title').textContent = biome.name;
  $('#biome-desc').textContent = biome.desc;
  const problemScreenCard = screens.problem.querySelector('.card');
  problemScreenCard.style.backgroundImage = `url(${biome.img || 'img/default.jpg'})`;
  problemScreenCard.classList.add('has-bg');
}

export function updateODSScreen(problem) {
  $('#problem-title').textContent = problem.name;
  $('#problem-desc').textContent = problem.desc;
}

export function updateResultScreen(state, points) {
  const { biome, problem, ods } = state.current;
  $('#choice-summary').innerHTML = `${biome.name} → ${problem.name}<br>Você escolheu <strong>${ods.title}</strong>`;
  animateCount($('#round-score'), points);
  animateCount($('#total-score'), state.total);
  $('#continue-game-btn').focus();
}

export function updateProgress(state) {
  const total = state.board.length - 1;
  const done = state.playerPosition;
  const pct = (done / total) * 100;
  $('#progress-bar').style.width = pct + '%';
}

export function showFinalScreen(state, allBiomes) {
  const max = allBiomes.length * 40;
  const pct = (state.total / max) * 100;
  let msg = pct > 80 ? 'Excelente! 🌟' : 'Bom trabalho! Continue aprendendo 🌿';
  const resumo = state.rounds
    .map(r => `• ${r.biome.name} — ${r.problem.name} → ${r.ods.title} (+${r.ods.points})`)
    .join('<br>');
  $('#final-score').textContent = state.total;
  $('#final-text').innerHTML = `${msg}<br><br><strong>Resumo:</strong><br>${resumo}`;
  showScreen('final');
}

export function renderBoard(state, allBiomes) {
  const boardEl = $('#game-board');
  boardEl.innerHTML = '<div id="player-pawn" class="player-pawn">🚀</div>';

  state.board.forEach((space, index) => {
    const spaceEl = document.createElement('div');
    spaceEl.className = 'board-space';

    // Layout horizontal
    spaceEl.style.left = `${index * (BOARD_SPACE_SIZE + BOARD_HORIZONTAL_GAP)}px`;

    if (space.type === 'start') {
      spaceEl.classList.add('start');
      spaceEl.innerHTML = '🏁<small>Início</small>';
    } else if (space.type === 'finish') {
      spaceEl.classList.add('finish');
      spaceEl.innerHTML = '🏆<small>Fim</small>';
    } else if (space.type === 'biome') {
      const biome = allBiomes.find(b => b.id === space.id);
      spaceEl.innerHTML = `${biome ? biome.emoji : '❓'}<small>${biome ? biome.name : '???'}</small>`;
    } else if (space.type === 'special') {
      spaceEl.classList.add('special');
      spaceEl.innerHTML = '⭐<small>Bônus</small>';
    }
    boardEl.appendChild(spaceEl);
  });

  updatePawnPosition(state);
  scrollBoardToPlayer(state.playerPosition); // Garante que o scroll comece na posição 0
  $('#board-total-score').textContent = state.total;
}

export function updatePawnPosition(state) {
  const pawnEl = $('#player-pawn');
  const newLeft = state.playerPosition * (BOARD_SPACE_SIZE + BOARD_HORIZONTAL_GAP) + BOARD_SPACE_SIZE / 2;

  pawnEl.style.left = `${newLeft}px`;
  scrollBoardToPlayer(state.playerPosition);
}

export function scrollBoardToPlayer(playerPosition) {
  const boardContainer = $('.board-container');
  const playerPixelPosition = playerPosition * (BOARD_SPACE_SIZE + BOARD_HORIZONTAL_GAP);
  const containerWidth = boardContainer.offsetWidth;

  // Calcula o scroll para centralizar o jogador, mas não antes do início ou depois do fim.
  const scrollTo = playerPixelPosition - (containerWidth / 2) + (BOARD_SPACE_SIZE / 2);
  boardContainer.scrollTo({ left: scrollTo, behavior: 'smooth' });
}

export function animateDiceRoll(roll) {
  const dice = $('#dice');
  // Remove classes de resultado anteriores e adiciona a animação
  dice.className = 'dice rolling';

  // Após a animação, define a face correta a ser mostrada
  setTimeout(() => {
    dice.classList.remove('rolling');
    dice.classList.add(`show-${roll}`);
  }, 1000); // Deve corresponder à duração da animação
}

export function renderThemeSelection(allBiomes) {
  const themeListEl = $('#theme-list');
  themeListEl.innerHTML = '';
  allBiomes.forEach(biome => {
    const itemEl = document.createElement('label');
    itemEl.className = 'theme-item';
    
    let deleteBtnHtml = '';
    if (biome.custom) {
      // Adiciona um botão de apagar apenas para temas personalizados
      deleteBtnHtml = `<button class="delete-theme-btn" data-id="${biome.id}" title="Apagar tema">❌</button>`;
    }
    itemEl.innerHTML = `<input type="checkbox" value="${biome.id}" ${biome.checked ? 'checked' : ''}> <span>${biome.emoji} ${biome.name}</span> ${deleteBtnHtml}`;
    
    // Adiciona feedback visual para seleção
    const checkbox = itemEl.querySelector('input[type="checkbox"]');
    if (checkbox.checked) itemEl.classList.add('selected');
    checkbox.addEventListener('change', () => {
      itemEl.classList.toggle('selected', checkbox.checked);
    });
    themeListEl.appendChild(itemEl);
  });
}

export function getSelectedThemes() {
  return Array.from($('#theme-list').querySelectorAll('input:checked')).map(input => input.value);
}