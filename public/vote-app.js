// public/vote-app.js
const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/login.html';

// --- SPINNER ---
const loaderHTML = `
<div id="global-loader" class="loader-container">
    <div class="spinner"></div>
    <div class="loader-text">Computando...</div>
</div>`;
document.body.insertAdjacentHTML('beforeend', loaderHTML);
const loader = document.getElementById('global-loader');
const showLoading = () => loader.style.display = 'flex';
const hideLoading = () => loader.style.display = 'none';

document.getElementById('user-name-display').innerText = `Olá, ${localStorage.getItem('userName')}!`;
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

let chart;
const buttonsContainer = document.getElementById('buttons-container');
const votedMessage = document.getElementById('voted-message');
const chartContainer = document.getElementById('chartVotos');

async function loadData() {
    showLoading(); // Mostra spinner ao abrir a página
    try {
        const res = await fetch('/api/get-votes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        hideLoading(); // Esconde spinner

        renderChart(data.totais);

        if (data.hasVoted) {
            buttonsContainer.style.display = 'none';
            votedMessage.style.display = 'block';
        } else {
            buttonsContainer.style.display = 'grid';
            votedMessage.style.display = 'none';
        }
    } catch (err) {
        hideLoading();
        console.error(err);
    }
}

function renderChart(votos) {
    const ctx = chartContainer.getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Corinthians', 'Palmeiras', 'São Paulo', 'Santos'],
            datasets: [{
                label: 'Votos',
                data: [votos['Corinthians'], votos['Palmeiras'], votos['São Paulo'], votos['Santos']],
                backgroundColor: ['#ffffff', '#00ff88', '#ff6b6b', '#cccccc'],
                /* Cores vivas */
                borderColor: '#333',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { stepSize: 1, color: '#eee' }, grid: { color: '#444' } },
                x: { ticks: { color: '#eee', font: { weight: 'bold', size: 12 } }, grid: { display: false } }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Resultado Parcial', color: '#ffc107', font: { size: 18 } }
            }
        }
    });
}

async function votar(time) {
    showLoading(); // Spinner enquanto vota
    try {
        const res = await fetch('/api/submit-vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ team: time })
        });

        const data = await res.json();
        hideLoading();

        if (res.status === 200) {
            buttonsContainer.style.display = 'none';
            votedMessage.style.display = 'block';
            updateChart();
        } else {
            alert(data.error);
        }
    } catch (err) {
        hideLoading();
        alert('Erro ao votar');
    }
}

async function updateChart() {
    const res = await fetch('/api/get-votes', { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    chart.data.datasets[0].data = [
        data.totais['Corinthians'],
        data.totais['Palmeiras'],
        data.totais['São Paulo'],
        data.totais['Santos']
    ];
    chart.update();
}

loadData();