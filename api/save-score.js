import { db } from './_lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(request, response) {
    if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

    const authHeader = request.headers.authorization;
    if (!authHeader) return response.status(401).json({ error: 'Não autorizado' });

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { score } = request.body;

        const client = await db.connect();
        // Atualiza a pontuação do usuário no banco
        await client.sql `
      UPDATE users SET quiz_score = ${score} WHERE id = ${decoded.userId}
    `;
        client.release();

        return response.status(200).json({ message: 'Placar salvo!' });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao salvar placar' });
    }
}