import { db } from './_lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(request, response) {
    // 1. Pegar o token do usuário (se ele tiver um)
    const authHeader = request.headers.authorization;
    let userId = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        } catch (e) {
            // Token inválido ou expirado, mas continuamos (só não vai poder votar)
        }
    }

    try {
        const client = await db.connect();

        // 2. BUSCA O TOTAL DE VOTOS (para o gráfico)
        const { rows: voteRows } = await client.sql `
      SELECT team, COUNT(*) as count FROM votes GROUP BY team
    `;

        // Formata os totais
        const totais = { "Corinthians": 0, "Palmeiras": 0, "São Paulo": 0, "Santos": 0 };
        voteRows.forEach(row => {
            if (totais.hasOwnProperty(row.team)) {
                totais[row.team] = parseInt(row.count);
            }
        });

        // 3. BUSCA O VOTO DO USUÁRIO ATUAL
        let hasVoted = false;
        if (userId) {
            const { rows: userVote } = await client.sql `
        SELECT id FROM votes WHERE user_id = ${userId}
      `;
            if (userVote.length > 0) {
                hasVoted = true;
            }
        }

        client.release();

        // 4. Retorna TUDO para o frontend
        return response.status(200).json({
            totais: totais,
            hasVoted: hasVoted
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao buscar votos' });
    }
}