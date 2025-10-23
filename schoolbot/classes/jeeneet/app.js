// app.js – Exam Prep Pro SPA

/***************
 * In-memory Data (mock backend)
 ***************/
const data = {
  courses: {
    JEE: {
      Maths: [
        {
          type: "PDF",
          label: "IIT JEE Previous Year Maths",
          url: "https://example.com/jee-maths.pdf",
        },
        {
          type: "Video",
          label: "Calculus Crash Course",
          url: "https://www.youtube.com/watch?v=wjynWmF8UYs",
        },
      ],
      Physics: [
        {
          type: "PDF",
          label: "HC Verma Solutions",
          url: "https://example.com/hcv.pdf",
        },
        {
          type: "Website",
          label: "HyperPhysics",
          url: "http://hyperphysics.phy-astr.gsu.edu/",
        },
      ],
      Chemistry: [
        {
          type: "Video",
          label: "Organic Mechanisms Quick Review",
          url: "https://www.youtube.com/watch?v=rXfRW0J0waA",
        },
      ],
    },
    NEET: {
      Zoology: [
        {
          type: "PDF",
          label: "Zoology Notes",
          url: "https://example.com/zoo.pdf",
        },
      ],
      Botany: [
        {
          type: "Video",
          label: "Plant Physiology Series",
          url: "https://www.youtube.com/watch?v=plant",
        },
      ],
      Physics: [],
      Chemistry: [],
      Maths: [],
    },
  },
  repeatedMcqs: {
    JEE: {
      Maths: [
        {
          q: "If ∇f = 0 then f is ____?",
          options: ["Constant", "Linear", "Quadratic", "Zero"],
          ansIdx: 0,
        },
      ],
      Physics: [],
      Chemistry: [],
    },
    NEET: {
      Zoology: [],
      Botany: [],
      Physics: [],
      Chemistry: [],
      Maths: [],
    },
  },
  pvqVideos: {
    JEE: {
      2018: {
        tamil: "https://www.youtube.com/embed/kGSXGgyE_cQ",
        english: "https://www.youtube.com/embed/7R4lPlGSYfg",
      },
    },
    NEET: {
      2018: {
        tamil: "https://www.youtube.com/embed/dZs3L-ByNkI",
        english: "https://www.youtube.com/embed/3",
      },
    },
  },
  allQuestions: {
    JEE: [
      {
        subject: "Physics",
        q: "Unit of Planck constant?",
        options: ["J·s", "J/s", "W", "eV"],
        ansIdx: 0,
      },
    ],
    NEET: [],
  },
};

// Duplicate first question until we have 15 demo questions per specs
while (data.allQuestions.JEE.length < 15) {
  const baseQ = data.allQuestions.JEE[0];
  data.allQuestions.JEE.push({ ...baseQ });
}

/***************
 * App State
 ***************/
const state = {
  user: null,
  currentExam: null, // "JEE" | "NEET"
  view: "auth", // view identifiers
  // MCQ practice sub-state
  mcq: {
    subject: null,
    index: 0,
    score: 0,
    questions: [],
  },
  // Exam simulation sub-state
  exam: {
    questions: [],
    currentIdx: 0,
    responses: {}, // { idx: selectedOptionIdx }
    visited: new Set(),
    timerId: null,
    timeRemaining: 3 * 60 * 60, // seconds
  },
};

/***************
 * Utilities
 ***************/
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function setView(view) {
  state.view = view;
  render();
}

function resetExamState() {
  state.exam = {
    questions: [],
    currentIdx: 0,
    responses: {},
    visited: new Set(),
    timerId: null,
    timeRemaining: 3 * 60 * 60,
  };
}

function subjectsForExam(exam) {
  return exam === "JEE"
    ? ["Maths", "Physics", "Chemistry"]
    : ["Zoology", "Botany", "Physics", "Chemistry", "Maths"];
}

