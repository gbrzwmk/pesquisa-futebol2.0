const token = localStorage.getItem('authToken');
if (!token) window.location.href = '/login.html'; // Proteção

const currentNameEl = document.getElementById('current-name');
const form = document.getElementById('profile-form');
const errorEl = document.getElementById('error-message');
const successEl = document.getElementById('success-message');

// Mostra o nome atual
const currentName = localStorage.getItem('userName');
currentNameEl.innerText = currentName;

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

// Envia o formulário
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    const novoNome = form.novoNome.value;

    try {
        const res = await fetch('/api/update-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ novoNome: novoNome })
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error);
        }

        // Sucesso!
        // 1. Atualiza o nome salvo no navegador
        localStorage.setItem('userName', data.novoNome);

        // 2. Mostra o nome novo na página
        currentNameEl.innerText = data.novoNome;

        // 3. Mostra mensagem de sucesso
        successEl.innerText = data.message;
        successEl.style.display = 'block';
        form.reset(); // Limpa o campo do formulário

    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    }
});