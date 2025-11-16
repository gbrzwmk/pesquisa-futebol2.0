// Este script vai rodar no navegador do usuário
document.addEventListener('DOMContentLoaded', () => {

    // Seletor universal de mensagens de erro
    const errorEl = document.getElementById('error-message');
    const showError = (message) => {
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    };

    // --- LÓGICA DE LOGIN (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async(e) => {
            e.preventDefault(); // Impede o formulário de recarregar a página
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                // Chama a nossa API de backend /api/login.js
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Erro desconhecido');
                }

                // SUCESSO! Salva o "Token" no navegador
                // localStorage persiste. sessionStorage apaga quando fecha a aba.
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userName', data.nome);

                // Redireciona para o Quiz
                window.location.href = '/quiz.html';

            } catch (err) {
                showError(err.message);
            }
        });
    }

    // --- LÓGICA DE REGISTRO ETAPA 1 (register-1.html) ---
    const regStep1Form = document.getElementById('register-step1-form');
    if (regStep1Form) {
        regStep1Form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Salva os dados na memória temporária do navegador
            sessionStorage.setItem('reg_nome', regStep1Form.nome.value);
            sessionStorage.setItem('reg_anoNascimento', regStep1Form.ano_nascimento.value);

            // Avança para a próxima página
            window.location.href = '/register-2.html';
        });
    }

    // --- LÓGICA DE REGISTRO ETAPA 2 (register-2.html) ---
    const regStep2Form = document.getElementById('register-step2-form');
    if (regStep2Form) {
        // (Proteção) Se o usuário pulou a etapa 1, volte-o
        if (!sessionStorage.getItem('reg_nome')) {
            window.location.href = '/register-1.html';
            return;
        }

        regStep2Form.addEventListener('submit', (e) => {
            e.preventDefault();

            const password = regStep2Form.password.value;
            const confirmPassword = regStep2Form.confirm_password.value;

            // Validação simples de senha no frontend
            if (password.length < 6) {
                return showError('A senha deve ter pelo menos 6 caracteres.');
            }
            if (password !== confirmPassword) {
                return showError('As senhas não coincidem.');
            }

            // Salva os dados na memória
            sessionStorage.setItem('reg_cpf', regStep2Form.cpf.value);
            sessionStorage.setItem('reg_email', regStep2Form.email.value);
            sessionStorage.setItem('reg_password', password);
            sessionStorage.setItem('reg_confirmPassword', confirmPassword);

            // Avança para a próxima página
            window.location.href = '/register-3.html';
        });
    }

    // --- LÓGICA DE REGISTRO ETAPA 3 (register-3.html) ---
    const regStep3Form = document.getElementById('register-step3-form');
    if (regStep3Form) {
        // (Proteção) Se o usuário pulou as etapas anteriores, volte-o
        if (!sessionStorage.getItem('reg_password')) {
            window.location.href = '/register-2.html';
            return;
        }

        regStep3Form.addEventListener('submit', async(e) => {
            e.preventDefault();

            try {
                // Reúne TODOS os dados do sessionStorage
                const registrationData = {
                    nome: sessionStorage.getItem('reg_nome'),
                    anoNascimento: sessionStorage.getItem('reg_anoNascimento'),
                    cpf: sessionStorage.getItem('reg_cpf'),
                    email: sessionStorage.getItem('reg_email'),
                    password: sessionStorage.getItem('reg_password'),
                    confirmPassword: sessionStorage.getItem('reg_confirmPassword'),
                    telefone: regStep3Form.telefone.value,
                    cep: regStep3Form.cep.value,
                    estado: regStep3Form.estado.value
                };

                // Envia o pacote completo para a API de Registro
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });

                const data = await response.json();

                if (!response.ok) {
                    // Erros podem vir da API (ex: "CPF já existe")
                    throw new Error(data.error || 'Erro ao registrar');
                }

                // SUCESSO!
                // Limpa a memória temporária
                sessionStorage.clear();

                // Envia o usuário para o login (com mensagem de sucesso)
                alert('Cadastro realizado com sucesso! Faça o login para continuar.');
                window.location.href = '/login.html';

            } catch (err) {
                showError(err.message);
            }
        });
    }
});