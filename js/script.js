// AVISO: Este arquivo parece ser uma versão antiga ou de rascunho da lógica do jogo.
// A lógica principal agora está nos arquivos `game.js` e `ui.js`.
let DATA = {
  biomes: [
    {
      id: "amazonia",
      name: "Amazônia",
      desc: "Maior floresta tropical do mundo.",
      emoji: "🌳",
      img: "img/amazonia.jpg",
    },
    {
      id: "cerrado",
      name: "Cerrado",
      desc: "Savanas brasileiras ricas em biodiversidade.",
      emoji: "🌾",
      img: "img/cerrado.jpg",
    },
    {
      id: "caatinga",
      name: "Caatinga",
      desc: "Bioma semiárido com espécies adaptadas à seca.",
      emoji: "🌵",
      img: "img/caatinga.jpg",
    },
    {
      id: "pantanal",
      name: "Pantanal",
      desc: "Maior planície alagável do planeta.",
      emoji: "🦜",
      img: "img/pantanal.jpg",
    },
    {
      id: "mata",
      name: "Mata Atlântica",
      desc: "Bioma costeiro muito ameaçado.",
      emoji: "🌲",
      img: "img/mata.jpg",
    },
    {
      id: "pampa",
      name: "Pampa",
      desc: "Campos do sul com rica fauna e flora.",
      emoji: "🐄",
      img: "img/pampa.jpg",
    },
    {
      id: "restinga",
      name: "Restinga",
      desc: "Ecossistemas costeiros com vegetação arenosa.",
      emoji: "🦀",
      img: "img/restinga.jpg",
    },
  ],

  problems: [
    {
      id: "queimadas",
      name: "Queimadas",
      desc: "Fogo destrói habitats e libera CO₂.",
    },
    {
      id: "desmatamento",
      name: "Desmatamento",
      desc: "Remoção da vegetação nativa.",
    },
    { id: "poluicao", name: "Poluição", desc: "Contaminação do solo e água." },
    {
      id: "extincao",
      name: "Extinção",
      desc: "Perda de espécies por caça e degradação.",
    },
  ],

  ods: [
    {
      id: 4,
      title: "ODS 4 - Educação de qualidade",
      desc: "Educação ambiental e conscientização.",
      points: 30,
    },
    {
      id: 13,
      title: "ODS 13 - Ação climática",
      desc: "Combate às mudanças climáticas.",
      points: 40,
    },
    {
      id: 15,
      title: "ODS 15 - Vida terrestre",
      desc: "Proteção de ecossistemas.",
      points: 35,
    },
    {
      id: 6,
      title: "ODS 6 - Água potável e saneamento",
      desc: "Preservação de recursos hídricos.",
      points: 20,
    },
  ],
};

// ===================== ESTADO DO JOGO =====================
// Objeto para armazenar o estado atual do jogo.
let state = {
  selectedThemes: [],
  board: [],
  playerPosition: 0,
  total: 0,
  current: {},
  rounds: [],
};

// ===================== UTILIDADES =====================
// Atalho para `document.querySelector`.
const $ = (s) => document.querySelector(s);

// Objeto para referenciar as diferentes telas do jogo.
const screens = {
  start: $("#start-screen"),
  board: $("#board-screen"),
  problem: $("#problem-screen"),
  ods: $("#ods-screen"),
  result: $("#result-screen"),
  final: $("#final-screen"),
};

// Função para mostrar uma tela específica e esconder as outras.
function show(screenName) {
  Object.values(screens).forEach((s) => {
    s.classList.remove("active");
  });
  screens[screenName].classList.add("active"); // A transição é controlada pelo CSS
}

// ===================== SOM SIMPLES =====================
let ctx;

// Gera um som simples (beep) usando a Web Audio API.
function beep(f = 440, t = 0.05) {
  if (!window.AudioContext) return;
  if (!ctx) ctx = new AudioContext();

  const o = ctx.createOscillator();
  const g = ctx.createGain();

  o.frequency.value = f;
  g.gain.value = 0.02;

  o.connect(g);
  g.connect(ctx.destination);
  o.start();

  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t);
  o.stop(ctx.currentTime + t + 0.01);
}

