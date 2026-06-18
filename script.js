/* ── Tabs ── */
const tabBtns  = document.querySelectorAll('.tab-btn');
const panels   = document.querySelectorAll('.panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + id).classList.add('active');
  });
});

/*  Demo 1 Counter  */
(function counterModule() {
  let count   = 0;
  let history = [];

  const numEl  = document.getElementById('counterNum');
  const histEl = document.getElementById('counterHistory');

  function updateDisplay() {
    numEl.textContent = count;
    numEl.className   = 'counter-num ' + (count > 0 ? 'pos' : count < 0 ? 'neg' : 'zero');
    
    // bump animation
    numEl.classList.add('bump');
    setTimeout(() => numEl.classList.remove('bump'), 150);
    histEl.innerHTML = history.length
      ? history.slice(-6).map(h =>
          `<span>${h.op}</span> → ${h.val}`
        ).join('  ·  ')
      : 'History will appear here…';
  }

  function change(delta, label) {
    count += delta;
    history.push({ op: label, val: count });
    updateDisplay();
  }

  document.getElementById('btnInc').addEventListener('click', () => change(+1, '+1'));
  document.getElementById('btnDec').addEventListener('click', () => change(-1, '−1'));
  document.getElementById('btnRst').addEventListener('click', () => {
    count = 0;
    history.push({ op: 'reset', val: 0 });
    updateDisplay();
  });

  updateDisplay();
})();

/*  Demo 2 To-Do List  */
(function todoModule() {
  let todos       = [];
  let idCounter   = 0;
  let activeFilter = 'all';

  const listEl    = document.getElementById('todoList');
  const inputEl   = document.getElementById('todoInput');
  const countEl   = document.getElementById('todoCount');

  function addTodo(text) {
    if (!text.trim()) return;
    todos.push({ id: ++idCounter, text: text.trim(), done: false });
    inputEl.value = '';
    render();
  }

  function toggleTodo(id) {
    const t = todos.find(t => t.id === id);
    if (t) t.done = !t.done;
    render();
  }

  function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    render();
  }

  function clearCompleted() {
    todos = todos.filter(t => !t.done);
    render();
  }

  function getFiltered() {
    if (activeFilter === 'active') return todos.filter(t => !t.done);
    if (activeFilter === 'done')   return todos.filter(t => t.done);
    return todos;
  }

  function render() {
    const filtered = getFiltered();
    listEl.innerHTML = '';

    if (filtered.length === 0) {
      listEl.innerHTML = `<li style="padding:.8rem .5rem;color:var(--muted);font-size:.85rem">
        ${activeFilter === 'done' ? 'No completed tasks yet.' : 'Nothing here. Add something!'}
      </li>`;
    }

    filtered.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item' + (todo.done ? ' done' : '');

      const check = document.createElement('div');
      check.className = 'todo-check' + (todo.done ? ' checked' : '');
      check.addEventListener('click', () => toggleTodo(todo.id));

      const span = document.createElement('span');
      span.className   = 'todo-text';
      span.textContent = todo.text;
      span.addEventListener('click', () => toggleTodo(todo.id));

      const del = document.createElement('button');
      del.className   = 'todo-del';
      del.textContent = '✕';
      del.addEventListener('click', () => deleteTodo(todo.id));

      li.append(check, span, del);
      listEl.appendChild(li);
    });

    const left = todos.filter(t => !t.done).length;
    countEl.textContent = left + ' item' + (left !== 1 ? 's' : '') + ' left';
  }

  document.getElementById('btnAddTodo').addEventListener('click', () => addTodo(inputEl.value));
  inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(inputEl.value); });
  document.getElementById('btnClearDone').addEventListener('click', clearCompleted);

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      render();
    });
  });

  ['Learn about closures in JS', 'Build 3 portfolio demos'].forEach(addTodo);
})();

