import { db } from './_lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

    const authHeader = request.headers.authorization;
    if (!authHeader) return response.status(401).json({ error: 'Não autorizado' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { team } = request.body;

        const client = await db.connect();

        // 1. Descobre a nota do usuário no Quiz
        const { rows: userRows } = await client.sql `
        SELECT quiz_score FROM users WHERE id = ${decoded.userId}
    `;

        // Lógica: Voto Base (1) + Pontos do Quiz. 
        // Se ele acertou 15, o voto vale 16. Se não jogou (-1), vale 1.
        let score = userRows[0] ? .quiz_score || 0;
        if (score < 0) score = 0;
        const pesoVoto = 1 + score;

        // 2. Salva o voto com o PESO calculado
        try {
            await client.sql `
        INSERT INTO votes (user_id, team, weight) VALUES (${decoded.userId}, ${team}, ${pesoVoto})
      `;
            client.release();
            return response.status(200).json({ message: `Voto computado com peso ${pesoVoto}!` });

        } catch (dbError) {
            client.release();
            if (dbError.code === '23505') {
                return response.status(409).json({ error: 'Você já gastou seu voto!' });
            }
            throw dbError;
        }

    } catch (error) {
        return response.status(500).json({ error: error.message || 'Erro interno' });
    }
}