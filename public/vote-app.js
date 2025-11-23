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
    const ctx = document.getElementById('chartVotos').getContext('2d');

    // Ordenar os times do maior para o menor
    const sortedTeams = Object.entries(votos).sort((a, b) => b[1] - a[1]);
    const labels = sortedTeams.map(item => item[0]);
    const dataValues = sortedTeams.map(item => item[1]);

    // Cores mapeadas
    const teamColors = {
        "Corinthians": "#ffffff",
        "Palmeiras": "#006437",
        "São Paulo": "#ff0000",
        "Santos": "#000000",
        "Flamengo": "#c3281e",
        "Vasco": "#ffffff",
        "Fluminense": "#9f0220",
        "Botafogo": "#ffffff",
        "Atlético-MG": "#ffffff",
        "Cruzeiro": "#0053a0",
        "Grêmio": "#0d80bf",
        "Internacional": "#e20e0e"
    };
    // Se o time não tiver cor definida, usa cinza
    const bgColors = labels.map(team => teamColors[team] || '#777');
    // Bordas brancas para destacar no fundo escuro
    const borderColors = labels.map(() => '#ffffff');

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pontos de Torcida',
                data: dataValues,
                backgroundColor: bgColors,
                borderColor: borderColors, // Borda branca em todos
                borderWidth: 1,
                borderRadius: 4,
                barThickness: 25,
            }]
        },
        options: {
            indexAxis: 'y', // Gráfico Horizontal
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Voto Computado!',
                    color: '#ffffff',
                    font: { size: 20, weight: 'bold' },
                    padding: { bottom: 5 }
                },
                subtitle: {
                    display: true,
                    text: 'Seu conhecimento de futebol ajudou seu time.',
                    color: '#cccccc',
                    font: { size: 14 },
                    padding: { bottom: 20 }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.2)' }, // Linhas da grade mais claras
                    ticks: { color: '#cccccc' }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: '#ffffff', // <--- AQUI ESTA A CORREÇÃO (BRANCO)
                        font: { size: 14, weight: 'bold' }
                    }
                }
            }
        }
    });

    // Ajusta a altura do gráfico
    document.getElementById('chartVotos').style.height = '600px';
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