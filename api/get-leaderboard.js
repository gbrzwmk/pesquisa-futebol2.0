import { db } from './_lib/db.js';

export default async function handler(request, response) {
    try {
        const client = await db.connect();

        // Busca os 10 melhores placares (que sejam maiores que -1)
        const { rows } = await client.sql `
      SELECT nome, quiz_score 
      FROM users 
      WHERE quiz_score >= 0
      ORDER BY quiz_score DESC, nome ASC
      LIMIT 10;
    `;
        client.release();

        return response.status(200).json(rows);

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro ao buscar o ranking' });
    }
}