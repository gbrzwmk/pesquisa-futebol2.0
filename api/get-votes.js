import { db } from './_lib/db.js';

export default async function handler(request, response) {
    try {
        const client = await db.connect();
        // Conta os votos agrupados por time
        const { rows } = await client.sql `
      SELECT team, COUNT(*) as count FROM votes GROUP BY team
    `;
        client.release();

        // Formata para o frontend
        const votos = { "Corinthians": 0, "Palmeiras": 0, "São Paulo": 0, "Santos": 0 };
        rows.forEach(row => {
            if (votos.hasOwnProperty(row.team)) {
                votos[row.team] = parseInt(row.count);
            }
        });

        return response.status(200).json(votos);
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao buscar votos' });
    }
}