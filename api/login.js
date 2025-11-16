// Este arquivo roda no SERVIDOR (Vercel)
import { db } from './_lib/db.js'; // Nosso arquivo de conexão
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Metodo não permitido' });
    }

    const { email, password } = request.body;
    if (!email || !password) {
        return response.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const client = await db.connect();

        // 1. Achar o usuário no banco
        const { rows } = await client.sql `
      SELECT id, nome, password_hash FROM users WHERE email = ${email}
    `;

        if (rows.length === 0) {
            client.release();
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }

        const user = rows[0];

        // 2. Checar a senha (Python: check_password_hash)
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            client.release();
            return response.status(401).json({ error: 'Senha incorreta' });
        }

        // 3. Criar a "Sessão" (Token JWT)
        const token = jwt.sign({ userId: user.id, nome: user.nome },
            process.env.JWT_SECRET, // Senha secreta da Vercel
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        client.release();

        // 4. Enviar a resposta de sucesso
        return response.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            nome: user.nome
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno do servidor' });
    }
}