// Anima a contagem de um número em um elemento HTML.
function animateCount(el, to) {
  let from = parseInt(el.textContent) || 0;
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

// ===================== INICIALIZAÇÃO =====================
function init() {
  // Pega os temas selecionados e inicializa o estado do jogo.
  state.selectedThemes = getSelectedThemes();
  if (state.selectedThemes.length === 0) {
    alert("Por favor, selecione pelo menos um tema para jogar!");
    return;
  }
  state.total = 0;
  state.rounds = [];
  state.playerPosition = 0;

  // Gera e renderiza o tabuleiro, e mostra a tela do tabuleiro.
  generateBoard();
  renderBoard();
  show("board");
}

// ===================== ETAPA 1 - ESCOLHA DO BIOMA =====================
function selectBiome(id) {
  // Encontra o bioma pelo ID e atualiza o estado.
  const b = DATA.biomes.find((x) => x.id === id);
  if (!b) {
    console.error(`Bioma com id "${id}" não encontrado!`);
    return;
  }
  state.current.biome = b;

  $("#biome-title").textContent = b.name;
  $("#biome-desc").textContent = b.desc;

  // Define a imagem de fundo da tela de problemas.
  const problemScreenCard = screens.problem.querySelector(".card");
  problemScreenCard.style.backgroundImage = `url(${b.img})`;
  problemScreenCard.classList.add("has-bg");

  // Renderiza as opções de problemas.
  renderOptions(
    "#problem-list",
    DATA.problems,
    (p) => `<strong>${p.name}</strong><br><small>${p.desc}</small>`,
    (p) => selectProblem(p.id)
  );

  show("problem");
}

// Função auxiliar para renderizar listas de opções clicáveis.
function renderOptions(containerSelector, items, htmlFn, clickFn) {
  const list = $(containerSelector);
  list.innerHTML = "";
  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerHTML = htmlFn(item);
    div.onclick = () => clickFn(item);
    div.style.animationDelay = `${index * 50}ms`; // Efeito de stagger
    list.appendChild(div);
  });
}
// ===================== ETAPA 2 - ESCOLHA DO PROBLEMA =====================
function selectProblem(id) {
  // Encontra o problema pelo ID e atualiza o estado.
  const p = DATA.problems.find((x) => x.id === id);
  state.current.problem = p;

  $("#problem-title").textContent = p.name;
  $("#problem-desc").textContent = p.desc;

  // Renderiza as opções de ODS.
  renderOptions(
    "#ods-list",
    DATA.ods,
    (o) =>
      `<div><strong>${o.title}</strong></div><small>${o.desc}</small><div class="points">+${o.points}</div>`,
    (o) => selectODS(o.id)
  );

  show("ods");
}

// ===================== ETAPA 3 - ESCOLHA DO ODS =====================
function selectODS(id) {
  // Encontra o ODS pelo ID e atualiza o estado.
  const o = DATA.ods.find((x) => x.id === id);
  state.current.ods = o;

  beep(800, 0.1);

  // Salva a rodada e atualiza a pontuação.
  state.rounds.push({
    biome: state.current.biome,
    problem: state.current.problem,
    ods: o,
  });

  state.total += o.points;

  // Atualiza a tela de resultado.
  $(
    "#choice-summary"
  ).innerHTML = `${state.current.biome.name} → ${state.current.problem.name}<br>Você escolheu <strong>${o.title}</strong>`;

  animateCount($("#round-score"), o.points);
  animateCount($("#total-score"), state.total);

  // Atualiza a barra de progresso e mostra a tela de resultado.
  updateProgress();
  show("result");
}

