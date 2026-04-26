(() => {
  "use strict";

  const CONFIG = {
    roundSeconds: 3.2,
    totalRounds: 8,
    feedbackDelayMs: 1250,
    leaderboardLimit: 5,
    storageKey: "safety-shaper-leaderboard-v1"
  };

  const SCENARIOS = [
    {
      type: "تشتيت الانتباه",
      title: "إشعار مفاجئ على الجوال",
      text: "أنت تقود بسرعة معتدلة، ظهر إشعار مهم على الشاشة والسيارة أمامك بدأت تهدئ.",
      riskIcon: "📱",
      choices: [
        { label: "أترك الجوال وأزيد الانتباه للطريق", hint: "القرار الأكثر أمانًا", score: 100, safe: true, feedback: "ممتاز. الإشعار ينتظر، لكن الطريق لا ينتظر." },
        { label: "أرد بسرعة وأنا ماسك المقود", hint: "ثانية واحدة قد تكلف كثيرًا", score: 15, feedback: "استخدام الجوال أثناء القيادة يرفع احتمالية الخطأ بشكل كبير." },
        { label: "أضغط فرامل فجأة وأقرأ الرسالة", hint: "قد تفاجئ من خلفك", score: 35, feedback: "الفرملة المفاجئة بدون سبب واضح قد تسبب تصادمًا خلفيًا." },
        { label: "أرفع السرعة لتجاوز السيارة", hint: "رد فعل متسرع", score: 10, feedback: "التجاوز بسبب التشتيت يزيد الخطر بدل ما يحله." }
      ]
    },
    {
      type: "ممر مشاة",
      title: "مشاة عند خط العبور",
      text: "تقترب من ممر مشاة، وهناك شخص يستعد للعبور من جهة الرصيف.",
      riskIcon: "🚶",
      choices: [
        { label: "أخفف السرعة وأتوقف بأمان", hint: "أولوية المشاة", score: 100, safe: true, feedback: "قرار صحيح. احترام ممر المشاة يحمي الجميع." },
        { label: "أستخدم البوري عشان ينتبه", hint: "تصرف مربك", score: 25, feedback: "التنبيه لا يغني عن التوقف وإعطاء الأولوية." },
        { label: "أعبر بسرعة قبل أن ينزل للطريق", hint: "خطر مباشر", score: 5, feedback: "محاولة العبور قبل المشاة قد تعرضه للخطر." },
        { label: "أغير المسار بدون تهدئة", hint: "الخطر يبقى موجودًا", score: 30, feedback: "تغيير المسار لا يكفي إذا كان الخطر أمامك." }
      ]
    },
    {
      type: "مسافة الأمان",
      title: "السيارة الأمامية توقفت فجأة",
      text: "السيارة أمامك فرملت بسرعة. لديك لحظات قليلة لاتخاذ القرار.",
      riskIcon: "⚠",
      choices: [
        { label: "أفرمل تدريجيًا وأحافظ على المسار", hint: "سيطرة وهدوء", score: 100, safe: true, feedback: "ممتاز. الهدوء ومسافة الأمان يعطيانك وقتًا للتصرف." },
        { label: "ألتف بقوة لليمين فورًا", hint: "قد تدخل على مركبة أخرى", score: 20, feedback: "الالتفاف المفاجئ قد يحول موقفًا واحدًا إلى حادث أكبر." },
        { label: "أضغط بوري وأقترب أكثر", hint: "يزيد الخطر", score: 0, feedback: "الاقتراب لا يحل المشكلة، بل يقلل وقت رد فعلك." },
        { label: "أسرّع لتجاوزها", hint: "قرار خطير", score: 5, feedback: "التجاوز في لحظة توقف مفاجئ قد يكون أخطر اختيار." }
      ]
    },
    {
      type: "إشارة مرورية",
      title: "الإشارة تحولت إلى الأصفر",
      text: "أنت بعيد نسبيًا عن التقاطع، والإشارة أصبحت صفراء قبل وصولك.",
      riskIcon: "🚦",
      choices: [
        { label: "أهدئ وأستعد للتوقف قبل التقاطع", hint: "قرار آمن", score: 100, safe: true, feedback: "صحيح. الأصفر يعني الاستعداد للتوقف عندما يكون ذلك آمنًا." },
        { label: "أزيد السرعة لألحق الإشارة", hint: "سباق غير ضروري", score: 10, feedback: "زيادة السرعة عند التقاطع ترفع احتمالية الاصطدام." },
        { label: "أدخل التقاطع وأنا متردد", hint: "التردد خطر", score: 25, feedback: "القرار المتردد في التقاطعات قد يربك الآخرين." },
        { label: "أغير المسار فجأة", hint: "لا يحل المشكلة", score: 15, feedback: "تغيير المسار فجأة قرب التقاطع تصرف غير آمن." }
      ]
    },
    {
      type: "منطقة مدارس",
      title: "لوحة منطقة مدارس أمامك",
      text: "الطريق هادئ، لكنك دخلت منطقة مدارس وقد يظهر أطفال أو حافلات في أي لحظة.",
      riskIcon: "🏫",
      choices: [
        { label: "أخفض السرعة وأراقب الجانبين", hint: "سلامة استباقية", score: 100, safe: true, feedback: "ممتاز. في مناطق المدارس، الخطر قد يظهر فجأة." },
        { label: "أستمر بنفس السرعة لأن الطريق فاضي", hint: "افتراض خطير", score: 25, feedback: "هدوء الطريق لا يعني خلوه من المخاطر." },
        { label: "أقترب من السيارة الأمامية لتسريع الحركة", hint: "يلغي مسافة الأمان", score: 10, feedback: "الاقتراب في مناطق المدارس يقلل قدرتك على الاستجابة." },
        { label: "أركز على الخريطة بالجوال", hint: "تشتيت", score: 0, feedback: "الجوال في منطقة مدارس يضاعف الخطر." }
      ]
    },
    {
      type: "أجواء ممطرة",
      title: "الطريق مبلل والرؤية أقل",
      text: "بدأ المطر، الطريق صار زلقًا، والسيارات حولك تتحرك بحذر.",
      riskIcon: "🌧",
      choices: [
        { label: "أخفف السرعة وأزيد المسافة", hint: "أفضل تصرف", score: 100, safe: true, feedback: "قرار ممتاز. الطريق المبلل يحتاج مسافة توقف أطول." },
        { label: "أستخدم الأنوار العالية طوال الوقت", hint: "قد تزعج الآخرين", score: 35, feedback: "الأفضل استخدام إضاءة مناسبة دون إبهار السائقين." },
        { label: "أحافظ على نفس السرعة لأن السيارة ثابتة", hint: "ثبات مؤقت لا يكفي", score: 20, feedback: "الانزلاق قد يحدث فجأة حتى لو بدا الطريق مستقرًا." },
        { label: "أفرمل بقوة عند كل منعطف", hint: "يزيد الانزلاق", score: 10, feedback: "الفرملة القوية على الطريق المبلل قد تفقدك السيطرة." }
      ]
    },
    {
      type: "مركبة طوارئ",
      title: "تسمع صوت إسعاف خلفك",
      text: "سيارة إسعاف تقترب من الخلف وتحتاج إلى مسار آمن للمرور.",
      riskIcon: "🚑",
      choices: [
        { label: "أفسح الطريق بهدوء عندما يكون ذلك آمنًا", hint: "قرار مسؤول", score: 100, safe: true, feedback: "ممتاز. إفساح الطريق للطوارئ قد ينقذ حياة." },
        { label: "أتوقف فجأة في منتصف المسار", hint: "خطر على الجميع", score: 15, feedback: "التوقف المفاجئ قد يربك السائقين ويعطل مركبة الطوارئ." },
        { label: "أسرّع أمام الإسعاف", hint: "تصرف خاطئ", score: 0, feedback: "السباق أمام مركبة طوارئ يعيقها ولا يساعدها." },
        { label: "أغير مساري بدون النظر للمرايا", hint: "خطر جانبي", score: 20, feedback: "إفساح الطريق لازم يكون بعد التأكد من المسار." }
      ]
    },
    {
      type: "دراجة وسكوتر",
      title: "سكوتر قريب من طرف الطريق",
      text: "ترى مستخدم سكوتر على يمين الطريق، ومساره غير ثابت بسبب عائق أمامه.",
      riskIcon: "🛴",
      choices: [
        { label: "أخفف وأترك مسافة جانبية كافية", hint: "مساحة أمان", score: 100, safe: true, feedback: "قرار ممتاز. مستخدمو السكوتر والدراجات يحتاجون مساحة آمنة." },
        { label: "أتجاوز بالقرب منه بسرعة", hint: "خطر الاحتكاك", score: 5, feedback: "التجاوز القريب قد يسبب سقوطًا أو ارتباكًا." },
        { label: "أستخدم البوري باستمرار", hint: "يربكه", score: 20, feedback: "التنبيه المبالغ فيه قد يربك مستخدم الطريق." },
        { label: "أتجاهله لأنه على الطرف", hint: "الخطر قد يتحرك", score: 25, feedback: "الوجود على طرف الطريق لا يعني أن المسار ثابت." }
      ]
    },
    {
      type: "مخرج مفاجئ",
      title: "اقتربت من المخرج متأخرًا",
      text: "اكتشفت أن المخرج قريب جدًا، وتحتاج تغيير مسارين للوصول له.",
      riskIcon: "↗",
      choices: [
        { label: "أكمل للطريق التالي بدل المخاطرة", hint: "قرار ناضج", score: 100, safe: true, feedback: "ممتاز. تفويت مخرج أفضل من حادث." },
        { label: "أقطع المسارات بسرعة", hint: "خطر كبير", score: 0, feedback: "قطع المسارات في آخر لحظة من أخطر السلوكيات." },
        { label: "أتوقف قرب المخرج", hint: "يعطل الطريق", score: 10, feedback: "التوقف المفاجئ قرب المخارج يسبب خطرًا على المركبات خلفك." },
        { label: "أشغل الإشارة وأدخل مباشرة", hint: "الإشارة لا تكفي", score: 30, feedback: "الإشارة مهمة، لكنها لا تعطيك حق الدخول إذا لم يكن المسار آمنًا." }
      ]
    },
    {
      type: "حزام الأمان",
      title: "راكب خلفي بدون حزام",
      text: "قبل التحرك، لاحظت أن أحد الركاب في الخلف لم يربط حزام الأمان.",
      riskIcon: "🔒",
      choices: [
        { label: "لا أتحرك حتى يربط الجميع الحزام", hint: "سلامة قبل الحركة", score: 100, safe: true, feedback: "صحيح. السلامة تبدأ قبل تشغيل السيارة." },
        { label: "أتحرك ببطء وأطلب منه يربطه لاحقًا", hint: "خطر قائم", score: 35, feedback: "حتى السرعات البطيئة قد تكون خطرة بدون حزام." },
        { label: "أتجاهل الموضوع لأنه راكب خلفي", hint: "معلومة خاطئة", score: 0, feedback: "الراكب الخلفي غير المربوط قد يتعرض للخطر ويؤذي الآخرين." },
        { label: "أفتح النوافذ عشان ينتبه", hint: "لا علاقة له", score: 10, feedback: "الإجراء الصحيح هو ربط الحزام، لا إجراءات جانبية." }
      ]
    }
  ];

  const state = {
    scenarios: [],
    currentIndex: 0,
    score: 0,
    correct: 0,
    answered: false,
    timerId: null,
    roundStartedAt: 0,
    fastestDecision: null,
    playerName: "ضيف البوث"
  };

  const $ = (selector) => document.querySelector(selector);

  const screens = {
    start: $("#startScreen"),
    how: $("#howScreen"),
    game: $("#gameScreen"),
    result: $("#resultScreen")
  };

  const els = {
    playerName: $("#playerName"),
    startBtn: $("#startBtn"),
    howBtn: $("#howBtn"),
    closeHowBtn: $("#closeHowBtn"),
    startFromHowBtn: $("#startFromHowBtn"),
    activePlayer: $("#activePlayer"),
    scoreText: $("#scoreText"),
    roundText: $("#roundText"),
    totalRoundsText: $("#totalRoundsText"),
    safetyPercent: $("#safetyPercent"),
    safetyFill: $("#safetyFill"),
    timeLeft: $("#timeLeft"),
    timerProgress: $("#timerProgress"),
    scenarioType: $("#scenarioType"),
    scenarioTitle: $("#scenarioTitle"),
    scenarioText: $("#scenarioText"),
    choiceGrid: $("#choiceGrid"),
    feedbackCard: $("#feedbackCard"),
    feedbackTitle: $("#feedbackTitle"),
    feedbackText: $("#feedbackText"),
    dynamicRisk: $("#dynamicRisk"),
    finalPercent: $("#finalPercent"),
    resultTitle: $("#resultTitle"),
    resultMessage: $("#resultMessage"),
    correctCount: $("#correctCount"),
    fastestDecision: $("#fastestDecision"),
    rankText: $("#rankText"),
    playAgainBtn: $("#playAgainBtn"),
    copyResultBtn: $("#copyResultBtn"),
    clearBoardBtn: $("#clearBoardBtn"),
    leaderboardList: $("#leaderboardList")
  };

  function showScreen(name) {
    Object.values(screens).forEach((screen) => screen.classList.remove("active"));
    screens[name].classList.add("active");

    document.body.classList.toggle("is-game", name === "game");
    document.body.classList.toggle("is-result", name === "result");

    // Keep booth devices stable: no old scroll position, no side drifting.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function shuffle(items) {
    return [...items].sort(() => Math.random() - 0.5);
  }

  function sanitizeName(name) {
    const cleaned = name.trim().replace(/\s+/g, " ");
    return cleaned.length ? cleaned : "ضيف البوث";
  }

  function startGame() {
    state.playerName = sanitizeName(els.playerName.value);
    state.scenarios = shuffle(SCENARIOS).slice(0, CONFIG.totalRounds);
    state.currentIndex = 0;
    state.score = 0;
    state.correct = 0;
    state.answered = false;
    state.fastestDecision = null;

    els.activePlayer.textContent = state.playerName;
    els.totalRoundsText.textContent = String(CONFIG.totalRounds);
    updateScoreUI();

    showScreen("game");
    renderScenario();
  }

  function renderScenario() {
    clearTimer();
    state.answered = false;

    const scenario = state.scenarios[state.currentIndex];
    els.roundText.textContent = String(state.currentIndex + 1);
    els.scenarioType.textContent = scenario.type;
    els.scenarioTitle.textContent = scenario.title;
    els.scenarioText.textContent = scenario.text;
    els.dynamicRisk.textContent = scenario.riskIcon || "!";
    els.feedbackCard.classList.remove("show");
    els.feedbackTitle.textContent = "";
    els.feedbackText.textContent = "";

    els.choiceGrid.innerHTML = "";
    shuffle(scenario.choices).forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice-btn";
      button.type = "button";
      button.innerHTML = `<strong>${choice.label}</strong><span>${choice.hint}</span>`;
      button.addEventListener("click", () => handleChoice(choice, button));
      els.choiceGrid.appendChild(button);
    });

    state.roundStartedAt = performance.now();
    startTimer();
  }

  function startTimer() {
    const durationMs = CONFIG.roundSeconds * 1000;
    const circumference = 326.73;
    const startedAt = performance.now();

    els.timerProgress.style.strokeDashoffset = "0";
    els.timerProgress.style.stroke = "var(--cyan)";
    els.timeLeft.textContent = CONFIG.roundSeconds.toFixed(1);

    state.timerId = window.setInterval(() => {
      if (state.answered) return;

      const elapsed = performance.now() - startedAt;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const remainingSeconds = remainingMs / 1000;
      const ratio = remainingMs / durationMs;
      const offset = circumference * (1 - ratio);

      els.timeLeft.textContent = remainingSeconds.toFixed(1);
      els.timerProgress.style.strokeDashoffset = String(offset);

      if (remainingSeconds <= 1.1) {
        els.timerProgress.style.stroke = "var(--amber)";
      }

      if (remainingMs <= 0) {
        handleTimeout();
      }
    }, 70);
  }

  function clearTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function handleChoice(choice, clickedButton) {
    if (state.answered) return;

    state.answered = true;
    clearTimer();

    const decisionTime = (performance.now() - state.roundStartedAt) / 1000;
    state.fastestDecision =
      state.fastestDecision === null ? decisionTime : Math.min(state.fastestDecision, decisionTime);

    const timeBonus = Math.max(0, Math.round((CONFIG.roundSeconds - decisionTime) * 8));
    const earned = Math.min(115, Math.round(choice.score + (choice.safe ? timeBonus : 0)));

    state.score += earned;

    if (choice.safe) {
      state.correct += 1;
      clickedButton.classList.add("correct");
      showFeedback("قرار ممتاز", choice.feedback);
    } else {
      clickedButton.classList.add("wrong");
      markCorrectChoice();
      showFeedback("قرار يحتاج مراجعة", choice.feedback);
    }

    disableChoices();
    updateScoreUI();

    window.setTimeout(nextRound, CONFIG.feedbackDelayMs);
  }

  function handleTimeout() {
    if (state.answered) return;

    state.answered = true;
    clearTimer();
    markCorrectChoice();
    showFeedback("انتهى الوقت", "في الطريق، التأخر في القرار قد يكون قرارًا بحد ذاته. الأفضل توقع الخطر مبكرًا.");
    disableChoices();

    window.setTimeout(nextRound, CONFIG.feedbackDelayMs);
  }

  function markCorrectChoice() {
    const scenario = state.scenarios[state.currentIndex];
    const buttons = [...els.choiceGrid.querySelectorAll(".choice-btn")];

    buttons.forEach((button) => {
      const strong = button.querySelector("strong");
      const correct = scenario.choices.find((choice) => choice.safe);
      if (correct && strong && strong.textContent === correct.label) {
        button.classList.add("correct");
      }
    });
  }

  function disableChoices() {
    els.choiceGrid.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
  }

  function showFeedback(title, text) {
    els.feedbackTitle.textContent = title;
    els.feedbackText.textContent = text;
    els.feedbackCard.classList.add("show");
  }

  function nextRound() {
    state.currentIndex += 1;
    if (state.currentIndex >= state.scenarios.length) {
      finishGame();
      return;
    }

    renderScenario();
  }

  function updateScoreUI() {
    const maxScore = CONFIG.totalRounds * 115;
    const percent = Math.max(0, Math.min(100, Math.round((state.score / maxScore) * 100)));

    els.scoreText.textContent = String(state.score);
    els.safetyPercent.textContent = `${percent}%`;
    els.safetyFill.style.width = `${percent}%`;
  }

  function finishGame() {
    const maxScore = CONFIG.totalRounds * 115;
    const percent = Math.max(0, Math.min(100, Math.round((state.score / maxScore) * 100)));
    const rank = getRank(percent);

    els.finalPercent.textContent = `${percent}%`;
    els.resultTitle.textContent = rank.title;
    els.resultMessage.textContent = rank.message;
    els.correctCount.textContent = `${state.correct}/${CONFIG.totalRounds}`;
    els.fastestDecision.textContent = state.fastestDecision === null ? "—" : `${state.fastestDecision.toFixed(1)}s`;
    els.rankText.textContent = rank.short;

    saveLeaderboard({
      name: state.playerName,
      percent,
      score: state.score,
      correct: state.correct,
      date: new Date().toISOString()
    });
    renderLeaderboard();

    showScreen("result");
  }

  function getRank(percent) {
    if (percent >= 90) {
      return {
        title: "أنت Safety Shaper محترف",
        short: "Elite Shaper",
        message: "قراراتك سريعة وواعية. هذا هو مستوى السلامة الذي تبنى عليه مدن المستقبل."
      };
    }

    if (percent >= 75) {
      return {
        title: "أنت Safety Shaper",
        short: "Safety Shaper",
        message: "أداؤك ممتاز. انتبه للتفاصيل الصغيرة، لأنها تصنع الفرق الكبير على الطريق."
      };
    }

    if (percent >= 55) {
      return {
        title: "قريب من مستوى Safety Shaper",
        short: "Rising Shaper",
        message: "لديك وعي جيد، لكن بعض القرارات تحتاج هدوءًا وتوقعًا أعلى للمخاطر."
      };
    }

    return {
      title: "تحتاج إعادة ضبط للغريزة المرورية",
      short: "Awareness Builder",
      message: "البداية الجيدة هي الوعي. جرّب مرة ثانية وركز على القرار الآمن قبل القرار السريع."
    };
  }

  function getLeaderboard() {
    try {
      const raw = window.localStorage.getItem(CONFIG.storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLeaderboard(entry) {
    const next = [...getLeaderboard(), entry]
      .sort((a, b) => b.percent - a.percent || b.score - a.score)
      .slice(0, CONFIG.leaderboardLimit);

    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(next));
    } catch {
      // If localStorage is blocked, the game still works.
    }
  }

  function renderLeaderboard() {
    const leaders = getLeaderboard();
    els.leaderboardList.innerHTML = "";

    if (!leaders.length) {
      const empty = document.createElement("li");
      empty.textContent = "لا توجد نتائج بعد.";
      els.leaderboardList.appendChild(empty);
      return;
    }

    leaders.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} — ${item.percent}% — ${item.correct}/${CONFIG.totalRounds}`;
      els.leaderboardList.appendChild(li);
    });
  }

  async function copyResult() {
    const text = `${state.playerName} حقق ${els.finalPercent.textContent} في تحدي Safety Shaper — قرار في ثانية.`;
    try {
      await navigator.clipboard.writeText(text);
      els.copyResultBtn.textContent = "تم النسخ";
      window.setTimeout(() => (els.copyResultBtn.textContent = "نسخ النتيجة"), 1200);
    } catch {
      els.copyResultBtn.textContent = "انسخها يدويًا";
      window.setTimeout(() => (els.copyResultBtn.textContent = "نسخ النتيجة"), 1200);
    }
  }

  function clearLeaderboard() {
    try {
      window.localStorage.removeItem(CONFIG.storageKey);
    } catch {
      // Ignore storage errors.
    }
    renderLeaderboard();
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {
        // Offline support is optional. The game remains fully usable online.
      });
    });
  }

  function bindEvents() {
    els.startBtn.addEventListener("click", startGame);
    els.startFromHowBtn.addEventListener("click", startGame);
    els.howBtn.addEventListener("click", () => showScreen("how"));
    els.closeHowBtn.addEventListener("click", () => showScreen("start"));
    els.playAgainBtn.addEventListener("click", () => showScreen("start"));
    els.copyResultBtn.addEventListener("click", copyResult);
    els.clearBoardBtn.addEventListener("click", clearLeaderboard);

    els.playerName.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        els.playerName.blur();
        startGame();
      }
    });
  }

  function init() {
    bindEvents();
    renderLeaderboard();
    registerServiceWorker();
  }

  init();
})();
