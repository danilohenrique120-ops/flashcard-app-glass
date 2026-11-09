// ALGORITMO DE REPETIÇÃO ESPAÇADA DE CICLO CURTO (Bounded Short-Horizon SRS)
// + SINCRONIZAÇÃO EM NUVEM (Firebase Cloud Firestore / Google Auth) & BACKUP JSON MULTIDISPOSITIVO

const SHORT_SRS_STEPS_MINUTES = [
  1,      // 0: 1 min
  10,     // 1: 10 min
  240,    // 2: 4 horas
  720,    // 3: 12 horas
  1440,   // 4: 1 dia
  2880,   // 5: 2 dias
  4320,   // 6: 3 dias
  7200,   // 7: 5 dias
  10080   // 8: 7 dias
];

const STORAGE_KEY = 'lexis_glass_state_v1';
const CLOUD_CONFIG_KEY = 'lexis_glass_cloud_config_v1';

const state = {
  currentLang: 'en',
  selectedCategory: 'all',
  maxCapDays: 3, // Teto padrão: nunca passa de 3 dias
  reviewedToday: 0,
  lastReviewDate: new Date().toDateString(),
  updatedAt: 0,
  continuousMode: false,
  currentCardId: null,
  isFlipped: false,
  customCards: { en: [], es: [] },
  srsData: {} // cardId -> { step: 0, dueAt: 0, reviews: 0, updatedAt: 0 }
};

const cloudRuntime = {
  connected: false,
  syncKey: '',
  firebaseConfig: null,
  db: null,
  auth: null,
  unsubscribeSnapshot: null,
  isApplyingRemote: false
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    state.currentLang = saved.currentLang || 'en';
    state.maxCapDays = saved.maxCapDays || 3;
    state.customCards = saved.customCards || { en: [], es: [] };
    state.srsData = saved.srsData || {};
    state.updatedAt = saved.updatedAt || Date.now();

    const today = new Date().toDateString();
    if (saved.lastReviewDate === today) {
      state.reviewedToday = saved.reviewedToday || 0;
    } else {
      state.reviewedToday = 0;
      state.lastReviewDate = today;
    }
  } catch (err) {
    console.warn('Falha ao carregar estado salvo:', err);
  }
}

function getSerializablePayload() {
  return {
    currentLang: state.currentLang,
    maxCapDays: state.maxCapDays,
    reviewedToday: state.reviewedToday,
    lastReviewDate: state.lastReviewDate,
    updatedAt: state.updatedAt,
    customCards: state.customCards,
    srsData: state.srsData
  };
}

function saveState(skipCloudPush = false) {
  state.updatedAt = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getSerializablePayload()));
  } catch (err) {
    console.warn('Falha ao salvar estado local:', err);
  }

  if (!skipCloudPush && cloudRuntime.connected && !cloudRuntime.isApplyingRemote) {
    pushStateToCloud();
  }
}

// Mescla inteligente entre o dispositivo atual e a nuvem (ou arquivo importado):
// - Preserva todos os cartões personalizados criados no celular e no computador (sem duplicar ID)
// - Para o histórico de cada cartão (srsData), mantém o registro mais recente/avançado
function mergeRemoteDataIntoLocal(remote) {
  if (!remote || typeof remote !== 'object') return;

  // 1. Mesclar cartões personalizados de Inglês e Espanhol
  ['en', 'es'].forEach((lang) => {
    const localList = state.customCards[lang] || [];
    const remoteList = (remote.customCards && remote.customCards[lang]) || [];
    const mapById = new Map();
    localList.forEach((c) => mapById.set(c.id, c));
    remoteList.forEach((c) => mapById.set(c.id, c));
    state.customCards[lang] = Array.from(mapById.values());
  });

  // 2. Mesclar progresso de repetição espaçada (srsData)
  const remoteSrs = remote.srsData || {};
  Object.keys(remoteSrs).forEach((cardId) => {
    const localEntry = state.srsData[cardId];
    const remoteEntry = remoteSrs[cardId];
    if (!localEntry) {
      state.srsData[cardId] = remoteEntry;
    } else {
      const localTime = localEntry.updatedAt || 0;
      const remoteTime = remoteEntry.updatedAt || 0;
      if (remoteTime > localTime || (remoteEntry.reviews || 0) > (localEntry.reviews || 0)) {
        state.srsData[cardId] = remoteEntry;
      }
    }
  });

  if (remote.maxCapDays) {
    state.maxCapDays = Number(remote.maxCapDays);
  }

  const today = new Date().toDateString();
  if (remote.lastReviewDate === today) {
    state.reviewedToday = Math.max(state.reviewedToday, remote.reviewedToday || 0);
  }

  saveState(true);
  renderCurrentCard();
  renderDeckList();
}

