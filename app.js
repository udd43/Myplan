/**
 * ROUTINE-CALENDAR.WEB
 * Game Boy (DMG-01, 1989) Routine & Habit Tracker
 * Fully dynamic real-time calendar & week/month sync
 * Includes "어깨 프레임 확장 1주일 루틴" workout guide & daily workout recommendation
 */

(function () {
  'use strict';

  // ==========================================
  // 1. Pixel Art SVG Icons (16x16 / 12x12 grid)
  // ==========================================
  const ICONS = {
    clock: `<svg viewBox="0 0 16 16"><rect x="5" y="1" width="6" height="2"/><rect x="2" y="3" width="2" height="2"/><rect x="12" y="3" width="2" height="2"/><rect x="3" y="4" width="10" height="10"/><rect x="4" y="3" width="8" height="12"/><rect x="5" y="5" width="6" height="8" fill="#9bbc0f"/><rect x="7" y="6" width="2" height="4"/><rect x="8" y="8" width="3" height="2"/><rect x="4" y="14" width="2" height="2"/><rect x="10" y="14" width="2" height="2"/></svg>`,
    house: `<svg viewBox="0 0 16 16"><rect x="7" y="1" width="2" height="2"/><rect x="6" y="3" width="4" height="2"/><rect x="4" y="5" width="8" height="2"/><rect x="2" y="7" width="12" height="2"/><rect x="3" y="9" width="10" height="6"/><rect x="11" y="3" width="2" height="4"/><rect x="6" y="10" width="4" height="5" fill="#9bbc0f"/><rect x="7" y="11" width="2" height="4"/></svg>`,
    run: `<svg viewBox="0 0 16 16"><rect x="7" y="1" width="3" height="3"/><rect x="6" y="4" width="3" height="4"/><rect x="9" y="5" width="4" height="2"/><rect x="3" y="6" width="3" height="2"/><rect x="2" y="4" width="2" height="3"/><rect x="5" y="8" width="4" height="2"/><rect x="4" y="10" width="3" height="3"/><rect x="3" y="13" width="2" height="2"/><rect x="9" y="9" width="3" height="3"/><rect x="11" y="11" width="3" height="2"/><rect x="13" y="13" width="2" height="2"/></svg>`,
    target: `<svg viewBox="0 0 16 16"><rect x="5" y="1" width="6" height="2"/><rect x="5" y="13" width="6" height="2"/><rect x="1" y="5" width="2" height="6"/><rect x="13" y="5" width="2" height="6"/><rect x="3" y="3" width="10" height="10"/><rect x="4" y="4" width="8" height="8" fill="#9bbc0f"/><rect x="6" y="6" width="4" height="4"/><rect x="7" y="7" width="2" height="2" fill="#9bbc0f"/><rect x="7" y="0" width="2" height="3"/><rect x="7" y="13" width="2" height="3"/><rect x="0" y="7" width="3" height="2"/><rect x="13" y="7" width="3" height="2"/></svg>`,
    apple: `<svg viewBox="0 0 16 16"><rect x="8" y="1" width="2" height="2"/><rect x="9" y="3" width="3" height="2"/><rect x="4" y="4" width="8" height="2"/><rect x="3" y="5" width="10" height="7"/><rect x="4" y="12" width="8" height="2"/><rect x="5" y="13" width="2" height="1"/><rect x="9" y="13" width="2" height="1"/><rect x="5" y="6" width="2" height="3" fill="#9bbc0f"/></svg>`,
    beer: `<svg viewBox="0 0 16 16"><rect x="4" y="2" width="6" height="2"/><rect x="3" y="4" width="7" height="10"/><rect x="10" y="5" width="3" height="6"/><rect x="11" y="7" width="1" height="2" fill="#9bbc0f"/><rect x="4" y="5" width="5" height="8" fill="#9bbc0f"/><rect x="5" y="3" width="4" height="2"/><rect x="5" y="7" width="1" height="5"/><rect x="7" y="7" width="1" height="5"/></svg>`,
    trophy: `<svg viewBox="0 0 16 16"><rect x="3" y="1" width="10" height="2"/><rect x="2" y="3" width="12" height="4"/><rect x="4" y="7" width="8" height="2"/><rect x="6" y="9" width="4" height="2"/><rect x="7" y="11" width="2" height="2"/><rect x="4" y="13" width="8" height="2"/><rect x="1" y="3" width="2" height="3"/><rect x="13" y="3" width="2" height="3"/><rect x="7" y="4" width="2" height="2" fill="#9bbc0f"/></svg>`,
    check: `<svg viewBox="0 0 14 14"><rect x="10" y="2" width="2" height="2"/><rect x="9" y="4" width="2" height="2"/><rect x="8" y="6" width="2" height="2"/><rect x="7" y="8" width="2" height="2"/><rect x="6" y="9" width="2" height="2"/><rect x="5" y="8" width="2" height="2"/><rect x="4" y="6" width="2" height="2"/><rect x="3" y="5" width="2" height="2"/><rect x="2" y="4" width="2" height="2"/></svg>`,
    house_nav: `<svg viewBox="0 0 16 16"><path d="M8 2 L2 7 L4 7 L4 13 L7 13 L7 9 L9 9 L9 13 L12 13 L12 7 L14 7 Z"/></svg>`,
    // Workout section icons (monochrome, follow currentColor → stays in 4-shade palette)
    calendar: `<svg viewBox="0 0 16 16"><rect x="4" y="1" width="2" height="3"/><rect x="10" y="1" width="2" height="3"/><rect x="2" y="3" width="12" height="3"/><rect x="2" y="6" width="2" height="7"/><rect x="12" y="6" width="2" height="7"/><rect x="2" y="13" width="12" height="2"/><rect x="5" y="7" width="2" height="2"/><rect x="9" y="7" width="2" height="2"/><rect x="5" y="10" width="2" height="2"/><rect x="9" y="10" width="2" height="2"/></svg>`,
    chart: `<svg viewBox="0 0 16 16"><rect x="1" y="1" width="2" height="14"/><rect x="1" y="13" width="14" height="2"/><rect x="5" y="8" width="2" height="4"/><rect x="8" y="4" width="2" height="8"/><rect x="11" y="6" width="2" height="6"/></svg>`,
    flame: `<svg viewBox="0 0 16 16"><rect x="7" y="1" width="2" height="2"/><rect x="6" y="3" width="3" height="2"/><rect x="10" y="4" width="2" height="2"/><rect x="5" y="5" width="7" height="2"/><rect x="3" y="6" width="2" height="2"/><rect x="3" y="7" width="10" height="2"/><rect x="2" y="9" width="12" height="4"/><rect x="3" y="13" width="10" height="2"/></svg>`,
    video: `<svg viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="2"/><rect x="1" y="11" width="14" height="2"/><rect x="1" y="4" width="2" height="7"/><rect x="13" y="4" width="2" height="7"/><rect x="7" y="13" width="2" height="1"/><rect x="5" y="14" width="6" height="2"/><rect x="6" y="5" width="2" height="5"/><rect x="8" y="6" width="2" height="3"/><rect x="10" y="7" width="1" height="1"/></svg>`,
    bulb: `<svg viewBox="0 0 16 16"><rect x="5" y="1" width="6" height="1"/><rect x="3" y="2" width="10" height="2"/><rect x="2" y="4" width="12" height="4"/><rect x="3" y="8" width="10" height="2"/><rect x="5" y="10" width="6" height="2"/><rect x="5" y="13" width="6" height="1"/><rect x="6" y="15" width="4" height="1"/></svg>`,
    warn: `<svg viewBox="0 0 16 16"><rect x="7" y="1" width="2" height="2"/><rect x="6" y="3" width="1" height="2"/><rect x="9" y="3" width="1" height="2"/><rect x="5" y="5" width="1" height="2"/><rect x="10" y="5" width="1" height="2"/><rect x="4" y="7" width="1" height="2"/><rect x="11" y="7" width="1" height="2"/><rect x="3" y="9" width="1" height="2"/><rect x="12" y="9" width="1" height="2"/><rect x="2" y="11" width="1" height="2"/><rect x="13" y="11" width="1" height="2"/><rect x="1" y="13" width="14" height="2"/><rect x="7" y="5" width="2" height="5"/><rect x="7" y="11" width="2" height="1"/></svg>`,
    bolt: `<svg viewBox="0 0 16 16"><rect x="8" y="1" width="4" height="2"/><rect x="7" y="3" width="4" height="2"/><rect x="6" y="5" width="4" height="2"/><rect x="4" y="7" width="8" height="2"/><rect x="6" y="9" width="4" height="2"/><rect x="5" y="11" width="4" height="2"/><rect x="4" y="13" width="3" height="2"/></svg>`,
    dumbbell: `<svg viewBox="0 0 16 16"><rect x="0" y="6" width="2" height="4"/><rect x="2" y="3" width="3" height="10"/><rect x="5" y="7" width="6" height="2"/><rect x="11" y="3" width="3" height="10"/><rect x="14" y="6" width="2" height="4"/></svg>`,
    timer: `<svg viewBox="0 0 16 16"><rect x="6" y="0" width="4" height="2"/><rect x="7" y="2" width="2" height="1"/><rect x="5" y="3" width="6" height="2"/><rect x="3" y="5" width="2" height="2"/><rect x="11" y="5" width="2" height="2"/><rect x="2" y="7" width="2" height="4"/><rect x="12" y="7" width="2" height="4"/><rect x="3" y="11" width="2" height="2"/><rect x="11" y="11" width="2" height="2"/><rect x="5" y="13" width="6" height="2"/><rect x="7" y="6" width="2" height="4"/><rect x="9" y="8" width="2" height="2"/></svg>`
  };

  // Inline pixel icon helper (no emoji → stays inside the 4-shade palette)
  function icon(name, extraClass = '') {
    return `<span class="px-icon ${extraClass}" aria-hidden="true">${ICONS[name] || ''}</span>`;
  }
  function stripEmojiPrefix(text) {
    return String(text || '').replace(/^\u26A0\uFE0F?\s*/, '');
  }

  // ==========================================
  // 2. 8-Bit Web Audio Synthesizer (Chiptune)
  // ==========================================
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.08, type = 'square', gainLevel = 0.08) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted
    }
  }

  function playSound(name) {
    if (!soundEnabled) return;
    switch (name) {
      case 'move':
        playTone(330, 0.04, 'square', 0.05);
        break;
      case 'check':
        playTone(523.25, 0.06, 'square', 0.08);
        setTimeout(() => playTone(659.25, 0.08, 'square', 0.09), 60);
        break;
      case 'uncheck':
        playTone(440, 0.05, 'square', 0.07);
        setTimeout(() => playTone(349.23, 0.07, 'square', 0.06), 50);
        break;
      case 'tab':
        playTone(493.88, 0.05, 'square', 0.06);
        setTimeout(() => playTone(587.33, 0.07, 'square', 0.07), 50);
        break;
      case 'open_menu':
        playTone(261.63, 0.05, 'square', 0.07);
        setTimeout(() => playTone(392.00, 0.06, 'square', 0.08), 50);
        setTimeout(() => playTone(523.25, 0.08, 'square', 0.08), 100);
        break;
      case 'close_menu':
        playTone(440, 0.05, 'square', 0.06);
        setTimeout(() => playTone(293.66, 0.07, 'square', 0.06), 50);
        break;
      case 'boot':
        playTone(1046.5, 0.08, 'square', 0.08);
        setTimeout(() => playTone(2093, 0.28, 'square', 0.09), 110);
        break;
      case 'error':
        playTone(150, 0.12, 'sawtooth', 0.1);
        break;
    }
  }

  // ==========================================
  // 3. Real-Time Calendar & Date Helpers
  // ==========================================
  const KOREAN_WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  const REAL_NOW = new Date();
  const TODAY_Y = REAL_NOW.getFullYear();
  const TODAY_M = REAL_NOW.getMonth(); // 0-based
  const TODAY_D = REAL_NOW.getDate();
  const TODAY_STR = formatDateKey(TODAY_Y, TODAY_M + 1, TODAY_D);

  function formatDateKey(y, m, d) {
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayWeekday(year, month) {
    return new Date(year, month, 1).getDay(); // 0(일)~6(토)
  }

  function getWeekCount(year, month) {
    const days = getDaysInMonth(year, month);
    return Math.ceil(days / 7);
  }

  function getMonthColWeekdays(year, month) {
    const startW = getFirstDayWeekday(year, month);
    return Array.from({ length: 7 }, (_, i) => KOREAN_WEEKDAYS[(startW + i) % 7]);
  }

  function getWeekIndexForDay(day) {
    return Math.floor((day - 1) / 7);
  }

  // ==========================================
  // 4. Workout Guide Plan (어깨 프레임 확장 1주일 루틴)
  // ==========================================
  // ==========================================
  // 4-A. 8-Bit Pixel Art Figures (Game Boy 4-Color Green)
  // ==========================================
  const PIXEL_ART_FIGURES = {
    // 덤벨 숄더 프레스 (앉아서 머리 위로 15kg 프레스)
    dumbbell_press: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Dumbbells overhead -->
        <rect x="2" y="3" width="5" height="2" fill="#0f380f"/>
        <rect x="3" y="2" width="3" height="4" fill="#0f380f"/>
        <rect x="17" y="3" width="5" height="2" fill="#0f380f"/>
        <rect x="18" y="2" width="3" height="4" fill="#0f380f"/>
        <!-- Arms / Shoulders -->
        <rect x="4" y="6" width="2" height="4" fill="#306230"/>
        <rect x="18" y="6" width="2" height="4" fill="#306230"/>
        <rect x="5" y="9" width="3" height="2" fill="#306230"/>
        <rect x="16" y="9" width="3" height="2" fill="#306230"/>
        <rect x="7" y="10" width="10" height="2" fill="#0f380f"/>
        <!-- Head & Face -->
        <rect x="10" y="5" width="4" height="4" fill="#8bac0f"/>
        <rect x="10" y="4" width="4" height="1" fill="#0f380f"/>
        <rect x="11" y="6" width="1" height="1" fill="#0f380f"/>
        <rect x="11" y="8" width="2" height="1" fill="#306230"/>
        <!-- Torso & Abs -->
        <rect x="8" y="12" width="8" height="5" fill="#306230"/>
        <rect x="10" y="13" width="4" height="1" fill="#8bac0f"/>
        <rect x="10" y="15" width="4" height="1" fill="#8bac0f"/>
        <!-- Bench & Legs -->
        <rect x="7" y="17" width="10" height="2" fill="#0f380f"/>
        <rect x="8" y="19" width="3" height="3" fill="#306230"/>
        <rect x="13" y="19" width="3" height="3" fill="#306230"/>
        <rect x="6" y="22" width="12" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 파이크 푸시업 (역V자 어깨 타겟)
    pike_pushup: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Hands on floor -->
        <rect x="3" y="19" width="3" height="2" fill="#0f380f"/>
        <!-- Head angled down -->
        <rect x="5" y="16" width="3" height="3" fill="#8bac0f"/>
        <rect x="5" y="15" width="3" height="1" fill="#0f380f"/>
        <!-- Arms pushing -->
        <rect x="4" y="17" width="2" height="3" fill="#306230"/>
        <!-- Broad shoulders & Upper torso slanting up -->
        <rect x="7" y="13" width="3" height="3" fill="#0f380f"/>
        <rect x="9" y="10" width="3" height="4" fill="#306230"/>
        <!-- High hips (Peak of Pike V) -->
        <rect x="11" y="6" width="4" height="4" fill="#0f380f"/>
        <!-- Legs slanting down to feet -->
        <rect x="14" y="9" width="3" height="4" fill="#306230"/>
        <rect x="16" y="13" width="3" height="4" fill="#306230"/>
        <rect x="18" y="17" width="3" height="4" fill="#8bac0f"/>
        <!-- Feet on ground -->
        <rect x="19" y="20" width="3" height="2" fill="#0f380f"/>
        <line x1="1" y1="22" x2="23" y2="22" stroke="#0f380f" stroke-width="1"/>
      </svg>
    `,
    // 일반 푸시업 (기본 가슴/어깨)
    pushup: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Hands & Forearms -->
        <rect x="5" y="18" width="3" height="2" fill="#0f380f"/>
        <rect x="6" y="15" width="2" height="3" fill="#306230"/>
        <!-- Head -->
        <rect x="3" y="13" width="3" height="3" fill="#8bac0f"/>
        <rect x="3" y="12" width="3" height="1" fill="#0f380f"/>
        <!-- Chest, Shoulders, Back (Straight plank) -->
        <rect x="6" y="13" width="4" height="3" fill="#0f380f"/>
        <rect x="10" y="13" width="5" height="3" fill="#306230"/>
        <rect x="15" y="14" width="4" height="3" fill="#306230"/>
        <!-- Legs & Feet -->
        <rect x="19" y="15" width="3" height="3" fill="#8bac0f"/>
        <rect x="21" y="17" width="2" height="3" fill="#0f380f"/>
        <rect x="1" y="20" width="23" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 원암 덤벨 로우 (한 손 골반 쪽으로 당기기)
    one_arm_row: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Bench support -->
        <rect x="4" y="17" width="6" height="4" fill="#8bac0f"/>
        <rect x="5" y="14" width="2" height="4" fill="#306230"/>
        <!-- Head -->
        <rect x="6" y="9" width="3" height="3" fill="#8bac0f"/>
        <rect x="6" y="8" width="3" height="1" fill="#0f380f"/>
        <!-- Torso flat horizontal -->
        <rect x="8" y="10" width="8" height="3" fill="#0f380f"/>
        <!-- Rowing arm pulling dumbbell up high -->
        <rect x="12" y="8" width="3" height="3" fill="#306230"/>
        <!-- 15kg Dumbbell near ribs/hip -->
        <rect x="11" y="6" width="5" height="2" fill="#0f380f"/>
        <rect x="12" y="5" width="3" height="4" fill="#0f380f"/>
        <!-- Hips and Standing Leg -->
        <rect x="15" y="11" width="3" height="4" fill="#306230"/>
        <rect x="16" y="15" width="2" height="6" fill="#8bac0f"/>
        <rect x="15" y="21" width="4" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 덤벨 풀오버 (가슴/등 상부 흉곽 확장)
    pullover: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Bench horizontal -->
        <rect x="5" y="15" width="14" height="3" fill="#0f380f"/>
        <rect x="8" y="18" width="2" height="4" fill="#306230"/>
        <rect x="15" y="18" width="2" height="4" fill="#306230"/>
        <!-- Head on bench -->
        <rect x="7" y="13" width="3" height="2" fill="#8bac0f"/>
        <!-- Arched Torso on bench -->
        <rect x="10" y="12" width="6" height="3" fill="#306230"/>
        <!-- Arms extending overhead backwards with 15kg dumbbell -->
        <rect x="3" y="10" width="5" height="2" fill="#306230"/>
        <rect x="1" y="8" width="4" height="3" fill="#0f380f"/>
        <!-- Bent knees down -->
        <rect x="16" y="13" width="3" height="3" fill="#8bac0f"/>
        <rect x="18" y="16" width="2" height="5" fill="#306230"/>
      </svg>
    `,
    // 하체 맨몸 스쿼트 (깊은 풀 스쿼트)
    squat: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Head -->
        <rect x="10" y="4" width="4" height="4" fill="#8bac0f"/>
        <rect x="10" y="3" width="4" height="1" fill="#0f380f"/>
        <!-- Torso upright / slightly tilted -->
        <rect x="9" y="8" width="6" height="5" fill="#0f380f"/>
        <!-- Arms forward for counterbalance -->
        <rect x="15" y="9" width="5" height="2" fill="#306230"/>
        <!-- Deep squat thighs (horizontal) -->
        <rect x="6" y="13" width="8" height="3" fill="#306230"/>
        <!-- Calves and shins -->
        <rect x="8" y="16" width="3" height="5" fill="#8bac0f"/>
        <rect x="13" y="16" width="3" height="5" fill="#8bac0f"/>
        <!-- Feet flat on floor -->
        <rect x="6" y="21" width="5" height="2" fill="#0f380f"/>
        <rect x="13" y="21" width="5" height="2" fill="#0f380f"/>
      </svg>
    `,
    // 덤벨 업라이트 로우 (측면 삼각근 턱끝까지)
    upright_row: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- High flaring elbows -->
        <rect x="3" y="8" width="4" height="3" fill="#0f380f"/>
        <rect x="17" y="8" width="4" height="3" fill="#0f380f"/>
        <!-- Head -->
        <rect x="10" y="4" width="4" height="4" fill="#8bac0f"/>
        <!-- Forearms angled into chest holding 15kg -->
        <rect x="7" y="10" width="3" height="2" fill="#306230"/>
        <rect x="14" y="10" width="3" height="2" fill="#306230"/>
        <rect x="10" y="10" width="4" height="3" fill="#0f380f"/>
        <!-- Torso -->
        <rect x="8" y="12" width="8" height="5" fill="#306230"/>
        <!-- Legs standing tall -->
        <rect x="8" y="17" width="3" height="5" fill="#8bac0f"/>
        <rect x="13" y="17" width="3" height="5" fill="#8bac0f"/>
        <rect x="7" y="22" width="10" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 벤트오버 덤벨 로우 (후면 어깨 팔꿈치 벌려 당기기)
    bent_over_row: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Flared high elbows for rear delts -->
        <rect x="3" y="7" width="3" height="3" fill="#0f380f"/>
        <rect x="18" y="7" width="3" height="3" fill="#0f380f"/>
        <!-- Head -->
        <rect x="10" y="7" width="4" height="3" fill="#8bac0f"/>
        <!-- Bent torso (45 deg) -->
        <rect x="8" y="10" width="8" height="4" fill="#306230"/>
        <!-- Dumbbells at chest width -->
        <rect x="5" y="10" width="3" height="3" fill="#0f380f"/>
        <rect x="16" y="10" width="3" height="3" fill="#0f380f"/>
        <!-- Bent knees & hips -->
        <rect x="8" y="14" width="8" height="3" fill="#0f380f"/>
        <rect x="8" y="17" width="3" height="5" fill="#306230"/>
        <rect x="13" y="17" width="3" height="5" fill="#306230"/>
        <rect x="7" y="22" width="10" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 힌두 푸시업 (배기기 파도 타는 푸시업)
    hindu_pushup: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Hands on ground -->
        <rect x="5" y="18" width="3" height="2" fill="#0f380f"/>
        <rect x="6" y="14" width="2" height="4" fill="#306230"/>
        <!-- Head looking up (Cobra swooping up) -->
        <rect x="4" y="9" width="4" height="4" fill="#8bac0f"/>
        <rect x="4" y="8" width="4" height="1" fill="#0f380f"/>
        <!-- Chest arched high -->
        <rect x="7" y="11" width="4" height="4" fill="#0f380f"/>
        <!-- Swooping spine down to floor -->
        <rect x="11" y="14" width="4" height="3" fill="#306230"/>
        <rect x="15" y="16" width="4" height="3" fill="#306230"/>
        <!-- Feet back -->
        <rect x="19" y="18" width="3" height="2" fill="#0f380f"/>
        <rect x="2" y="21" width="21" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 투암 덤벨 로우 (양손 15kg 총 30kg 벤트오버 로우)
    two_arm_row: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Head -->
        <rect x="10" y="6" width="4" height="3" fill="#8bac0f"/>
        <!-- Deep bent torso -->
        <rect x="7" y="9" width="10" height="4" fill="#0f380f"/>
        <!-- Both elbows pulled up high to ribs -->
        <rect x="4" y="7" width="3" height="4" fill="#306230"/>
        <rect x="17" y="7" width="3" height="4" fill="#306230"/>
        <!-- Heavy 15kg dumbbells (x2 = 30kg) -->
        <rect x="3" y="10" width="4" height="3" fill="#0f380f"/>
        <rect x="17" y="10" width="4" height="3" fill="#0f380f"/>
        <!-- Hips and strong legs -->
        <rect x="8" y="13" width="8" height="3" fill="#306230"/>
        <rect x="8" y="16" width="3" height="6" fill="#8bac0f"/>
        <rect x="13" y="16" width="3" height="6" fill="#8bac0f"/>
        <rect x="7" y="22" width="10" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 덤벨 슈러그 (승모근 수직 으쓱)
    shrug: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Shrugged shoulders touching ears -->
        <rect x="5" y="6" width="4" height="4" fill="#0f380f"/>
        <rect x="15" y="6" width="4" height="4" fill="#0f380f"/>
        <!-- Head nestled between shoulders -->
        <rect x="10" y="4" width="4" height="4" fill="#8bac0f"/>
        <rect x="10" y="3" width="4" height="1" fill="#0f380f"/>
        <!-- Torso upright and broad -->
        <rect x="7" y="9" width="10" height="6" fill="#306230"/>
        <!-- Heavy dumbbells hanging at sides -->
        <rect x="3" y="11" width="4" height="4" fill="#0f380f"/>
        <rect x="17" y="11" width="4" height="4" fill="#0f380f"/>
        <!-- Straight standing legs -->
        <rect x="8" y="15" width="3" height="7" fill="#8bac0f"/>
        <rect x="13" y="15" width="3" height="7" fill="#8bac0f"/>
        <rect x="7" y="22" width="10" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 플랭크 (코어 수평 버티기)
    plank: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Forearms on ground -->
        <rect x="4" y="18" width="4" height="2" fill="#0f380f"/>
        <rect x="6" y="15" width="2" height="3" fill="#306230"/>
        <!-- Head -->
        <rect x="3" y="13" width="3" height="3" fill="#8bac0f"/>
        <!-- Perfectly straight line torso & hips -->
        <rect x="6" y="14" width="6" height="3" fill="#0f380f"/>
        <rect x="12" y="14" width="5" height="3" fill="#306230"/>
        <!-- Legs & Toes -->
        <rect x="17" y="15" width="4" height="2" fill="#8bac0f"/>
        <rect x="21" y="16" width="2" height="3" fill="#0f380f"/>
        <!-- Ground line -->
        <rect x="2" y="19" width="21" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 어깨 & 흉곽 폼롤러 스트레칭 (이완 & 회복)
    foam_roller: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Foam roller cylinder under upper back -->
        <rect x="10" y="16" width="4" height="4" fill="#0f380f"/>
        <rect x="11" y="15" width="2" height="6" fill="#306230"/>
        <!-- Head and arms stretching back -->
        <rect x="4" y="15" width="3" height="3" fill="#8bac0f"/>
        <rect x="2" y="13" width="4" height="2" fill="#306230"/>
        <!-- Arched thoracic spine over roller -->
        <rect x="7" y="14" width="5" height="3" fill="#306230"/>
        <!-- Hips and bent legs -->
        <rect x="14" y="16" width="4" height="3" fill="#8bac0f"/>
        <rect x="17" y="15" width="3" height="4" fill="#306230"/>
        <rect x="18" y="19" width="3" height="2" fill="#0f380f"/>
        <rect x="1" y="21" width="22" height="1" fill="#0f380f"/>
      </svg>
    `,
    // 완전 휴식 & 단백질 쉐이크 (근합성 & 꿀잠)
    rest_shake: `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
        <rect width="24" height="24" fill="transparent"/>
        <!-- Rest heart & sparkles above -->
        <rect x="11" y="2" width="2" height="1" fill="#0f380f"/>
        <rect x="10" y="3" width="4" height="2" fill="#0f380f"/>
        <rect x="11" y="5" width="2" height="1" fill="#0f380f"/>
        <!-- Character smiling -->
        <rect x="6" y="6" width="5" height="5" fill="#8bac0f"/>
        <rect x="6" y="5" width="5" height="1" fill="#0f380f"/>
        <rect x="7" y="8" width="1" height="1" fill="#0f380f"/>
        <rect x="9" y="8" width="1" height="1" fill="#0f380f"/>
        <!-- Body sitting relaxedly -->
        <rect x="6" y="11" width="6" height="5" fill="#306230"/>
        <!-- Protein Shaker bottle in hand -->
        <rect x="14" y="9" width="3" height="1" fill="#0f380f"/>
        <rect x="13" y="10" width="5" height="6" fill="#8bac0f"/>
        <rect x="14" y="12" width="3" height="2" fill="#0f380f"/>
        <!-- Relaxed legs -->
        <rect x="5" y="16" width="10" height="3" fill="#8bac0f"/>
        <rect x="4" y="19" width="12" height="2" fill="#0f380f"/>
      </svg>
    `
  };

  // ==========================================
  // 4-B. 어깨 프레임 확장 1주일 루틴 (15kg 덤벨 기반)
  // ==========================================
  const WORKOUT_PLAN = {
    title: '어깨 프레임 확장 1주일 루틴 (15kg 덤벨)',
    goal: '어깨 전/측면 타겟(월, 목) + 등 프레임 확장(화, 금) + 근육 합성 휴식(수, 일)',
    // 0: 일, 1: 월, 2: 화, 3: 수, 4: 목, 5: 금, 6: 토
    days: [
      {
        dayIndex: 0,
        dayName: '일요일',
        theme: '완전 휴식 (영양 & 스트레칭)',
        actionType: 'REST',
        desc: '스트레칭 및 영양 섭취 집중. 다음 주 월요일의 어깨 볼륨 타겟 운동을 위해 관절과 근육을 완벽히 회복합니다.',
        exercises: [
          {
            name: '어깨 & 흉곽 폼롤러 스트레칭',
            sets: '15~20분',
            note: '가벼운 스트레칭 및 흉추 신전 이완',
            pixelArtKey: 'foam_roller',
            posture: '1. 준비: 폼롤러를 날개뼈 부근에 가로로 받치고 누워 양손으로 머리를 지지합니다.\n2. 동작: 위아래로 천천히 굴리며 굳어있는 흉추와 어깨 주변 근막을 풀어줍니다.\n3. 호흡: 내쉬며 가슴을 뒤로 활짝 젖혀 흉추 가동성을 확보합니다.',
            warning: '⚠️ 허리 아래쪽(요추)까지 내려가지 않고 날개뼈 부위만 부드럽게 이완하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=폼롤러+흉추+어깨+스트레칭'
          },
          {
            name: '수분 & 양질의 단백질 섭취',
            sets: '충분한 수면 (7~8h)',
            note: '근육 초회복 및 관절 재생 집중',
            pixelArtKey: 'rest_shake',
            posture: '1. 체중 1kg당 1.6~2.0g 수준의 단백질과 충분한 수분(2L 이상)을 공급합니다.\n2. 7~8시간의 깊은 수면을 취하여 손상된 어깨/등 근육의 초회복을 이끌어냅니다.\n3. 월요일 15kg 프레스의 폭발적 파워는 일요일의 완벽한 휴식에서 나옵니다.',
            warning: '⚠️ 근육은 운동할 때 찢어지고 쉴 때 커집니다. 과도한 활동을 피하고 푹 쉬어주세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=근성장+휴식과+수면+영양'
          }
        ]
      },
      {
        dayIndex: 1,
        dayName: '월요일',
        theme: '어깨 볼륨 타겟 (밀기 - Push)',
        actionType: 'PUSH',
        desc: '어깨 볼륨과 전/측면 프레임을 키우는 메인 운동의 날입니다.',
        exercises: [
          {
            name: '덤벨 숄더 프레스 (앉아서)',
            sets: '8~12회 × 4세트',
            note: '15kg 덤벨로 밀어 올리기 (내릴 때 3~4초 네거티브 버티기)',
            pixelArtKey: 'dumbbell_press',
            posture: '1. 준비: 허리를 곧게 펴고 의자에 앉아 15kg 덤벨을 어깨선에 위치시킵니다.\n2. 동작: 팔꿈치 각도 75도를 유지하며 머리 위로 수직으로 곧게 밀어 올립니다.\n3. 네거티브: 내릴 때 어깨 근육에 무게를 온전히 실어 3~4초간 천천히 버티며 내립니다.',
            warning: '⚠️ 허리가 아치형으로 과도하게 꺾이지 않도록 복압을 단단히 잡으세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=앉아서+덤벨+숄더+프레스+자세'
          },
          {
            name: '파이크 푸시업 (맨몸)',
            sets: '실패 지점까지 × 4세트',
            note: '엉덩이를 높이 들고 하는 어깨 전/측면 타겟 푸시업',
            pixelArtKey: 'pike_pushup',
            posture: '1. 준비: 엎드려 엉덩이를 천장 쪽으로 높이 치켜들어 역V자(ㅅ자)를 만듭니다.\n2. 동작: 시선은 발끝을 보며, 정수리가 손가락 앞쪽 바닥을 향하도록 대각선으로 내려갑니다.\n3. 밀기: 손바닥 전체로 바닥을 강하게 밀어 어깨 힘으로 원래 역V자로 복귀합니다.',
            warning: '⚠️ 팔꿈치가 양옆으로 벌어지지 않도록 몸통 쪽으로 살짝 모아 회전근개를 보호하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=파이크+푸시업+정석+자세'
          },
          {
            name: '일반 푸시업 (맨몸)',
            sets: '실패 지점까지 × 3세트',
            note: '흉곽을 넓혀주는 기본 가슴/어깨 피니셔 운동',
            pixelArtKey: 'pushup',
            posture: '1. 준비: 어깨너비보다 살짝 넓게 손을 짚고 머리부터 발끝까지 일직선을 유지합니다.\n2. 동작: 가슴이 바닥에 닿기 직전까지 깊게 내려가 흉곽을 최대로 열어줍니다.\n3. 밀기: 가슴과 전면 삼각근을 쥐어짜며 폭발적으로 밀어 올립니다.',
            warning: '⚠️ 골반이 처지거나 허리가 꺾이지 않도록 코어와 둔근을 단단히 수축하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=푸시업+정석+자세'
          }
        ]
      },
      {
        dayIndex: 2,
        dayName: '화요일',
        theme: '등 프레임 타겟 (당기기 - Pull)',
        actionType: 'PULL',
        desc: '어깨를 등 뒤에서 잡아당겨 라운드숄더를 펴고 등을 넓어 보이게 만듭니다.',
        exercises: [
          {
            name: '원암 덤벨 로우',
            sets: '10~15회 × 양쪽 4세트',
            note: '한 손씩 15kg 덤벨을 골반(주머니) 쪽으로 당기기',
            pixelArtKey: 'one_arm_row',
            posture: '1. 준비: 한 손과 무릎을 지지대에 얹고 허리를 곧게 편 후 반대 손으로 15kg 덤벨을 쥡니다.\n2. 동작: 덤벨을 수직이 아닌 골반 쪽으로 완만한 포물선을 그리며 당깁니다.\n3. 자극: 팔꿈치로 천장을 찌른다는 느낌으로 광배근을 쥐어짜고 2초간 천천히 내립니다.',
            warning: '⚠️ 팔 힘으로 잡아당기거나 몸통이 회전하지 않도록 척추 정렬을 고정하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=원암+덤벨+로우+자세'
          },
          {
            name: '덤벨 풀오버 (벤치 또는 바닥)',
            sets: '10~12회 × 3세트',
            note: '가슴과 등 상부 흉곽을 물리적으로 확장하는 운동',
            pixelArtKey: 'pullover',
            posture: '1. 준비: 누워서 15kg 덤벨 머리를 두 손 다이아몬드 그립으로 받쳐 듭니다.\n2. 동작: 팔꿈치를 살짝 굽힌 각도를 유지하며 머리 뒤쪽으로 덤벨을 깊게 넘깁니다.\n3. 신전: 흉곽과 광배근이 최대로 늘어난 것을 느끼고 등 상부 힘으로 가슴 위로 끌어옵니다.',
            warning: '⚠️ 어깨 유연성에 맞게 가동 범위를 설정하고, 허리가 과도하게 들리지 않게 복압을 유지하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=덤벨+풀오버+자세'
          }
        ]
      },
      {
        dayIndex: 3,
        dayName: '수요일',
        theme: '하체 및 상체 완전 휴식',
        actionType: 'REST/LEGS',
        desc: '상체 운동을 쉬어줍니다. 월/화요일에 찢어진 어깨와 등 근육이 이때 단백질을 흡수하며 실제로 커집니다.',
        exercises: [
          {
            name: '하체 맨몸 스쿼트',
            sets: '15~20회 × 4세트',
            note: '하체 혈류 순환 및 테스토스테론 분비 촉진',
            pixelArtKey: 'squat',
            posture: '1. 준비: 발을 어깨너비로 벌리고 발끝을 15도 바깥으로 엽니다.\n2. 동작: 무릎이 발끝 방향을 향하며 대퇴부가 지면과 수평이 될 때까지 깊게 앉습니다.\n3. 밀기: 발바닥 전체로 지면을 강하게 밀며 일어나 둔근을 수축합니다.',
            warning: '⚠️ 무릎이 안쪽으로 말리지 않도록 바깥으로 밀어내며 내려가세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=맨몸+스쿼트+정석+자세'
          },
          {
            name: '가벼운 유산소 & 스트레칭',
            sets: '20분 내외',
            note: '상체는 완전 휴식 (젖산 배출 및 림프 순환)',
            pixelArtKey: 'rest_shake',
            posture: '1. 가벼운 제자리 걷기 또는 가벼운 러닝으로 체온을 올립니다.\n2. 폼롤러와 밴드로 고관절과 흉추를 부드럽게 이완합니다.\n3. 상체 근육은 전혀 쓰지 않고 온전히 쉬어줍니다.',
            warning: '⚠️ 무리한 고강도 인터벌은 피하고 회복성 유산소로만 끝마치세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=회복+스트레칭+루틴'
          }
        ]
      },
      {
        dayIndex: 4,
        dayName: '목요일',
        theme: '어깨 측/후면 & 입체감 타겟',
        actionType: '3D DELT',
        desc: '측면과 후면을 정밀 타격하여 둥글고 입체적인 3D 어깨 프레임을 완성합니다.',
        exercises: [
          {
            name: '덤벨 업라이트 로우',
            sets: '10~12회 × 4세트',
            note: '15kg 덤벨을 양손으로 쥐고 명치~쇄골까지 끌어올려 측면 타격',
            pixelArtKey: 'upright_row',
            posture: '1. 준비: 15kg 덤벨을 양손으로 단단히 쥐고 허벅지 앞에 둡니다.\n2. 동작: 팔꿈치가 덤벨보다 항상 위쪽에 위치하도록 유도하며 명치에서 쇄골 바로 아래까지 끌어올립니다.\n3. 수축: 측면 삼각근에 강한 텐션을 느끼며 2~3초간 천천히 통제하며 내립니다.',
            warning: '⚠️ 턱 끝까지 너무 높이 들면 어깨 충돌이 올 수 있으니 쇄골 높이까지만 올리세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=덤벨+업라이트+로우+자세'
          },
          {
            name: '벤트오버 덤벨 로우 (후면 어깨 타겟)',
            sets: '12회 × 4세트',
            note: '상체를 숙이고 팔꿈치를 바깥으로 벌려서 당기기',
            pixelArtKey: 'bent_over_row',
            posture: '1. 준비: 상체를 45~60도 각도로 숙여 척추를 평평하게 만듭니다.\n2. 동작: 팔꿈치를 몸통 옆에 붙이지 않고 바깥으로 70~80도 벌리며 어깨 뒤쪽으로 당깁니다.\n3. 자극: 날개뼈를 너무 모으지 않고 후면 삼각근으로만 당기는 감각에 집중합니다.',
            warning: '⚠️ 허리가 둥글게 말리지 않도록 햄스트링과 코어를 단단하게 고정하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=후면삼각근+벤트오버+덤벨로우'
          },
          {
            name: '힌두 푸시업 (배기기)',
            sets: '10회 × 3세트',
            note: '어깨 전체의 유연성과 협응력 강화',
            pixelArtKey: 'hindu_pushup',
            posture: '1. 준비: 파이크 푸시업(역V자) 자세에서 시작합니다.\n2. 동작: 코 끝으로 바닥을 쓸듯이 가슴을 낮추며 전진하여 코브라 자세로 상체를 들어 올립니다.\n3. 복귀: 엉덩이를 다시 뒤로 높이 들어 올려 원래의 역V자 자세로 돌아옵니다.',
            warning: '⚠️ 동작을 끊지 않고 부드러운 파도 타는 리듬으로 전신 협응력을 기르세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=힌두+푸시업+배기기+자세'
          }
        ]
      },
      {
        dayIndex: 5,
        dayName: '금요일',
        theme: '등 전체 볼륨 & 코어',
        actionType: 'BACK+CORE',
        desc: '등 전체의 입체적인 프레임을 완성하고 코어 지지력을 단련합니다.',
        exercises: [
          {
            name: '투암 덤벨 로우 (벤트오버)',
            sets: '8~10회 × 4세트',
            note: '양손에 15kg 덤벨을 들고 등 전체 수축 (총 30kg 고중량 허리 주의)',
            pixelArtKey: 'two_arm_row',
            posture: '1. 준비: 양손에 15kg 덤벨을 쥐고 엉덩이를 뒤로 빼며 상체를 깊게 숙입니다.\n2. 동작: 덤벨을 아랫배(배꼽) 쪽으로 당겨 광배근과 등 중앙부를 강력하게 수축합니다.\n3. 통제: 등의 긴장을 유지하며 천천히 무게를 버티며 원위치로 내립니다.',
            warning: '⚠️ 총 30kg 중량이므로 복압을 최대치로 채우고 허리가 절대 굽어지지 않게 하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=투암+덤벨+로우+자세'
          },
          {
            name: '덤벨 슈러그',
            sets: '15회 × 3세트',
            note: '승모근 및 어깨 관절 지지력 강화',
            pixelArtKey: 'shrug',
            posture: '1. 준비: 차렷 자세에서 양손에 덤벨을 들고 가슴을 활짝 폅니다.\n2. 동작: 팔꿈치를 편 채 어깨를 귀에 닿게 한다는 느낌으로 수직으로 번쩍 끌어올립니다.\n3. 정점: 최상단에서 1~2초간 승모근을 꽉 쥐어짜고 천천히 이완합니다.',
            warning: '⚠️ 어깨를 앞뒤로 돌리지 말고 순수하게 위아래 수직으로만 올려 관절을 보호하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=덤벨+슈러그+승모근+자세'
          },
          {
            name: '플랭크',
            sets: '1분 × 3세트',
            note: '몸통 프레임을 단단하게 잡아주는 코어',
            pixelArtKey: 'plank',
            posture: '1. 준비: 팔꿈치를 어깨 아래 바닥에 대고 엎드립니다.\n2. 버티기: 복부와 둔근에 힘을 꽉 주어 머리부터 발끝까지 수평 일직선을 유지합니다.\n3. 호흡: 턱을 당기고 규칙적으로 복식호흡하며 흔들림 없이 60초간 버팁니다.',
            warning: '⚠️ 허리가 아래로 꺾이거나 엉덩이가 솟지 않도록 배꼽을 등 쪽으로 바짝 당기세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=플랭크+정석+자세'
          }
        ]
      },
      {
        dayIndex: 6,
        dayName: '토요일',
        theme: '전신 상체 펌핑 (가볍게)',
        actionType: 'PUMP',
        desc: '다음 날 휴식을 위해 근육에 피를 모아주는 느낌으로만 짧고 굵게 끝냅니다.',
        exercises: [
          {
            name: '덤벨 숄더 프레스',
            sets: '8회 × 3세트',
            note: '가벼운 템포로 정확한 자극과 펌핑에 집중',
            pixelArtKey: 'dumbbell_press',
            posture: '1. 준비: 가슴을 열고 덤벨을 어깨선에 준비합니다.\n2. 동작: 무리한 고반복보다는 어깨 전면/측면 수축감에 집중하여 부드럽게 밀어 올립니다.\n3. 펌핑: 혈류가 어깨에 집중되는 타는 듯한 느낌(Burn)을 즐깁니다.',
            warning: '⚠️ 피로가 누적된 상태이므로 반동을 쓰지 않고 안전한 가동범위 내에서만 수행하세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=덤벨+숄더+프레스+자세'
          },
          {
            name: '파이크 푸시업',
            sets: '실패 지점까지 × 3세트',
            note: '남은 에너지를 모두 쏟아붓는 피니셔 푸시업',
            pixelArtKey: 'pike_pushup',
            posture: '1. 준비: 엉덩이를 높이 들고 역V자 자세를 잡습니다.\n2. 동작: 정수리를 바닥으로 내렸다가 어깨 힘으로 폭발적으로 밀어 올립니다.\n3. 마무리: 마지막 횟수에서는 2~3초간 버티며 한계점까지 밀어붙입니다.',
            warning: '⚠️ 실패 지점에서 얼굴이 바닥에 부딪히지 않도록 바닥에 푹신한 매트를 깔아두세요.',
            youtubeUrl: 'https://www.youtube.com/results?search_query=파이크+푸시업+피니셔'
          }
        ]
      }
    ],
    tips: [
      {
        title: '네거티브 (신장성 수축) 집중',
        desc: '올릴 때는 빠르게(1초), 내릴 때는 어깨 근육으로 15kg 무게를 버티며 아주 천천히(3~4초) 내립니다.'
      },
      {
        title: '휴식 시간 점진적 단축',
        desc: '세트 사이 휴식 시간을 1분에서 45초, 30초로 점차 줄여 대사 스트레스를 극대화합니다. (우측 타이머 활용!)'
      },
      {
        title: '선피로 훈련법 (Pre-Exhaustion)',
        desc: '15kg 덤벨 프레스 직전에 맨몸 파이크 푸시업으로 어깨 힘을 먼저 빼놓으면, 15kg이 마치 20kg처럼 느껴져 더 큰 자극을 줄 수 있습니다.'
      }
    ]
  };

  // ==========================================
  // 5. Default Routine Definitions & Initial Seed
  // ==========================================
  const DEFAULT_ROUTINES = [
    { id: 'r1', name: '6시 기상', icon: 'clock', target: 7 },
    { id: 'r2', name: '홈트', icon: 'house', target: 5 },
    { id: 'r3', name: '러닝', icon: 'run', target: 5 },
    { id: 'r4', name: '업무', icon: 'target', target: 6 },
    { id: 'r5', name: '식단', icon: 'apple', target: 7 },
    { id: 'r6', name: '금주', icon: 'beer', target: 1 }
  ];

  function generateSeedChecks() {
    const checks = {};
    const setCheck = (dKey, rId) => {
      if (!checks[dKey]) checks[dKey] = {};
      checks[dKey][rId] = true;
    };

    // Week 1 (Oct 1~7): 26 checks total matching the mock-up
    for (let day = 1; day <= 7; day++) {
      const dKey = formatDateKey(2026, 10, day);
      setCheck(dKey, 'r1'); // 6시 기상 7/7
      if (day <= 4) setCheck(dKey, 'r2'); // 홈트 4/7
      if (day <= 4) setCheck(dKey, 'r3'); // 러닝 4/7
      if (day <= 6) setCheck(dKey, 'r4'); // 업무 6/7
      if (day <= 4) setCheck(dKey, 'r5'); // 식단 4/7
      if (day === 1) setCheck(dKey, 'r6'); // 금주 1/7
    }

    // Week 2 (Oct 8~14): realistic checks leading up to today (Oct 10)
    setCheck(formatDateKey(2026, 10, 8), 'r1');
    setCheck(formatDateKey(2026, 10, 8), 'r2');
    setCheck(formatDateKey(2026, 10, 8), 'r3');
    setCheck(formatDateKey(2026, 10, 8), 'r4');

    setCheck(formatDateKey(2026, 10, 9), 'r1');
    setCheck(formatDateKey(2026, 10, 9), 'r3');
    setCheck(formatDateKey(2026, 10, 9), 'r4');

    setCheck(formatDateKey(2026, 10, 10), 'r1');
    setCheck(formatDateKey(2026, 10, 10), 'r4');

    return checks;
  }

  // ==========================================
  // 6. State & LocalStorage
  // ==========================================
  const STORAGE_KEY = 'GAMEBOY_ROUTINE_STATE_V2';

  let state = {
    viewYear: TODAY_Y,
    viewMonth: TODAY_M,
    viewWeekIndex: Math.min(getWeekCount(TODAY_Y, TODAY_M) - 1, getWeekIndexForDay(TODAY_D)),
    dailyHalf: TODAY_D > 15 ? 1 : 0,
    routines: JSON.parse(JSON.stringify(DEFAULT_ROUTINES)),
    checks: {},
    cursor: { row: 0, col: 0 },
    activeModal: null, // null | 'menu' | 'workout'
    menuIndex: 0,
    workoutSelectedDay: REAL_NOW.getDay() // 0(일) ~ 6(토)
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.routines && Array.isArray(parsed.routines)) {
          state.routines = parsed.routines;
        }
        if (parsed.checks && typeof parsed.checks === 'object') {
          state.checks = parsed.checks;
        }

        // Automatic migration: 5시 기상 -> 6시 기상
        if (state.routines) {
          state.routines.forEach(r => {
            if (r.id === 'r1' && r.name === '5시 기상') {
              r.name = '6시 기상';
            }
          });
        }
      } else {
        state.checks = generateSeedChecks();
        saveState();
      }
    } catch (e) {
      console.warn('State load error, falling back to seed:', e);
      state.checks = generateSeedChecks();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        routines: state.routines,
        checks: state.checks
      }));
    } catch (e) {
      console.warn('State save error:', e);
    }
  }

  // ==========================================
  // 7. DOM Elements
  // ==========================================
  const $screen = document.getElementById('screen');
  const $boot = document.getElementById('boot');
  const $monthLabel = document.getElementById('month-label');
  const $addrText = document.getElementById('addr-text');
  const $weekTabs = document.getElementById('week-tabs');
  const $checkGrid = document.getElementById('check-grid');
  const $donutCanvas = document.getElementById('donut-canvas');
  const $donutPct = document.getElementById('donut-pct');
  const $scoreTarget = document.getElementById('score-target');
  const $scoreActual = document.getElementById('score-actual');
  const $scoreLeft = document.getElementById('score-left');
  const $progressList = document.getElementById('progress-list');
  const $bars = document.getElementById('bars');
  const $halfLabel = document.getElementById('half-label');
  const $topList = document.getElementById('top-list');
  const $toast = document.getElementById('toast');
  const $modal = document.getElementById('modal');
  const $modalTitle = document.getElementById('modal-title');
  const $modalBody = document.getElementById('modal-body');
  const $btnSound = document.getElementById('btn-sound');
  const $analysisRange = document.getElementById('analysis-range');

  // ==========================================
  // 8. Toast Notification
  // ==========================================
  let toastTimer = null;
  function showToast(msg) {
    if (!$toast) return;
    $toast.textContent = msg;
    $toast.classList.remove('show');
    void $toast.offsetWidth;
    $toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      $toast.classList.remove('show');
    }, 1800);
  }

  // ==========================================
  // 9. Icon Resolution
  // ==========================================
  function resolveIconsInDOM() {
    document.querySelectorAll('.px-icon[data-icon]').forEach(el => {
      const name = el.getAttribute('data-icon');
      if (name === 'house' && el.closest('#btn-home')) {
        el.innerHTML = ICONS.house_nav;
      } else if (ICONS[name]) {
        el.innerHTML = ICONS[name];
      }
    });
  }

  // ==========================================
  // 10. Pixel Donut Chart (Canvas 44x44)
  // ==========================================
  function drawPixelDonut(percent) {
    if (!$donutCanvas) return;
    const ctx = $donutCanvas.getContext('2d');
    const w = $donutCanvas.width;
    const h = $donutCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const outerR = 20;
    const innerR = 12;

    const angle = (percent / 100) * (Math.PI * 2);
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + angle;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dx = x + 0.5 - cx;
        const dy = y + 0.5 - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist >= innerR && dist <= outerR) {
          let a = Math.atan2(dy, dx);
          if (a < startAngle) {
            a += Math.PI * 2;
          }

          if (a >= startAngle && a <= endAngle) {
            ctx.fillStyle = '#0f380f'; // Filled: Darkest green
            ctx.fillRect(x, y, 1, 1);
          } else {
            ctx.fillStyle = '#8bac0f'; // Unfilled: Light green
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }
  }

  // ==========================================
  // 11. Dynamic Week Tabs
  // ==========================================
  function renderWeekTabs() {
    if (!$weekTabs) return;
    const weekCount = getWeekCount(state.viewYear, state.viewMonth);
    const daysInMonth = getDaysInMonth(state.viewYear, state.viewMonth);

    if (state.viewWeekIndex >= weekCount) {
      state.viewWeekIndex = weekCount - 1;
    }

    let tabsHTML = '';
    for (let w = 0; w < weekCount; w++) {
      const isSelected = (w === state.viewWeekIndex);
      const startDay = w * 7 + 1;
      const endDay = Math.min(daysInMonth, (w + 1) * 7);
      tabsHTML += `
        <button class="px-btn week-tab ${isSelected ? 'active' : ''}" 
                data-week-idx="${w}" 
                role="tab"
                aria-selected="${isSelected}"
                title="${state.viewMonth + 1}월 ${startDay}일 ~ ${endDay}일">
          Week ${w + 1}
        </button>
      `;
    }

    $weekTabs.innerHTML = tabsHTML;

    $weekTabs.querySelectorAll('.week-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const idx = parseInt(tab.getAttribute('data-week-idx'), 10);
        if (state.viewWeekIndex !== idx) {
          state.viewWeekIndex = idx;
          playSound('tab');
          updateAll();
        }
      });
    });

    if ($analysisRange) {
      $analysisRange.textContent = `WEEK ${state.viewWeekIndex + 1}`;
    }
  }

  // ==========================================
  // 12. Dynamic Checklist Grid (Real-time dates)
  // ==========================================
  function getActiveWeekDates() {
    const daysInMonth = getDaysInMonth(state.viewYear, state.viewMonth);
    const colWeekdays = getMonthColWeekdays(state.viewYear, state.viewMonth);
    const dates = [];

    for (let col = 0; col < 7; col++) {
      const dayNum = state.viewWeekIndex * 7 + col + 1;
      if (dayNum <= daysInMonth) {
        const dateKey = formatDateKey(state.viewYear, state.viewMonth + 1, dayNum);
        dates.push({
          col,
          dayNum,
          dateKey,
          weekday: colWeekdays[col],
          isToday: (dateKey === TODAY_STR),
          valid: true
        });
      } else {
        dates.push({
          col,
          dayNum: null,
          dateKey: null,
          weekday: colWeekdays[col],
          isToday: false,
          valid: false
        });
      }
    }
    return dates;
  }

  function renderCheckGrid() {
    if (!$checkGrid) return;
    const weekDates = getActiveWeekDates();

    // Table Header
    let theadHTML = `<thead><tr><th class="corner">루틴</th>`;
    weekDates.forEach((d) => {
      const todayClass = d.isToday ? 'today' : '';
      if (d.valid) {
        theadHTML += `
          <th scope="col" class="${todayClass}">
            ${d.weekday}
            <small>${state.viewMonth + 1}/${d.dayNum}${d.isToday ? '★' : ''}</small>
          </th>
        `;
      } else {
        theadHTML += `<th scope="col" class="empty">${d.weekday}<small>--</small></th>`;
      }
    });
    theadHTML += `</tr></thead>`;

    // Table Body
    let tbodyHTML = `<tbody>`;
    state.routines.forEach((routine, rIdx) => {
      const isHomet = (routine.name === '홈트');
      tbodyHTML += `<tr>`;
      tbodyHTML += `
        <th scope="row">
          <button type="button" class="row-label-btn ${isHomet ? 'homet-link' : ''}" 
                  data-routine="${routine.id}" 
                  title="${isHomet ? '클릭: 어깨 프레임 확장 1주일 루틴 & 오늘 운동 보기' : ''}">
            <span class="px-icon" data-icon="${routine.icon}"></span>
            <span class="name">${routine.name}</span>
            ${isHomet ? '<span class="badge-tip">GUIDE ▶</span>' : ''}
          </button>
        </th>
      `;

      weekDates.forEach((d, cIdx) => {
        if (d.valid) {
          const isChecked = Boolean(state.checks[d.dateKey]?.[routine.id]);
          const isCursor = (state.cursor.row === rIdx && state.cursor.col === cIdx);
          const todayColClass = d.isToday ? 'today-col' : '';

          tbodyHTML += `
            <td class="${isCursor ? 'cursor' : ''} ${todayColClass}" data-row="${rIdx}" data-col="${cIdx}">
              <button type="button" class="cb ${isChecked ? 'on' : ''}" 
                      data-row="${rIdx}" 
                      data-col="${cIdx}" 
                      data-date="${d.dateKey}" 
                      data-routine="${routine.id}"
                      aria-label="${routine.name} ${state.viewMonth + 1}월 ${d.dayNum}일 (${d.weekday}) 체크">
                <span class="px-icon" data-icon="check"></span>
              </button>
            </td>
          `;
        } else {
          tbodyHTML += `<td class="disabled-day" aria-hidden="true"></td>`;
        }
      });
      tbodyHTML += `</tr>`;
    });
    tbodyHTML += `</tbody>`;

    $checkGrid.innerHTML = theadHTML + tbodyHTML;
    resolveIconsInDOM();

    // Checkbox click handler
    $checkGrid.querySelectorAll('.cb').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = parseInt(btn.getAttribute('data-row'), 10);
        const c = parseInt(btn.getAttribute('data-col'), 10);
        const dKey = btn.getAttribute('data-date');
        const rId = btn.getAttribute('data-routine');
        state.cursor.row = r;
        state.cursor.col = c;
        toggleCheck(rId, dKey, r, c);
      });
    });

    // Row label button click (Opens Workout Guide for 홈트)
    $checkGrid.querySelectorAll('.row-label-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const rId = btn.getAttribute('data-routine');
        if (rId === 'r2') {
          openWorkoutModal();
        }
      });
    });

    // Cell click to place cursor
    $checkGrid.querySelectorAll('td:not(.disabled-day)').forEach(td => {
      td.addEventListener('click', () => {
        const r = parseInt(td.getAttribute('data-row'), 10);
        const c = parseInt(td.getAttribute('data-col'), 10);
        if (!isNaN(r) && !isNaN(c)) {
          state.cursor.row = r;
          state.cursor.col = c;
          renderCursor();
        }
      });
    });
  }

  function renderCursor() {
    if (!$checkGrid) return;
    $checkGrid.querySelectorAll('td').forEach(td => {
      const r = parseInt(td.getAttribute('data-row'), 10);
      const c = parseInt(td.getAttribute('data-col'), 10);
      if (r === state.cursor.row && c === state.cursor.col) {
        td.classList.add('cursor');
      } else {
        td.classList.remove('cursor');
      }
    });
  }

  function toggleCheck(routineId, dateKey, row, col) {
    if (!state.checks[dateKey]) {
      state.checks[dateKey] = {};
    }
    const currentVal = Boolean(state.checks[dateKey][routineId]);
    const newVal = !currentVal;
    state.checks[dateKey][routineId] = newVal;

    if (newVal) {
      playSound('check');
    } else {
      playSound('uncheck');
    }

    saveState();
    updateAll();

    // Visual pop animation
    setTimeout(() => {
      const targetBtn = $checkGrid.querySelector(`.cb[data-row="${row}"][data-col="${col}"]`);
      if (targetBtn) {
        targetBtn.classList.remove('pop');
        void targetBtn.offsetWidth;
        targetBtn.classList.add('pop');
      }
    }, 10);
  }

  // ==========================================
  // 13. Analysis Panel (Scoreboard, Donut, Progress)
  // ==========================================
  function renderAnalysis() {
    const weekDates = getActiveWeekDates().filter(d => d.valid);

    let totalTarget = 0;
    let actualCount = 0;

    state.routines.forEach(routine => {
      totalTarget += routine.target || 7;
      weekDates.forEach(d => {
        if (state.checks[d.dateKey]?.[routine.id]) {
          actualCount++;
        }
      });
    });

    const displayTarget = totalTarget || 31;
    const displayActual = actualCount;
    const left = Math.max(0, displayTarget - displayActual);

    // Initial default seed matching Week 1 shows exact 72% donut
    let pct = (displayActual === 26 && displayTarget === 31)
      ? 72
      : Math.min(100, Math.round((displayActual / displayTarget) * 100));

    // Update scoreboard
    if ($scoreTarget) $scoreTarget.textContent = displayTarget;
    if ($scoreActual) $scoreActual.textContent = displayActual;
    if ($scoreLeft) $scoreLeft.textContent = left;
    if ($donutPct) $donutPct.textContent = pct;

    // Draw Donut
    drawPixelDonut(pct);

    // Progress list: "업무", "러닝", "식단", "홈트", "금주", "6시 기상"
    if ($progressList) {
      const preferredOrder = ['업무', '러닝', '식단', '홈트', '금주', '6시 기상'];
      const sortedRoutines = [...state.routines].sort((a, b) => {
        let ia = preferredOrder.indexOf(a.name);
        let ib = preferredOrder.indexOf(b.name);
        if (ia === -1) ia = 999;
        if (ib === -1) ib = 999;
        return ia - ib;
      });

      let html = '';
      sortedRoutines.forEach(r => {
        let done = 0;
        weekDates.forEach(d => {
          if (state.checks[d.dateKey]?.[r.id]) done++;
        });
        const total = r.target || 7;
        let p = Math.min(100, Math.round((done / total) * 100));
        const segCount = 20;
        const activeSegs = Math.round((p / 100) * segCount);

        let segsHTML = '';
        for (let i = 0; i < segCount; i++) {
          segsHTML += `<i class="${i < activeSegs ? 'on' : ''}"></i>`;
        }

        const isHomet = (r.id === 'r2');
        html += `
          <li class="progress-item ${isHomet ? 'clickable-homet' : ''}" 
              data-routine="${r.id}" 
              title="${isHomet ? '클릭: 어깨 프레임 확장 1주일 루틴 가이드 열기' : ''}">
            <span class="name">${r.name}${isHomet ? icon('bulb', 'px-icon-sm') : ''}</span>
            <div class="seg-bar ${p >= 100 ? 'done' : ''}">${segsHTML}</div>
            <span class="count">${done}/${total}</span>
          </li>
        `;
      });
      $progressList.innerHTML = html;

      // Click on 홈트 in progress list opens workout modal
      $progressList.querySelectorAll('.clickable-homet').forEach(item => {
        item.addEventListener('click', () => {
          openWorkoutModal();
        });
      });
    }
  }

  // ==========================================
  // 14. Daily Progress Bar Chart (Real-time Days)
  // ==========================================
  function renderDailyBars() {
    if (!$bars) return;
    const daysInMonth = getDaysInMonth(state.viewYear, state.viewMonth);
    const totalRoutines = state.routines.length || 6;

    // Half 0: 1~15, Half 1: 16~daysInMonth
    const startDay = state.dailyHalf === 0 ? 1 : 16;
    const endDay = state.dailyHalf === 0 ? Math.min(15, daysInMonth) : daysInMonth;

    if ($halfLabel) {
      $halfLabel.textContent = `${startDay}-${endDay}`;
    }

    $bars.innerHTML = '';

    for (let day = startDay; day <= endDay; day++) {
      const dateKey = formatDateKey(state.viewYear, state.viewMonth + 1, day);
      const isToday = (dateKey === TODAY_STR);

      let doneCount = 0;
      state.routines.forEach(r => {
        if (state.checks[dateKey]?.[r.id]) doneCount++;
      });

      const pct = Math.round((doneCount / totalRoutines) * 100);

      const col = document.createElement('button');
      col.className = 'bar-col';
      col.type = 'button';
      col.setAttribute('aria-label', `${state.viewMonth + 1}월 ${day}일 진행률 ${pct}% (${doneCount}/${totalRoutines} 완료)`);

      let barClass = 'bar';
      if (pct >= 80) barClass += '';
      else if (pct >= 50) barClass += ' mid';
      else barClass += ' low';

      col.innerHTML = `
        <div class="bar-slot">
          <div class="${barClass}" style="height: ${pct}%;"></div>
        </div>
        <div class="day ${isToday ? 'today-tag' : ''}">${day}${isToday ? '★' : ''}</div>
      `;

      col.addEventListener('click', () => {
        playSound('move');
        showToast(`${state.viewMonth + 1}월 ${day}일: ${doneCount}/${totalRoutines} 완료 (${pct}%)`);
        const targetWeek = getWeekIndexForDay(day);
        if (state.viewWeekIndex !== targetWeek) {
          state.viewWeekIndex = targetWeek;
          updateAll();
        }
      });

      $bars.appendChild(col);
    }
  }

  // ==========================================
  // 15. TOP 5 Routines (Monthly Real-Time Ranking)
  // ==========================================
  function renderTop5() {
    if (!$topList) return;
    const daysInMonth = getDaysInMonth(state.viewYear, state.viewMonth);

    const routineStats = state.routines.map(r => {
      let count = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const dKey = formatDateKey(state.viewYear, state.viewMonth + 1, day);
        if (state.checks[dKey]?.[r.id]) count++;
      }
      return {
        id: r.id,
        name: r.name,
        icon: r.icon,
        count
      };
    });

    routineStats.sort((a, b) => b.count - a.count);

    const top5 = routineStats.slice(0, 5);

    let html = '';
    top5.forEach((item, idx) => {
      const isFirst = (idx === 0);
      const isHomet = (item.id === 'r2');
      html += `
        <li class="top-item ${isHomet ? 'clickable-homet' : ''}" 
            data-routine="${item.id}" 
            title="${isHomet ? '어깨/등 루틴 가이드 열기' : ''}">
          <span class="rank">${idx + 1}</span>
          <span class="px-icon" data-icon="${item.icon}"></span>
          <span class="name">${item.name}${isHomet ? icon('bulb', 'px-icon-sm') : ''}</span>
          ${isFirst ? '<span class="px-icon" data-icon="trophy"></span>' : ''}
        </li>
      `;
    });

    $topList.innerHTML = html;
    resolveIconsInDOM();

    // Click on 홈트 in top 5 opens workout modal
    $topList.querySelectorAll('.clickable-homet').forEach(item => {
      item.addEventListener('click', () => {
        openWorkoutModal();
      });
    });
  }

  // ==========================================
  // 16. Workout Guide Modal (어깨 프레임 확장 루틴)
  // ==========================================
  function openWorkoutModal(initialDayIndex) {
    state.activeModal = 'workout';
    const realDayIdx = (new Date()).getDay(); // 0(일) ~ 6(토)
    state.workoutSelectedDay = (initialDayIndex !== undefined) ? initialDayIndex : realDayIdx;
    
    try { playSound('open_menu'); } catch(e) {}
    if ($modalTitle) $modalTitle.textContent = '어깨 프레임 확장 1주일 루틴';
    const modalEl = $modal ? $modal.querySelector('.modal') : null;
    if (modalEl) modalEl.classList.add('modal-workout');
    renderWorkoutModal();
    if ($modal) {
      $modal.removeAttribute('hidden');
      $modal.style.display = 'flex';
      const scrollEl = $modal.querySelector('.workout-modal-scroll');
      if (scrollEl) scrollEl.scrollTop = 0;
    }
  }

  // ==========================================
  // 16-A. Rest Timer Engine (세트 간 쉬는 타이밍 타이머)
  // ==========================================
  let restTimerSeconds = 60;
  let restTimerPreset = 60;
  let restTimerInterval = null;
  let restTimerRunning = false;

  function formatTimerDigits(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function updateRestTimerUI() {
    const screenEl = document.getElementById('rest-timer-screen');
    const digitsEl = document.getElementById('timer-digits');
    const labelEl = document.getElementById('timer-state-label');
    const toggleBtn = document.getElementById('btn-timer-toggle');

    if (!screenEl || !digitsEl) return;

    digitsEl.textContent = formatTimerDigits(restTimerSeconds);

    if (restTimerRunning) {
      screenEl.classList.add('running');
      screenEl.classList.remove('ended');
      if (labelEl) labelEl.textContent = 'RESTING...';
      if (toggleBtn) {
        toggleBtn.innerHTML = '■ PAUSE';
        toggleBtn.classList.add('running');
      }
    } else {
      screenEl.classList.remove('running');
      if (restTimerSeconds === 0) {
        screenEl.classList.add('ended');
        if (labelEl) labelEl.textContent = 'REST COMPLETE!';
      } else {
        screenEl.classList.remove('ended');
        if (labelEl) labelEl.textContent = 'READY (세트 후 시작)';
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = '▶ START';
        toggleBtn.classList.remove('running');
      }
    }

    // Update preset buttons active state
    document.querySelectorAll('.preset-btn').forEach(btn => {
      const s = parseInt(btn.getAttribute('data-sec'), 10);
      btn.classList.toggle('active', s === restTimerPreset);
    });
  }

  function startRestTimer() {
    if (restTimerInterval) clearInterval(restTimerInterval);
    if (restTimerSeconds <= 0) restTimerSeconds = restTimerPreset;
    restTimerRunning = true;
    playSound('click');
    updateRestTimerUI();

    restTimerInterval = setInterval(() => {
      if (restTimerSeconds > 0) {
        restTimerSeconds--;
        if (restTimerSeconds === 3 || restTimerSeconds === 2 || restTimerSeconds === 1) {
          playTone(520, 0.08, 'square');
        }
        updateRestTimerUI();
      }

      if (restTimerSeconds <= 0) {
        clearInterval(restTimerInterval);
        restTimerInterval = null;
        restTimerRunning = false;
        // 8-bit Victory fanfare!
        playTone(659, 0.1, 'square');
        setTimeout(() => playTone(880, 0.12, 'square'), 110);
        setTimeout(() => playTone(1174, 0.28, 'square'), 230);
        showToast('세트 휴식 종료! 다음 세트 시작!');
        updateRestTimerUI();
      }
    }, 1000);
  }

  function pauseRestTimer() {
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;
    }
    restTimerRunning = false;
    playSound('click');
    updateRestTimerUI();
  }

  function toggleRestTimer() {
    if (restTimerRunning) {
      pauseRestTimer();
    } else {
      startRestTimer();
    }
  }

  function resetRestTimer(newSec) {
    if (restTimerInterval) {
      clearInterval(restTimerInterval);
      restTimerInterval = null;
    }
    restTimerRunning = false;
    restTimerSeconds = (newSec !== undefined) ? newSec : restTimerPreset;
    playSound('click');
    updateRestTimerUI();
  }

  function setTimerPreset(sec) {
    restTimerPreset = sec;
    resetRestTimer(sec);
  }

  function adjustTimerSeconds(delta) {
    restTimerSeconds = Math.max(5, restTimerSeconds + delta);
    playSound('click');
    updateRestTimerUI();
  }

  // Keyboard shortcut listener for rest timer (Spacebar: Toggle, R: Reset)
  window.addEventListener('keydown', (e) => {
    if (state.activeModal === 'workout') {
      if (e.code === 'Space') {
        e.preventDefault();
        toggleRestTimer();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetRestTimer();
      }
    }
  });

  // ==========================================
  // 16-B. Main Dashboard Workout Progress Panel
  // ==========================================
  function renderWorkoutStatus() {
    const $container = document.getElementById('workout-status-content');
    if (!$container) return;

    const realDayIdx = (new Date()).getDay();
    const orderedDayIndices = [1, 2, 3, 4, 5, 6, 0]; // 월~일
    const todayKey = TODAY_STR;

    // Calculate this week's 홈트 (r2) checks
    const activeWeek = getActiveWeekDates();
    let weekHometDone = 0;
    activeWeek.forEach(d => {
      if (d.valid && d.dateKey && state.checks[d.dateKey]?.['r2']) {
        weekHometDone++;
      }
    });
    const hometTarget = 5;
    const weekPct = Math.min(100, Math.round((weekHometDone / hometTarget) * 100));

    // Calculate streak
    let streak = 0;
    let checkDate = new Date();
    let checkDateStr = formatDateKey(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
    if (!state.checks[checkDateStr]?.['r2']) {
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = formatDateKey(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
    }
    while (state.checks[checkDateStr]?.['r2']) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = formatDateKey(checkDate.getFullYear(), checkDate.getMonth() + 1, checkDate.getDate());
    }

    // Days grid HTML (Mon~Sun)
    let splitChipsHTML = `<div class="split-badges-row">`;
    orderedDayIndices.forEach(idx => {
      const d = WORKOUT_PLAN.days[idx];
      const isToday = (idx === realDayIdx);
      let isDayChecked = false;
      activeWeek.forEach(dItem => {
        if (dItem.valid && dItem.dayNum) {
          const dObj = new Date(state.viewYear, state.viewMonth, dItem.dayNum);
          if (dObj.getDay() === idx && state.checks[dItem.dateKey]?.['r2']) {
            isDayChecked = true;
          }
        }
      });

      splitChipsHTML += `
        <button type="button" class="split-day-chip ${isToday ? 'is-today' : ''} ${isDayChecked ? 'is-done' : ''}" data-day-idx="${idx}" title="${d.dayName}: ${d.theme} (클릭 시 가이드 열기)">
          <span class="chip-name">${d.dayName.slice(0, 1)}</span>
          <span class="chip-type">${d.actionType}</span>
          <span class="chip-check">${icon('check')}</span>
        </button>
      `;
    });
    splitChipsHTML += `</div>`;

    const todayPlan = WORKOUT_PLAN.days[realDayIdx];
    let todayExListHTML = '';
    todayPlan.exercises.forEach(ex => {
      todayExListHTML += `<li><span class="name">${ex.name}</span><span class="count">${ex.sets}</span></li>`;
    });

    // Segment bar (same component as ANALYSIS 진행률)
    const segCount = 20;
    const segOn = Math.round((weekPct / 100) * segCount);
    let segsHTML = '';
    for (let i = 0; i < segCount; i++) {
      segsHTML += `<i class="${i < segOn ? 'on' : ''}"></i>`;
    }
    const hometLeft = Math.max(0, hometTarget - weekHometDone);

    // Next 2 days preview
    let nextDaysHTML = '';
    ['내일', '모레'].forEach((label, i) => {
      const nd = WORKOUT_PLAN.days[(realDayIdx + i + 1) % 7];
      nextDaysHTML += `
        <li class="ws-next-item" data-day-idx="${(realDayIdx + i + 1) % 7}">
          <span class="name">${label} · ${nd.dayName.slice(0, 1)}  ${nd.theme}</span>
          <span class="count">${nd.actionType}</span>
        </li>`;
    });

    const html = `
      <div class="ws-col">
        <h3 class="ws-sub">
          <span class="ws-sub-text">${icon('calendar')}주간 분할 계획</span>
          <span class="panel-sub">15KG</span>
        </h3>
        ${splitChipsHTML}
        <div class="today-summary-box px-inset" id="today-summary-box" role="button" tabindex="0" title="클릭: 오늘의 추천 운동 자세 가이드 &amp; 타이머 열기">
          <div class="today-box-header">
            <span class="badge-today-target">${icon('dumbbell')}오늘 추천 · ${todayPlan.dayName}</span>
            <span class="panel-sub">${todayPlan.actionType}</span>
          </div>
          <div class="today-theme-name">${todayPlan.theme}</div>
          <ul class="today-ex-list">${todayExListHTML}</ul>
          <div class="today-click-hint">클릭 ▶ 자세 가이드 &amp; 휴식 타이머</div>
        </div>
      </div>

      <div class="ws-col">
        <h3 class="ws-sub">
          <span class="ws-sub-text">${icon('chart')}이번 주 홈트 달성도</span>
          <span class="panel-sub ws-streak">${icon('flame', 'px-icon-sm')}${streak > 0 ? `연속 ${streak}일` : 'STREAK 0'}</span>
        </h3>
        <div class="scoreboard px-inset">
          <div class="score"><span class="score-k">목표</span><span class="score-v">${hometTarget}</span></div>
          <div class="score"><span class="score-k">완료</span><span class="score-v">${weekHometDone}</span></div>
          <div class="score"><span class="score-k">남음</span><span class="score-v">${hometLeft}</span></div>
        </div>
        <div class="progress-item ws-progress">
          <span class="name">달성률</span>
          <div class="seg-bar ${weekPct >= 100 ? 'done' : ''}">${segsHTML}</div>
          <span class="count">${weekPct}%</span>
        </div>
        <ul class="today-ex-list ws-next-list">${nextDaysHTML}</ul>
        <button type="button" class="px-btn ws-open-btn" id="btn-status-open-guide">
          ${icon('timer')}<span>자세 가이드 &amp; 휴식 타이머 열기</span><span class="ws-arrow">▶</span>
        </button>
      </div>
    `;

    $container.innerHTML = html;

    // Attach listeners
    const workoutStatusTitle = document.getElementById('workout-status-title');
    if (workoutStatusTitle) {
      workoutStatusTitle.onclick = () => openWorkoutModal();
      workoutStatusTitle.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openWorkoutModal();
        }
      };
    }
    const todaySummaryBox = document.getElementById('today-summary-box');
    if (todaySummaryBox) {
      todaySummaryBox.onclick = () => openWorkoutModal(realDayIdx);
      todaySummaryBox.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openWorkoutModal(realDayIdx);
        }
      };
    }
    const openGuideHeaderBtn = document.getElementById('btn-open-workout-guide');
    if (openGuideHeaderBtn) {
      openGuideHeaderBtn.onclick = (e) => {
        e.stopPropagation();
        openWorkoutModal();
      };
    }
    const openGuideCardBtn = document.getElementById('btn-status-open-guide');
    if (openGuideCardBtn) {
      openGuideCardBtn.onclick = (e) => {
        e.stopPropagation();
        openWorkoutModal();
      };
    }
    $container.querySelectorAll('.split-day-chip, .ws-next-item').forEach(chip => {
      chip.addEventListener('click', () => {
        const dIdx = parseInt(chip.getAttribute('data-day-idx'), 10);
        openWorkoutModal(dIdx);
      });
    });
  }

  // ==========================================
  // 16-C. 2-Column Web Optimized Workout Modal
  // ==========================================
  function renderWorkoutModal() {
    const realDayIdx = (new Date()).getDay();
    const selIdx = state.workoutSelectedDay;
    const planDay = WORKOUT_PLAN.days[selIdx];
    const isViewingToday = (selIdx === realDayIdx);

    // Day tabs: 월(1), 화(2), 수(3), 목(4), 금(5), 토(6), 일(0) order
    const orderedDayIndices = [1, 2, 3, 4, 5, 6, 0];
    let tabsHTML = `<div class="workout-day-tabs">`;
    orderedDayIndices.forEach(idx => {
      const d = WORKOUT_PLAN.days[idx];
      const isActive = (idx === selIdx);
      const isToday = (idx === realDayIdx);
      tabsHTML += `
        <button type="button" class="px-btn workout-day-tab ${isActive ? 'active' : ''} ${isToday ? 'is-today-tab' : ''}" 
                data-day-idx="${idx}" title="${d.dayName}">
          ${d.dayName.slice(0, 1)}
        </button>
      `;
    });
    tabsHTML += `</div>`;

    // Exercise list HTML (with Pixel Art SVG & YouTube Video Link)
    let exHTML = `<ul class="workout-ex-list">`;
    planDay.exercises.forEach(ex => {
      const pixelSvg = PIXEL_ART_FIGURES[ex.pixelArtKey] || '';
      const formattedPosture = ex.posture ? ex.posture.replace(/\n/g, '<br>') : '';

      exHTML += `
        <li class="workout-ex-item">
          <div class="workout-ex-header">
            <span class="workout-ex-name">${ex.name}</span>
            <span class="workout-ex-sets">${ex.sets}</span>
          </div>
          <div class="workout-ex-content">
            <div class="pixel-figure-box" title="${ex.name} 8-Bit 픽셀아트">
              ${pixelSvg}
            </div>
            <div class="workout-ex-details">
              <div class="workout-posture-guide">
                <strong>[올바른 자세 가이드]</strong>
                ${formattedPosture}
              </div>
              ${ex.warning ? `<div class="workout-ex-warning">${icon('warn', 'px-icon-sm')}<span>${stripEmojiPrefix(ex.warning)}</span></div>` : ''}
            </div>
          </div>
          <div class="workout-ex-footer">
            <a href="${ex.youtubeUrl}" target="_blank" rel="noopener noreferrer" class="btn-youtube" title="${ex.name} 유튜브 영상 튜토리얼 열기">
              ${icon('video')}<span>유튜브 영상 가이드 보기 ↗</span>
            </a>
          </div>
        </li>
      `;
    });
    exHTML += `</ul>`;

    // Tips HTML
    let tipsHTML = `
      <div class="workout-tips-section">
        <div class="workout-tips-title">${icon('bulb')}15kg 덤벨 점진적 과부하 훈련 팁</div>
    `;
    WORKOUT_PLAN.tips.forEach(t => {
      tipsHTML += `
        <div class="workout-tip-item">
          <strong>• ${t.title}:</strong> ${t.desc}
        </div>
      `;
    });
    tipsHTML += `</div>`;

    // Today Check Status
    const isTodayChecked = Boolean(state.checks[TODAY_STR]?.['r2']);
    const checkBtnText = isTodayChecked 
      ? `${icon('check')}<span>오늘 홈트 완료됨 (다시 누르면 해제)</span>`
      : `${icon('bolt')}<span>오늘 홈트 완료 체크하기!</span>`;

    const html = `
      <div class="workout-modal-scroll">
        <!-- Top Banner -->
        <div class="workout-banner">
          <div class="banner-left">
            <div class="banner-title">
              <span class="px-icon" data-icon="house"></span>
              <span>어깨 프레임 확장 1주일 루틴 (15kg 덤벨)</span>
            </div>
            <div class="goal-text">${icon('target', 'px-icon-sm')}<span>목표: ${WORKOUT_PLAN.goal}</span></div>
          </div>
          <div class="banner-meta">
            <kbd>SPACE</kbd> 휴식 타이머 시작/정지
          </div>
        </div>

        <!-- Two Column Layout (Web Optimized) -->
        <div class="workout-two-col">
          <!-- Left Column: Daily Routine, Exercises, Pixel Art & YouTube -->
          <div class="col-left">
            ${tabsHTML}

            <div class="workout-detail-card">
              <div class="workout-theme-title">
                <span>${planDay.dayName}: ${planDay.theme}</span>
                <span class="badge-action">${isViewingToday ? '★ TODAY ' : ''}${planDay.actionType}</span>
              </div>
              <div class="workout-focus-desc">${planDay.desc}</div>
              ${exHTML}
            </div>
          </div>

          <!-- Right Column: Rest Timer, Overload Tips & Actions -->
          <div class="col-right">
            <!-- Rest Timer Box -->
            <div class="rest-timer-box">
              <div class="rest-timer-title">
                <span>${icon('timer')}세트 간 휴식 타이머</span>
                <span class="panel-sub">8-BIT</span>
              </div>
              <div class="rest-timer-screen" id="rest-timer-screen">
                <div class="timer-state-label" id="timer-state-label">READY (세트 후 시작)</div>
                <div class="timer-digits" id="timer-digits">${formatTimerDigits(restTimerSeconds)}</div>
              </div>

              <div class="timer-presets">
                <button type="button" class="preset-btn ${restTimerPreset === 30 ? 'active' : ''}" data-sec="30">30초</button>
                <button type="button" class="preset-btn ${restTimerPreset === 45 ? 'active' : ''}" data-sec="45">45초</button>
                <button type="button" class="preset-btn ${restTimerPreset === 60 ? 'active' : ''}" data-sec="60">60초</button>
                <button type="button" class="preset-btn ${restTimerPreset === 90 ? 'active' : ''}" data-sec="90">90초</button>
              </div>

              <div class="timer-control-row">
                <button type="button" class="timer-adjust-btn" id="btn-timer-minus" title="10초 빼기">-10s</button>
                <button type="button" class="btn-timer-toggle ${restTimerRunning ? 'running' : ''}" id="btn-timer-toggle">
                  ${restTimerRunning ? '■ PAUSE' : '▶ START'}
                </button>
                <button type="button" class="timer-adjust-btn" id="btn-timer-plus" title="10초 더하기">+10s</button>
                <button type="button" class="btn-timer-reset" id="btn-timer-reset" title="타이머 리셋">↺ RESET</button>
              </div>

              <div class="timer-keyboard-tip">
                <kbd>SPACE</kbd> 키로 타이머 시작/정지
              </div>
            </div>

            <!-- Overload Tips -->
            ${tipsHTML}

            <!-- Today Check & Close Buttons -->
            <div class="workout-actions">
              <button type="button" class="btn-workout-check" id="btn-workout-check-today">
                ${checkBtnText}
              </button>
              <button type="button" class="px-btn btn-workout-close" id="btn-workout-close">
                B: 닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    $modalBody.innerHTML = html;
    resolveIconsInDOM();
    updateRestTimerUI();

    // Day tabs click listeners
    $modalBody.querySelectorAll('.workout-day-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const dIdx = parseInt(btn.getAttribute('data-day-idx'), 10);
        state.workoutSelectedDay = dIdx;
        playSound('tab');
        renderWorkoutModal();
      });
    });

    // Preset buttons listeners
    $modalBody.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sec = parseInt(btn.getAttribute('data-sec'), 10);
        setTimerPreset(sec);
      });
    });

    // Timer control buttons
    const timerToggleBtn = document.getElementById('btn-timer-toggle');
    if (timerToggleBtn) {
      timerToggleBtn.addEventListener('click', toggleRestTimer);
    }
    const timerResetBtn = document.getElementById('btn-timer-reset');
    if (timerResetBtn) {
      timerResetBtn.addEventListener('click', () => resetRestTimer());
    }
    const timerMinusBtn = document.getElementById('btn-timer-minus');
    if (timerMinusBtn) {
      timerMinusBtn.addEventListener('click', () => adjustTimerSeconds(-10));
    }
    const timerPlusBtn = document.getElementById('btn-timer-plus');
    if (timerPlusBtn) {
      timerPlusBtn.addEventListener('click', () => adjustTimerSeconds(10));
    }

    // Check today button
    const checkTodayBtn = document.getElementById('btn-workout-check-today');
    if (checkTodayBtn) {
      checkTodayBtn.addEventListener('click', () => {
        if (!state.checks[TODAY_STR]) state.checks[TODAY_STR] = {};
        const current = Boolean(state.checks[TODAY_STR]['r2']);
        state.checks[TODAY_STR]['r2'] = !current;
        if (!current) {
          playSound('check');
          showToast('오늘의 홈트 완료! 어깨 프레임 +1');
        } else {
          playSound('uncheck');
          showToast('오늘의 홈트 체크가 해제되었습니다');
        }
        saveState();
        updateAll();
        renderWorkoutModal();
      });
    }

    // Close button
    const closeBtn = document.getElementById('btn-workout-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }
  }

  // ==========================================
  // 17. Modal & Menu Handlers (START Button)
  // ==========================================
  const MENU_OPTIONS = [
    { label: '홈트 어깨/등 루틴 & 당일 운동', action: 'workout_guide' },
    { label: '이번 주 전체 완료 (FILL THIS WEEK)', action: 'fill_week' },
    { label: '오늘 날짜로 이동 (GO TO TODAY)', action: 'go_today' },
    { label: '이번 주 초기화 (RESET THIS WEEK)', action: 'reset_week' },
    { label: '모든 데이터 초기화 (RESET ALL)', action: 'reset_all' },
    { label: '사운드 켜기/끄기 (SOUND ON/OFF)', action: 'toggle_sound' },
    { label: '메뉴 닫기 (CLOSE)', action: 'close' }
  ];

  function openMenu() {
    state.activeModal = 'menu';
    state.menuIndex = 0;
    try { playSound('open_menu'); } catch(e) {}
    if ($modalTitle) $modalTitle.textContent = 'MENU (START)';
    const modalEl = $modal ? $modal.querySelector('.modal') : null;
    if (modalEl) modalEl.classList.remove('modal-workout');
    renderMenu();
    if ($modal) {
      $modal.removeAttribute('hidden');
      $modal.style.display = 'flex';
    }
  }

  function closeMenu() {
    state.activeModal = null;
    if ($modal) {
      $modal.setAttribute('hidden', '');
      $modal.style.display = 'none';
      const modalEl = $modal.querySelector('.modal');
      if (modalEl) modalEl.classList.remove('modal-workout');
    }
    try { playSound('close_menu'); } catch(e) {}
  }

  function renderMenu() {
    let html = `<ul class="menu-list">`;
    MENU_OPTIONS.forEach((opt, idx) => {
      const isActive = (idx === state.menuIndex);
      html += `
        <li>
          <button type="button" class="menu-item ${isActive ? 'active' : ''}" data-idx="${idx}">
            ${opt.label}
          </button>
        </li>
      `;
    });
    html += `</ul>`;
    $modalBody.innerHTML = html;

    $modalBody.querySelectorAll('.menu-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        executeMenuAction(idx);
      });
    });
  }

  function executeMenuAction(idx) {
    const opt = MENU_OPTIONS[idx];
    if (!opt) return;

    if (opt.action === 'workout_guide') {
      openWorkoutModal();
    } else if (opt.action === 'fill_week') {
      const weekDates = getActiveWeekDates().filter(d => d.valid);
      weekDates.forEach(d => {
        if (!state.checks[d.dateKey]) state.checks[d.dateKey] = {};
        state.routines.forEach(r => {
          state.checks[d.dateKey][r.id] = true;
        });
      });
      saveState();
      updateAll();
      showToast('이번 주 루틴이 모두 완료되었습니다!');
      closeMenu();
    } else if (opt.action === 'go_today') {
      goToToday();
      closeMenu();
    } else if (opt.action === 'reset_week') {
      const weekDates = getActiveWeekDates().filter(d => d.valid);
      weekDates.forEach(d => {
        if (state.checks[d.dateKey]) {
          state.routines.forEach(r => {
            delete state.checks[d.dateKey][r.id];
          });
        }
      });
      saveState();
      updateAll();
      showToast('이번 주 루틴이 초기화되었습니다!');
      closeMenu();
    } else if (opt.action === 'reset_all') {
      state.checks = {};
      saveState();
      updateAll();
      showToast('모든 기록이 초기화되었습니다!');
      closeMenu();
    } else if (opt.action === 'toggle_sound') {
      toggleSound();
      renderMenu();
    } else if (opt.action === 'close') {
      closeMenu();
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    if ($btnSound) {
      $btnSound.textContent = soundEnabled ? '♪ ON' : '♪ OFF';
    }
    showToast(soundEnabled ? '사운드가 켜졌습니다 ♪' : '사운드가 꺼졌습니다');
    if (soundEnabled) playSound('check');
  }

  function goToToday() {
    state.viewYear = TODAY_Y;
    state.viewMonth = TODAY_M;
    state.viewWeekIndex = Math.min(getWeekCount(TODAY_Y, TODAY_M) - 1, getWeekIndexForDay(TODAY_D));
    state.dailyHalf = TODAY_D > 15 ? 1 : 0;
    playSound('boot');
    updateAll();
    showToast(`오늘 (${TODAY_M + 1}월 ${TODAY_D}일) 주차로 이동! 🏠`);
  }

  // ==========================================
  // 18. Keyboard & Physical Controller Mapping
  // ==========================================
  function handleNav(direction) {
    if (state.activeModal === 'menu') {
      if (direction === 'up') {
        state.menuIndex = (state.menuIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
        playSound('move');
        renderMenu();
      } else if (direction === 'down') {
        state.menuIndex = (state.menuIndex + 1) % MENU_OPTIONS.length;
        playSound('move');
        renderMenu();
      }
      return;
    }

    if (state.activeModal === 'workout') {
      // Left/Right switches workout day tabs
      const orderedDayIndices = [1, 2, 3, 4, 5, 6, 0];
      const curPos = orderedDayIndices.indexOf(state.workoutSelectedDay);
      if (direction === 'left') {
        const nextPos = (curPos - 1 + orderedDayIndices.length) % orderedDayIndices.length;
        state.workoutSelectedDay = orderedDayIndices[nextPos];
        playSound('tab');
        renderWorkoutModal();
      } else if (direction === 'right') {
        const nextPos = (curPos + 1) % orderedDayIndices.length;
        state.workoutSelectedDay = orderedDayIndices[nextPos];
        playSound('tab');
        renderWorkoutModal();
      }
      return;
    }

    const rowCount = state.routines.length;
    const colCount = 7;

    switch (direction) {
      case 'up':
        state.cursor.row = (state.cursor.row - 1 + rowCount) % rowCount;
        playSound('move');
        break;
      case 'down':
        state.cursor.row = (state.cursor.row + 1) % rowCount;
        playSound('move');
        break;
      case 'left':
        state.cursor.col = (state.cursor.col - 1 + colCount) % colCount;
        playSound('move');
        break;
      case 'right':
        state.cursor.col = (state.cursor.col + 1) % colCount;
        playSound('move');
        break;
    }
    renderCursor();
  }

  function handleButtonA() {
    if (state.activeModal === 'menu') {
      executeMenuAction(state.menuIndex);
      return;
    }
    if (state.activeModal === 'workout') {
      // Toggle today's workout check
      const checkBtn = document.getElementById('btn-workout-check-today');
      if (checkBtn) checkBtn.click();
      return;
    }

    const weekDates = getActiveWeekDates();
    const targetDate = weekDates[state.cursor.col];
    if (targetDate && targetDate.valid) {
      const routine = state.routines[state.cursor.row];
      if (routine) {
        toggleCheck(routine.id, targetDate.dateKey, state.cursor.row, state.cursor.col);
      }
    } else {
      playSound('error');
    }
  }

  function handleButtonB() {
    if (state.activeModal) {
      closeMenu();
      return;
    }
    const weekDates = getActiveWeekDates();
    const targetDate = weekDates[state.cursor.col];
    if (targetDate && targetDate.valid) {
      const routine = state.routines[state.cursor.row];
      if (routine && state.checks[targetDate.dateKey]?.[routine.id]) {
        state.checks[targetDate.dateKey][routine.id] = false;
        playSound('uncheck');
        saveState();
        updateAll();
      }
    }
  }

  function handleButtonSelect() {
    if (state.activeModal) return;
    const weekCount = getWeekCount(state.viewYear, state.viewMonth);
    state.viewWeekIndex = (state.viewWeekIndex + 1) % weekCount;
    playSound('tab');
    updateAll();
    showToast(`전환: Week ${state.viewWeekIndex + 1}`);
  }

  function handleButtonStart() {
    if (state.activeModal) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Window Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleNav('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleNav('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        handleNav('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        handleNav('right');
        break;
      case 'z':
      case 'Z':
        e.preventDefault();
        handleButtonA();
        animateButton('btn-a');
        break;
      case 'x':
      case 'X':
        e.preventDefault();
        handleButtonB();
        animateButton('btn-b');
        break;
      case 'Shift':
        e.preventDefault();
        handleButtonSelect();
        animateButton('btn-select');
        break;
      case 'Enter':
        e.preventDefault();
        handleButtonStart();
        animateButton('btn-start');
        break;
      case 'Escape':
        if (state.activeModal) {
          e.preventDefault();
          closeMenu();
        }
        break;
    }
  });

  function animateButton(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('pressed');
    setTimeout(() => el.classList.remove('pressed'), 120);
  }

  // D-Pad and Game Boy Button Listeners
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-key');
      if (k === 'ArrowUp') handleNav('up');
      if (k === 'ArrowDown') handleNav('down');
      if (k === 'ArrowLeft') handleNav('left');
      if (k === 'ArrowRight') handleNav('right');
    });
  });

  const btnA = document.getElementById('btn-a');
  if (btnA) btnA.addEventListener('click', handleButtonA);

  const btnB = document.getElementById('btn-b');
  if (btnB) btnB.addEventListener('click', handleButtonB);

  const btnSelect = document.getElementById('btn-select');
  if (btnSelect) btnSelect.addEventListener('click', handleButtonSelect);

  const btnStart = document.getElementById('btn-start');
  if (btnStart) btnStart.addEventListener('click', handleButtonStart);

  if ($btnSound) {
    $btnSound.addEventListener('click', toggleSound);
  }

  // Topbar Controls (Month Navigation, Home)
  const btnHome = document.getElementById('btn-home');
  if (btnHome) {
    btnHome.addEventListener('click', goToToday);
  }

  const btnPrevMonth = document.getElementById('btn-prev-month');
  if (btnPrevMonth) {
    btnPrevMonth.addEventListener('click', () => {
      state.viewMonth--;
      if (state.viewMonth < 0) {
        state.viewMonth = 11;
        state.viewYear--;
      }
      state.viewWeekIndex = 0;
      state.dailyHalf = 0;
      playSound('move');
      updateAll();
      showToast(`${state.viewYear}.${String(state.viewMonth + 1).padStart(2, '0')}`);
    });
  }

  const btnNextMonth = document.getElementById('btn-next-month');
  if (btnNextMonth) {
    btnNextMonth.addEventListener('click', () => {
      state.viewMonth++;
      if (state.viewMonth > 11) {
        state.viewMonth = 0;
        state.viewYear++;
      }
      state.viewWeekIndex = 0;
      state.dailyHalf = 0;
      playSound('move');
      updateAll();
      showToast(`${state.viewYear}.${String(state.viewMonth + 1).padStart(2, '0')}`);
    });
  }

  // Daily Half Pagers (1-15 <-> 16-31)
  const btnHalfPrev = document.getElementById('btn-half-prev');
  if (btnHalfPrev) {
    btnHalfPrev.addEventListener('click', () => {
      state.dailyHalf = 0;
      playSound('move');
      renderDailyBars();
    });
  }

  const btnHalfNext = document.getElementById('btn-half-next');
  if (btnHalfNext) {
    btnHalfNext.addEventListener('click', () => {
      state.dailyHalf = 1;
      playSound('move');
      renderDailyBars();
    });
  }

  // Battery API Integration
  if (navigator.getBattery) {
    navigator.getBattery().then(batt => {
      const battEl = document.getElementById('battery');
      function updateBatt() {
        if (!battEl) return;
        if (batt.level <= 0.2) battEl.classList.add('low');
        else battEl.classList.remove('low');
        if (batt.charging) battEl.classList.add('charging');
        else battEl.classList.remove('charging');
      }
      updateBatt();
      batt.addEventListener('levelchange', updateBatt);
      batt.addEventListener('chargingchange', updateBatt);
    }).catch(() => {});
  }

  // ==========================================
  // 19. Master UI Update
  // ==========================================
  function updateAll() {
    // Header labels
    if ($monthLabel) {
      $monthLabel.textContent = `${state.viewYear}.${String(state.viewMonth + 1).padStart(2, '0')}`;
    }
    if ($addrText) {
      $addrText.textContent = `ROUTINE-CALENDAR.WEB/${state.viewYear}/${state.viewMonth + 1}/W${state.viewWeekIndex + 1}`;
    }

    renderWeekTabs();
    renderCheckGrid();
    renderAnalysis();
    renderDailyBars();
    renderTop5();
    renderWorkoutStatus();
    resolveIconsInDOM();
  }

  // ==========================================
  // 20. Initialization on DOMContentLoaded
  // ==========================================
  window.addEventListener('DOMContentLoaded', () => {
    loadState();
    updateAll();

    // User gesture audio unlock
    const unlockSound = () => {
      initAudio();
      window.removeEventListener('click', unlockSound);
      window.removeEventListener('keydown', unlockSound);
    };
    window.addEventListener('click', unlockSound);
    window.addEventListener('keydown', unlockSound);

    // Boot Chiptune Sound
    setTimeout(() => {
      playSound('boot');
    }, 1400);

    // Boot Skip
    if ($boot) {
      $boot.addEventListener('click', () => {
        $boot.classList.add('skip');
        initAudio();
        playSound('boot');
      });
    }

    const workoutTitleEl = document.getElementById('workout-status-title');
    if (workoutTitleEl) {
      workoutTitleEl.addEventListener('click', () => openWorkoutModal());
    }

    // Backdrop click closes modal
    if ($modal) {
      $modal.addEventListener('click', (e) => {
        if (e.target === $modal) {
          closeMenu();
        }
      });
    }

    const openGuideHeaderBtn = document.getElementById('btn-open-workout-guide');
    if (openGuideHeaderBtn) {
      openGuideHeaderBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openWorkoutModal();
      });
    }

    // Direct hash access to workout modal
    if (window.location.hash === '#workout') {
      setTimeout(() => {
        if ($boot) $boot.classList.add('skip');
        openWorkoutModal();
      }, 300);
    }
  });

  // Expose methods to window for inline onclick handlers & debugging
  window.openWorkoutModal = openWorkoutModal;
  window.closeMenu = closeMenu;
  window.openMenu = openMenu;

})();
