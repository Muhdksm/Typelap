// Wait for the DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. ELEMENT SELECTORS ---

    // Header
    const themeBtn = document.getElementById('themeBtn');
    const streakCounter = document.getElementById('streakCounter');
    const avatar = document.getElementById('avatar');

    // Main Stats
    const wpmDisplay = document.getElementById('wpmDisplay');
    const accDisplay = document.getElementById('accDisplay');
    const errDisplay = document.getElementById('errDisplay');
    const timerDisplay = document.getElementById('timerDisplay');

    // Typing Area
    const typingArea = document.getElementById('typingArea');
    const hiddenInput = document.getElementById('hiddenInput');
    const capsLockWarning = document.getElementById('capsLockWarning');

    // Main Controls
    const durationGroup = document.querySelector('.control-group[data-type="duration"]');
    const difficultyGroup = document.querySelector('.control-group[data-type="difficulty"]');
    const langGroup = document.querySelector('.control-group[data-type="lang"]');
    
    // Main Actions
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const repeatBtn = document.getElementById('repeatBtn');

    // Feature Bar
    const dailyChallengeBtn = document.getElementById('dailyChallengeBtn');
    const customTextBtn = document.getElementById('customTextBtn');
    const mistakeReviewBtn = document.getElementById('mistakeReviewBtn');
    const focusTimerBtn = document.getElementById('focusTimerBtn');
    const closeMistakeModalBtn = document.getElementById('closeMistakeModalBtn');
    const distractionFreeBtn = document.getElementById('distractionFreeBtn');
    const soundBtn = document.getElementById('soundBtn');
    const keyboardBtn = document.getElementById('keyboardBtn');
    const streakBtn = document.getElementById('streakBtn');
    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const sessionReplayBtn = document.getElementById('sessionReplayBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Contextual Elements
    const customTextWrapper = document.getElementById('customTextWrapper');
    const customTextArea = document.getElementById('customTextArea');
    const useCustomTextBtn = document.getElementById('useCustomTextBtn');
    const virtualKeyboard = document.getElementById('virtualKeyboard');
    
    // Results
    const wpmChartCanvas = document.getElementById('wpmChart');
    const mistypedList = document.getElementById('mistypedList');


    // --- 2. APP STATE ---
    let testActive = false;
    let timer;
    let wpmHistory = []; // For the chart
    let currentSettings = {
        duration: 30,
        difficulty: 'medium',
        lang: 'en'
    };

    // --- 3. EVENT LISTENERS ---

    // --- Core Test Actions ---
    startBtn.addEventListener('click', startTest);
    resetBtn.addEventListener('click', resetTest);
    // --- ADD LISTENERS FOR PAUSE, RESUME, REPEAT ---
    // pauseBtn.addEventListener('click', pauseTest);
    // resumeBtn.addEventListener('click', resumeTest);
    // repeatBtn.addEventListener('click', repeatTest);

    // --- Input Handling ---
    // Focus the hidden input when the user clicks the typing area
    typingArea.addEventListener('click', () => hiddenInput.focus());

    // Main input listener
    hiddenInput.addEventListener('input', handleTyping);

    // Check for Caps Lock
    hiddenInput.addEventListener('keydown', (e) => {
        const capsOn = e.getModifierState && e.getModifierState('CapsLock');
        capsLockWarning.classList.toggle('hidden', !capsOn);
    });

    // --- Main Control Toggles (Duration, Difficulty, Language) ---
    // We use one handler for all control groups
    document.querySelectorAll('.control-group').forEach(group => {
        group.addEventListener('click', (e) => {
            if (e.target.classList.contains('control-btn')) {
                // 1. Remove 'active' from all buttons in this group
                group.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
                
                // 2. Add 'active' to the clicked button
                e.target.classList.add('active');
                
                // 3. Update settings object
                const type = e.target.dataset.type;
                const value = e.target.dataset.value;
                currentSettings[type] = value;
                
                console.log('Settings updated:', currentSettings);
                // You can now reset the test with new settings, e.g., loadNewText()
            }
        });
    });

    // --- Feature Toggles ---

    // Theme Toggle
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme'); // You'll need to create this class in CSS
        // Save preference
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeBtn.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            themeBtn.textContent = '🌙'; // Or your dark mode icon
        }
    });

    // Custom Text Area Toggle
    customTextBtn.addEventListener('click', () => {
        customTextWrapper.classList.toggle('hidden');
        customTextBtn.classList.toggle('active');
    });

    // Virtual Keyboard Toggle
    keyboardBtn.addEventListener('click', () => {
        virtualKeyboard.classList.toggle('hidden');
        keyboardBtn.classList.toggle('active');
    });
    
    // Sound Toggle
    soundBtn.addEventListener('click', () => {
        soundBtn.classList.toggle('active');
        // --- ADD YOUR SOUND ON/OFF LOGIC HERE ---
        const soundOn = soundBtn.classList.contains('active');
        soundBtn.textContent = soundOn ? '🔊 Sound On' : '🔇 Sound Off';
    });

    // --- ADD LISTENERS FOR YOUR OTHER FEATURE BUTTONS ---
    // dailyChallengeBtn.addEventListener('click', () => { ... });
    // mistakeReviewBtn.addEventListener('click', () => { ... });
    // focusTimerBtn.addEventListener('click', () => { ... });
    // distractionFreeBtn.addEventListener('click', () => { ... });
    // exportBtn.addEventListener('click', () => { ... });


    // --- 4. CORE FUNCTIONS ---

    function startTest() {
        console.log('Starting test with settings:', currentSettings);
        testActive = true;
        // --- ADD YOUR START LOGIC HERE ---
        // 1. Get text (from API or local array) based on settings
        // 2. Populate typingArea
        // 3. Reset stats (WPM, errors, etc.)
        // 4. Start the timer countdown
        // 5. Focus the hidden input
        hiddenInput.focus();
        hiddenInput.value = '';
        
        // Example:
        // loadText();
        // startTimer(currentSettings.duration);
        
        // Show/hide action buttons
        startBtn.classList.add('hidden');
        pauseBtn.classList.remove('hidden');
        resetBtn.classList.remove('hidden');
    }

    function resetTest() {
        console.log('Resetting test');
        testActive = false;
        clearInterval(timer);
        
        // --- ADD YOUR RESET LOGIC HERE ---
        // 1. Clear stats
        wpmDisplay.textContent = '0';
        accDisplay.textContent = 'Accuracy: 100%';
        errDisplay.textContent = 'Errors: 0';
        timerDisplay.textContent = `Time: 00:${currentSettings.duration}`;
        
        // 2. Reset typing area to placeholder
        typingArea.innerHTML = '<span>c</span><span>l</span><span>i</span><span>c</span><span>k</span>&nbsp;<span>s</span><span>t</span><span>a</span><span>r</span><span>t</span>';
        
        // 3. Reset buttons
        startBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
        resumeBtn.classList.add('hidden');
        resetBtn.classList.add('hidden');
    }

    function handleTyping(e) {
        if (!testActive) return;

        // --- THIS IS WHERE YOUR CORE TYPING LOGIC GOES ---
        console.log('User typed:', e.target.value);
        
        // 1. Get the current word/character from typingArea
        // 2. Compare with user input
        // 3. Apply .correct or .incorrect classes to spans in typingArea
        // 4. Update WPM, Accuracy, and Error stats
        
        // Example (very simplified):
        // const currentText = "example";
        // const typedValue = e.target.value;
        // if (currentText.startsWith(typedValue)) {
        //     updateWPM();
        // } else {
        //     // Handle error
        // }
    }
    
    function updateWPM() {
        // --- ADD YOUR WPM CALCULATION LOGIC ---
        // const grossWPM = (allTypedEntries / 5) / (timeElapsedInMinutes);
        // wpmDisplay.textContent = calculatedWPM;
    }

    function testFinished() {
        console.log('Test finished');
        testActive = false;
        clearInterval(timer);
        
        // --- ADD YOUR TEST FINISHED LOGIC ---
        // 1. Do final WPM/Accuracy calculation
        // 2. Add final WPM to wpmHistory array
        // 3. Update the chart
        // 4. Show leaderboard or results modal
        
        // Example:
        // const finalWPM = parseInt(wpmDisplay.textContent);
        // wpmHistory.push(finalWPM);
        // updateChart();
        
        // Show/hide buttons
        startBtn.classList.add('hidden');
        resetBtn.classList.remove('hidden');
        repeatBtn.classList.remove('hidden');
        pauseBtn.classList.add('hidden');
    }


    // --- 5. CHART.JS SETUP ---
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. The WPM chart will not work.');
        return;
    }
    
    // Chart.js global config for dark mode
    Chart.defaults.color = 'rgba(160, 160, 224, 0.7)'; // --text-mid
    Chart.defaults.borderColor = 'rgba(42, 54, 87, 0.5)'; // #2a3657

    const chartCtx = wpmChartCanvas.getContext('2d');
    const wpmChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: [], // Will be populated
            datasets: [{
                label: 'WPM',
                data: [], // Will be populated
                borderColor: '#00FFFF', // --accent-cyan
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#00FFFF'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'WPM'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Test #'
                    }
                }
            }
        }
    });

    function updateChart() {
        wpmChart.data.labels = wpmHistory.map((_, i) => i + 1); // [1, 2, 3...]
        wpmChart.data.datasets[0].data = wpmHistory;
        wpmChart.update();
    }


    // --- 6. INITIALIZATION ---
    function init() {
        console.log('Typelap app initialized.');
        // Load preferences
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeBtn.textContent = '☀️';
        }
        
        // Reset test to initial state
        resetTest();
    }

    init(); // Run the app
});
const textSamples = {
  en: {
    easy: [
      "The quick brown fox jumps over the lazy dog.",
      "Typing is fun and improves your skills.",
      "Practice daily to get better results.",
      "A sentence can be viewed from various perspectives.",
      "Presenting information in a usable format.",
    ],
    medium: [
      "Learning to type efficiently can boost your productivity and accuracy.",
      "Consistent practice unlocks your full potential as a fast typist.",
      "Mistakes are proof that you are trying and improving every day.",
      "As groups of words that begin with a capital letter.",
      "What is the distinction between data and information?",
    ],
    hard: [
      "Amazingly few discotheques provide jukeboxes.",
      "Sphinx of black quartz, judge my vow.",
      "Assisting organizations in analyzing strengths and patterns for swift decision-making.",
      "Through systematic data handling, such as business sales analysis to identify profitable products or healthcare patient diagnosis based on symptoms and medical history.",
      "Typing is a skill that requires both speed and precision, and only through rigorous practice can one attain mastery.",
    ]
  },
  es: {
    easy: [
      "El rápido zorro marrón salta sobre el perro perezoso.",
      "Escribir es divertido y mejora tus habilidades.",
      "Practica todos los días para obtener mejores resultados.",
    ],
    medium: [
      "Aprender a escribir eficientemente puede aumentar tu productividad y precisión.",
      "La práctica constante desbloquea tu potencial como mecanógrafo rápido.",
      "Los errores son prueba de que estás intentando y mejorando cada día.",
    ],
    hard: [
      "Hay pocas discotecas que ofrecen tocadiscos.",
      "Esfinge de cuarzo negro, juzga mi voto.",
      "Escribir es una habilidad que requiere velocidad y precisión, y solo a través de una práctica rigurosa se puede alcanzar la maestría.",
    ]
  }
};