/*  Demo 3 Quiz  */
(function quizModule() {
  const questions = [
    {
      q: 'What does "hoisting" mean in JavaScript?',
      opts: [
        'Variables and function declarations are moved to the top of their scope before execution.',
        'JavaScript runs on a web server.',
        'A method to lift DOM elements visually.',
        'CSS animation property.'
      ],
      ans: 0,
      exp: 'Hoisting moves var declarations and function declarations to the top of their scope. let/const are hoisted but stay in the Temporal Dead Zone.'
    },
    {
      q: 'What will `console.log(typeof null)` output?',
      opts: ['"null"', '"undefined"', '"object"', '"boolean"'],
      ans: 2,
      exp: 'This is a famous JS quirk — `typeof null` returns "object" due to a legacy bug kept for backwards compatibility.'
    },
    {
      q: 'Which of these creates a closure?',
      opts: [
        'Declaring a variable with var.',
        'A function accessing a variable from its outer (enclosing) scope.',
        'Using the `new` keyword.',
        'Writing an async function.'
      ],
      ans: 1,
      exp: 'A closure forms when an inner function "closes over" variables from its outer scope, keeping them alive even after the outer function returns.'
    },
    {
      q: 'What does `Promise.resolve(42).then(v => v * 2)` eventually resolve to?',
      opts: ['42', '84', 'undefined', 'A pending Promise'],
      ans: 1,
      exp: 'Promise.resolve(42) creates a resolved promise. .then(v => v * 2) transforms the value — 42 × 2 = 84.'
    },
    {
      q: 'What is the output of: `var x = 1; function foo() { console.log(x); var x = 2; } foo();`',
      opts: ['1', '2', 'undefined', 'ReferenceError'],
      ans: 2,
      exp: 'Due to hoisting, `var x` inside foo() is hoisted to the top of foo\'s scope as `var x = undefined`, shadowing the outer x before the assignment runs.'
    },
    {
      q: 'Which method is used to add an event listener to a DOM element?',
      opts: ['element.on()', 'element.listen()', 'element.addEventListener()', 'element.attachEvent()'],
      ans: 2,
      exp: '`addEventListener()` is the standard DOM method. It accepts the event type, a callback, and an optional options object. Old IE used attachEvent() but that\'s obsolete.'
    }
  ];

  let current = 0;
  let score   = 0;
  let answered = false;

  const qEl       = document.getElementById('quizQ');
  const optsEl    = document.getElementById('quizOpts');
  const feedEl    = document.getElementById('quizFeedback');
  const nextBtn   = document.getElementById('btnNext');
  const barEl     = document.getElementById('quizBar');
  const counterEl = document.getElementById('quizCounter');
  const scoreEl   = document.getElementById('quizScore');
  const bodyEl    = document.getElementById('quizBody');
  const resultEl  = document.getElementById('quizResult');

  function loadQuestion(index) {
    return new Promise(resolve => {
      setTimeout(() => resolve(questions[index]), 80);
    });
  }

  async function showQuestion(index) {
    answered = false;
    feedEl.className = 'quiz-feedback hidden';
    feedEl.textContent = '';
    nextBtn.classList.remove('visible');

    const q = await loadQuestion(index);

    qEl.textContent     = q.q;
    counterEl.textContent = `Question ${index + 1} / ${questions.length}`;
    scoreEl.textContent   = `Score: ${score}`;
    barEl.style.width     = ((index / questions.length) * 100) + '%';

    optsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className   = 'quiz-opt';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i, q));
      optsEl.appendChild(btn);
    });
  }

  function handleAnswer(chosen, q) {
    if (answered) return;
    answered = true;

    const optBtns = optsEl.querySelectorAll('.quiz-opt');
    optBtns.forEach(b => b.disabled = true);

    const correct = chosen === q.ans;
    if (correct) score++;

    optBtns[q.ans].classList.add('correct');
    if (!correct) optBtns[chosen].classList.add('wrong');

    feedEl.className   = 'quiz-feedback ' + (correct ? 'correct' : 'wrong');
    feedEl.textContent = (correct ? '✓ Correct! ' : '✗ Not quite. ') + q.exp;
    nextBtn.classList.add('visible');
    scoreEl.textContent = `Score: ${score}`;
  }

  nextBtn.addEventListener('click', () => {
    current++;
    if (current < questions.length) {
      showQuestion(current);
    } else {
      showResult();
    }
  });

  document.getElementById('btnRestart').addEventListener('click', () => {
    current  = 0;
    score    = 0;
    resultEl.classList.remove('show');
    bodyEl.style.display = 'block';
    showQuestion(0);
  });

  function showResult() {
    barEl.style.width = '100%';
    bodyEl.style.display = 'none';
    resultEl.classList.add('show');

    const pct = score / questions.length;
    document.getElementById('resultScore').textContent = score;

    let grade, msg;
    if (pct === 1)       { grade = ' Perfect!';    msg = 'You nailed every JS concept. Ship it!'; }
    else if (pct >= .83) { grade = ' Excellent';   msg = 'Strong grasp of core JS. Nearly there!'; }
    else if (pct >= .67) { grade = ' Good job';    msg = 'Solid foundation. Review the ones you missed.'; }
    else if (pct >= .5)  { grade = ' Keep going';  msg = 'Half way there — re-watch the relevant videos.'; }
    else                 { grade = ' Try again';   msg = 'Core concepts need more practice. You got this!'; }

    document.getElementById('resultGrade').textContent = grade;
    document.getElementById('resultMsg').textContent   = msg;
  }

  showQuestion(0);
})();
