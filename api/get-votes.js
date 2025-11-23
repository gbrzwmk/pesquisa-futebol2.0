import { db } from './_lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(request, response) {
    const authHeader = request.headers.authorization;
    let userId = null;
    if (authHeader) {
        try {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        } catch (e) {}
    }

    try {
        const client = await db.connect();

        // MUDANÇA: SUM(weight) em vez de COUNT(*)
        const { rows: voteRows } = await client.sql `
      SELECT team, SUM(weight) as total_points FROM votes GROUP BY team
    `;

        // Objeto com todos os times do Eixo (G12) zerados inicialmente
        const totais = {
            "Corinthians": 0,
            "Palmeiras": 0,
            "São Paulo": 0,
            "Santos": 0,
            "Flamengo": 0,
            "Fluminense": 0,
            "Vasco": 0,
            "Botafogo": 0,
            "Grêmio": 0,
            "Internacional": 0,
            "Atlético-MG": 0,
            "Cruzeiro": 0
        };

        voteRows.forEach(row => {
            if (totais.hasOwnProperty(row.team)) {
                totais[row.team] = parseInt(row.total_points);
            }
        });

        let hasVoted = false;
        if (userId) {
            const { rows: userVote } = await client.sql `SELECT id FROM votes WHERE user_id = ${userId}`;
            if (userVote.length > 0) hasVoted = true;
        }

        client.release();

        return response.status(200).json({ totais, hasVoted });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao buscar votos' });
    }
}