/* ----------- State Variables ----------- */
let duration = 60;
let difficulty = 'easy';
let language = 'en';
let typingText = '';
let typingTextArr = [];
let currentIndex = 0;
let timer = null;
let timeLeft = 60;
let isPaused = false;
let started = false;
let errors = 0;
let correctChars = 0;
let totalChars = 0;
let wpm = 0;
let accuracy = 100;
let wpmHistory = [];
let leaderboard = [];
let mistyped = {};
let soundOn = true;
let bestWPM = 0;
let lastSessionText = '';
let chartInterval = null;
let chartCtx = null;
let streak = 0;
let streakDate = '';
let dailyChallengeText = '';
let focusTimer = null;
let focusTimeLeft = 1500; //25min
let focusTimerRunning = false;
let customText = '';
let distractionFreeMode = false;
let mistakeReviewMode = false;
let mistakeReviewList = [];
let sessionReplayList = [];
let avatarMood = "neutral";

/* ----------- Elements ----------- */
const typingArea = document.getElementById('typingArea');
const inputArea = document.getElementById('inputArea');
const wpmSpan = document.getElementById('wpm');
const accuracySpan = document.getElementById('accuracy');
const errorsSpan = document.getElementById('errors');
const timerSpan = document.getElementById('timer');
const progress = document.getElementById('progress');
const leaderboardList = document.getElementById('leaderboardList');
const personalBestSpan = document.getElementById('personalBest');
const mistypedWords = document.getElementById('mistypedWords');
const motivational = document.getElementById('motivational');
const wpmChart = document.getElementById('wpmChart');
const themeBtns = document.querySelectorAll('.theme-btn');
const streakCounter = document.getElementById('streakCounter');
const dailyChallengeBtn = document.getElementById('dailyChallengeBtn');
const streakBtn = document.getElementById('streakBtn');
const distractionFreeBtn = document.getElementById('distractionFreeBtn');
const mistakeReviewBtn = document.getElementById('mistakeReviewBtn');
const focusTimerBtn = document.getElementById('focusTimerBtn');
const customTextBtn = document.getElementById('customTextBtn');
const customTextArea = document.getElementById('customTextArea');
const focusTimerStatus = document.getElementById('focusTimerStatus');
const avatar = document.getElementById('avatar');
const capsLockWarning = document.getElementById('capsLockWarning');
const sessionReplayBtn = document.getElementById('sessionReplayBtn');
const distractionOverlay = document.getElementById('distractionOverlay');
const dfTypingArea = document.getElementById('dfTypingArea');
const dfInputArea = document.getElementById('dfInputArea');
const mistakeReviewModal = document.getElementById('mistakeReviewModal');
const mistakeReviewContent = document.getElementById('mistakeReviewContent');

