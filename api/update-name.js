import { db } from './_lib/db.js';
import jwt from 'jsonwebtoken';
import { validarNome } from './_lib/validation.js';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Metodo não permitido' });
    }

    // 1. Autenticar o usuário
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ error: 'Não autorizado' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // 2. Pegar e validar o novo nome
        const { novoNome } = request.body;
        const erroNome = validarNome(novoNome); // Usa a mesma validação do cadastro
        if (erroNome) {
            return response.status(400).json({ error: erroNome });
        }

        // 3. Atualizar o nome no banco de dados
        const client = await db.connect();
        await client.sql `
      UPDATE users 
      SET nome = ${novoNome} 
      WHERE id = ${userId}
    `;
        client.release();

        // 4. Retornar sucesso com o novo nome
        return response.status(200).json({
            message: 'Nome atualizado com sucesso!',
            novoNome: novoNome
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno do servidor' });
    }
}