function updateCloudIndicator(status, detailMessage) {
  const dot = document.getElementById('cloudStatusDot');
  const text = document.getElementById('cloudStatusText');
  const badge = document.getElementById('syncConnectionBadge');
  const detail = document.getElementById('syncStatusDetail');

  if (!dot || !text) return;

  dot.classList.remove('synced', 'syncing');
  if (status === 'synced') {
    dot.classList.add('synced');
    text.textContent = 'Nuvem Ativa';
    if (badge) {
      badge.textContent = 'Sincronizado em Tempo Real';
      badge.classList.add('online');
    }
  } else if (status === 'syncing') {
    dot.classList.add('syncing');
    text.textContent = 'Sincronizando...';
  } else {
    text.textContent = 'Salvo Local';
    if (badge) {
      badge.textContent = 'Apenas Neste Aparelho';
      badge.classList.remove('online');
    }
  }

  if (detail && detailMessage) {
    detail.textContent = detailMessage;
  }
}

// ============================================================================
// INTEGRAÇÃO COM FIREBASE CLOUD FIRESTORE & GOOGLE AUTH (MODULAR SDK v11)
// ============================================================================
async function connectFirebaseCloud(firebaseConfig, syncKey, useGoogleLogin = false) {
  try {
    updateCloudIndicator('syncing', 'Conectando ao Cloud Firestore...');

    const [
      { initializeApp, getApps, getApp },
      { getFirestore, doc, setDoc, getDoc, onSnapshot },
      { getAuth, GoogleAuthProvider, signInWithPopup }
    ] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js'),
      import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js')
    ]);

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);

    cloudRuntime.db = { instance: db, doc, setDoc, getDoc, onSnapshot };
    cloudRuntime.auth = { instance: auth, GoogleAuthProvider, signInWithPopup };
    cloudRuntime.firebaseConfig = firebaseConfig;

    let finalSyncKey = (syncKey || '').trim();

    if (useGoogleLogin) {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        finalSyncKey = `google_${result.user.uid}`;
        const syncInput = document.getElementById('inputSyncKey');
        if (syncInput) syncInput.value = finalSyncKey;
      }
    }

    if (!finalSyncKey) {
      updateCloudIndicator('local', 'Informe um Código de Sincronização ou entre com o Google.');
      return;
    }

    cloudRuntime.syncKey = finalSyncKey;

    // Salva configuração de nuvem neste aparelho para reconectar sozinho ao abrir o app
    localStorage.setItem(
      CLOUD_CONFIG_KEY,
      JSON.stringify({ firebaseConfig, syncKey: finalSyncKey })
    );

    if (cloudRuntime.unsubscribeSnapshot) {
      cloudRuntime.unsubscribeSnapshot();
    }

    const userDocRef = doc(db, 'lexis_glass_sync', finalSyncKey);

    // 1. Busca dados existentes na nuvem e mescla com os locais
    const existingSnap = await getDoc(userDocRef);
    if (existingSnap.exists()) {
      cloudRuntime.isApplyingRemote = true;
      mergeRemoteDataIntoLocal(existingSnap.data());
      cloudRuntime.isApplyingRemote = false;
    }

    // 2. Envia estado mesclado atualizado para a nuvem
    await setDoc(userDocRef, getSerializablePayload(), { merge: true });

    // 3. Escuta alterações em tempo real vindas de outros celulares ou computadores
    cloudRuntime.unsubscribeSnapshot = onSnapshot(userDocRef, (snapshot) => {
      if (!snapshot.exists()) return;
      const remoteData = snapshot.data();
      if (remoteData.updatedAt && remoteData.updatedAt > state.updatedAt) {
        cloudRuntime.isApplyingRemote = true;
        mergeRemoteDataIntoLocal(remoteData);
        cloudRuntime.isApplyingRemote = false;
        updateCloudIndicator(
          'synced',
          `Sincronizado em tempo real (Chave: ${finalSyncKey})`
        );
      }
    });

    cloudRuntime.connected = true;
    updateCloudIndicator(
      'synced',
      `Conectado! Tudo o que você adicionar será salvo na chave "${finalSyncKey}" em qualquer aparelho.`
    );
  } catch (err) {
    console.error('Erro ao conectar ao Firebase:', err);
    updateCloudIndicator(
      'local',
      `Erro na conexão com nuvem: ${err.message || 'Verifique o firebaseConfig e as regras do Firestore.'}`
    );
  }
}

