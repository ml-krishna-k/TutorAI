// Gamified Learning System for Class 5 Students
// MAIN APPLICATION LOGIC – with NO use of localStorage (sandbox safe)

class LearningSystem {
  constructor() {
    /* ----------------- CONFIG / DATA ----------------- */
    this.data = {
      mathActivities: [
        { id: 'fractions', title: 'Fraction Adventure', description: 'Learn fractions with visual pizza and chocolate examples', topics: ['Parts and Wholes', 'Equivalent Fractions', 'Mixed Numbers'], difficulty: 'beginner', xpReward: 50 },
        { id: 'decimals', title: 'Decimal Detective', description: 'Master decimal numbers and comparisons', topics: ['Tenths and Hundredths', 'Decimal Comparison', 'Place Value'], difficulty: 'intermediate', xpReward: 75 },
        { id: 'geometry', title: 'Geometry Space Mission', description: 'Explore shapes, angles, and spatial concepts', topics: ['Shapes and Angles', '2D and 3D Shapes', 'Symmetry'], difficulty: 'beginner', xpReward: 60 },
        { id: 'largenumbers', title: 'Large Numbers Cosmic Calculator', description: 'Work with big numbers and place values', topics: ['The Fish Tale', 'Place Value', 'Number Comparison'], difficulty: 'intermediate', xpReward: 80 },
        { id: 'measurement', title: 'Measurement Planet', description: 'Learn about length, weight, and capacity', topics: ['How Big? How Heavy?', 'Units', 'Conversions'], difficulty: 'beginner', xpReward: 55 },
        { id: 'patterns', title: 'Pattern Puzzle Portal', description: 'Discover sequences and mathematical patterns', topics: ['Can You See the Pattern?', 'Number Sequences', 'Shape Patterns'], difficulty: 'intermediate', xpReward: 70 },
        { id: 'wordproblems', title: 'Word Problem Workshop', description: 'Solve real-world math challenges', topics: ['Story Problems', 'Multi-step Solutions', 'Critical Thinking'], difficulty: 'advanced', xpReward: 100 }
      ],
      englishActivities: [
        { id: 'grammar', title: 'Grammar Castle', description: 'Master parts of speech and sentence structure', topics: ['Nouns', 'Verbs', 'Adjectives', 'Sentence Building'], difficulty: 'beginner', xpReward: 45 },
        { id: 'vocabulary', title: 'Vocabulary Village', description: 'Expand your word knowledge and understanding', topics: ['Word Meanings', 'Synonyms', 'Antonyms', 'Context Clues'], difficulty: 'beginner', xpReward: 40 },
        { id: 'stories', title: 'Story Builder Studio', description: 'Create amazing stories with guided writing', topics: ['Creative Writing', 'Story Structure', 'Character Development'], difficulty: 'intermediate', xpReward: 85 },
        { id: 'comprehension', title: 'Comprehension Quest', description: 'Read passages and answer thoughtful questions', topics: ['Reading Skills', 'Main Ideas', 'Details', 'Inference'], difficulty: 'intermediate', xpReward: 70 },
        { id: 'phonics', title: 'Phonics Playground', description: 'Learn sound patterns and improve spelling', topics: ['Sound Patterns', 'Spelling Rules', 'Word Families'], difficulty: 'beginner', xpReward: 35 },
        { id: 'poetry', title: 'Poetry Palace', description: 'Explore poems, rhymes, and rhythm', topics: ['Ice-cream Man', 'My Shadow', 'Rhyme Patterns', 'Recitation'], difficulty: 'intermediate', xpReward: 65 },
        { id: 'sentences', title: 'Sentence Puzzle Lab', description: 'Build and fix sentences like a language scientist', topics: ['Sentence Types', 'Punctuation', 'Grammar Rules'], difficulty: 'beginner', xpReward: 50 }
      ],
      achievements: [
        { id: 'firstSteps', title: 'First Steps', description: 'Complete your first activity', icon: '🌟' },
        { id: 'mathWizard', title: 'Math Wizard', description: 'Complete 5 math activities', icon: '🧙‍♂️' },
        { id: 'wordMaster', title: 'Word Master', description: 'Complete 5 English activities', icon: '📚' },
        { id: 'perfectScore', title: 'Perfect Score', description: 'Get 3 stars on any activity', icon: '⭐' },
        { id: 'streakMaster', title: 'Streak Master', description: 'Study for 7 days in a row', icon: '🔥' },
        { id: 'explorer', title: 'Zone Explorer', description: 'Try both Maths Galaxy and English Kingdom', icon: '🚀' }
      ]
    };

    // PROGRESS – kept in-memory only (no persistence)
    this.progress = {
      mathXP: 0,
      englishXP: 0,
      totalXP: 0,
      level: 1,
      streak: 0,
      completedActivities: [],
      badges: [],
      stars: {}
    };

    /* ----------------- STATE ----------------- */
    this.currentZone = null;         // 'math' | 'english'
    this.currentActivity = null;     // activity object
    this.currentQuestions = [];
    this.currentQuestionIndex = 0;
    this.sessionScore = 0;

    /* ----------------- INIT ----------------- */
    this.bindUI();
    this.showSection('hub');
  }

