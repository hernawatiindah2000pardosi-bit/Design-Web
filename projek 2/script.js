/* =========================================
   1. NAVIGATION LOGIC (Single Page App)
========================================= */
function showSection(sectionId) {
    document.querySelectorAll('.view-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Otomatis menutup hamburger menu setelah memilih halaman di HP
    const navMenu = document.querySelector('.nav-links');
    if (navMenu) {
        navMenu.classList.remove('active');
    }
    
    if (sectionId !== 'games') {
        stopCatcherGame();
    }
    
    if (sectionId === 'exercises') startQuiz();
    if (sectionId === 'games') {
        initScramble();
        startCatcherGame(); 
    }
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

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.add('hidden');
    }
}

/* =========================================
   3. INTERMEDIATE QUIZ ENGINE
========================================= */
const quizData = [
    // Module A: Functional Syntax & Sentence Building
    {
        question: "Choose the correct relative pronoun: 'The database system ___ Herna built last week handles data smoothly.'",
        options: ["who", "which", "whose", "where"],
        correct: 1
    },
    {
        question: "Complete the sentence with the best linking word: 'The team added a new features, ___ they still need to fix a minor bug.'",
        options: ["because", "therefore", "although", "so"],
        correct: 2
    },
    {
        question: "Change this sentence to the passive voice: 'The software engineer optimized the code.'",
        options: ["The code is optimized by the software engineer.", "The code optimized the software engineer.", "The code was optimized by the software engineer.", "The code has optimized by the software engineer."],
        correct: 2
    },
    // Module B: Practical Tenses & Conditionals
    {
        question: "Select the correct tense combination: 'I ___ PHP for two years, but last month I ___ learning React JS.'",
        options: ["have studied / started", "studied / have started", "study / start", "am studying / was starting"],
        correct: 0
    },
    {
        question: "Complete the conditional sentence: 'If the server crashes during production, the monitoring system ___ us immediately.'",
        options: ["notified", "will notify", "would notify", "notifies"],
        correct: 1
    },
    {
        question: "Choose the correct Second Conditional form for a hypothetical situation: 'If we ___ a bigger budget, we ___ hire a remote backend developer.'",
        options: ["have / will", "had / would", "had / will", "have / would"],
        correct: 1
    },
    // Module C: Professional Workplace Expressions
    {
        question: "Your team lead tells you to 'put a feature on the back burner.' What does this mean?",
        options: ["Delete the feature completely.", "Finish the feature immediately.", "Delay the feature and focus on more important tasks.", "Test the feature for bugs."],
        correct: 2
    },
    {
        question: "Which phrase is the most polite way to disagree with a colleague during a project meeting?",
        options: ["Your logic is completely wrong.", "I see your point, but I think we should consider a different approach.", "I don't like this website structure.", "Change your code because it's bad."],
        correct: 1
    }
];

let currentQuestion = 0;
let quizScore = 0;

