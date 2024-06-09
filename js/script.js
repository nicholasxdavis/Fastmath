// /path/to/your/script.js

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
    if (event.key === 'Enter') {
        checkAnswer();
    } else if (event.key === 'r' && event.shiftKey) {
        retry();
    }
});

function generateQuestion() {
    clearInterval(timerInterval);
    const [num1, num2, operator] = getQuestionComponents();
    const question = `${num1} ${operator} ${num2}`;
    const explanation = getExplanation(num1, num2, operator);

    questionElement.textContent = question;
    explanationElement.textContent = explanation;

    startTimer();
}

function getQuestionComponents() {
    const num1 = getRandomNumber();
    const num2 = getRandomNumber(true);
    const operator = getRandomOperator();

    if (operator === '-') {
        return [Math.max(num1, num2), Math.min(num1, num2), operator];
    } else if (operator === '/') {
        return [num1 * num2, num2, operator];
    }
    return [num1, num2, operator];
}

function getExplanation(num1, num2, operator) {
    const explanations = {
        '+': `To solve this addition problem, simply add ${num1} and ${num2} together.`,
        '-': `To solve this subtraction problem, subtract ${num2} from ${num1}.`,
        '*': `To solve this multiplication problem, multiply ${num1} by ${num2}.`,
        '/': `To solve this division problem, divide ${num1} by ${num2}.`
    };
    return explanations[operator];
}

function updateStreak(isCorrect) {
    streakCount = isCorrect ? streakCount + 1 : 0;
    streakElement.textContent = streakCount;

    if (streakCount > highScore) {
        highScore = streakCount;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
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
    streakCount = 0;
    streakElement.textContent = streakCount;
    generateQuestion();
    userAnswerElement.focus();
}

function getRandomNumber(isForDivision = false) {
    const ranges = {
        'easy': [1, 10],
        'medium': [10, 50],
        'hard': isForDivision ? [2, 20] : [20, 100] // Keep divisor range smaller for division
    };
    const [min, max] = ranges[difficulty];
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomOperator() {
    const operators = {
        'easy': ['+', '-'],
        'medium': ['+', '-', '*'],
        'hard': ['+', '-', '*', '/']
    };
    const ops = operators[difficulty];
    return ops[Math.floor(Math.random() * ops.length)];
}

function loadQuestions(difficultyLevel) {
    difficulty = difficultyLevel;
    generateQuestion();
}

function checkAnswer() {
    const userAnswer = parseFloat(userAnswerElement.value);
    const [num1, operator, num2] = questionElement.textContent.split(' ');
    const correctAnswer = calculateAnswer(parseInt(num1), operator, parseInt(num2));

    clearInterval(timerInterval);
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

function calculateAnswer(num1, operator, num2) {
    const operations = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b
    };
    return operations[operator](num1, num2);
}

highScoreElement.textContent = highScore;
generateQuestion();
