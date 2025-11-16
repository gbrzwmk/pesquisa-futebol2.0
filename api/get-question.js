import { gerarPerguntaAleatoria } from './_lib/quiz-logic.js';
import jwt from 'jsonwebtoken';

export default async function handler(request, response) {
    // 1. Verifica se o usuário está logado (tem Token)
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ error: 'Não autorizado' });
    }

    try {
        // Valida o Token
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);

        // 2. Gera a pergunta
        const dadosPergunta = gerarPerguntaAleatoria();

        // Retorna a pergunta e a resposta certa (o frontend vai comparar)
        return response.status(200).json(dadosPergunta);

    } catch (error) {
        return response.status(401).json({ error: 'Token inválido' });
    }
}