const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/login.html'; // Proteção: Se não logado, chuta pro login

let currentQuestion = 1;
let score = 0;
const totalQuestions = 15; // <<--- MUDANÇA AQUI (15 Perguntas)
let isAnswering = false;
let currentCorrectAnswer = ''; // Guarda a resposta certa

// Configurações iniciais
document.getElementById('user-name-display').innerText = `Olá, ${localStorage.getItem('userName')}!`;
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

async function loadQuestion() {
    isAnswering = true;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('feedback-msg').style.display = 'none';
    document.getElementById('options-container').innerHTML = '';
    document.getElementById('question-text').innerText = 'Carregando...';

    try {
        const res = await fetch('/api/get-question', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) { alert('Sessão expirada');
            window.location.href = '/login.html'; return; }

        const data = await res.json();

        // Renderiza a pergunta
        document.getElementById('question-text').innerText = data.pergunta;
        document.getElementById('question-count').innerText = `Pergunta ${currentQuestion} de ${totalQuestions}`;
        currentCorrectAnswer = data.respostaCorreta; // Salva a resposta

        // Renderiza as opções
        data.opcoes.forEach(opcao => {
            const btn = document.createElement('button');
            btn.innerText = opcao;
            btn.className = 'opcao'; // Classe do CSS
            btn.onclick = () => checkAnswer(opcao);
            document.getElementById('options-container').appendChild(btn);
        });

    } catch (err) {
        console.error(err);
    }
}

function checkAnswer(selected) {
    if (!isAnswering) return; // Evita duplo clique
    isAnswering = false;

    const feedbackEl = document.getElementById('feedback-msg');
    feedbackEl.style.display = 'block';

    if (selected === currentCorrectAnswer) {
        score++;
        document.getElementById('score-display').innerText = `Pontos: ${score}`;
        feedbackEl.innerText = "RESPOSTA CORRETA!";
        feedbackEl.className = "mensagem correta"; // CSS verde
    } else {
        feedbackEl.innerText = `QUE PENA! A resposta era: ${currentCorrectAnswer}`;
        feedbackEl.className = "mensagem errada"; // CSS vermelho
    }

    // Mostra botão "Próxima"
    const nextBtn = document.getElementById('next-btn');
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = nextQuestion;
}

async function nextQuestion() {
    currentQuestion++;
    if (currentQuestion > totalQuestions) {
        // Fim do jogo! Salva o placar no backend
        await fetch('/api/save-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ score: score })
        });

        // Salva localmente para exibir na próxima tela
        localStorage.setItem('quizScore', score);
        window.location.href = '/result.html';
    } else {
        loadQuestion();
    }
}

// Inicia
loadQuestion();