// ===================== CONTINUAR JOGO =====================
function continueGame() {
  // Habilita o botão do dado e volta para a tela do tabuleiro.
  $("#roll-dice-btn").disabled = false;
  show("board");
}

// ===================== BARRA DE PROGRESSO =====================
function updateProgress() {
  // Calcula e atualiza a largura da barra de progresso.
  const total = state.board.length - 1;
  const done = state.playerPosition;
  const pct = (done / total) * 100;

  $("#progress-bar").style.width = pct + "%";
}

// ===================== TELA FINAL =====================
function showFinal() {
  // Calcula a pontuação percentual para dar uma mensagem final.
  const max = state.selectedThemes.length * 40; // Estimativa
  const pct = (state.total / max) * 100;

  let msg = pct > 80 ? "Excelente! 🌟" : "Bom trabalho! Continue aprendendo 🌿";

  // Cria um resumo de todas as jogadas.
  const resumo = state.rounds
    .map(
      (r) =>
        `• ${r.biome.name} — ${r.problem.name} → ${r.ods.title} (+${r.ods.points})`
    )
    .join("<br>");

  $("#final-score").textContent = state.total;
  $(
    "#final-text"
  ).innerHTML = `${msg}<br><br><strong>Resumo:</strong><br>${resumo}`;

  // Mostra a tela final.
  show("final");
}

// ===================== LÓGICA DO TABULEIRO =====================
function generateBoard() {
  const boardSize = state.selectedThemes.length * 2 + 3; // Ajuste o tamanho conforme necessário
  state.board = [];
  state.board.push({ type: "start" });

  // Preenche o tabuleiro com casas de bioma e casas especiais.
  let themeIndex = 0;
  for (let i = 1; i < boardSize - 1; i++) {
    if (i % 2 !== 0 && themeIndex < state.selectedThemes.length) {
      state.board.push({ type: "biome", id: state.selectedThemes[themeIndex] });
      themeIndex++;
    } else {
      state.board.push({ type: "special", event: "bonus" }); // Pode adicionar mais eventos
    }
  }
  state.board.push({ type: "finish" });
}

function renderBoard() {
  const boardEl = $("#game-board");
  // Limpa o tabuleiro e adiciona o peão.
  boardEl.innerHTML = '<div id="player-pawn" class="player-pawn">🚀</div>'; // Reset com peão

  // Cria os elementos HTML para cada casa do tabuleiro.
  state.board.forEach((space) => {
    const spaceEl = document.createElement("div");
    spaceEl.className = "board-space";
    if (space.type === "start") {
      spaceEl.classList.add("start");
      spaceEl.innerHTML = "🏁<small>Início</small>";
    } else if (space.type === "finish") {
      spaceEl.classList.add("finish");
      spaceEl.innerHTML = "🏆<small>Fim</small>";
    } else if (space.type === "biome") {
      const biome = DATA.biomes.find((b) => b.id === space.id);
      spaceEl.innerHTML = biome.emoji + `<small>${biome.name}</small>`;
    } else if (space.type === "special") {
      spaceEl.classList.add("special");
      spaceEl.innerHTML = "⭐<small>Bônus</small>";
    }
    boardEl.appendChild(spaceEl);
  });
  // Atualiza a posição do peão e o placar.
  updatePawnPosition();
  $("#board-total-score").textContent = state.total;
}

function rollDice() {
  // Desabilita o botão e rola o dado.
  $("#roll-dice-btn").disabled = true;
  const roll = Math.floor(Math.random() * 3) + 1; // Dado de 1 a 3
  const diceResultEl = $("#dice-result");
  diceResultEl.textContent = roll;
  diceResultEl.style.animation = "dice-roll .3s ease";
  setTimeout(() => {
    diceResultEl.style.animation = "";
  }, 300);

  // Move o jogador.
  movePlayer(roll);
}

