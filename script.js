let currentQuestionIndex = 0;
let score = 0;
const totalQuestions = 5;
let startTime;
let timerInterval;

function startQuiz() {
    currentQuestionIndex = 1;
    score = 0;
    startTime = new Date();
    startTimer();
    showSection('question-1');
}

function showSection(sectionClass) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector('.' + sectionClass).classList.add('active');
}

function checkAnswer(questionClass, isCorrect) {
    if (isCorrect) {
        score++;
    }
    if (currentQuestionIndex < totalQuestions) {
        currentQuestionIndex++;
        showSection('question-' + currentQuestionIndex);
    } else {
        showResult();
    }
}

function showResult() {
    stopTimer();
    const finalTime = document.getElementById('time').textContent;
    if (score === totalQuestions) {
        document.getElementById('score-display').textContent = score;
        showSection('win-screen');
    } else {
        document.getElementById('score-display-lose').textContent = score;
        showSection('lose-screen');
    }
    updateLeaderboard(score, finalTime);
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.querySelectorAll('.timer span').forEach(span => {
        span.textContent = timeString;
    });
}

function stopTimer() {
    clearInterval(timerInterval);
}

function updateLeaderboard(score, time) {
    let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    leaderboard.push({ score, time });
    leaderboard.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.time.localeCompare(b.time);
    });
    leaderboard = leaderboard.slice(0, 10); // Keep only top 10
    localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
    const tbody = document.querySelector('#leaderboard tbody');
    tbody.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = entry.score;
        row.insertCell(2).textContent = entry.time;
    });
    showSection('leaderboard-screen');
}