async function pushStateToCloud() {
  if (!cloudRuntime.connected || !cloudRuntime.db || !cloudRuntime.syncKey) return;
  try {
    const { instance, doc, setDoc } = cloudRuntime.db;
    const userDocRef = doc(instance, 'lexis_glass_sync', cloudRuntime.syncKey);
    await setDoc(userDocRef, getSerializablePayload(), { merge: true });
    updateCloudIndicator(
      'synced',
      `Salvo na nuvem às ${new Date().toLocaleTimeString()} (${cloudRuntime.syncKey})`
    );
  } catch (err) {
    console.warn('Falha ao enviar atualização para nuvem:', err);
  }
}

function tryAutoConnectCloud() {
  try {
    const savedCloudRaw = localStorage.getItem(CLOUD_CONFIG_KEY);
    if (!savedCloudRaw) return;
    const savedCloud = JSON.parse(savedCloudRaw);
    if (savedCloud.syncKey) {
      const keyInput = document.getElementById('inputSyncKey');
      if (keyInput) keyInput.value = savedCloud.syncKey;
    }
    if (savedCloud.firebaseConfig) {
      const cfgInput = document.getElementById('inputFirebaseConfig');
      if (cfgInput) cfgInput.value = JSON.stringify(savedCloud.firebaseConfig, null, 2);
      if (savedCloud.syncKey) {
        connectFirebaseCloud(savedCloud.firebaseConfig, savedCloud.syncKey, false);
      }
    }
  } catch (err) {
    console.warn('Falha ao reconectar nuvem automaticamente:', err);
  }
}

// ============================================================================
// LÓGICA DE FLASHCARDS & REPETIÇÃO ESPAÇADA CURTA
// ============================================================================
function getAllCardsForLang(lang) {
  const base = INITIAL_DECKS[lang]?.cards || [];
  const custom = state.customCards[lang] || [];
  return [...custom, ...base];
}

function getCardSrs(cardId) {
  if (!state.srsData[cardId]) {
    state.srsData[cardId] = { step: 0, dueAt: 0, reviews: 0, updatedAt: 0 };
  }
  return state.srsData[cardId];
}

function getNextIntervalsMinutes(currentStep) {
  const capMinutes = state.maxCapDays * 1440;
  const clamp = (mins) => Math.min(mins, capMinutes);

  const againMins = 1;
  const hardStep = Math.max(1, currentStep);
  const hardMins = Math.min(SHORT_SRS_STEPS_MINUTES[hardStep] || 10, 360);

  const goodStep = Math.min(currentStep + 1, SHORT_SRS_STEPS_MINUTES.length - 1);
  const goodMins = clamp(SHORT_SRS_STEPS_MINUTES[goodStep]);

  const easyStep = Math.min(currentStep + 2, SHORT_SRS_STEPS_MINUTES.length - 1);
  const easyMins = clamp(Math.max(goodMins, SHORT_SRS_STEPS_MINUTES[easyStep]));

  return [
    { mins: againMins, nextStep: 0 },
    { mins: clamp(hardMins), nextStep: Math.max(1, currentStep) },
    { mins: goodMins, nextStep: goodStep },
    { mins: easyMins, nextStep: easyStep }
  ];
}

function formatDurationShort(mins) {
  if (mins < 60) return `${mins} min`;
  if (mins < 1440) {
    const h = Math.round(mins / 60);
    return `${h} ${h === 1 ? 'hora' : 'horas'}`;
  }
  const d = Math.round((mins / 1440) * 10) / 10;
  return `${d} ${d === 1 ? 'dia' : 'dias'}`;
}