function formatSeconds(s) {
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

/***************
 * Render Functions
 ***************/
function render() {
  const app = $("#app");
  const backBtn = $("#backBtn");
  const logoutBtn = $("#logoutBtn");

  // Control nav visibility
  backBtn.classList.toggle("hidden", state.view === "auth");
  logoutBtn.classList.toggle("hidden", state.view === "auth");

  switch (state.view) {
    case "auth":
      renderAuth(app);
      break;
    case "examSelect":
      renderExamSelect(app);
      break;
    case "examHome":
      renderExamHome(app);
      break;
    case "courses":
      renderCourses(app);
      break;
    case "mcq-subject":
      renderMcqSubjectSelect(app);
      break;
    case "mcq-quiz":
      renderMcqQuiz(app);
      break;
    case "pvq":
      renderPvq(app);
      break;
    case "exam-sim":
      renderExamSim(app);
      break;
    case "exam-result":
      renderExamResult(app);
      break;
    default:
      app.innerHTML = `<p>Unknown view</p>`;
  }
}

/***** View: Authentication *****/
function renderAuth(container) {
  container.innerHTML = `
    <div class="container" style="max-width:400px;">
      <h2 class="mb-8">Student Verification</h2>
      <form id="authForm" class="flex flex-col gap-16">
        <div class="form-group">
          <label class="form-label" for="name">Name</label>
          <input required id="name" class="form-control" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label" for="standard">Standard</label>
          <input required id="standard" class="form-control" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label" for="school">School</label>
          <input required id="school" class="form-control" type="text" />
        </div>
        <div class="form-group">
          <label class="form-label" for="idcard">Upload ID Card (Optional)</label>
          <input id="idcard" class="form-control" type="file" accept="image/*,.pdf" />
          <small style="color: var(--color-text-secondary); font-size: var(--font-size-xs); margin-top: var(--space-4); display: block;">
            Select an image or PDF file of your ID card
          </small>
        </div>
        <button class="btn btn--primary" type="submit">Verify & Continue</button>
      </form>
    </div>
  `;

  const form = $("#authForm");
  const fileInput = $("#idcard");
  
  // Add file input change handler to show selected file name
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    const small = fileInput.nextElementSibling;
    if (file) {
      small.textContent = `Selected: ${file.name}`;
      small.style.color = "var(--color-success)";
    } else {
      small.textContent = "Select an image or PDF file of your ID card";
      small.style.color = "var(--color-text-secondary)";
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#name").value.trim();
    const standard = $("#standard").value.trim();
    const school = $("#school").value.trim();
    
    if (!name || !standard || !school) {
      alert("Please fill in all required fields.");
      return;
    }
    
    state.user = { name, standard, school };
    setView("examSelect");
  });
}

/***** View: Exam Select (JEE / NEET) *****/
function renderExamSelect(container) {
  container.innerHTML = `
    <div class="container center-vert" style="min-height:60vh;">
      <h2 class="mb-8">Hello, ${state.user.name}! Choose Your Exam</h2>
      <div class="flex flex-col gap-16" style="width:100%;max-width:300px;">
        <button class="btn btn--primary" data-exam="JEE">JEE</button>
        <button class="btn btn--primary" data-exam="NEET">NEET</button>
      </div>
    </div>
  `;
  $$("button[data-exam]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.currentExam = btn.dataset.exam;
      setView("examHome");
    });
  });
}

/***** View: Exam Home (4 feature buttons) *****/
function renderExamHome(container) {
  container.innerHTML = `
    <div class="container center-vert" style="min-height:60vh;">
      <h2 class="mb-8">${state.currentExam} Preparation</h2>
      <div class="flex flex-col gap-16" style="width:100%;max-width:320px;">
        <button class="btn btn--secondary" data-action="courses">Courses</button>
        <button class="btn btn--secondary" data-action="mcq">MCQ Repeated Questions</button>
        <button class="btn btn--secondary" data-action="pvq">PVQ Solved</button>
        <button class="btn btn--secondary" data-action="exam">Exam Simulation</button>
      </div>
    </div>
  `;

  $$("button[data-action]").forEach((b) => {
    b.addEventListener("click", () => {
      const action = b.dataset.action;
      if (action === "courses") setView("courses");
      else if (action === "mcq") setView("mcq-subject");
      else if (action === "pvq") setView("pvq");
      else if (action === "exam") startExamSimulation();
    });
  });
}

/***** View: Courses *****/
function renderCourses(container) {
  const subjects = subjectsForExam(state.currentExam);
  let html = `<div class="container"><h3 class="mb-8">${state.currentExam} Courses</h3>`;
  subjects.forEach((sub) => {
    const resources = data.courses[state.currentExam][sub] || [];
    if (!resources.length) return; // skip empty
    html += `<div class="card"><div class="card__header"><h4>${sub}</h4></div><div class="card__body">`;
    resources.forEach((r) => {
      html += `<p><strong>${r.type}:</strong> <a target="_blank" href="${r.url}">${r.label}</a></p>`;
    });
    html += `</div></div>`;
  });
  html += `</div>`;
  container.innerHTML = html;
}

