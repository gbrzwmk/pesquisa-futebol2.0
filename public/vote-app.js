const token = localStorage.getItem('authToken');
// Se não está logado, chuta para a página de login
if (!token) window.location.href = '/login.html';

document.getElementById('user-name-display').innerText = `Olá, ${localStorage.getItem('userName')}!`;
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

let chart; // Variável global do gráfico
const buttonsContainer = document.getElementById('buttons-container');
const votedMessage = document.getElementById('voted-message');
const chartContainer = document.getElementById('chartVotos');

// 1. FUNÇÃO DE CARREGAR A PÁGINA (A MAIS IMPORTANTE)
async function loadData() {
    try {
        const res = await fetch('/api/get-votes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        // 2. MOSTRA O GRÁFICO (AGORA VAI FUNCIONAR)
        renderChart(data.totais);

        // 3. DECIDE SE MOSTRA OS BOTÕES OU A MENSAGEM "OBRIGADO"
        if (data.hasVoted) {
            buttonsContainer.style.display = 'none';
            votedMessage.style.display = 'block';
        } else {
            buttonsContainer.style.display = 'grid'; // 'grid' (do nosso CSS)
            votedMessage.style.display = 'none';
        }

    } catch (err) { console.error(err); }
}

// 2. FUNÇÃO DE RENDERIZAR O GRÁFICO
function renderChart(votos) {
    const ctx = chartContainer.getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Corinthians', 'Palmeiras', 'São Paulo', 'Santos'],
            datasets: [{
                label: 'Votos',
                data: [votos['Corinthians'], votos['Palmeiras'], votos['São Paulo'], votos['Santos']],
                backgroundColor: ['#000000', '#006437', '#da1414', '#ffffff'],
                borderColor: '#444',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#eee' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#eee', weight: 'bold' },
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                title: { display: true, text: 'Resultado Parcial', color: '#ffffff', font: { size: 18 } }
            }
        }
    });
}

// 3. FUNÇÃO DE VOTAR (AGORA COM FEEDBACK DE "LOADING")
async function votar(time) {
    // Para o "Estático": desabilita botões ao clicar
    buttonsContainer.style.pointerEvents = 'none';
    buttonsContainer.style.opacity = '0.5';

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

        if (res.status === 200) {
            // Sucesso! Esconde botões e mostra mensagem
            buttonsContainer.style.display = 'none';
            votedMessage.style.display = 'block';
            updateChart(); // Atualiza o gráfico com o novo voto
        } else {
            alert(data.error); // Ex: "Você só pode votar uma vez"
        }

    } catch (err) {
        alert('Erro ao votar');
        // Reabilita os botões se der erro
        buttonsContainer.style.pointerEvents = 'auto';
        buttonsContainer.style.opacity = '1';
    }
}

// 4. FUNÇÃO DE ATUALIZAR O GRÁFICO
async function updateChart() {
    const res = await fetch('/api/get-votes', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    chart.data.datasets[0].data = [
        data.totais['Corinthians'],
        data.totais['Palmeiras'],
        data.totais['São Paulo'],
        data.totais['Santos']
    ];
    chart.update();
}

// Inicia o processo quando a página carrega
loadData();