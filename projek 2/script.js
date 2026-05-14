// 1. QUESTION DATABASE (University & Industry Standard)
const questionsData = [
    {
        question: "Choose the most professional way to disagree during a team sprint planning:",
        options: ["You are totally wrong.", "I see your point, but perhaps we could consider an alternative.", "That idea is bad.", "No way we can do that."],
        correctAnswer: "I see your point, but perhaps we could consider an alternative."
    },
    {
        question: "Grammar check: 'By the time the project manager arrives, the development team ___ the core module.'",
        options: ["will have finished", "finished", "finishes", "has finished"],
        correctAnswer: "will have finished"
    },
    {
        question: "In web development using PHP, which specific function is used to output text directly to the browser?",
        options: ["System.out.println", "console.log", "echo", "document.write"],
        correctAnswer: "echo"
    },
    {
        question: "Vocabulary: What is the appropriate term for the process of finding and resolving hidden bugs in the source code?",
        options: ["Deploying", "Compiling", "Debugging", "Refactoring"],
        correctAnswer: "Debugging"
    },
    {
        question: "Which of the following action verbs is the most impactful to use on your professional CV?",
        options: ["Did", "Engineered", "Made", "Got"],
        correctAnswer: "Engineered"
    }
];

// 2. GAME STATE VARIABLES
let currentQuestionIndex = 0;
let xpScore = 0;
let playerLives = 3;

// 3. DISPLAY QUESTION FUNCTION
function displayQuestion() {
    const currentQuestion = questionsData[currentQuestionIndex];

    // Display the question
    document.getElementById("question-text").innerText = currentQuestion.question;

    // Clear previous options
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = ""; 

    // Generate new option buttons
    currentQuestion.options.forEach(optionText => {
        const button = document.createElement("button");
        button.innerText = optionText;
        button.classList.add("btn-option"); 
        
        button.onclick = () => checkAnswer(optionText, button);
        
        optionsContainer.appendChild(button);
    });

    // Hide the 'Next' button initially
    document.getElementById("btn-next").style.display = "none";
}

// 4. CHECK ANSWER FUNCTION
function checkAnswer(selectedAnswer, clickedButton) {
    const currentQuestion = questionsData[currentQuestionIndex];
    const allButtons = document.querySelectorAll(".btn-option");

    // Disable all buttons to prevent multiple clicks
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedAnswer === currentQuestion.correctAnswer) {
        // CORRECT ANSWER
        clickedButton.classList.add("correct");
        xpScore += 10;
        document.getElementById("score-text").innerText = xpScore;
    } else {
        // WRONG ANSWER
        clickedButton.classList.add("wrong");
        playerLives -= 1;
        updateLivesUI();
    }

    // Show the 'Next Question' button
    document.getElementById("btn-next").style.display = "block";

    // Check for Game Over condition
    if (playerLives === 0) {
        endGame();
    }
}

// 5. GO TO NEXT QUESTION FUNCTION
function nextQuestion() {
    currentQuestionIndex++; 

    if (currentQuestionIndex < questionsData.length) {
        displayQuestion();
    } else {
        endGame(); 
    }
}

// 6. UPDATE LIVES UI FUNCTION
function updateLivesUI() {
    let heartsText = "";
    for (let i = 0; i < playerLives; i++) {
        heartsText += "❤️";
    }
    document.getElementById("lives-text").innerText = playerLives > 0 ? heartsText : "☠️"; 
}

// 7. END GAME FUNCTION
function endGame() {
    document.querySelector(".question-box").style.display = "none";
    document.getElementById("options-container").style.display = "none";
    document.getElementById("btn-next").style.display = "none";
    
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "block";
    document.getElementById("final-score").innerText = xpScore;
}

// 8. RESTART GAME FUNCTION
function restartGame() {
    currentQuestionIndex = 0;
    xpScore = 0;
    playerLives = 3;
    
    document.getElementById("score-text").innerText = xpScore;
    updateLivesUI();
    
    document.querySelector(".question-box").style.display = "block";
    document.getElementById("options-container").style.display = "grid";
    document.getElementById("game-over-screen").style.display = "none";
    
    displayQuestion();
}

// INITIALIZE THE GAME
displayQuestion();