/* ----------- Utility Functions ----------- */
function pad(num) { return num.toString().padStart(2,'0'); }
function randomItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }
function getRandomText(lang, diff) {
  let arr = textSamples[lang][diff];
  let s = randomItem(arr);
  while (s.length < 60) s += ' ' + randomItem(arr);
  return s.trim();
}
function motivationalPopup(msg) {
  motivational.textContent = msg;
  motivational.classList.add('show');
  setTimeout(()=>motivational.classList.remove('show'), 1500);
}
function playSound(type) {
  if (!soundOn) return;
  let ctx = new(window.AudioContext||window.webkitAudioContext)();
  let o = ctx.createOscillator();
  o.type = type==='error'?'square':'sine';
  o.frequency.value = type==='error'?220:660;
  let g = ctx.createGain();
  g.gain.value = 0.07;
  o.connect(g); g.connect(ctx.destination);
  o.start();
  o.stop(ctx.currentTime + 0.07);
}
function saveStats(stats) {
  let localStats = JSON.parse(localStorage.getItem('leaderboard')||'[]');
  localStats.push(stats);
  localStorage.setItem('leaderboard', JSON.stringify(localStats));
}
function loadLeaderboard() {
  leaderboard = JSON.parse(localStorage.getItem('leaderboard')||'[]');
  leaderboard.sort((a,b)=>b.wpm-a.wpm);
  leaderboardList.innerHTML = '';
  leaderboard.slice(0,10).forEach((s,i)=>{
    let li = document.createElement('li');
    li.textContent = `${pad(i+1)}. ${s.wpm} WPM (${s.accuracy}% accuracy, ${s.errors} errors)`;
    leaderboardList.appendChild(li);
  });
  let best = leaderboard[0]?.wpm || 0;
  bestWPM = best;
  personalBestSpan.textContent = `Best WPM: ${best}`;
}
function updateAvatar(mood="neutral") {
  avatarMood = mood;
  let html = "";
  if(mood==="neutral") html = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#e3e3ff"/><circle cx="16" cy="20" r="3" fill="#222"/><circle cx="32" cy="20" r="3" fill="#222"/><path d="M16 32 Q24 36 32 32" stroke="#222" stroke-width="2" fill="none"/></svg>';
  if(mood==="happy") html = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#e3e3ff"/><circle cx="16" cy="20" r="3" fill="#222"/><circle cx="32" cy="20" r="3" fill="#222"/><path d="M16 30 Q24 38 32 30" stroke="#222" stroke-width="2" fill="none"/></svg>';
  if(mood==="sad") html = '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#e3e3ff"/><circle cx="16" cy="20" r="3" fill="#222"/><circle cx="32" cy="20" r="3" fill="#222"/><path d="M16 36 Q24 28 32 36" stroke="#222" stroke-width="2" fill="none"/></svg>';
  avatar.innerHTML = html;
  avatar.classList.remove("animated");
  setTimeout(()=>avatar.classList.add("animated"),50);
}
function updateStreak() {
  let s = parseInt(localStorage.getItem('typingStreak')||'0');
  let lastDate = localStorage.getItem('typingStreakDate');
  let today = new Date().toISOString().slice(0,10);
  if(lastDate!==today) {
    streakCounter.textContent = `🔥 Streak: ${s}`;
  } else {
    streakCounter.textContent = `🔥 Streak: ${s}`;
  }
}
function incrementStreak() {
  let s = parseInt(localStorage.getItem('typingStreak')||'0');
  let lastDate = localStorage.getItem('typingStreakDate');
  let today = new Date().toISOString().slice(0,10);
  if(lastDate!==today) {
    s = (lastDate===(new Date(Date.now()-864e5).toISOString().slice(0,10))) ? s+1 : 1;
    localStorage.setItem('typingStreak',s);
    localStorage.setItem('typingStreakDate',today);
  }
  updateStreak();
}
function saveSessionHistory(stats) {
  let hist = JSON.parse(localStorage.getItem('typingHistory')||'[]');
  hist.push(stats);
  localStorage.setItem('typingHistory', JSON.stringify(hist));
}
function loadSessionHistory() {
  return JSON.parse(localStorage.getItem('typingHistory')||'[]');
}

