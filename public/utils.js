// public/utils.js

// Cria o container de toasts se não existir
if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
}

window.showToast = function(message, type = 'success') {
    const container = document.querySelector('.toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    // Ícone baseado no tipo
    const icon = type === 'success' ? '✅' : '❌';

    toast.innerHTML = `
        <span style="font-size: 1.2em;">${icon}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove automaticamente após 4 segundos
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}