function getStudyQueue() {
  const now = Date.now();
  const allCards = getAllCardsForLang(state.currentLang).filter((c) =>
    state.selectedCategory === 'all' ? true : c.category === state.selectedCategory
  );

  const dueCards = allCards.filter((c) => {
    const srs = getCardSrs(c.id);
    return srs.dueAt <= now;
  });

  if (dueCards.length > 0 && !state.continuousMode) {
    return dueCards.sort((a, b) => getCardSrs(a.id).dueAt - getCardSrs(b.id).dueAt);
  }

  return [...allCards].sort((a, b) => getCardSrs(a.id).dueAt - getCardSrs(b.id).dueAt);
}

function updateThemeAccent() {
  const deck = INITIAL_DECKS[state.currentLang];
  document.documentElement.style.setProperty('--accent-primary', deck.accentColor);
  const orb1 = document.getElementById('orb1');
  if (orb1) orb1.style.background = deck.accentColor;
}

function renderTopStats() {
  const now = Date.now();
  const allLangCards = getAllCardsForLang(state.currentLang);
  const dueCount = allLangCards.filter((c) => getCardSrs(c.id).dueAt <= now).length;

  document.getElementById('statDue').textContent = dueCount;
  document.getElementById('statReviewed').textContent = state.reviewedToday;
  document.getElementById('statCapLabel').textContent = `Máx ${state.maxCapDays}d`;
  document.getElementById('navCardCount').textContent = allLangCards.length;
}

function renderCurrentCard() {
  renderTopStats();
  const queue = getStudyQueue();
  const deck = INITIAL_DECKS[state.currentLang];

  if (queue.length === 0) {
    document.getElementById('cardFrontText').textContent = 'Nenhum cartão neste filtro';
    return;
  }

  let card = queue[0];
  if (queue.length > 1 && card.id === state.currentCardId) {
    card = queue[1];
  }
  state.currentCardId = card.id;

  const srs = getCardSrs(card.id);
  const now = Date.now();
  const dueNowCount = getAllCardsForLang(state.currentLang).filter(
    (c) =>
      (state.selectedCategory === 'all' || c.category === state.selectedCategory) &&
      getCardSrs(c.id).dueAt <= now
  ).length;

  const queueCounter = document.getElementById('queueCounter');
  if (dueNowCount > 0) {
    queueCounter.textContent = `${dueNowCount} ${dueNowCount === 1 ? 'cartão pronto' : 'cartões prontos'} para agora`;
  } else {
    queueCounter.textContent = `Reforço antecipado ativo (${queue.length} cartões)`;
  }

  state.isFlipped = false;
  document.getElementById('flashcard').classList.remove('is-flipped');

  document.getElementById('cardCategory').textContent = card.category;
  document.getElementById('cardTheorist').textContent = card.theorist || 'Cartão Pessoal';
  document.getElementById('cardLangBadge').textContent = `${deck.flag} ${deck.nativeName}`;
  document.getElementById('cardFrontText').textContent = card.front;
  document.getElementById('cardPhonetic').textContent = card.phonetic || '';
  document.getElementById('cardStepBadge').textContent =
    srs.reviews === 0 ? 'Novo • 1ª vez' : `Ciclo ${srs.step} • ${srs.reviews}x revisto`;

  document.getElementById('cardCategoryBack').textContent = card.category;
  document.getElementById('cardFrontEcho').textContent = card.front;
  document.getElementById('cardBackText').textContent = card.back;
  document.getElementById('cardExample').textContent = card.example || card.front;
  document.getElementById('cardExampleTrans').textContent = card.exampleTranslation || card.back;
  document.getElementById('cardTip').textContent =
    card.tip || 'Pratique pronunciar em voz alta para ativar a memória motora (Método Pimsleur).';

  const intervals = getNextIntervalsMinutes(srs.step);
  intervals.forEach((item, idx) => {
    const el = document.getElementById(`timeGrade${idx}`);
    if (el) el.textContent = formatDurationShort(item.mins);
  });
}