/* ----------- Main Typing Logic ----------- */
function renderTypingText() {
  typingArea.innerHTML = '';
  typingTextArr.forEach((ch, i) => {
    let span = document.createElement('span');
    if (i === currentIndex) span.className = 'current';
    else if (i < currentIndex) span.className = inputArea.value[i]===typingTextArr[i] ? 'correct' : 'incorrect';
    span.textContent = ch;
    typingArea.appendChild(span);
  });
}
function updateStats() {
  wpm = Math.round((correctChars/5)/(duration-timeLeft)*60);
  accuracy = totalChars>0 ? Math.round(100*(correctChars/(totalChars))) : 100;
  wpmSpan.textContent = `WPM: ${wpm}`;
  accuracySpan.textContent = `Accuracy: ${accuracy}%`;
  errorsSpan.textContent = `Errors: ${errors}`;
  let min = Math.floor(timeLeft/60), sec = timeLeft%60;
  timerSpan.textContent = `Time: ${pad(min)}:${pad(sec)}`;
  progress.style.width = `${((duration-timeLeft)/duration)*100}%`;
  personalBestSpan.textContent = `Best WPM: ${bestWPM}`;
  // Avatar mood
  if(wpm>bestWPM) updateAvatar("happy");
  else if(errors>0) updateAvatar("sad");
  else updateAvatar("neutral");
}
function showMistypedWords() {
  mistypedWords.innerHTML = '';
  Object.entries(mistyped).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([word, count]) => {
    let sp = document.createElement('span');
    sp.textContent = `${word} (${count})`;
    mistypedWords.appendChild(sp);
  });
}
function startSession() {
  if(customText) typingText = customText;
  else if(dailyChallengeText) typingText = dailyChallengeText;
  else typingText = getRandomText(language, difficulty);
  typingTextArr = typingText.split('');
  currentIndex = 0;
  errors = 0;
  correctChars = 0;
  totalChars = 0;
  mistyped = {};
  timeLeft = duration;
  isPaused = false;
  started = true;
  wpmHistory = [];
  inputArea.value = '';
  inputArea.disabled = false;
  renderTypingText();
  updateStats();
  showMistypedWords();
  inputArea.focus();
  lastSessionText = typingText;
  if (timer) clearInterval(timer);
  timer = setInterval(onTick, 1000);
  if (chartInterval) clearInterval(chartInterval);
  chartInterval = setInterval(updateChart, 1000);
  motivationalPopup("Let's go! 🚀");
  sessionReplayList = [];
  customText = '';
  dailyChallengeText = '';
  // streak update
  incrementStreak();
}
function pauseSession() {
  isPaused = true;
  inputArea.disabled = true;
  if (timer) clearInterval(timer);
  if (chartInterval) clearInterval(chartInterval);
  motivationalPopup("Paused ⏸️");
}
function resumeSession() {
  isPaused = false;
  inputArea.disabled = false;
  inputArea.focus();
  timer = setInterval(onTick, 1000);
  chartInterval = setInterval(updateChart, 1000);
  motivationalPopup("Resumed 👍");
}
function resetSession() {
  started = false;
  inputArea.value = '';
  inputArea.disabled = true;
  currentIndex = 0;
  errors = 0;
  correctChars = 0;
  totalChars = 0;
  timeLeft = duration;
  wpm = 0;
  accuracy = 100;
  mistyped = {};
  renderTypingText();
  updateStats();
  showMistypedWords();
  if (timer) clearInterval(timer);
  if (chartInterval) clearInterval(chartInterval);
  motivationalPopup("Session reset 🔄");
}
function repeatSession() {
  typingText = lastSessionText;
  typingTextArr = typingText.split('');
  currentIndex = 0;
  errors = 0;
  correctChars = 0;
  totalChars = 0;
  mistyped = {};
  timeLeft = duration;
  isPaused = false;
  started = true;
  wpmHistory = [];
  inputArea.value = '';
  inputArea.disabled = false;
  renderTypingText();
  updateStats();
  showMistypedWords();
  inputArea.focus();
  if (timer) clearInterval(timer);
  timer = setInterval(onTick, 1000);
  if (chartInterval) clearInterval(chartInterval);
  chartInterval = setInterval(updateChart, 1000);
  motivationalPopup("Repeat session! 🦾");
}
function endSession() {
  started = false;
  inputArea.disabled = true;
  if (timer) clearInterval(timer);
  if (chartInterval) clearInterval(chartInterval);
  let stats = {
    wpm, accuracy, errors, date: new Date().toISOString(), duration,
    text: typingText
  };
  saveStats(stats);
  saveSessionHistory(stats);
  loadLeaderboard();
  motivationalPopup("Session ended! 🎉");
  if (wpm > bestWPM) {
    bestWPM = wpm;
    personalBestSpan.textContent = `Best WPM: ${bestWPM}`;
    motivationalPopup("New personal best! 🏆");
  }
}
function onTick() {
  if (isPaused || !started) return;
  timeLeft--;
  updateStats();
  wpmHistory.push(wpm);
  if (timeLeft <= 0) {
    endSession();
  }
}
inputArea.addEventListener('input', (e) => {
  if (!started || isPaused) return;
  let val = inputArea.value;
  let lastInput = val[val.length-1];
  totalChars = val.length;
  if (val.length > typingTextArr.length) val = val.slice(0, typingTextArr.length);
  if (val[currentIndex] === typingTextArr[currentIndex]) {
    correctChars++;
    playSound('correct');
    motivationalPopup(['Great!','Keep going!','You rock!','Amazing!'][Math.floor(Math.random()*4)]);
  } else if (val[currentIndex] && val[currentIndex] !== typingTextArr[currentIndex]) {
    errors++;
    playSound('error');
    let word = getCurrentWord();
    mistyped[word] = (mistyped[word]||0)+1;
    flashMistyped(word);
    motivationalPopup(['Oops!','Try again!','Focus!'][Math.floor(Math.random()*3)]);
    mistakeReviewList.push({index: currentIndex, char: val[currentIndex], expected: typingTextArr[currentIndex]});
  }
  currentIndex = val.length;
  renderTypingText();
  updateStats();
  showMistypedWords();
  sessionReplayList.push({time: new Date().getTime(), index: currentIndex, char: val[currentIndex]});
  if (val.length === typingTextArr.length) endSession();
});
function getCurrentWord() {
  let textUptoCursor = typingText.slice(0, currentIndex+1);
  let words = textUptoCursor.split(' ');
  return words[words.length-1].replace(/[^a-zA-Z0-9]/g,'');
}
function flashMistyped(word) {
  mistypedWords.innerHTML = `<span>${word}</span>`;
  mistypedWords.firstChild.style.background='#fff2f2';
  setTimeout(showMistypedWords, 650);
}