function startQuiz() {
    currentQuestion = 0;
    quizScore = 0;
    document.getElementById('quiz-ui').classList.remove('hidden');
    document.getElementById('quiz-result').classList.add('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = quizData[currentQuestion];
    document.getElementById('quiz-question').textContent = q.question;
    document.getElementById('quiz-progress').textContent = `Quiz ${currentQuestion + 1}/${quizData.length}`;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.className = 'option-btn';
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    const correctIndex = quizData[currentQuestion].correct;
    
    if (selectedIndex === correctIndex) {
        btnElement.classList.add('correct');
        quizScore++;
    } else {
        btnElement.classList.add('wrong');
        allBtns[correctIndex].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 1200);
}

function showResults() {
    document.getElementById('quiz-ui').classList.add('hidden');
    const resultUI = document.getElementById('quiz-result');
    resultUI.classList.remove('hidden');
    
    const percentage = Math.round((quizScore / quizData.length) * 100);
    document.getElementById('score-display').textContent = `${percentage}%`;
    
    const msg = document.getElementById('score-message');
    if(percentage === 100) msg.textContent = "Excellent! You have mastered the intermediate modules!";
    else if(percentage >= 70) msg.textContent = "Good job! You have a solid grasp of intermediate English.";
    else msg.textContent = "Keep practicing. Review the study cards and try again!";
}

/* =========================================
   4. GAME LOGIC: WORD SCRAMBLE
========================================= */
const words = [
    { word: "ALTHOUGH", hint: "Conjunction: Used to connect two contrasting or opposing ideas cleanly." },
    { word: "OPTIMIZE", hint: "Verb: To improve a program or system to make it faster and more efficient." },
    { word: "DATABASE", hint: "Noun: An organized collection of structured data stored in a computer system." },
    { word: "FEEDBACK", hint: "Noun: Helpful information or opinions given to someone about their work." },
    { word: "CRITERIA", hint: "Noun: A principle or standard by which something is judged or decided." },
    { word: "IMPROVE", hint: "Verb: To make something better than it was before." }
];

let currentWordObj;
let gameScore = 0;

function scrambleWord(word) {
    let arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join(' ');
}

function initScramble() {
    const randIndex = Math.floor(Math.random() * words.length);
    currentWordObj = words[randIndex];
    
    document.getElementById('scrambled-word').textContent = scrambleWord(currentWordObj.word);
    document.getElementById('word-hint').textContent = currentWordObj.hint;
    
    const input = document.getElementById('user-guess');
    input.value = '';
    
    document.getElementById('game-feedback').textContent = '';
}

function checkScramble() {
    const guess = document.getElementById('user-guess').value.toUpperCase().trim();
    const feedback = document.getElementById('game-feedback');
    
    if (guess === currentWordObj.word) {
        feedback.textContent = "Correct answer! +10 points.";
        feedback.style.color = "var(--primary-color)";
        gameScore += 10;
        document.getElementById('game-score').textContent = gameScore;
        setTimeout(initScramble, 1500);
    } else {
        feedback.textContent = "Not quite right. Try again!";
        feedback.style.color = "#ff4b4b";
    }
}

/* =========================================
   5. GAME LOGIC: VOCAB CATCHER
========================================= */
const catcherDataset = [
    { id: "To make code faster and efficient", correct: "Optimize", wrongs: ["Delete", "Postpone", "Ignore", "Damage"] },
    { id: "Connects contrasting ideas", correct: "Although", wrongs: ["Because", "Therefore", "So", "And"] },
    { id: "Structured system data storage", correct: "Database", wrongs: ["Layout", "Monologue", "Feedback", "Prototype"] },
    { id: "Helpful reviews on your work", correct: "Feedback", wrongs: ["Argument", "Blame", "Conflict", "Ignore"] },
    { id: "Delay a low-priority task", correct: "Postpone", wrongs: ["Accelerate", "Deliver", "Optimize", "Deploy"] },
    { id: "A phrase for disagreeing politely", correct: "I see your point", wrongs: ["You are wrong", "Stop talking", "I hate this", "This is bad"] },
    { id: "Action completed in the past", correct: "Simple Past", wrongs: ["Present Continuous", "Simple Future", "Present Perfect", "Imperative"] }
];

const catcherArea = document.getElementById('catcher-game-area');
const catcherBasket = document.getElementById('catcher-basket');
const catcherScoreDisplay = document.getElementById('catcher-score');
const catcherLivesDisplay = document.getElementById('catcher-lives');
const catcherGameOverScreen = document.getElementById('catcher-gameover-screen');
const catcherFinalScore = document.getElementById('catcher-final-score');
const catcherTargetDisplay = document.getElementById('catcher-target-word');

let catcherActiveQuestion = {};
let catcherScore = 0;
let catcherLives = 3;
let isCatcherGameOver = false;
let catcherSpawnInterval = null;

function setNextCatcherQuestion() {
    if (isCatcherGameOver) return;
    const randomIndex = Math.floor(Math.random() * catcherDataset.length);
    catcherActiveQuestion = catcherDataset[randomIndex];
    catcherTargetDisplay.textContent = catcherActiveQuestion.id;
}

// Handler Basket Responsif (Mouse & Touch HP)
if(catcherArea && catcherBasket) {
    catcherArea.addEventListener('mousemove', (e) => {
        if (isCatcherGameOver) return;
        const rect = catcherArea.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let basketX = mouseX - (catcherBasket.offsetWidth / 2);
        moveBasket(basketX);
    });

    catcherArea.addEventListener('touchmove', (e) => {
        if (isCatcherGameOver) return;
        const rect = catcherArea.getBoundingClientRect();
        let touchX = e.touches[0].clientX - rect.left;
        let basketX = touchX - (catcherBasket.offsetWidth / 2);
        moveBasket(basketX);
    });
}

function moveBasket(xPos) {
    if (xPos < 0) xPos = 0;
    if (xPos > catcherArea.offsetWidth - catcherBasket.offsetWidth) {
        xPos = catcherArea.offsetWidth - catcherBasket.offsetWidth;
    }
    catcherBasket.style.left = xPos + 'px';
}

function spawnFallingWord() {
    if (isCatcherGameOver || document.getElementById('games').classList.contains('hidden')) return;

    const wordEl = document.createElement('div');
    wordEl.className = 'catcher-falling-word';

    const pickCorrect = Math.random() < 0.4;
    if (pickCorrect) {
        wordEl.textContent = catcherActiveQuestion.correct;
        wordEl.dataset.type = "correct";
    } else {
        const randomWrong = catcherActiveQuestion.wrongs[Math.floor(Math.random() * catcherActiveQuestion.wrongs.length)];
        wordEl.textContent = randomWrong;
        wordEl.dataset.type = "wrong";
    }

    catcherArea.appendChild(wordEl);
    const randomX = Math.floor(Math.random() * (catcherArea.offsetWidth - 60));
    wordEl.style.left = randomX + 'px';
    wordEl.style.top = '0px';

    let currentY = 0;
    let speed = 2.2 + Math.random() * 2.2; 

    let fallTimer = setInterval(() => {
        if (isCatcherGameOver) {
            clearInterval(fallTimer);
            wordEl.remove();
            return;
        }

        currentY += speed;
        wordEl.style.top = currentY + 'px';

        const basketRect = catcherBasket.getBoundingClientRect();
        const wordRect = wordEl.getBoundingClientRect();

        if (
            wordRect.bottom >= basketRect.top &&
            wordRect.top <= basketRect.bottom &&
            wordRect.right >= basketRect.left &&
            wordRect.left <= basketRect.right
        ) {
            clearInterval(fallTimer);
            
            if (wordEl.dataset.type === "correct") {
                catcherScore += 15;
                catcherScoreDisplay.textContent = catcherScore;
                setNextCatcherQuestion();
            } else {
                catcherLives--;
                catcherLivesDisplay.textContent = catcherLives;
                if (catcherLives <= 0) endCatcherGame();
            }
            wordEl.remove();
        } 
        else if (currentY > catcherArea.offsetHeight) {
            clearInterval(fallTimer);
            if (wordEl.dataset.type === "correct") {
                catcherLives--;
                catcherLivesDisplay.textContent = catcherLives;
                if (catcherLives <= 0) endCatcherGame();
            }
            wordEl.remove();
        }
    }, 20);
}

function startCatcherGame() {
    stopCatcherGame();
    isCatcherGameOver = false;
    catcherScore = 0;
    catcherLives = 3;
    catcherScoreDisplay.textContent = catcherScore;
    catcherLivesDisplay.textContent = catcherLives;
    catcherGameOverScreen.style.display = 'none';
    
    setNextCatcherQuestion();
    catcherSpawnInterval = setInterval(spawnFallingWord, 1700);
}

function stopCatcherGame() {
    if (catcherSpawnInterval) {
        clearInterval(catcherSpawnInterval);
        catcherSpawnInterval = null;
    }
    document.querySelectorAll('.catcher-falling-word').forEach(el => el.remove());
}

function endCatcherGame() {
    isCatcherGameOver = true;
    stopCatcherGame();
    catcherFinalScore.textContent = catcherScore;
    catcherGameOverScreen.style.display = 'flex';
}

/* =========================================
   6. MOBILE NAVIGATION (HAMBURGER LOGIC)
========================================= */
const menuBtn = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-links');

if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        navMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });
}