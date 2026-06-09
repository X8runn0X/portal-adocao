document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. LEITURA DE PARÂMETROS DA URL (QUERY STRINGS)
    // -------------------------------------------------------------
    const petInputField = document.getElementById('pet-interesse');
    const urlParams = new URLSearchParams(window.location.search);
    const petNameParam = urlParams.get('pet');

    if (petInputField) {
        if (petNameParam) {
            petInputField.value = decodeURIComponent(petNameParam);
        } else {
            petInputField.value = "Adoção Geral (Ainda sem pet específico)";
        }
    }

    // -------------------------------------------------------------
    // 2. VALIDAÇÃO DE CAMPOS E FLUXO DE SUBMISSÃO
    // -------------------------------------------------------------
    const form = document.getElementById('form-cadastro');

    function validateField(inputElement, errorElement, validationFn, errorMsg) {
        if (!inputElement) return;
        inputElement.addEventListener('blur', () => {
            if (!validationFn(inputElement.value)) {
                errorElement.textContent = errorMsg;
                errorElement.style.display = 'block';
                inputElement.style.borderColor = 'var(--error-color)';
            } else {
                errorElement.style.display = 'none';
                inputElement.style.borderColor = 'var(--border-color)';
            }
        });
    }

    const nomeInput = document.getElementById('nome');
    const nomeError = document.getElementById('nome-error');
    validateField(nomeInput, nomeError, val => val.trim().length >= 4, "O nome deve conter pelo menos 4 caracteres.");

    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateField(emailInput, emailError, val => emailRegex.test(val), "Insira um endereço de e-mail válido.");

    const telefoneInput = document.getElementById('telefone');
    const telefoneError = document.getElementById('telefone-error');
    validateField(telefoneInput, telefoneError, val => /^[0-9]{11}$/.test(val), "O telefone deve conter exatamente 11 dígitos numéricos.");

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const isNameValid = nomeInput.value.trim().length >= 4;
            const isEmailValid = emailRegex.test(emailInput.value);
            const isPhoneValid = /^[0-9]{11}$/.test(telefoneInput.value);
            const checkTermos = document.getElementById('termos').checked;

            if (isNameValid && isEmailValid && isPhoneValid && checkTermos) {
                alert(`Obrigado, ${nomeInput.value}!\nSua solicitação de adoção para o pet "${petInputField.value}" foi encaminhada com sucesso.\nNossa equipe de triagem entrará em contato.`);
                window.location.href = "index.html";
            } else {
                alert("Por favor, preencha todos os campos corretamente antes de enviar.");
            }
        });
    }
});