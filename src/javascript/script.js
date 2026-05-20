const initKanban = () => {
    const attachDragEvents = card => {
        card.addEventListener('dragstart', e => {
            e.currentTarget.classList.add('dragging');
        });

        card.addEventListener('dragend', e => {
            e.currentTarget.classList.remove('dragging');
        });
    };

    const removeCardIcons = card => {
        const cardIcons = card.querySelector('.card-icons');
        if (cardIcons) {
            cardIcons.remove();
        }
    };

    const initializeCards = () => {
        document.querySelectorAll('.kanban-card').forEach(card => {
            attachDragEvents(card);
            removeCardIcons(card);
        });
    };

    const createCardElement = (title, priority = 'medium') => {
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.setAttribute('draggable', 'true');

        const badge = document.createElement('div');
        badge.className = `badge ${priority}`;
        badge.innerHTML = `<span>${priority === 'high' ? 'Alta prioridade' : priority === 'low' ? 'Baixa prioridade' : 'Média prioridade'}</span>`;

        const cardTitle = document.createElement('p');
        cardTitle.className = 'card-title';
        cardTitle.textContent = title;

        const cardInfos = document.createElement('div');
        cardInfos.className = 'card-infos';

        const user = document.createElement('div');
        user.className = 'user';

        const avatar = document.createElement('img');
        avatar.src = 'src/images/ailton.png';
        avatar.alt = 'Avatar';

        user.appendChild(avatar);
        cardInfos.appendChild(user);

        card.appendChild(badge);
        card.appendChild(cardTitle);
        card.appendChild(cardInfos);

        attachDragEvents(card);
        return card;
    };

    const getCardPriority = () => {
        const choicePrompt = prompt('Digite a prioridade do card: alta, média ou baixa (deixe em branco para média)');
        if (!choicePrompt) return 'medium';

        const choice = choicePrompt.trim().toLowerCase();
        if (choice === 'alta' || choice === 'alta prioridade') return 'high';
        if (choice === 'baixa' || choice === 'baixa prioridade') return 'low';
        return 'medium';
    };

    const initializeAddCardButtons = () => {
        const kanban = document.querySelector('.kanban') || document.body;
        const buttons = document.querySelectorAll('.add-card');
        console.log('Kanban init: add-card buttons found =', buttons.length);

        buttons.forEach(button => button.setAttribute('type', 'button'));

        kanban.addEventListener('click', event => {
            const button = event.target.closest('.add-card');
            if (!button) return;
            event.preventDefault();

            const title = prompt('Digite o título do novo card:');
            if (!title || !title.trim()) return;

            const priority = getCardPriority();
            const column = button.closest('.kanban-column');
            if (!column) return;

            const cardsContainer = column.querySelector('.kanban-cards');
            if (!cardsContainer) return;

            const newCard = createCardElement(title.trim(), priority);
            console.log('Kanban create card:', title.trim(), priority, cardsContainer);
            cardsContainer.appendChild(newCard);
        });
    };

    const initializeColumns = () => {
        document.querySelectorAll('.kanban-cards').forEach(column => {
            column.addEventListener('dragover', e => {
                e.preventDefault();
                e.currentTarget.classList.add('cards-hover');
            });

            column.addEventListener('dragleave', e => {
                e.currentTarget.classList.remove('cards-hover');
            });

            column.addEventListener('drop', e => {
                e.currentTarget.classList.remove('cards-hover');
                const dragCard = document.querySelector('.kanban-card.dragging');
                if (!dragCard) return;
                e.currentTarget.appendChild(dragCard);
            });
        });
    };

    initializeCards();
    initializeAddCardButtons();
    initializeColumns();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKanban);
} else {
    initKanban();
}