function movePlayer(steps) {
  state.playerPosition += steps;
  // Garante que o jogador não passe do fim.
  if (state.playerPosition >= state.board.length - 1) {
    state.playerPosition = state.board.length - 1;
  }
  updatePawnPosition();

  // Espera a animação do peão antes de ativar o evento da casa.
  setTimeout(triggerSpaceEvent, 800); // Espera a animação do peão
}

function updatePawnPosition() {
  // Atualiza a posição 'left' do peão para movê-lo horizontalmente.
  const pawnEl = $("#player-pawn");
  const spaceWidth = 80; // 70px de largura + 10px de margem
  const newLeft = state.playerPosition * spaceWidth + spaceWidth / 2;
  pawnEl.style.left = `${newLeft}px`;
}

function triggerSpaceEvent() {
  // Ativa o evento correspondente à casa onde o jogador parou.
  const currentSpace = state.board[state.playerPosition];
  if (currentSpace.type === "biome") {
    selectBiome(currentSpace.id);
  } else if (currentSpace.type === "finish") {
    showFinal();
  } else {
    // Para casas 'start' ou 'special', apenas habilita o dado novamente
    if (currentSpace.type === "special") {
      beep(900, 0.08);
      state.total += 10; // Bônus de 10 pontos
      animateCount($("#board-total-score"), state.total);
    }
    $("#roll-dice-btn").disabled = false;
  }
}

// ===================== SELEÇÃO E CRIAÇÃO DE TEMAS =====================
function loadThemes() {
  // Carrega temas personalizados do localStorage e os combina com os temas padrão.
  const customThemes = JSON.parse(localStorage.getItem("customBiomes")) || [];
  DATA.biomes = [...DATA.biomes.filter((b) => !b.custom), ...customThemes]; // Evita duplicação

  // Renderiza a lista de temas na tela inicial.
  const themeListEl = $("#theme-list");
  themeListEl.innerHTML = "";
  DATA.biomes.forEach((biome) => {
    const itemEl = document.createElement("label");
    itemEl.className = "theme-item";
    itemEl.innerHTML = `<input type="checkbox" value="${biome.id}" checked> ${biome.emoji} ${biome.name}`;
    themeListEl.appendChild(itemEl);
  });
}

function getSelectedThemes() {
  // Retorna um array com os valores dos checkboxes de tema que estão marcados.
  return Array.from($("#theme-list").querySelectorAll("input:checked")).map(
    (input) => input.value
  );
}

function saveNewTheme(event) {
  // Previne o envio do formulário e pega os valores dos inputs.
  event.preventDefault();
  const name = $("#theme-name").value;
  const desc = $("#theme-desc").value;
  const emoji = $("#theme-emoji").value;
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  const newTheme = {
    id,
    name,
    desc,
    emoji,
    img: "img/default.jpg",
    custom: true,
  };

  // Salva o novo tema no localStorage.
  const customThemes = JSON.parse(localStorage.getItem("customBiomes")) || [];
  customThemes.push(newTheme);
  localStorage.setItem("customBiomes", JSON.stringify(customThemes));

  // Recarrega a lista de temas e fecha o modal.
  loadThemes();
  $("#create-theme-modal").style.display = "none";
}

// ===================== EVENTOS =====================
// Adiciona os listeners de evento quando o DOM estiver pronto.
document.addEventListener("DOMContentLoaded", () => {
  loadThemes();
  show("start");

  $("#start-btn").onclick = init;
  $("#roll-dice-btn").onclick = rollDice;
  $("#board-back-btn").onclick = () => show("start");
  $("#problem-back").onclick = () => show("biome");
  $("#ods-back").onclick = () => show("problem");
  $("#continue-game-btn").onclick = continueGame;
  $("#play-again").onclick = () => show("start");

  // Eventos para abrir e fechar o modal de criação de tema.
  $("#create-theme-btn").onclick = () =>
    ($("#create-theme-modal").style.display = "flex");
  $("#cancel-theme-btn").onclick = () =>
    ($("#create-theme-modal").style.display = "none");
  $("#create-theme-form").onsubmit = saveNewTheme;
});
