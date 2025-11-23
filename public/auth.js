// public/auth.js
document.addEventListener('DOMContentLoaded', () => {
    // --- SPINNER ---
    const loaderHTML = `
    <div id="global-loader" class="loader-container">
        <div class="spinner"></div>
        <div class="loader-text">Carregando...</div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', loaderHTML);
    const loader = document.getElementById('global-loader');
    const showLoading = () => loader.style.display = 'flex';
    const hideLoading = () => loader.style.display = 'none';

    const errorEl = document.getElementById('error-message');
    const showError = (message) => {
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    };

    // --- LOGIN ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            showLoading(); // Mostra spinner
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await response.json();
                hideLoading(); // Esconde

                if (!response.ok) throw new Error(data.error || 'Erro desconhecido');

                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userName', data.nome);
                window.location.href = '/quiz.html';

            } catch (err) {
                hideLoading();
                showError(err.message);
            }
        });
    }

    // --- REGISTRO 3 (Final) ---
    const regStep3Form = document.getElementById('register-step3-form');
    if (regStep3Form) {
        if (!sessionStorage.getItem('reg_password')) { window.location.href = '/register-2.html'; return; }

        regStep3Form.addEventListener('submit', async(e) => {
            e.preventDefault();
            showLoading(); // Mostra spinner ao criar conta (que demora mais)

            try {
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

                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });
                const data = await response.json();
                hideLoading();

                if (!response.ok) throw new Error(data.error);

                sessionStorage.clear();
                alert('Cadastro realizado! Faça login.');
                window.location.href = '/login.html';

            } catch (err) {
                hideLoading();
                showError(err.message);
            }
        });
    }

    // (Mantenha a lógica simples das etapas 1 e 2 aqui, elas não precisam de spinner pois não tem fetch)
    const regStep1Form = document.getElementById('register-step1-form');
    if (regStep1Form) {
        regStep1Form.addEventListener('submit', (e) => {
            e.preventDefault();
            sessionStorage.setItem('reg_nome', regStep1Form.nome.value);
            sessionStorage.setItem('reg_anoNascimento', regStep1Form.ano_nascimento.value);
            window.location.href = '/register-2.html';
        });
    }
    const regStep2Form = document.getElementById('register-step2-form');
    if (regStep2Form) {
        regStep2Form.addEventListener('submit', (e) => {
            e.preventDefault();
            sessionStorage.setItem('reg_cpf', regStep2Form.cpf.value);
            sessionStorage.setItem('reg_email', regStep2Form.email.value);
            sessionStorage.setItem('reg_password', regStep2Form.password.value);
            sessionStorage.setItem('reg_confirmPassword', regStep2Form.confirm_password.value);
            window.location.href = '/register-3.html';
        });
    }
});
// ... (Mantenha todo o código anterior) ...

// ADICIONE ISTO NO FINAL DO ARQUIVO (FORA do DOMContentLoaded)
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling; // O span do ícone

    if (input.type === "password") {
        input.type = "text";
        icon.innerText = "🙈"; // Macaco tapando olho (ou outro ícone)
    } else {
        input.type = "password";
        icon.innerText = "👁️"; // Olho
    }
}