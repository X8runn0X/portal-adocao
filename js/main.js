document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. BASE DE DADOS PRÉ-CARREGADA COM ANIMAIS E FOTOS REAIS
    // -------------------------------------------------------------
    const defaultPets = []; // Array vazio para manter a estrutura, os pets reais estão em pets.js e serão mesclados posteriormente

    // -------------------------------------------------------------
    // 2. CARREGAMENTO DOS ANIMAIS DO LOCALSTORAGE (ONGs) - CORRIGIDO
    // -------------------------------------------------------------
    const registeredPets = JSON.parse(localStorage.getItem('registeredPets')) || [];
    const allPets = [...defaultPets,...registeredPets]; // Junta os animais padrões com os novos das ONGs

    // -------------------------------------------------------------
    // 3. RENDERIZAÇÃO DOS CARDS NA GALERIA (DOM)
    // -------------------------------------------------------------
    const petGallery = document.getElementById('pet-gallery');

    function renderGallery(petsToDisplay) {
        if (!petGallery) return; // Segurança para o script só rodar onde a galeria existir (index.html)
        petGallery.innerHTML = ''; 

        if (petsToDisplay.length === 0) {
            petGallery.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>Nenhum animal correspondente encontrado...</h3>
                    <p>Tente ajustar os filtros ou pesquisar por outro nome.</p>
                </div>
            `;
            return;
        }

        petsToDisplay.forEach(pet => {
            const card = document.createElement('div');
            card.className = 'item';
            card.setAttribute('data-category', pet.category);
            card.setAttribute('data-name', pet.name);

            card.innerHTML = `
                <article class="card">
                    <button class="fav-btn" aria-label="Favoritar ${pet.name}" data-pet-id="${pet.id}">♥</button>
                    <div class="thumb" style="background-image: url('${pet.img}');"></div>
                    <div class="card-content">
                        <h3>${pet.name}</h3>
                        <p>${pet.desc}</p>
                        <span class="pet-card-ong">🏡 Abrigo: <strong>${pet.ong}</strong></span>
                        <span class="pet-card-location">📍 Localização: ${pet.location}</span>
                        <span>${pet.category === 'dog'? 'Cão' : 'Gato'} | ${pet.age}</span>
                        <a href="cadastro.html?pet=${encodeURIComponent(pet.name)}" class="adopt-btn">Quero Adotar</a>
                    </div>
                </article>
            `;
            petGallery.appendChild(card);
        });

        bindFavoriteEvents();
    }

    // -------------------------------------------------------------
    // 4. SISTEMA DE FILTRAGEM (CÃES / GATOS) E BARRA DE PESQUISA - CORRIGIDO
    // -------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('search-input');

    function applyFilters() {
        const activeBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeBtn? activeBtn.getAttribute('data-filter') : 'all';
        const textQuery = searchInput? searchInput.value.toLowerCase().trim() : '';

        const filtered = allPets.filter(pet => {
            const matchesCategory = (activeFilter === 'all' || pet.category === activeFilter);
            const matchesText = pet.name.toLowerCase().includes(textQuery) || 
                                pet.ong.toLowerCase().includes(textQuery) ||
                                pet.location.toLowerCase().includes(textQuery);
            return matchesCategory && matchesText;
        });

        renderGallery(filtered);
    }

    // Ouvintes de evento de clique para os botões de categoria
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            applyFilters();
        });
    });

    // Ouvinte em tempo real da barra de busca
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // -------------------------------------------------------------
    // 5. GERENCIADOR DE FAVORITOS (LOCALSTORAGE) - CORRIGIDO
    // -------------------------------------------------------------
    let favoritedPets = JSON.parse(localStorage.getItem('favoritedPets')) ||

    function bindFavoriteEvents() {
        const favButtons = document.querySelectorAll('.fav-btn');
        
        favButtons.forEach(btn => {
            const petId = btn.getAttribute('data-pet-id');
            
            // Ativa visualmente o coração se o ID estiver nos favoritos
            if (favoritedPets.includes(petId)) {
                btn.classList.add('favorited');
            }

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (favoritedPets.includes(petId)) {
                    favoritedPets = favoritedPets.filter(id => id!== petId);
                    btn.classList.remove('favorited');
                } else {
                    favoritedPets.push(petId);
                    btn.classList.add('favorited');
                }
                
                localStorage.setItem('favoritedPets', JSON.stringify(favoritedPets));
            });
        });
    }

    // Inicializa a galeria desenhando todos os elementos na tela principal
    renderGallery(allPets);
});