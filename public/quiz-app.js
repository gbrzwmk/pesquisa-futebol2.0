// public/quiz-app.js
const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/login.html';

// --- INJEÇÃO DO SPINNER (Automático) ---
const loaderHTML = `
<div id="global-loader" class="loader-container">
    <div class="spinner"></div>
    <div class="loader-text">Carregando...</div>
</div>`;
document.body.insertAdjacentHTML('beforeend', loaderHTML);
const loader = document.getElementById('global-loader');
const showLoading = () => loader.style.display = 'flex';
const hideLoading = () => loader.style.display = 'none';

// --- LÓGICA DO QUIZ ---
let currentQuestion = 1;
let score = 0;
const totalQuestions = 15;
let isAnswering = false;
let currentCorrectAnswer = '';

// Header Info
document.getElementById('user-name-display').innerText = `Olá, ${localStorage.getItem('userName')}!`;
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

async function loadQuestion() {
    isAnswering = true; // Bloqueia cliques enquanto carrega
    showLoading();

    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('feedback-msg').style.display = 'none';
    const container = document.getElementById('options-container');
    container.innerHTML = '';

    try {
        const res = await fetch('/api/get-question', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        hideLoading();

        if (res.status === 401) { alert('Sessão expirada');
            window.location.href = '/login.html'; return; }

        const data = await res.json();
        document.getElementById('question-text').innerText = data.pergunta;
        document.getElementById('question-count').innerText = `Pergunta ${currentQuestion} de ${totalQuestions}`;
        currentCorrectAnswer = data.respostaCorreta;

        data.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.innerText = opcao;
            btn.className = 'opcao';
            // Passamos o PRÓPRIO botão para a função checar
            btn.onclick = () => checkAnswer(opcao, btn);
            container.appendChild(btn);
        });
        isAnswering = false; // Libera cliques

    } catch (err) {
        hideLoading();
        console.error(err);
    }
}

function checkAnswer(selected, btnElement) {
    if (isAnswering) return;
    isAnswering = true; // Bloqueia novos cliques

    const feedbackEl = document.getElementById('feedback-msg');
    feedbackEl.style.display = 'block';

    // Pega TODOS os botões para pintar o certo
    const allButtons = document.querySelectorAll('.opcao');

    if (selected === currentCorrectAnswer) {
        score++;
        document.getElementById('score-display').innerText = `Pontos: ${score}`;
        feedbackEl.innerText = "GOLAÇO! Resposta Correta!";
        feedbackEl.className = "mensagem correta";
        btnElement.classList.add('certa-anim'); // Efeito verde
    } else {
        feedbackEl.innerText = `NA TRAVE! A resposta era: ${currentCorrectAnswer}`;
        feedbackEl.className = "mensagem errada";
        btnElement.classList.add('errada-anim'); // Efeito vermelho

        // Encontra e ilumina o botão certo para o usuário aprender
        allButtons.forEach(btn => {
            if (btn.innerText === currentCorrectAnswer) {
                btn.classList.add('certa-anim');
            }
        });
    }

    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = nextQuestion;
}

async function nextQuestion() {
    currentQuestion++;
    if (currentQuestion > totalQuestions) {
        showLoading();
        await fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ score: score })
        });
        localStorage.setItem('quizScore', score);
        window.location.href = '/result.html';
    } else {
        loadQuestion();
    }
}

loadQuestion();