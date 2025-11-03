// Importa os dados iniciais do jogo (biomas, problemas, ODS) do arquivo data.js
import { DATA as initialData } from "./data.js";
// Importa funções de utilidade da UI do arquivo ui.js
import {
  $,
  showScreen,
  animateCount,
  renderOptions,
  updateProblemScreen,
  updateODSScreen,
  updateResultScreen,
  updateProgress,
  showFinalScreen,
  renderBoard,
  updatePawnPosition,
  animateDiceRoll,
  renderThemeSelection,
  getSelectedThemes,
} from "./ui.js";

// Clona os dados iniciais para uma variável local. Isso evita que o objeto original importado seja modificado durante o jogo.
let allGameData = JSON.parse(JSON.stringify(initialData));

// ===================== ESTADO DO JOGO =====================
// O objeto 'state' armazena todas as informações dinâmicas do jogo.
let state = {
  selectedThemes: [],
  board: [],
  playerPosition: 0,
  total: 0,
  current: {},
  rounds: [],
};

// ===================== SOM SIMPLES =====================
let ctx;

// Função para gerar um som simples (beep) usando a Web Audio API.
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

// ===================== INICIALIZAÇÃO =====================
function init() {
  // Pega os temas (biomas) selecionados pelo jogador na tela inicial.
  state.selectedThemes = getSelectedThemes();
  if (state.selectedThemes.length === 0) {
    alert("Por favor, selecione pelo menos um tema para jogar!");
    return;
  }
  // Reseta o estado do jogo para uma nova partida.
  state.total = 0;
  state.rounds = [];
  state.playerPosition = 0;

  // Gera o tabuleiro, renderiza na tela e mostra a tela do tabuleiro.
  generateBoard();
  renderBoard(state, allGameData.biomes);
  showScreen("board");
}

// ===================== ETAPA 1 - ESCOLHA DO BIOMA =====================
function selectBiome(id) {
  // Encontra o bioma selecionado nos dados do jogo.
  const b = allGameData.biomes.find((x) => x.id === id);
  if (!b) {
    console.error(`Bioma com id "${id}" não encontrado!`);
    return;
  }
  state.current.biome = b;

  // Atualiza a tela de problemas com as informações do bioma.
  updateProblemScreen(b);

  // Renderiza a lista de problemas para o jogador escolher.
  renderOptions(
    "#problem-list",
    b.problems || [], // Usa os problemas do bioma selecionado.
    (p) => `<strong>${p.name}</strong><br><small>${p.desc}</small>`,
    (p) => selectProblem(p) // p é o objeto completo do problema
  );

  // Mostra a tela de seleção de problemas.
  showScreen("problem");
}

// ===================== ETAPA 2 - ESCOLHA DO PROBLEMA =====================
function selectProblem(p) {
  // Armazena o problema escolhido no estado do jogo.
  state.current.problem = p;
  updateODSScreen(p);

  // Renderiza a lista de soluções (que agora estão dentro do próprio problema) para o jogador escolher.
  renderOptions(
    "#ods-list",
    p.solutions || [], // Usa a lista de soluções do problema.
    (o) =>
      // A resposta 'o' agora é um objeto com 'text' e 'points'.
      `<div>${o.text}</div><div class="points">+${o.points}</div>`,
    (o) => selectSolution(o) // o é o objeto completo da solução
  );

  // Mostra a tela de seleção de ODS.
  showScreen("ods");
}

// ===================== ETAPA 3 - ESCOLHA DA SOLUÇÃO =====================
function selectSolution(solutionObject) {
  // Armazena a solução escolhida.
  state.current.solution = solutionObject;
  beep(800, 0.1);

  // Salva a jogada completa (bioma, problema, ODS) no histórico de rodadas.
  state.rounds.push({
    biome: state.current.biome,
    problem: state.current.problem,
    solution: solutionObject,
  });

  state.total += solutionObject.points;

  // Atualiza a tela de resultado com os pontos ganhos e o total.
  updateResultScreen(state, solutionObject.points);
  // Atualiza a barra de progresso no tabuleiro.
  updateProgress(state);
  showScreen("result");
}

// ===================== CONTINUAR JOGO =====================
function continueGame() {
  console.log(
    '[DEBUG] Habilitando botão "Jogar Dado" (após tela de resultado).'
  );
  $("#roll-dice-btn").disabled = false;
  // Atualiza o placar do tabuleiro ao voltar da tela de resultado.
  animateCount($("#board-total-score"), state.total);
  showScreen("board");
}

// ===================== LÓGICA DO TABULEIRO =====================
function generateBoard() {
  const boardSize = state.selectedThemes.length * 3 + 2;
  state.board = [];
  state.board.push({ type: "start" });

  // Preenche o tabuleiro com casas de bioma e casas especiais (bônus).
  let themeIndex = 0;
  for (let i = 0; i < state.selectedThemes.length * 2; i++) {
    // Alterna entre casas de bioma e casas especiais.
    if (i % 2 === 0 && themeIndex < state.selectedThemes.length) {
      // Adiciona uma casa de bioma, pegando o ID da lista de temas selecionados.
      state.board.push({ type: "biome", id: state.selectedThemes[themeIndex] });
      themeIndex++;
    } else {
      state.board.push({ type: "special", event: "bonus" }); // Pode adicionar mais eventos
    }
  }
  state.board.push({ type: "finish" });
}