/* ----------- Controls ----------- */
document.getElementById('startBtn').onclick = () => startSession();
document.getElementById('pauseBtn').onclick = () => pauseSession();
document.getElementById('resumeBtn').onclick = () => resumeSession();
document.getElementById('resetBtn').onclick = () => resetSession();
document.getElementById('repeatBtn').onclick = () => repeatSession();
document.getElementById('exportBtn').onclick = () => exportCSV();
document.getElementById('soundBtn').onclick = () => {
  soundOn = !soundOn;
  document.getElementById('soundBtn').textContent = soundOn ? '🔊' : '🔇';
};
document.getElementById('themeBtn').onclick = () => toggleDarkMode();

document.getElementById('duration').onchange = (e)=>{duration = parseInt(e.target.value);resetSession();}
document.getElementById('difficulty').onchange = (e)=>{difficulty = e.target.value;resetSession();}
document.getElementById('language').onchange = (e)=>{language = e.target.value;resetSession();}


/* ----------- Keyboard Shortcuts ----------- */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); startSession(); }
  if (e.ctrlKey && e.key === 'p') { e.preventDefault(); pauseSession(); }
  if (e.ctrlKey && e.key === 'r') { e.preventDefault(); resetSession(); }
  // Distraction-free shortcut
  if (e.ctrlKey && e.key === 'd') { e.preventDefault(); toggleDistractionFree(); }
});

/* ----------- Theme Selection ----------- */
themeBtns.forEach(btn => {
  btn.onclick = () => {
    themeBtns.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    let theme = btn.dataset.theme;
    if (theme === 'blue') {
      document.body.style.setProperty('--accent','#3a8eff');
      document.body.style.setProperty('--success','#0099ff');
    } else if (theme === 'green') {
      document.body.style.setProperty('--accent','#00cc77');
      document.body.style.setProperty('--success','#00cc77');
    } else if (theme === 'pink') {
      document.body.style.setProperty('--accent','#ff5ba3');
      document.body.style.setProperty('--success','#f83c7d');
    } else {
      document.body.style.setProperty('--accent','#0099ff');
      document.body.style.setProperty('--success','#00cc77');
    }
  };
});

