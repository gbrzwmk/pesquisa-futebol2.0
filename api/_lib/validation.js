// Este é o seu 'criar_cadastro.py' (funções de validação) 
// traduzido para JavaScript

export function validarNome(nome) {
    if (!nome) {
        return "O nome não pode ser vazio.";
    }
    if (!/^[a-zA-Zà-úÀ-Ú\s]+$/.test(nome)) {
        return "O nome contém caracteres inválidos. Use apenas letras e espaços.";
    }
    if (nome.trim().split(' ').length < 2) {
        return "Digite o nome completo (nome e sobrenome).";
    }
    return null;
}

export function validarCpf(cpf) {
    const cpfLimpo = (cpf || '').replace(/\D/g, '');
    if (cpfLimpo.length !== 11 || !/^\d{11}$/.test(cpfLimpo)) {
        return 'CPF inválido! Digite um CPF com 11 dígitos numéricos.';
    }
    return null;
}

export function validarCep(cep) {
    const cepLimpo = (cep || '').replace(/\D/g, '');
    if (cepLimpo.length !== 8 || !/^\d{8}$/.test(cepLimpo)) {
        return 'CEP inválido! Digite um CEP com 8 dígitos numéricos.';
    }
    return null;
}

export function validarEmail(email) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email || '')) {
        return 'Email inválido! O formato deve ser exemplo@dominio.com.';
    }
    return null;
}

export function validarTelefone(telefone) {
    const telLimpo = (telefone || '').replace(/\D/g, '');
    if (telLimpo.length < 8 || telLimpo.length > 11) {
        return 'Telefone inválido! Digite um número válido com ou sem DDD.';
    }
    return null;
}

export function validarIdade(anoNascimentoStr) {
    try {
        const anoNascimento = parseInt(anoNascimentoStr, 10);
        const anoAtual = new Date().getFullYear();
        const idade = anoAtual - anoNascimento;

        if (isNaN(anoNascimento) || !(anoNascimento > 1920 && anoNascimento <= anoAtual)) {
            return "Ano de nascimento inválido. Por favor, digite um ano realista.";
        }
        if (idade < 18) {
            return `Cadastro não permitido para menores de 18 anos. Idade calculada: ${idade} anos.`;
        }
        return null;
    } catch (e) {
        return "Ano de nascimento inválido! Digite um ano com 4 dígitos (ex: 1995).";
    }
}

export function validarUf(estado) {
    const ufsValidas = new Set([
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ]);
    if (!ufsValidas.has((estado || '').toUpperCase().trim())) {
        return "Estado inválido! Digite a sigla de uma UF válida (ex: SP, RJ...).";
    }
    return null;
}

export function validarSenha(password, confirmPassword) {
    if (!password || password.length < 6) {
        return 'A senha deve ter pelo menos 6 caracteres.';
    }
    if (password !== confirmPassword) {
        return 'As senhas não coincidem.';
    }
    return null;
}