function gradeCurrentCard(gradeIndex) {
  if (!state.currentCardId) return;
  const srs = getCardSrs(state.currentCardId);
  const intervals = getNextIntervalsMinutes(srs.step);
  const chosen = intervals[gradeIndex];

  srs.step = chosen.nextStep;
  srs.reviews += 1;
  srs.dueAt = Date.now() + chosen.mins * 60 * 1000;
  srs.updatedAt = Date.now();

  state.reviewedToday += 1;
  saveState();
  renderCurrentCard();
}

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const cleanText = text.split('/')[0].trim();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = INITIAL_DECKS[state.currentLang].speechLang;
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

function deleteCustomCard(cardId) {
  state.customCards[state.currentLang] = (state.customCards[state.currentLang] || []).filter(
    (c) => c.id !== cardId
  );
  delete state.srsData[cardId];
  saveState();
  renderCurrentCard();
  renderDeckList();
}

function renderDeckList() {
  const container = document.getElementById('deckListContainer');
  const cards = getAllCardsForLang(state.currentLang);
  const now = Date.now();

  container.innerHTML = cards
    .map((card) => {
      const srs = getCardSrs(card.id);
      const isCustom = String(card.id).includes('-custom-');
      let statusLabel = 'Novo';
      if (srs.reviews > 0) {
        const diffMins = Math.max(0, Math.round((srs.dueAt - now) / 60000));
        statusLabel = diffMins === 0 ? 'Pronto agora' : `em ${formatDurationShort(diffMins)}`;
      }
      return `
        <div class="deck-item glass-panel">
          <div class="deck-item-main">
            <strong>${card.front}</strong>
            <span>${card.back}</span>
          </div>
          <div class="deck-item-meta">
            <div>${isCustom ? '⭐ Meu Cartão' : card.category}</div>
            <div>${statusLabel}</div>
            ${
              isCustom
                ? `<button class="btn-delete-custom" data-del-id="${card.id}" type="button">Excluir</button>`
                : ''
            }
          </div>
        </div>
      `;
    })
    .join('');

  container.querySelectorAll('.btn-delete-custom').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteCustomCard(btn.getAttribute('data-del-id'));
    });
  });
}

// ============================================================================
// EXPORTAR E IMPORTAR ARQUIVO DE BACKUP (.JSON)
// ============================================================================
function exportBackupFile() {
  const payload = {
    app: 'LexisGlass',
    exportedAt: new Date().toISOString(),
    ...getSerializablePayload()
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lexis-glass-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importBackupFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      mergeRemoteDataIntoLocal(imported);
      if (cloudRuntime.connected) pushStateToCloud();
      updateCloudIndicator(
        cloudRuntime.connected ? 'synced' : 'local',
        'Backup importado e mesclado com sucesso!'
      );
    } catch (err) {
      updateCloudIndicator('local', 'Arquivo de backup inválido.');
    }
  };
  reader.readAsText(file);
}