/***** View: MCQ Subject Select *****/
function renderMcqSubjectSelect(container) {
  const subjects = subjectsForExam(state.currentExam);
  container.innerHTML = `
    <div class="container center-vert" style="min-height:60vh;">
      <h3 class="mb-8">Choose Subject</h3>
      <div class="flex flex-col gap-16" style="width:100%;max-width:320px;">
        ${subjects
          .map(
            (s) => `<button class="btn btn--secondary" data-subject="${s}">${s}</button>`
          )
          .join("")}
      </div>
    </div>
  `;
  $$("button[data-subject]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const subj = btn.dataset.subject;
      state.mcq.subject = subj;
      state.mcq.index = 0;
      state.mcq.score = 0;
      state.mcq.questions = data.repeatedMcqs[state.currentExam][subj] || [];
      if (!state.mcq.questions.length) {
        alert("No MCQs available for this subject yet.");
        return;
      }
      setView("mcq-quiz");
    });
  });
}

/***** View: MCQ Quiz *****/
function renderMcqQuiz(container) {
  const { questions, index } = state.mcq;
  if (index >= questions.length) {
    container.innerHTML = `<div class="container"><h3>Practice Completed!</h3><p>Your Score: ${state.mcq.score}/${questions.length}</p></div>`;
    return;
  }
  const qObj = questions[index];
  container.innerHTML = `
    <div class="container" style="max-width:600px;">
      <h4 class="mb-8">Q${index + 1}. ${qObj.q}</h4>
      <form id="mcqForm" class="flex flex-col gap-8">
        ${qObj.options
          .map(
            (opt, i) => `
          <label class="flex gap-8 items-center">
            <input type="radio" name="opt" value="${i}" required />
            <span>${opt}</span>
          </label>`
          )
          .join("")}
        <button type="submit" class="btn btn--primary mt-8">Submit Answer</button>
      </form>
      <div id="mcqFeedback" class="mt-8"></div>
    </div>
  `;
  $("#mcqForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const sel = Number($("input[name='opt']:checked").value);
    const correct = sel === qObj.ansIdx;
    if (correct) state.mcq.score++;
    const feedback = correct
      ? `<span class="status status--success">Correct!</span>`
      : `<span class="status status--error">Wrong!</span>`;
    $("#mcqFeedback").innerHTML = feedback;
    setTimeout(() => {
      state.mcq.index++;
      render();
    }, 800);
  });
}

/***** View: PVQ Videos *****/
function renderPvq(container) {
  const years = Array.from({ length: 2025 - 2018 + 1 }, (_, i) => 2018 + i);
  container.innerHTML = `
    <div class="container" style="max-width:700px;">
      <h3 class="mb-8">${state.currentExam} Previous Year Questions - Solved</h3>
      <form id="pvqForm" class="flex gap-16 items-center mb-8">
        <select class="form-control" id="pvqYear">
          ${years.map((y) => `<option value="${y}">${y}</option>`).join("")}
        </select>
        <button class="btn btn--primary" type="submit">Show Videos</button>
      </form>
      <div id="pvqVideos"></div>
    </div>
  `;
  $("#pvqForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const yr = $("#pvqYear").value;
    const vids = data.pvqVideos[state.currentExam][yr];
    const container = $("#pvqVideos");
    if (!vids) {
      container.innerHTML = `<p>No videos available for ${yr}.</p>`;
      return;
    }
    container.innerHTML = `
      <div class="flex gap-16 exam-sim-layout" style="flex-wrap:wrap;">
        <iframe style="flex:1;min-width:280px;height:315px;" src="${vids.tamil}" frameborder="0" allowfullscreen></iframe>
        <iframe style="flex:1;min-width:280px;height:315px;" src="${vids.english}" frameborder="0" allowfullscreen></iframe>
      </div>
    `;
  });
}

/***** Exam Simulation *****/
function startExamSimulation() {
  resetExamState();
  state.exam.questions = data.allQuestions[state.currentExam];
  setView("exam-sim");
}