function rollDice() {
  console.log('[DEBUG] Desabilitando botão "Jogar Dado" (ao ser clicado).');
  // Desabilita o botão para evitar múltiplos cliques.
  $("#roll-dice-btn").disabled = true;
  // Gera um número aleatório entre 1 e 3.
  const roll = Math.floor(Math.random() * 3) + 1;
  // Inicia a animação do dado 3D.
  animateDiceRoll(roll);
  // Move o peão do jogador.
  movePlayer(roll);
}

function movePlayer(steps) {
  state.playerPosition += steps;
  // Garante que o jogador não ultrapasse a casa final.
  if (state.playerPosition >= state.board.length - 1) {
    state.playerPosition = state.board.length - 1;
  }
  // Atualiza a posição visual do peão no tabuleiro.
  updatePawnPosition(state);
  // Aguarda a animação do peão terminar antes de ativar o evento da casa.
  setTimeout(triggerSpaceEvent, 1300); // Aumentado para corresponder à nova duração da animação
}

function triggerSpaceEvent() {
  const currentSpace = state.board[state.playerPosition];
  if (currentSpace.type === "biome") {
    // Se for uma casa de bioma, inicia a sequência de perguntas.
    selectBiome(currentSpace.id);
  } else if (currentSpace.type === "finish") {
    showFinalScreen(state, allGameData.biomes);
  } else {
    // Para casas 'start' ou 'special', apenas habilita o dado novamente
    if (currentSpace.type === "special") {
      beep(900, 0.08);
      state.total += 5; // Bônus de 5 pontos
      animateCount($("#board-total-score"), state.total);
    }
    console.log(
      `[DEBUG] Habilitando botão "Jogar Dado" (após evento da casa '${currentSpace.type}').`
    );
    $("#roll-dice-btn").disabled = false;
  }
}

// ===================== SELEÇÃO E CRIAÇÃO DE TEMAS =====================
function loadThemes() {
  // Carrega temas personalizados salvos no localStorage do navegador.
  const customBiomes = JSON.parse(localStorage.getItem("customBiomes")) || [];
  // Combina os biomas originais com os personalizados.
  allGameData.biomes = [...initialData.biomes, ...customBiomes].map(
    (biome) => ({
      ...biome,
      checked: true,
    })
  );
  renderThemeSelection(allGameData.biomes);
}

function saveNewTheme(event) {
  event.preventDefault();
  // Pega os dados do formulário do modal.
  const name = $("#theme-name").value;
  const desc = $("#theme-desc").value;
  const emoji = $("#theme-emoji").value;
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, "");

  // Cria um novo objeto de tema.
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

  // Recarrega a lista de temas na UI e fecha o modal.
  loadThemes();
  $("#create-theme-modal").style.display = "none";
}

function deleteTheme(themeId) {
  if (
    !confirm(
      "Tem certeza que deseja apagar este tema? Esta ação não pode ser desfeita."
    )
  ) {
    return;
  }

  // Pega os temas personalizados, filtra para remover o tema selecionado e salva de volta.
  let customThemes = JSON.parse(localStorage.getItem("customBiomes")) || [];

  customThemes = customThemes.filter((theme) => theme.id !== themeId);

  localStorage.setItem("customBiomes", JSON.stringify(customThemes));

  loadThemes();
}

// ===================== CONTROLE DE MÚSICA =====================
function setupMusicControls() {
  const musicEl = $("#background-music");
  const musicToggleBtn = $("#music-toggle-btn");
  let isMusicPlaying = false;

  function toggleMusic() {
    // Alterna entre tocar e pausar a música de fundo.
    if (isMusicPlaying) {
      musicEl.pause();
      musicToggleBtn.textContent = "🔇";
    } else {
      musicEl.play();
      musicToggleBtn.textContent = "🎵";
    }
    isMusicPlaying = !isMusicPlaying;
  }
  musicToggleBtn.onclick = toggleMusic;
}

// ===================== EVENTOS =====================
// Adiciona os listeners de eventos quando o DOM estiver completamente carregado.
document.addEventListener("DOMContentLoaded", () => {
  loadThemes();
  setupMusicControls();
  showScreen("start");

  // Função para voltar à tela inicial.
  function goToStartScreen() {
    $("#roll-dice-btn").disabled = false;
    showScreen("start");
  }

  $("#start-btn").onclick = init;
  $("#roll-dice-btn").onclick = rollDice;

  // Botões que levam de volta ao início
  $("#board-back-btn").onclick = goToStartScreen;
  $("#play-again").onclick = goToStartScreen;

  $("#problem-back").onclick = () => showScreen("board");
  $("#ods-back").onclick = () => showScreen("problem");
  $("#continue-game-btn").onclick = continueGame;

  // Eventos do Modal para criar tema.
  $("#create-theme-btn").onclick = () =>
    ($("#create-theme-modal").style.display = "flex");
  $("#cancel-theme-btn").onclick = () =>
    ($("#create-theme-modal").style.display = "none");
  $("#create-theme-form").onsubmit = saveNewTheme;

  // Usa delegação de evento para capturar cliques nos botões de apagar tema.
  $("#theme-list").addEventListener("click", (event) => {
    if (event.target.matches(".delete-theme-btn")) {
      deleteTheme(event.target.dataset.id);
    }
  });
});
