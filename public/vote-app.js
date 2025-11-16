const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/';

document.getElementById('user-name-display').innerText = `Olá, ${localStorage.getItem('userName')}!`;
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/';
});

let chart; // Variável global do gráfico

async function loadData() {
    try {
        // 1. Busca os votos atuais
        const res = await fetch('/api/get-votes');
        const votos = await res.json();

        // 2. Renderiza o Gráfico
        const ctx = document.getElementById('chartVotos').getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Corinthians', 'Palmeiras', 'São Paulo', 'Santos'],
                datasets: [{
                    label: 'Votos',
                    data: [votos['Corinthians'], votos['Palmeiras'], votos['São Paulo'], votos['Santos']],
                    backgroundColor: ['#000000', '#006437', '#da1414', '#cccccc'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
            }
        });

    } catch (err) { console.error(err); }
}

async function votar(time) {
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
            // Sucesso! Esconde botões, mostra mensagem e atualiza gráfico
            document.getElementById('buttons-container').style.display = 'none';
            document.getElementById('voted-message').style.display = 'block';

            // Atualiza o gráfico sem recarregar a página inteira
            updateChart();
        } else {
            alert(data.error); // Ex: "Você só pode votar uma vez"
            if (res.status === 409) {
                document.getElementById('buttons-container').style.display = 'none';
                document.getElementById('voted-message').style.display = 'block';
            }
        }

    } catch (err) { alert('Erro ao votar'); }
}

async function updateChart() {
    const res = await fetch('/api/get-votes');
    const votos = await res.json();
    chart.data.datasets[0].data = [
        votos['Corinthians'], votos['Palmeiras'], votos['São Paulo'], votos['Santos']
    ];
    chart.update();
}

// Inicia
loadData();