closeMistakeModalBtn.onclick = () => closeMistakeReview();

/* ----------- Dark/Light Mode ----------- */
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  document.getElementById('themeBtn').textContent =
    document.body.classList.contains('dark') ? '☀️' : '🌙';
}

/* ----------- Chart Drawing ----------- */
function updateChart() {
  if (!wpmChart.getContext) return;
  chartCtx = wpmChart.getContext('2d');
  chartCtx.clearRect(0,0,wpmChart.width,wpmChart.height);
  let data = wpmHistory;
  let maxWPM = Math.max(...data, 40);
  chartCtx.strokeStyle = '#0099ff';
  chartCtx.lineWidth = 3;
  chartCtx.beginPath();
  data.forEach((val, i) => {
    let x = i* (wpmChart.width/(duration));
    let y = wpmChart.height - (val/maxWPM)*wpmChart.height;
    if (i===0) chartCtx.moveTo(x,y);
    else chartCtx.lineTo(x,y);
  });
  chartCtx.stroke();
  chartCtx.fillStyle = '#555';
  chartCtx.font = '14px Arial';
  chartCtx.fillText('WPM', 10, 20);
}
function resizeChart() {
  wpmChart.width = wpmChart.parentElement.offsetWidth-10;
  wpmChart.height = 100;
  updateChart();
}
window.addEventListener('resize', resizeChart);

/* ----------- Export CSV ----------- */
function exportCSV() {
  let stats = JSON.parse(localStorage.getItem('leaderboard')||'[]');
  let csv = 'Date,WPM,Accuracy,Errors,Duration,Text\n';
  stats.forEach(s => {
    csv += `${s.date},${s.wpm},${s.accuracy},${s.errors},${s.duration},"${s.text.replace(/"/g,'""')}"\n`;
  });
  let blob = new Blob([csv], {type: 'text/csv'});
  let a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'typing_stats.csv';
  a.click();
}

/* ----------- Feature: Daily Challenge ----------- */
function getDailyChallengeText() {
  let today = new Date().toISOString().slice(0,10);
  let hash = today.split('-').reduce((a,b)=>a*31+b.charCodeAt(0),1)%3;
  return textSamples[language][difficulty][hash];
}
dailyChallengeBtn.onclick = () => {
  dailyChallengeText = getDailyChallengeText();
  customText = '';
  startSession();
};

/* ----------- Feature: Streak Tracker ----------- */
streakBtn.onclick = () => {
  let s = localStorage.getItem('typingStreak')||'0';
  let lastDate = localStorage.getItem('typingStreakDate')||'Never';
  motivationalPopup(`Streak: ${s} days. Last: ${lastDate}`);
};

/* ----------- Feature: Distraction-Free Mode ----------- */
distractionFreeBtn.onclick = () => toggleDistractionFree();
function toggleDistractionFree() {
  distractionFreeMode = !distractionFreeMode;
  distractionOverlay.style.display = distractionFreeMode ? "flex" : "none";
  if(distractionFreeMode) {
    dfTypingArea.innerHTML = typingArea.innerHTML;
    dfInputArea.value = inputArea.value;
    dfInputArea.focus();
    dfInputArea.oninput = function(e){
      inputArea.value = dfInputArea.value;
      inputArea.dispatchEvent(new Event('input'));
      dfTypingArea.innerHTML = typingArea.innerHTML;
    };
  }
}

/* ----------- Feature: Mistake Review ----------- */
mistakeReviewBtn.onclick = () => showMistakeReview();
function showMistakeReview() {
  mistakeReviewModal.style.display = "flex";
  let html = "<ul style='font-size:1.1rem;'>";
  mistakeReviewList.forEach(m => {
    html += `<li>Char #${m.index+1}: You typed "${m.char||''}", expected "${m.expected}"</li>`;
  });
  html += "</ul>";
  if(mistakeReviewList.length===0) html = "No mistakes!";
  mistakeReviewContent.innerHTML = html;
}
function closeMistakeReview() {
  mistakeReviewModal.style.display = "none";
}

/* ----------- Feature: Focus Timer Integration ----------- */
focusTimerBtn.onclick = () => startFocusTimer();
function startFocusTimer() {
  focusTimeLeft = 1500; // 25min
  focusTimerRunning = true;
  focusTimerStatus.textContent = "Focus started!";
  if(focusTimer) clearInterval(focusTimer);
  focusTimer = setInterval(()=>{
    if(!focusTimerRunning) return;
    focusTimeLeft--;
    let min = Math.floor(focusTimeLeft/60), sec = focusTimeLeft%60;
    focusTimerStatus.textContent = `Focus: ${pad(min)}:${pad(sec)}`;
    if(focusTimeLeft<=0) {
      clearInterval(focusTimer);
      focusTimerStatus.textContent = "Focus session complete!";
      motivationalPopup("Take a break! ☕");
      focusTimerRunning = false;
    }
  },1000);
}

