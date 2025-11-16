import { db } from './_lib/db.js';
import bcrypt from 'bcryptjs';
import * as v from './_lib/validation.js'; // Importa nossas validações

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Metodo não permitido' });
    }

    // Recebe TODOS os dados do formulário de 3 etapas de uma vez
    const {
        nome,
        anoNascimento,
        cpf,
        email,
        password,
        confirmPassword,
        telefone,
        cep,
        estado
    } = request.body;

    // --- VALIDAÇÃO ---
    // Roda todas as suas funções de validação que traduzimos
    const erros = [
        v.validarNome(nome),
        v.validarIdade(anoNascimento),
        v.validarCpf(cpf),
        v.validarEmail(email),
        v.validarSenha(password, confirmPassword),
        v.validarTelefone(telefone),
        v.validarCep(cep),
        v.validarUf(estado)
    ].filter(e => e !== null); // Filtra e deixa só as mensagens de erro

    if (erros.length > 0) {
        // Se tiver qualquer erro, retorna o primeiro
        return response.status(400).json({ error: erros[0] });
    }

    // --- SALVAR NO BANCO ---
    try {
        const client = await db.connect();

        // Checar se email ou CPF já existem
        const { rows: existingUser } = await client.sql `
      SELECT id FROM users WHERE email = ${email} OR cpf = ${cpf}
    `;
        if (existingUser.length > 0) {
            client.release();
            return response.status(409).json({ error: 'Email ou CPF já cadastrado.' });
        }

        // Criptografa a senha (Python: generate_password_hash)
        const passwordHash = await bcrypt.hash(password, 10);

        // Insere o novo usuário
        await client.sql `
      INSERT INTO users (
        nome, ano_nascimento, cpf, email, telefone, cep, estado, password_hash
      ) VALUES (
        ${nome}, ${anoNascimento}, ${cpf}, ${email}, ${telefone}, ${cep}, ${estado}, ${passwordHash}
      )
    `;

        client.release();

        // Retorna sucesso (o frontend vai redirecionar para o login)
        return response.status(201).json({ message: 'Cadastro realizado com sucesso!' });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ error: 'Erro interno do servidor' });
    }
}