function renderExamSim(container) {
  const ex = state.exam;
  const qObj = ex.questions[ex.currentIdx];
  // Start timer if not already started
  if (!ex.timerId) {
    ex.timerId = setInterval(() => {
      ex.timeRemaining--;
      if (ex.timeRemaining <= 0) {
        submitExam();
      }
      const tEl = $("#timer");
      if (tEl) tEl.textContent = formatSeconds(ex.timeRemaining);
    }, 1000);
  }

  container.innerHTML = `
    <div class="container">
      <div class="flex justify-between items-center mb-8">
        <h3>Exam Simulation – ${state.currentExam}</h3>
        <div class="timer" id="timer">${formatSeconds(ex.timeRemaining)}</div>
      </div>
      <div class="flex gap-16 exam-sim-layout">
        <div>
          <div class="exam-grid">
            ${ex.questions
              .map((_, i) => {
                const statusClass = ex.responses[i] !== undefined
                  ? "green"
                  : ex.visited.has(i)
                  ? "violet"
                  : "red";
                return `<button class="${statusClass}" data-qidx="${i}">${i + 1}</button>`;
              })
              .join("")}
          </div>
          <button class="btn btn--primary mt-8" id="submitExamBtn">Submit Exam</button>
        </div>

        <div style="flex:1;">
          <h4 class="mb-8">Q${ex.currentIdx + 1}. ${qObj.q}</h4>
          <form id="examQForm" class="flex flex-col gap-8">
            ${qObj.options
              .map(
                (opt, i) => `
                <label class="flex gap-8 items-center">
                  <input type="radio" name="opt" value="${i}" ${
                    ex.responses[ex.currentIdx] === i ? "checked" : ""
                  } />
                  <span>${opt}</span>
                </label>`
              )
              .join("")}
          </form>
          <div class="flex gap-8 mt-8">
            <button class="btn btn--secondary" id="saveNextBtn">Save & Next</button>
            <button class="btn btn--secondary" id="markVisitedBtn">Mark Visited</button>
            <button class="btn btn--outline" id="clearRespBtn">Clear Response</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Grid navigation buttons
  $$(".exam-grid button").forEach((b) => {
    b.addEventListener("click", () => {
      ex.currentIdx = Number(b.dataset.qidx);
      ex.visited.add(ex.currentIdx);
      render();
    });
  });

  // Action buttons
  $("#saveNextBtn").addEventListener("click", () => {
    const sel = $("input[name='opt']:checked");
    if (sel) ex.responses[ex.currentIdx] = Number(sel.value);
    ex.visited.add(ex.currentIdx);
    ex.currentIdx = (ex.currentIdx + 1) % ex.questions.length;
    render();
  });
  $("#markVisitedBtn").addEventListener("click", () => {
    ex.visited.add(ex.currentIdx);
    ex.currentIdx = (ex.currentIdx + 1) % ex.questions.length;
    render();
  });
  $("#clearRespBtn").addEventListener("click", () => {
    delete ex.responses[ex.currentIdx];
    render();
  });
  $("#submitExamBtn").addEventListener("click", submitExam);
}

function submitExam() {
  clearInterval(state.exam.timerId);
  // compute score
  let score = 0;
  state.exam.questions.forEach((q, idx) => {
    const resp = state.exam.responses[idx];
    if (resp === undefined) return;
    if (resp === q.ansIdx) score += 2;
    else score -= 1;
  });
  state.exam.finalScore = score;
  setView("exam-result");
}

/***** View: Exam Result *****/
function renderExamResult(container) {
  const score = state.exam.finalScore;
  const totalMarks = state.exam.questions.length * 2;
  const percent = ((score / totalMarks) * 100).toFixed(1);
  container.innerHTML = `
    <div class="container center-vert" style="min-height:60vh;text-align:center;">
      <h3 class="mb-8">Exam Completed!</h3>
      <p class="status status--info mb-8">Score: ${score} / ${totalMarks} (${percent}%)</p>
      <button class="btn btn--primary" id="backHomeBtn">Back to Home</button>
    </div>
  `;
  $("#backHomeBtn").addEventListener("click", () => {
    setView("examHome");
  });
}

/***************
 * Global Nav Button Handlers
 ***************/
$("#backBtn").addEventListener("click", () => {
  switch (state.view) {
    case "examHome":
      setView("examSelect");
      break;
    case "courses":
    case "mcq-subject":
    case "pvq":
    case "exam-sim":
    case "exam-result":
      setView("examHome");
      break;
    case "mcq-quiz":
      // back from quiz to subject list
      setView("mcq-subject");
      break;
  }
});

$("#logoutBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    location.reload(); // easiest to reset all in-memory state
  }
});

/***************
 * Bootstrapping
 ***************/
render();

// Start emotion detection for JEE/NEET students after a delay
setTimeout(() => {
    if (window.emotionDetection) {
        window.emotionDetection.startEmotionDetection(12); // Use class 12 questions for JEE/NEET
    }
}, 2000);