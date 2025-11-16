// Este é o seu 'quiz_futebol.py' traduzido para JavaScript

// (Em um projeto real, isso viria do seu banco de dados)
const TIMES_BRASILEIRAO_2025 = {
    'A': [
        "Atlético-MG", "Bahia", "Botafogo", "Ceará", "Corinthians",
        "Cruzeiro", "Flamengo", "Fluminense", "Fortaleza", "Grêmio",
        "Internacional", "Juventude", "Mirassol", "Palmeiras", "Red Bull Bragantino",
        "Santos", "São Paulo", "Sport", "Vasco da Gama", "Vitória"
    ],
    'B': [
        "Amazonas", "América-MG", "Athletic-MG", "Athletico-PR", "Atlético-GO",
        "Avaí", "Botafogo-SP", "Chapecoense", "Coritiba", "CRB",
        "Criciúma", "Cuiabá", "Ferroviária", "Goiás", "Novorizontino",
        "Operário-PR", "Paysandu", "Remo", "Vila Nova", "Volta Redonda"
    ],
    'C': [ /* ...e assim por diante... */ ],
    'D': [ /* ...e assim por diante... */ ]
};

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function gerarPerguntaAleatoria() {
    const tipoPergunta = choice(['qual_serie', 'qual_time']);
    const todasAsSeries = Object.keys(TIMES_BRASILEIRAO_2025);

    if (tipoPergunta === 'qual_serie') {
        const serieCorretaKey = choice(todasAsSeries);
        const timeCorreto = choice(TIMES_BRASILEIRAO_2025[serieCorretaKey]);

        const pergunta = `Em qual série o time '${timeCorreto}' está em 2025?`;
        const respostaCorreta = `Série ${serieCorretaKey}`;

        let opcoesIncorretas = todasAsSeries
            .filter(s => s !== serieCorretaKey)
            .map(s => `Série ${s}`);
        opcoesIncorretas = shuffle(opcoesIncorretas).slice(0, 3);

        const opcoes = shuffle([...opcoesIncorretas, respostaCorreta]);
        return { pergunta, opcoes, respostaCorreta };

    } else { // qual_time
        const serieCorretaKey = choice(todasAsSeries);
        const timeCorreto = choice(TIMES_BRASILEIRAO_2025[serieCorretaKey]);

        const pergunta = `Qual destes times disputa a Série '${serieCorretaKey}' em 2025?`;
        const respostaCorreta = timeCorreto;

        let opcoesIncorretas = [];
        const seriesErradas = todasAsSeries.filter(s => s !== serieCorretaKey);
        while (opcoesIncorretas.length < 3) {
            const serieAleatoria = choice(seriesErradas);
            const timeErrado = choice(TIMES_BRASILEIRAO_2025[serieAleatoria]);
            if (!opcoesIncorretas.includes(timeErrado)) {
                opcoesIncorretas.push(timeErrado);
            }
        }

        const opcoes = shuffle([...opcoesIncorretas, respostaCorreta]);
        return { pergunta, opcoes, respostaCorreta };
    }
}