document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. POPULAÇÃO DINÂMICA DO DROPDOWN (SCROLL DE ANIMAIS)
    // -------------------------------------------------------------
    const petSelect = document.getElementById('pet-interesse');
    
    // Lista básica e leitura de novos pets cadastrados pelas ONGs
    const defaultPets = [
        {
            id: 'pet1',
            name: 'Rex',
            category: 'dog',
            age: '2 anos',
            desc: 'Cachorrinho muito brincalhão e carinhoso.',
            img: 'https://revistanovaimagem.com.br/wp-content/uploads/2024/06/1-4.jpeg',
            ong: 'Abrigo Animal',
            location: 'São Paulo, SP'
        },
        {
            id: 'pet2',
            name: 'Lua',
            category: 'cat',
            age: '1 ano',
            desc: 'Gata muito tranquila e independente.',
            img: 'https://cdn.pixabay.com/photo/2017/06/30/07/02/cat-2457441_1280.jpg',
            ong: 'Abrigo Animal',
            location: 'Rio de Janeiro, RJ'
        }
    ];
    const registeredPets = JSON.parse(localStorage.getItem('registeredPets')) || [];
    const allPets = [...defaultPets,...registeredPets];

    if (petSelect) {
        // Limpa o select e injeta a opção padrão
        petSelect.innerHTML = '<option value="geral">Adoção Geral (Qualquer animal)</option>';
        
        // Popula o select interativo com todos os animais
        allPets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.name;
            option.textContent = `${pet.name} (${pet.category === 'dog'? 'Cão' : 'Gato'})`;
            petSelect.appendChild(option);
        });
    }

    // -------------------------------------------------------------
    // 2. LEITURA DE PARÂMETROS DA URL (QUERY STRINGS)
    // -------------------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const petNameParam = urlParams.get('pet');

    if (petSelect && petNameParam) {
        // Se veio por um card, seleciona o animal automaticamente, mas permite o scroll
        petSelect.value = decodeURIComponent(petNameParam);
    }

    // -------------------------------------------------------------
    // 3. VALIDAÇÃO DE CAMPOS E FLUXO DE SUBMISSÃO
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
                alert(`Obrigado, ${nomeInput.value}!\nSua solicitação de adoção para: "${petSelect.value}" foi encaminhada com sucesso.\nNossa equipe de triagem entrará em contato.`);
                window.location.href = "index.html";
            } else {
                alert("Por favor, preencha todos os campos corretamente antes de enviar.");
            }
        });
    }
});