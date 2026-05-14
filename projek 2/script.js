/* =========================================
   1. NAVIGATION LOGIC (Single Page App)
========================================= */
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    // Show targeted section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Initialize specific logic based on section
    if(sectionId === 'exercises') startQuiz();
    if(sectionId === 'games') initScramble();
}

/* =========================================
   2. MODAL LOGIC (For Materials)
========================================= */
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Close modal if user clicks outside the content box
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.add('hidden');
    }
}

/* =========================================
   3. QUIZ ENGINE LOGIC
========================================= */
// Structured data for scalability
const quizData = [
    {
        question: "Which of the following is a NOUN?",
        options: ["Quickly", "Beautiful", "Developer", "Running"],
        correct: 2
    },
    {
        question: "Choose the correct verb: 'She ___ code every day.'",
        options: ["writes", "writing", "wrote", "write"],
        correct: 0
    },
    {
        question: "Identify the article in this sentence: 'I need an umbrella.'",
        options: ["I", "need", "an", "umbrella"],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    document.getElementById('quiz-question').textContent = q.question;
    document.getElementById('quiz-progress').textContent = `Question ${currentQuestion + 1}/${quizData.length}`;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = ''; // Clear previous options
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    // Disable all buttons to prevent double-clicking
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    const correctIndex = quizData[currentQuestion].correct;
    
    if (selectedIndex === correctIndex) {
        btnElement.classList.add('correct');
        score++;
    } else {
        btnElement.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct'); // Show correct answer
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1500); // Wait 1.5 seconds before next question
}

function showResults() {
    document.getElementById('quiz-ui').classList.add('hidden');
    const resultUI = document.getElementById('quiz-result');
    resultUI.classList.remove('hidden');
    
    const percentage = Math.round((score / quizData.length) * 100);
    document.getElementById('score-display').textContent = `${percentage}%`;
    
    const msg = document.getElementById('score-message');
    if(percentage === 100) msg.textContent = "Excellent! Perfect Score!";
    else if(percentage >= 60) msg.textContent = "Good Job! Keep it up!";
    else msg.textContent = "Keep Practicing! You'll get it next time.";
}

/* =========================================
   4. GAME LOGIC: WORD SCRAMBLE
========================================= */
const words = [
    { word: "SOFTWARE", hint: "Programs and operating information used by a computer." },
    { word: "LANGUAGE", hint: "Method of human communication." },
    { word: "GRAMMAR", hint: "The whole system and structure of a language." },
    { word: "VOCABULARY", hint: "Body of words used in a particular language." }
];

let currentWordObj;
let gameScore = 0;

function scrambleWord(word) {
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join(' '); // Add spaces for readability
}

function initScramble() {
    // Pick random word
    const randIndex = Math.floor(Math.random() * words.length);
    currentWordObj = words[randIndex];
    
    document.getElementById('scrambled-word').textContent = scrambleWord(currentWordObj.word);
    document.getElementById('word-hint').textContent = currentWordObj.hint;
    
    const input = document.getElementById('user-guess');
    input.value = '';
    input.focus();
    
    document.getElementById('game-feedback').textContent = '';
}

function checkScramble() {
    const guess = document.getElementById('user-guess').value.toUpperCase().trim();
    const feedback = document.getElementById('game-feedback');
    
    if (guess === currentWordObj.word) {
        feedback.textContent = "Correct! Well done.";
        feedback.style.color = "var(--primary-color)";
        gameScore += 10;
        document.getElementById('game-score').textContent = gameScore;
        setTimeout(initScramble, 1500); // Load next word automatically
    } else {
        feedback.textContent = "Oops! Try again.";
        feedback.style.color = "#ff4b4b";
    }
}