document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-cadastrar-pet');
    const fotoInput = document.getElementById('pet-foto');
    const fotoError = document.getElementById('foto-error');
    const historiaInput = document.getElementById('pet-historia');
    const historiaError = document.getElementById('historia-error');

    // Validação inline de URL de Imagem
    if (fotoInput) {
        fotoInput.addEventListener('blur', () => {
            const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
            if (!urlPattern.test(fotoInput.value)) {
                fotoError.textContent = "Por favor, insira uma URL de imagem válida.";
                fotoError.style.display = 'block';
                fotoInput.style.borderColor = 'var(--error-color)';
            } else {
                fotoError.style.display = 'none';
                fotoInput.style.borderColor = 'var(--border-color)';
            }
        });
    }

    // Validação de número mínimo de caracteres para a história do resgate
    if (historiaInput) {
        historiaInput.addEventListener('blur', () => {
            if (historiaInput.value.trim().length < 15) {
                historiaError.textContent = "Forneça mais detalhes sobre o resgate (mínimo 15 caracteres).";
                historiaError.style.display = 'block';
                historiaInput.style.borderColor = 'var(--error-color)';
            } else {
                historiaError.style.display = 'none';
                historiaInput.style.borderColor = 'var(--border-color)';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento padrão da página

            const nome = document.getElementById('pet-nome').value.trim();
            const especie = document.getElementById('pet-especie').value;
            const genero = document.getElementById('pet-genero').value; // Coleta o gênero do formulário da ONG
            const idade = document.getElementById('pet-idade').value.trim();
            const fotoUrl = fotoInput.value.trim();
            const ong = document.getElementById('pet-ong').value.trim();
            const localizacao = document.getElementById('pet-localizacao').value.trim();
            const historia = historiaInput.value.trim();

            // Requisitos de Triagem Médica Obrigatórios
            const vacinaCheck = document.getElementById('triagem-vacina').checked;
            const castraCheck = document.getElementById('triagem-castrado').checked;
            const docilCheck = document.getElementById('triagem-docil').checked;

            if (!vacinaCheck ||!castraCheck ||!docilCheck) {
                alert("O animal precisa estar apto e aprovado em todos os itens do protocolo de triagem médica!");
                return;
            }

            // Cria o objeto do novo animal resgatado pela ONG
            const novoPet = {
                id: 'pet-' + Date.now(), // Gera um ID único baseado em timestamp
                name: nome,
                category: especie,
                gender: genero, // Adiciona o sexo ao novo objeto cadastrado
                age: idade,
                desc: historia,
                img: fotoUrl,
                ong: ong,
                location: localizacao
            };

            // Salva o animal na lista correspondente do localStorage
            const registeredPets = JSON.parse(localStorage.getItem('registeredPets')) || [];
            registeredPets.push(novoPet);
            localStorage.setItem('registeredPets', JSON.stringify(registeredPets));

            alert(`O cadastro do pet "${nome}" foi realizado e validado pela triagem com sucesso!\nEle já se encontra disponível para doação na Galeria.`);
            window.location.href = "index.html"; // Redireciona para atualizar a galeria principal
        });
    }
});