/* ----------- Feature: Custom Text Input ----------- */
customTextBtn.onclick = () => {
  customTextArea.style.display = customTextArea.style.display==="none"?"block":"none";
  if(customTextArea.style.display==="block") customTextArea.focus();
  else customTextArea.value = '';
};
customTextArea.onblur = function(){
  if(customTextArea.value.trim().length>0){
    customText = customTextArea.value.trim();
    startSession();
    customTextArea.style.display = "none";
  }
};

/* ----------- Feature: Session Replay ----------- */
sessionReplayBtn.onclick = () => replaySession();
function replaySession() {
  let idx = 0;
  inputArea.value = '';
  renderTypingText();
  let replayInterval = setInterval(()=>{
    if(idx>=sessionReplayList.length) { clearInterval(replayInterval); return; }
    let ev = sessionReplayList[idx];
    inputArea.value = typingText.slice(0,ev.index);
    renderTypingText();
    idx++;
  },120);
}

/* ----------- Feature: Caps Lock Warning ----------- */
inputArea.addEventListener('keydown', function(e){
  if(e.getModifierState && e.getModifierState('CapsLock')) {
    capsLockWarning.style.display = 'inline-block';
  } else {
    capsLockWarning.style.display = 'none';
  }
});

/* ----------- Feature: Slow Typing Alert ----------- */
function checkSlowTyping() {
  if(wpm<20 && started && !isPaused) {
    motivationalPopup("Typing slow! Try to speed up!");
  }
}
setInterval(checkSlowTyping, 4000);

/* ----------- Feature: Typing Speed Test History ----------- */
function showTypingHistory() {
  let hist = loadSessionHistory();
  let html = "<h3>Past Sessions</h3><ul>";
  hist.slice(-10).reverse().forEach(s=>{
    html += `<li>${s.date}: ${s.wpm} WPM, ${s.accuracy}% acc, ${s.errors} errors</li>`;
  });
  html += "</ul>";
  motivationalPopup(html);
}

/* ----------- Feature: Animated Avatar/Character ----------- */
// Already handled via updateAvatar()

/* ----------- Feature: Mistake Review Mode ----------- */
// See mistakeReviewBtn and modal

/* ----------- Feature: Customizable Key Sounds ----------- */
// Not implemented, stub: allow soundOn toggle

/* ----------- Feature: Distraction-Free Mode ----------- */
// See distractionOverlay

/* ----------- Feature: Focus Timer Integration ----------- */
// See focusTimerBtn

/* ----------- Feature: Practice Reminders ----------- */
// Stub: Would require notifications/email backend

/* ----------- Feature: Virtual Keyboard Display ----------- */
// Stub: Not implemented, would require drawing a keyboard

/* ----------- Feature: Finger Placement Guide ----------- */
// Stub: Would require images/UI

/* ----------- Feature: Adaptive Difficulty ----------- */
// Not implemented, stub: could adjust 'difficulty' based on recent WPM

/* ----------- Feature: Typing Game Mode ----------- */
// Stub: Could race against a timer

/* ----------- Feature: Online Multiplayer ----------- */
// UI stub only
let multiplayerMode = false;

/* ----------- Feature: Chat Room/Forum ----------- */
// UI stub only

/* ----------- Feature: Achievements/Badges ----------- */
function checkAchievements() {
  if(wpm>=40) motivationalPopup("Achievement unlocked: Fast Typer!");
  if(streak>=5) motivationalPopup("Achievement unlocked: Streak Master!");
}
setInterval(checkAchievements, 5000);

/* ----------- Feature: Progress Graphs ----------- */
// see updateChart()

/* ----------- Feature: Text-to-Speech ----------- */
// Stub: Would require speechSynthesis API

/* ----------- Feature: Accessibility Options ----------- */
// Not implemented, stub: could add high-contrast mode

/* ----------- Feature: Error Correction Suggestions ----------- */
// Not implemented, stub: could suggest correct word

/* ----------- Feature: Practice with Code Snippets ----------- */
// Stub: could add code sample texts

/* ----------- Feature: Leaderboard by Region/Age/Group ----------- */
// Not implemented: needs user registration

/* ----------- Feature: API for Developers ----------- */
// Not implemented: needs backend

/* ----------- Initialize ----------- */
function init() {
  loadLeaderboard();
  resizeChart();
  resetSession();
  updateStreak();
  updateAvatar("neutral");
}
init();
// --- Virtual Keyboard Functionality ---

// COMMENT: Virtual keyboard input handler.
// When a key is clicked, add its value to the typing input box and trigger the input event.
// Space and Backspace handled specially.
document.querySelectorAll('.vk-key').forEach(key => {
  key.addEventListener('click', () => {
    const input = document.getElementById('inputArea');
    if (key.classList.contains('vk-key-space')) {
      input.value += ' ';
    } else if (key.classList.contains('vk-key-backspace')) {
      input.value = input.value.slice(0, -1);
    } else {
      input.value += key.textContent;
    }
    input.dispatchEvent(new Event('input')); // Trigger main logic
    input.focus();
  });
});

// COMMENT: Highlight the virtual key when the real keyboard key is pressed.
// This visually links physical keyboard use with the virtual display.
document.addEventListener('keydown', (e) => {
  let pressed = e.key.toUpperCase();
  document.querySelectorAll('.vk-key').forEach(key => {
    if ((key.textContent.toUpperCase() === pressed) ||
        (key.classList.contains('vk-key-space') && pressed === ' ') ||
        (key.classList.contains('vk-key-backspace') && (pressed === 'BACKSPACE' || pressed === '⌫'))) {
      key.classList.add('active');
    }
  });
});
document.addEventListener('keyup', () => {
  document.querySelectorAll('.vk-key').forEach(key => key.classList.remove('active'));
});

