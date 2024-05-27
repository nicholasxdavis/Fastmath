console.log("Script Loaded");
let timerInterval;
let streakCount = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;
let difficulty = 'medium';
const questionElement = document.getElementById('question');
const explanationElement = document.getElementById('explanation');
const timerElement = document.getElementById('timer');
const feedbackElement = document.getElementById('feedback');
const highScoreElement = document.getElementById('highScoreCount');
const streakElement = document.getElementById('streakCount');
const userAnswerElement = document.getElementById('userAnswer');

document.addEventListener('keydown', function(event) {
    console.log(event.key);
    if (event.key === 'Enter') {
        checkAnswer(); // Submit answer when Enter key is pressed
    } else if (event.key === 'r' && event.shiftKey) {
        retry(); // Restart game when Shift+R is pressed
    }
});

function generateQuestion() {
    clearInterval(timerInterval); // Reset timer
    const num1 = getRandomNumber();
    const num2 = getRandomNumber();
    const operator = getRandomOperator();
    let question;
    let explanation;

    if (operator === '+') {
        question = `${num1} + ${num2}`;
        explanation = `To solve this addition problem, simply add ${num1} and ${num2} together. Adding two numbers together is the process of combining their values to find their total.`;
    } else if (operator === '-') {
        question = `${Math.max(num1, num2)} - ${Math.min(num1, num2)}`;
        explanation = `To solve this subtraction problem, subtract the smaller number (${Math.min(num1, num2)}) from the larger number (${Math.max(num1, num2)}). Subtracting one number from another is the process of finding the difference between their values.`;
    } else if (operator === '*') {
        question = `${num1} * ${num2}`; // Use '*' for multiplication
        explanation = `To solve this multiplication problem, multiply ${num1} by ${num2}. Multiplying two numbers together is the process of repeated addition of one of the numbers.`;
    } else if (operator === '/') {
        const dividend = num1 * num2; // Ensure a whole number result
        question = `${dividend} ÷ ${num2}`;
        explanation = `To solve this division problem, divide ${dividend} by ${num2}. Dividing one number by another is the process of finding out how many times the divisor can be subtracted from the dividend.`;
    }

    questionElement.textContent = question;
    explanationElement.textContent = explanation;

    startTimer();
}

function updateStreak(isCorrect) {
    streakCount = isCorrect ? streakCount + 1 : 0;
    streakElement.textContent = streakCount;

    if (streakCount > highScore) {
        highScore = streakCount;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore); // Save high score to localStorage
    }
}

function startTimer() {
    let seconds = 30;
    timerElement.classList.remove('red');
    timerInterval = setInterval(() => {
        timerElement.textContent = `Time left: ${seconds} seconds`;
        if (seconds <= 10) {
            timerElement.classList.add('red');
        }
        if (seconds < 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "Time's up!";
            setTimeout(() => {
                timerElement.textContent = '';
                generateQuestion();
            }, 1500);
        }
        seconds--;
    }, 1000);
}

function retry() {
    clearInterval(timerInterval);
    feedbackElement.textContent = '';
    timerElement.textContent = '';
    userAnswerElement.value = '';
    streakCount = 0; // Reset streak count to 0
    streakElement.textContent = streakCount; // Update streak element on the page
    generateQuestion();
    window.onload = function() {
        document.getElementById('userAnswer').focus();
    };
}

function getRandomNumber() {
    switch (difficulty) {
        case 'easy':
            console.log("Easy Question Loaded");
            return Math.floor(Math.random() * 9) + 1; // Generate single-digit numbers from 1 to 9
        case 'medium':
            console.log("Medium Question Loaded");
            return Math.floor(Math.random() * 90) + 10; // Generate two-digit numbers from 10 to 99
        case 'hard':
            console.log("Hard Question Loaded");
            return Math.floor(Math.random() * 900) + 100; // Generate three-digit numbers from 100 to 999
        default:
            console.error('Invalid difficulty level');
            return;
    }
}

function getRandomOperator() {
    switch (difficulty) {
        case 'easy':
            return ['+', '-'][Math.floor(Math.random() * 2)]; // Only addition and subtraction
        case 'medium':
            return ['+', '-', '*'][Math.floor(Math.random() * 3)]; // Addition, subtraction, and multiplication
        case 'hard':
            return ['+', '-', '*', '/'][Math.floor(Math.random() * 4)]; // Addition, subtraction, multiplication, and division
        default:
            console.error('Invalid difficulty level');
            return;
    }
}

function loadQuestions(difficultyLevel) {
    switch (difficultyLevel) {
        case 'easy':
            difficulty = 'easy';
            break;
        case 'medium':
            difficulty = 'medium';
            break;
        case 'hard':
            difficulty = 'hard';
            break;
        default:
            console.error('Invalid difficulty level');
            return;
    }
    generateQuestion();
}

function checkAnswer() {
    const userAnswer = parseFloat(userAnswerElement.value);
    const questionText = questionElement.textContent;
    const parts = questionText.split(' ');
    const num1 = parseInt(parts[0]);
    const operator = parts[1];
    const num2 = parseInt(parts[2]);
    let correctAnswer;

    if (operator === '+') {
        correctAnswer = num1 + num2;
    } else if (operator === '-') {
        correctAnswer = num1 - num2;
    } else if (operator === '*') {
        correctAnswer = num1 * num2;
    } else if (operator === '÷' || operator === '/') {
        correctAnswer = num1 / num2;
    }

    clearInterval(timerInterval);

    // Compare answers with tolerance for floating-point errors
    const tolerance = 0.0001;
    if (Math.abs(userAnswer - correctAnswer) < tolerance) {
        feedbackElement.textContent = 'Correct! Good job!';
        updateStreak(true);
        setTimeout(() => {
            feedbackElement.textContent = '';
            userAnswerElement.value = '';
            generateQuestion();
        }, 1500);
    } else {
        feedbackElement.textContent = `Incorrect. The correct answer is ${correctAnswer}. Keep trying!`;
        updateStreak(false);
    }
}

// Initialize the high score counter
highScoreElement.textContent = highScore;

// Initialize the first question
generateQuestion();
