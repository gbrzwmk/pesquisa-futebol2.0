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

        // Tenta inserir o voto (vai falhar se o user_id já existir na tabela votes)
        try {
            await client.sql `
        INSERT INTO votes (user_id, team) VALUES (${decoded.userId}, ${team})
      `;
            client.release();
            return response.status(200).json({ message: 'Voto computado!' });

        } catch (dbError) {
            client.release();
            // Erro de "Unique Constraint" (já votou)
            if (dbError.code === '23505') {
                return response.status(409).json({ error: 'Você só pode votar uma vez!' });
            }
            throw dbError;
        }

    } catch (error) {
        return response.status(500).json({ error: error.message || 'Erro interno' });
    }
}