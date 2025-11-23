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
    showLoading();
    try {
        const res = await fetch('/api/get-votes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        hideLoading();

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

    const sortedTeams = Object.entries(votos).sort((a, b) => b[1] - a[1]);
    const labels = sortedTeams.map(item => item[0]);
    const dataValues = sortedTeams.map(item => item[1]);

    // Cores dos times
    const teamColors = {
        "Corinthians": "#000000",
        "Palmeiras": "#006437",
        "São Paulo": "#ff0000",
        "Santos": "#000000",
        "Flamengo": "#c3281e",
        "Vasco": "#000000",
        "Fluminense": "#9f0220",
        "Botafogo": "#000000",
        "Atlético-MG": "#000000",
        "Cruzeiro": "#0053a0",
        "Grêmio": "#0d80bf",
        "Internacional": "#e20e0e"
    };
    const bgColors = labels.map(team => teamColors[team] || '#555');

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pontos',
                data: dataValues,
                backgroundColor: bgColors,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // GRÁFICO HORIZONTAL
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'RANKING DA TORCIDA',
                    color: '#000000', // Título PRETO
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: '#000000' }, // Texto eixo X PRETO
                    grid: { color: '#ddd' }
                },
                y: {
                    ticks: {
                        color: '#000000', // NOMES DOS TIMES EM PRETO (AQUI ESTAVA O ERRO)
                        font: { size: 12, weight: 'bold' }
                    },
                    grid: { display: false }
                }
            }
        }
    });
    // Força altura para caber todos os times
    chartContainer.style.height = '500px';
}

async function votar(time) {
    showLoading();
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
    chart.data.datasets[0].data = Object.entries(data.totais)
        .sort((a, b) => b[1] - a[1])
        .map(item => item[1]);
    chart.update();
}

loadData();