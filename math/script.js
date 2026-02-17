
let currentNum1, currentNum2, correctAnswer;
let currentInput = "";
let startTime;

let stats = JSON.parse(localStorage.getItem('mathStats')) || {
    total: 0,
    correct: 0,
    incorrect: 0,
    totalResponseTime: 0
};

function generateQuestion() {
    currentNum1 = Math.floor(Math.random() * 19) + 2;
    currentNum2 = Math.floor(Math.random() * 19) + 2;
    correctAnswer = currentNum1 * currentNum2;
    
    document.getElementById('question').innerText = `${currentNum1} x ${currentNum2}`;
    currentInput = "";
    updateInputDisplay();
    document.getElementById('feedback').innerText = "";
    startTime = Date.now();
}

function back() {
    if (currentInput) {
        currentInput = currentInput.substring(0, currentInput.length -1);
        updateInputDisplay();
    } 
}

function appendNumber(num) {
    currentInput += num;
    updateInputDisplay();
}

function updateInputDisplay() {
    document.getElementById('user-input').innerText = currentInput || "0";
}

function checkAnswer() {
    if (currentInput === "") return;
    
    const timeTaken = (Date.now() - startTime) / 1000;
    const userAnswer = parseInt(currentInput);
    const feedbackEl = document.getElementById('feedback');
    
    stats.total++;
    stats.totalResponseTime += timeTaken;

    if (userAnswer === correctAnswer) {
        stats.correct++;
        feedbackEl.style.color = "#2ecc71";
        feedbackEl.innerText = "Correct!";
        setTimeout(generateQuestion, 2000);
    } else {
        stats.incorrect++;
        feedbackEl.style.color = "#e74c3c";
        feedbackEl.innerText = `Incorrect! Correct: ${correctAnswer}`;
    }

    saveStats();
    
}

function skipQuestion() {
    generateQuestion();
}

function saveStats() {
    localStorage.setItem('mathStats', JSON.stringify(stats));
}

function resetStats() {
    stats = { total: 0, correct: 0, incorrect: 0, totalResponseTime: 0 };
    saveStats();
    alert("Statistics have been reset.");
}

function showStats() {
    const avgTime = stats.total > 0 ? (stats.totalResponseTime / stats.total).toFixed(2) : 0;
    const percentage = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : 0;
    
    const dataHtml = `
        <p>Total Operations: ${stats.total}</p>
        <p>Correct: ${stats.correct}</p>
        <p>Incorrect: ${stats.incorrect}</p>
        <p>Accuracy: ${percentage}%</p>
        <p>Avg Time: ${avgTime}s</p>
    `;
    
    document.getElementById('stats-data').innerHTML = dataHtml;
    document.getElementById('stats-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('stats-modal').style.display = 'none';
}

// Init
generateQuestion();