// --- JavaScript Code Typing Practice Feature ---

// JavaScript snippets covering functions, arrays, DOM, variables, if/else, JSON, fetch, async/await
const codeSamples = [
  // Function
  `function greet(name) {\n  return "Hello, " + name;\n}`,
  // Arrays
  `const nums = [1, 2, 3, 4];\nconsole.log(nums.length);`,
  // DOM Manipulation
  `document.getElementById("demo").textContent = "Hello DOM!";`,
  // Variables
  `let x = 10;\nconst y = 20;\nconsole.log(x + y);`,
  // If/Else Statement
  `if (x > y) {\n  console.log("x is greater");\n} else {\n  console.log("y is greater");\n}`,
  // JSON Parse
  `const json = '{"name":"Alice","age":25}';\nconst obj = JSON.parse(json);\nconsole.log(obj.name);`,
  // Fetch API
  `fetch('https://api.github.com').then(r => r.json()).then(data => console.log(data));`,
  // Async/Await
  `async function getData() {\n  const res = await fetch('https://api.github.com');\n  const data = await res.json();\n  console.log(data);\n}\ngetData();`
];

let codePracticeMode = false;
let currentCodeSnippet = '';

const codePracticeBtn = document.createElement('button');
codePracticeBtn.textContent = "Code Practice";
codePracticeBtn.className = "feature-btn";
codePracticeBtn.style.marginTop = "8px";
document.querySelector('.controls').appendChild(codePracticeBtn);

codePracticeBtn.onclick = () => {
  codePracticeMode = true;
  document.getElementById('codePracticeArea').style.display = "block";
  // Pick a random JS code snippet
  currentCodeSnippet = codeSamples[Math.floor(Math.random() * codeSamples.length)];
  typingText = currentCodeSnippet;
  typingTextArr = typingText.split('');
  currentIndex = 0;
  errors = 0;
  correctChars = 0;
  totalChars = 0;
  timeLeft = duration;
  isPaused = false;
  started = true;
  wpmHistory = [];
  inputArea.value = '';
  inputArea.disabled = false;
  renderTypingText();
  updateStats();
  showMistypedWords();
  inputArea.focus();
  lastSessionText = typingText;
  // Show code preview
  document.getElementById('codePreview').textContent = currentCodeSnippet;
  document.getElementById('codeOutput').textContent = '';
};

// Update code preview as user types in code mode
inputArea.addEventListener('input', () => {
  if (codePracticeMode) {
    document.getElementById('codePreview').textContent = inputArea.value;
  }
});

// --- Run Code Button ---
document.getElementById('runCodeBtn').onclick = () => {
  const code = inputArea.value;
  let outputEl = document.getElementById('codeOutput');
  outputEl.textContent = '';
  try {
    // Redirect console.log to output element
    let log = [];
    const origLog = console.log;
    console.log = (...args) => {
      log.push(args.map(String).join(' '));
      origLog.apply(console, args);
    };
    // Run code safely
    new Function(code)();
    outputEl.textContent = log.join('\n') || 'Code ran successfully!';
    console.log = origLog;
  } catch (err) {
    outputEl.textContent = 'Error: ' + err;
  }
};

// --- Exit Code Practice Mode ---
document.getElementById('exitCodePracticeBtn').onclick = () => {
  codePracticeMode = false;
  document.getElementById('codePracticeArea').style.display = "none";
  inputArea.value = '';
  renderTypingText();
};

// --- Update renderTypingText for code mode ---
const origRenderTypingText = renderTypingText;
window.renderTypingText = function() {
  if (codePracticeMode) {
    typingArea.innerHTML = `<pre style="font-family:monospace;background:#222;color:#fff;border-radius:8px;padding:8px;white-space:pre-wrap;">${typingTextArr.map((ch, i) => {
      let cls = i === currentIndex ? 'current' : i < currentIndex ? (inputArea.value[i] === typingTextArr[i] ? 'correct' : 'incorrect') : '';
      return `<span class="${cls}">${ch === '\n' ? '<br>' : ch}</span>`;
    }).join('')}</pre>`;
  } else {
    origRenderTypingText();
  }
};
// Save current session progress every few seconds
setInterval(() => {
  if (started && !isPaused) {
    const progressData = {
      typingText,
      currentIndex,
      inputValue: inputArea.value,
      errors,
      correctChars,
      totalChars,
      timeLeft,
      language,
      difficulty,
      duration
    };
    localStorage.setItem('currentSession', JSON.stringify(progressData));
  }
}, 3000);

// Load last session when site opens
function loadSavedSession() {
  const saved = JSON.parse(localStorage.getItem('currentSession') || 'null');
  if (saved) {
    typingText = saved.typingText;
    typingTextArr = typingText.split('');
    currentIndex = saved.currentIndex;
    errors = saved.errors;
    correctChars = saved.correctChars;
    totalChars = saved.totalChars;
    timeLeft = saved.timeLeft;
    duration = saved.duration;
    language = saved.language;
    difficulty = saved.difficulty;
    inputArea.value = saved.inputValue || '';
    started = true;
    isPaused = true; // start in paused mode
    renderTypingText();
    updateStats();
    motivationalPopup("Session restored! ⏪");
  }
}

// Call when initializing
loadSavedSession();