  /* =========================================================
     USER INTERFACE BINDINGS
  ========================================================= */
  bindUI() {
    // Portal buttons
    document.querySelectorAll('.portal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.playClick();
        this.enterZone(btn.dataset.zone);
      });
    });

    // Back buttons
    document.getElementById('backFromMath').addEventListener('click', () => {
      this.playClick();
      this.showSection('hub');
    });
    document.getElementById('backFromEnglish').addEventListener('click', () => {
      this.playClick();
      this.showSection('hub');
    });
    document.getElementById('backToDashboard').addEventListener('click', () => {
      this.playClick();
      if (this.currentZone) this.showSection(this.currentZone + 'Zone');
    });
  }

  /* =========================================================
     NAVIGATION HELPERS
  ========================================================= */
  playClick() {
    const audio = document.getElementById('clickSound');
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  showSection(id) {
    document.querySelectorAll('.hub, .zone, #activitySection').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(id);
    if (target) target.classList.remove('hidden');
    // Refresh XP displays after every navigation
    this.updateXPDisplay('math');
    this.updateXPDisplay('english');
  }

  enterZone(zone) {
    this.currentZone = zone; // remember zone
    this.renderActivities(zone);
    this.renderAchievements(zone);
    this.updateXPDisplay(zone);
    this.showSection(zone + 'Zone');
    
    // Start emotion detection for Class 5
    setTimeout(() => {
      if (window.emotionDetection) {
        window.emotionDetection.startEmotionDetection(5);
      }
    }, 1000);
  }

  /* =========================================================
     RENDER DASHBOARD COMPONENTS
  ========================================================= */
  renderActivities(zone) {
    const list = zone === 'math' ? this.data.mathActivities : this.data.englishActivities;
    const container = document.getElementById(zone + 'Activities');

    container.innerHTML = list.map(act => {
      const done = this.progress.completedActivities.includes(act.id);
      const starCount = this.progress.stars[act.id] || 0;
      return `
        <div class="activity-card ${done ? 'completed' : ''}" data-act="${act.id}">
          <div class="stars-display">${'⭐'.repeat(starCount)}</div>
          <h4 class="activity-title">${act.title}</h4>
          <p class="activity-description">${act.description}</p>
          <div class="activity-meta">
            <span class="difficulty-badge difficulty-${act.difficulty}">${act.difficulty}</span>
            <span class="xp-reward">+${act.xpReward} XP</span>
          </div>
        </div>`;
    }).join('');

    // Attach listeners
    container.querySelectorAll('.activity-card').forEach(card => {
      card.addEventListener('click', () => {
        const actId = card.dataset.act;
        this.playClick();
        this.startActivity(zone, actId);
      });
    });
  }

  renderAchievements(zone) {
    const container = document.getElementById(zone + 'Achievements');
    container.innerHTML = this.data.achievements.map(a => {
      const earned = this.progress.badges.includes(a.id) ? 'earned' : '';
      return `<div class="achievement-card ${earned}">
        <div class="achievement-icon">${a.icon}</div>
        <div class="achievement-title">${a.title}</div>
      </div>`;
    }).join('');
  }

  updateXPDisplay(zone) {
    const xpEl = document.getElementById(zone + 'Xp');
    if (!xpEl) return;
    const xpVal = zone === 'math' ? this.progress.mathXP : this.progress.englishXP;
    xpEl.querySelector('span').textContent = xpVal;
  }

  /* =========================================================
     ACTIVITY FLOW
  ========================================================= */
  startActivity(zone, activityId) {
    this.currentZone = zone;
    const activities = zone === 'math' ? this.data.mathActivities : this.data.englishActivities;
    this.currentActivity = activities.find(a => a.id === activityId);
    if (!this.currentActivity) return;

    // Prepare questions
    this.currentQuestions = this.buildQuestions(activityId);
    this.currentQuestionIndex = 0;
    this.sessionScore = 0;

    // Update header
    document.getElementById('activityTitle').textContent = this.currentActivity.title;
    document.getElementById('activityDescription').textContent = this.currentActivity.description;
    document.getElementById('starsEarned').innerHTML = '⭐ 0';

    this.showSection('activitySection');
    this.renderCurrentQuestion();
  }

  buildQuestions(activityId) {
    const generators = {
      // MATH
      fractions: () => this.qFractions(),
      decimals: () => this.qDecimals(),
      geometry: () => this.qGeometry(),
      largenumbers: () => this.qLargeNumbers(),
      measurement: () => this.qMeasurement(),
      patterns: () => this.qPatterns(),
      wordproblems: () => this.qWordProblems(),
      // ENGLISH
      grammar: () => this.qGrammar(),
      vocabulary: () => this.qVocabulary(),
      stories: () => this.qStories(),
      comprehension: () => this.qComprehension(),
      phonics: () => this.qPhonics(),
      poetry: () => this.qPoetry(),
      sentences: () => this.qSentences()
    };
    return generators[activityId] ? generators[activityId]() : [];
  }

  /* ----------------- QUESTION BANKS ----------------- */
  qFractions() { return [
    { q: 'Which fraction represents half of a pizza?', o: ['1/4','1/2','3/4','2/3'], a: 1, exp: '1/2 means one out of two equal parts!' },
    { q: 'If you eat 2 pieces out of 8 equal pieces of chocolate, what fraction did you eat?', o: ['2/8','6/8','2/6','8/2'], a: 0, exp: '2 pieces out of 8 total pieces is 2/8.' },
    { q: 'Which is bigger: 1/3 or 1/4?', o: ['1/4','1/3','Equal','Cannot tell'], a: 1, exp: '1/3 is larger than 1/4.' }
  ]; }

  qDecimals() { return [
    { q: 'What is 0.5 as a fraction?', o: ['1/5','1/2','5/10','Both B and C'], a: 3, exp: '0.5 = 5/10 = 1/2.' },
    { q: 'Which decimal is larger: 0.8 or 0.3?', o: ['0.3','0.8','Equal','Cannot compare'], a: 1, exp: '0.8 is greater than 0.3.' },
    { q: 'What is 7.25 rounded to the nearest whole number?', o: ['7','7.3','8','7.2'], a: 0, exp: '7.25 rounds down to 7.' }
  ]; }

  qGeometry() { return [
    { q: 'How many sides does a triangle have?', o: ['2','3','4','5'], a: 1, exp: 'A triangle has 3 sides.' },
    { q: 'What type of angle is exactly 90 degrees?', o: ['Acute','Obtuse','Right','Straight'], a: 2, exp: 'A 90° angle is a right angle.' },
    { q: 'Which shape has 4 equal sides and 4 right angles?', o: ['Rectangle','Triangle','Square','Circle'], a: 2, exp: 'A square has equal sides and right angles.' }
  ]; }

  qLargeNumbers() { return [
    { q: 'Place value of 5 in 52,847?', o: ['Ones','Tens','Hundreds','Ten thousands'], a: 3, exp: 'The 5 is in the ten-thousands place.' },
    { q: 'Which is larger: 9,999 or 10,001?', o: ['9,999','10,001','Equal','Cannot tell'], a: 1, exp: '10,001 is larger.' },
    { q: 'Round 78,456 to the nearest thousand:', o: ['78,000','79,000','80,000','78,500'], a: 1, exp: '78,456 rounds to 79,000.' }
  ]; }

  qMeasurement() { return [
    { q: 'How many centimeters in 1 meter?', o: ['10','100','1000','50'], a: 1, exp: 'There are 100 cm in a meter.' },
    { q: 'Unit to measure length of a pencil?', o: ['Kilometers','Meters','Centimeters','Millimeters'], a: 2, exp: 'Centimeters are appropriate.' },
    { q: 'If bottle holds 500ml, how many bottles make 1 liter?', o: ['1','2','3','4'], a: 1, exp: '1 liter = 1000 ml, so 2 bottles.' }
  ]; }

  qPatterns() { return [
    { q: 'Next in pattern 2,4,6,8,?', o: ['9','10','12','11'], a: 1, exp: 'Add 2 each step → 10.' },
    { q: 'Complete: 1,4,7,10,?', o: ['12','13','14','15'], a: 1, exp: 'Add 3 → 13.' },
    { q: 'Rule for 20,18,16,14,?', o: ['Subtract 2','Add 2','×2','÷2'], a: 0, exp: 'Subtract 2 each time.' }
  ]; }

  qWordProblems() { return [
    { q: 'Sarah has 15 stickers, gives 6, buys 8. Total now?', o: ['17','15','13','19'], a: 0, exp: '15-6+8 = 17.' },
    { q: '24 chocolates split by 4 kids. Each gets?', o: ['4','5','6','8'], a: 2, exp: '24 ÷ 4 = 6.' },
    { q: 'Ram walks 250m to school and back. Total?', o: ['250m','400m','500m','750m'], a: 2, exp: '250 + 250 = 500 m.' }
  ]; }

  qGrammar() { return [
    { q: "Which word is a noun: 'The cat runs quickly'?", o: ['The','cat','runs','quickly'], a: 1, exp: 'Cat is a noun.' },
    { q: "What type of word is 'running' in 'She is running fast'?", o: ['Noun','Verb','Adjective','Adverb'], a: 1, exp: 'Running shows action → verb.' },
    { q: 'Choose the correct sentence:', o: ['I are happy','I is happy','I am happy','I be happy'], a: 2, exp: '"I am happy" is correct.' }
  ]; }

  qVocabulary() { return [
    { q: "Meaning of 'enormous'?", o: ['Very small','Very big','Very fast','Very slow'], a: 1, exp: 'Enormous = very big.' },
    { q: 'Synonym for happy:', o: ['Sad','Angry','Joyful','Worried'], a: 2, exp: 'Joyful is a synonym.' },
    { q: 'Opposite of hot?', o: ['Warm','Cool','Cold','Freezing'], a: 2, exp: 'Cold is opposite of hot.' }
  ]; }

  qStories() { return [
    { q: 'Main character in a story is called:', o: ['Villain','Hero','Narrator','Author'], a: 1, exp: 'Hero / protagonist.' },
    { q: 'What should come at beginning of story?', o: ['Ending','Middle','Intro of characters','Climax'], a: 2, exp: 'Introduce characters & setting first.' },
    { q: 'What makes story interesting?', o: ['Long sentences','Describing feelings','Difficult words','No punctuation'], a: 1, exp: 'Feelings add interest.' }
  ]; }

  qComprehension() { return [
    { q: 'When reading a story, first look for?', o: ['Big words','Main idea','Pictures only','Page numbers'], a: 1, exp: 'Find the main idea.' },
    { q: 'Smiling & laughing shows a character is:', o: ['Sad','Angry','Happy','Scared'], a: 2, exp: 'They seem happy.' },
    { q: "To 'infer' means:", o: ['Read loudly','Guess based on clues','Skip parts','Read backwards'], a: 1, exp: 'Inference = using clues.' }
  ]; }

  qPhonics() { return [
    { q: 'Word that rhymes with cat?', o: ['Dog','Hat','Fish','Bird'], a: 1, exp: 'Cat / hat rhyme.' },
    { q: 'Syllables in elephant?', o: ['2','3','4','5'], a: 1, exp: 'Ele-phant → 3 syllables.' },
    { q: "Letters making 'sh' sound in ship?", o: ['s','h','sh','i'], a: 2, exp: 'Sh together make the sound.' }
  ]; }

  qPoetry() { return [
    { q: 'Words rhyme when they have:', o: ['Same first letter','Same ending sound','Same length','Same meaning'], a: 1, exp: 'Rhyming = same ending sound.' },
    { q: "In 'Twinkle twinkle little star', which rhyme?", o: ['Twinkle/little','Star/are','How/wonder','What/you'], a: 1, exp: 'Star / are rhyme.' },
    { q: 'Rhythm in poetry is:', o: ['Big words','The beat/pattern','Difficult meanings','Long sentences'], a: 1, exp: 'Rhythm = beat pattern.' }
  ]; }

  qSentences() { return [
    { q: 'Every sentence must end with:', o: ['A comma','A question mark','Some punctuation','A space'], a: 2, exp: 'Needs punctuation like . ! ?' },
    { q: 'Which sentence is correct?', o: ['the boy runs fast','The boy runs fast.','the boy runs fast,','The boy runs fast'], a: 1, exp: 'Capital + punctuation ✓' },
    { q: 'Sentence that asks something is a:', o: ['Statement','Question','Exclamation','Command'], a: 1, exp: 'A question asks something.' }
  ]; }

  /* =========================================================
     QUESTION PRESENTATION & ANSWERING
  ========================================================= */
  renderCurrentQuestion() {
    const qData = this.currentQuestions[this.currentQuestionIndex];
    const wrapper = document.getElementById('questionContainer');
    if (!qData) {
      this.finishActivity();
      return;
    }

    wrapper.innerHTML = `
      <div class="question">
        <h3 class="question-text">Question ${this.currentQuestionIndex + 1}: ${qData.q}</h3>
        <div class="options-grid">
          ${qData.o.map((opt, i) => `<button class="option-btn" data-idx="${i}">${opt}</button>`).join('')}
        </div>
        <div id="feedback" class="feedback hidden"></div>
        <button id="nextBtn" class="btn btn--primary next-question-btn hidden">Next Question</button>
      </div>`;

    // attach listeners
    wrapper.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.evaluateAnswer(parseInt(btn.dataset.idx, 10));
      });
    });
    wrapper.querySelector('#nextBtn').addEventListener('click', () => {
      this.playClick();
      this.currentQuestionIndex += 1;
      this.renderCurrentQuestion();
    });
  }

  evaluateAnswer(selected) {
    const qData = this.currentQuestions[this.currentQuestionIndex];
    const correct = selected === qData.a;
    const feedback = document.getElementById('feedback');
    const optionButtons = document.querySelectorAll('.option-btn');

    optionButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.a) btn.classList.add('correct');
      if (idx === selected && !correct) btn.classList.add('incorrect');
    });

    feedback.textContent = qData.exp;
    feedback.classList.remove('hidden');
    feedback.classList.add(correct ? 'correct' : 'incorrect');

    if (correct) this.sessionScore += 1;

    document.getElementById('nextBtn').classList.remove('hidden');
    this.playClick();
  }

  /* =========================================================
     COMPLETING ACTIVITY
  ========================================================= */
  finishActivity() {
    const totalQ = this.currentQuestions.length;
    const starRating = Math.max(1, Math.ceil((this.sessionScore / totalQ) * 3)); // 1-3 stars

    // update progress
    if (!this.progress.completedActivities.includes(this.currentActivity.id)) {
      this.progress.completedActivities.push(this.currentActivity.id);
    }
    this.progress.stars[this.currentActivity.id] = Math.max(this.progress.stars[this.currentActivity.id] || 0, starRating);

    const xpKey = this.currentZone === 'math' ? 'mathXP' : 'englishXP';
    this.progress[xpKey] += this.currentActivity.xpReward;
    this.progress.totalXP += this.currentActivity.xpReward;

    this.evaluateAchievements();

    // show summary
    const wrapper = document.getElementById('questionContainer');
    wrapper.innerHTML = `
      <div class="completion-message text-center">
        <h2>🎉 Awesome! 🎉</h2>
        <p>You finished <strong>${this.currentActivity.title}</strong></p>
        <p>Score: ${this.sessionScore}/${totalQ}</p>
        <p>Stars: ${'⭐'.repeat(starRating)}</p>
        <p>XP Gained: +${this.currentActivity.xpReward}</p>
        <button class="btn btn--primary" id="backDash">Back to Dashboard</button>
      </div>`;
    document.getElementById('backDash').addEventListener('click', () => {
      this.playClick();
      this.enterZone(this.currentZone);
    });

    document.getElementById('starsEarned').innerHTML = `⭐ ${starRating}`;
  }

  /* =========================================================
     ACHIEVEMENTS
  ========================================================= */
  evaluateAchievements() {
    const mathDone = this.progress.completedActivities.filter(id => this.data.mathActivities.some(a => a.id === id)).length;
    const engDone  = this.progress.completedActivities.filter(id => this.data.englishActivities.some(a => a.id === id)).length;

    const unlock = (id) => {
      if (!this.progress.badges.includes(id)) {
        this.progress.badges.push(id);
        this.popupAchievement(id);
      }
    };

    if (this.progress.completedActivities.length >= 1) unlock('firstSteps');
    if (mathDone >= 5) unlock('mathWizard');
    if (engDone >= 5) unlock('wordMaster');
    if (Object.values(this.progress.stars).some(s => s === 3)) unlock('perfectScore');
    if (mathDone >= 1 && engDone >= 1) unlock('explorer');
  }

  popupAchievement(id) {
    const ach = this.data.achievements.find(a => a.id === id);
    if (!ach) return;

    const pop = document.createElement('div');
    pop.innerHTML = `
      <div style="background: var(--color-bg-6); border:2px solid var(--color-success); padding:16px; border-radius:12px; box-shadow:var(--shadow-lg);">
        <h3 style="margin:0 0 8px 0; text-align:center;">🎖️ Achievement Unlocked! 🎖️</h3>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:24px;">${ach.icon}</span>
          <div>
            <strong>${ach.title}</strong>
            <p style="margin:0; font-size:12px;">${ach.description}</p>
          </div>
        </div>
      </div>`;
    pop.style.cssText = 'position:fixed; top:20px; right:20px; z-index:999; animation:slideIn 0.4s ease-out;';
    document.body.appendChild(pop);

    setTimeout(() => { pop.style.animation = 'slideOut 0.4s ease-in'; }, 3500);
    setTimeout(() => pop.remove(), 4000);

    // keyframes (created once)
    if (!document.getElementById('ach-anim')) {
      const style = document.createElement('style');
      style.id = 'ach-anim';
      style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}@keyframes slideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(100%);opacity:0;}}';
      document.head.appendChild(style);
    }
  }
}

/* =========================== INITIALISE =========================== */
document.addEventListener('DOMContentLoaded', () => {
  window.learningSystem = new LearningSystem();
});