function initEvents() {
  const flashcard = document.getElementById('flashcard');
  flashcard.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    state.isFlipped = !state.isFlipped;
    flashcard.classList.toggle('is-flipped', state.isFlipped);
  });

  document.getElementById('btnSpeakFront').addEventListener('click', (e) => {
    e.stopPropagation();
    const cards = getAllCardsForLang(state.currentLang);
    const card = cards.find((c) => c.id === state.currentCardId);
    if (card) speakText(card.front);
  });

  document.getElementById('btnSpeakExample').addEventListener('click', (e) => {
    e.stopPropagation();
    const cards = getAllCardsForLang(state.currentLang);
    const card = cards.find((c) => c.id === state.currentCardId);
    if (card) speakText(card.example || card.front);
  });

  document.querySelectorAll('.srs-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const grade = Number(btn.getAttribute('data-grade'));
      gradeCurrentCard(grade);
    });
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      state.currentLang = lang;
      state.currentCardId = null;
      document.querySelectorAll('.lang-btn').forEach((b) => b.classList.toggle('active', b === btn));
      updateThemeAccent();
      saveState();
      renderCurrentCard();
      renderDeckList();
    });
  });

  document.querySelectorAll('.cat-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      state.selectedCategory = pill.getAttribute('data-cat');
      state.currentCardId = null;
      document.querySelectorAll('.cat-pill').forEach((p) => p.classList.toggle('active', p === pill));
      renderCurrentCard();
    });
  });

  const btnForce = document.getElementById('btnForcePractice');
  btnForce.addEventListener('click', () => {
    state.continuousMode = !state.continuousMode;
    btnForce.style.borderColor = state.continuousMode ? 'var(--accent-primary)' : '';
    renderCurrentCard();
  });

  // Atalho no botão de nuvem do topo para abrir direto a aba de Sincronização
  document.getElementById('btnCloudQuick').addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((b) =>
      b.classList.toggle('active', b.getAttribute('data-target') === 'viewMethod')
    );
    document.querySelectorAll('.view').forEach((v) =>
      v.classList.toggle('active', v.id === 'viewMethod')
    );
  });

  document.querySelectorAll('.nav-item').forEach((navBtn) => {
    navBtn.addEventListener('click', () => {
      const targetId = navBtn.getAttribute('data-target');
      document.querySelectorAll('.nav-item').forEach((b) => b.classList.toggle('active', b === navBtn));
      document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === targetId));
      if (targetId === 'viewDeck') renderDeckList();
    });
  });

  document.querySelectorAll('input[name="maxCapDays"]').forEach((radio) => {
    if (Number(radio.value) === state.maxCapDays) radio.checked = true;
    radio.addEventListener('change', () => {
      state.maxCapDays = Number(radio.value);
      saveState();
      renderCurrentCard();
    });
  });

  document.getElementById('btnResetProgress').addEventListener('click', () => {
    state.srsData = {};
    state.reviewedToday = 0;
    saveState();
    renderCurrentCard();
    renderDeckList();
  });

  // Botões de Nuvem (Firebase) e Backup JSON
  const parseConfigInput = () => {
    const raw = document.getElementById('inputFirebaseConfig').value.trim();
    if (!raw) {
      updateCloudIndicator(
        'local',
        'Abra "Configurar Credenciais do Projeto Firebase" e cole o JSON do seu firebaseConfig.'
      );
      const details = document.querySelector('.firebase-config-details');
      if (details) details.open = true;
      return null;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      updateCloudIndicator('local', 'O JSON do firebaseConfig está com formato inválido.');
      return null;
    }
  };

  document.getElementById('btnConnectCloud').addEventListener('click', () => {
    const cfg = parseConfigInput();
    if (!cfg) return;
    const syncKey = document.getElementById('inputSyncKey').value.trim();
    connectFirebaseCloud(cfg, syncKey, false);
  });

  document.getElementById('btnGoogleLogin').addEventListener('click', () => {
    const cfg = parseConfigInput();
    if (!cfg) return;
    const syncKey = document.getElementById('inputSyncKey').value.trim();
    connectFirebaseCloud(cfg, syncKey, true);
  });

  document.getElementById('btnExportBackup').addEventListener('click', exportBackupFile);
  document.getElementById('inputImportBackup').addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      importBackupFile(e.target.files[0]);
      e.target.value = '';
    }
  });

  // Modal Adicionar Cartão
  const modal = document.getElementById('addCardModal');
  document.getElementById('btnOpenAddModal').addEventListener('click', () => {
    modal.classList.remove('hidden');
  });
  document.getElementById('btnCloseModal').addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  document.getElementById('formAddCard').addEventListener('submit', (e) => {
    e.preventDefault();
    const front = document.getElementById('inputFront').value.trim();
    const back = document.getElementById('inputBack').value.trim();
    const example = document.getElementById('inputExample').value.trim();
    const category = document.getElementById('inputCategory').value;

    if (!front || !back) return;

    const newCard = {
      id: `${state.currentLang}-custom-${Date.now()}`,
      category,
      theorist: 'Cartão Pessoal',
      front,
      phonetic: '',
      back,
      example: example || front,
      exampleTranslation: back,
      tip: 'Frase personalizada adicionada ao seu ciclo curto de repetição.'
    };

    state.customCards[state.currentLang].unshift(newCard);
    saveState();
    e.target.reset();
    modal.classList.add('hidden');
    renderCurrentCard();
    renderDeckList();
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadState();
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-lang') === state.currentLang);
  });
  updateThemeAccent();
  initEvents();
  renderCurrentCard();
  renderDeckList();
  tryAutoConnectCloud();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
