export default function () {
    const tabContainers = document.querySelectorAll('[data-tabs]');

    tabContainers.forEach((container) => {
        // Збираємо та кешуємо елементи один раз (з захистом від вкладених табів)
        const buttons = Array.from(container.querySelectorAll('[data-tabs-target]')).filter(
            (el) => el.closest('[data-tabs]') === container
        );
        const panes = Array.from(container.querySelectorAll('[data-tabs-pane]')).filter(
            (el) => el.closest('[data-tabs]') === container
        );

        if (!buttons.length || !panes.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                // Ігноруємо клік, якщо цей таб вже активний
                if (btn.classList.contains('is-active')) return;

                const targetId = btn.dataset.tabsTarget;

                buttons.forEach((item) => {
                    const isActive = item === btn;
                    item.classList.toggle('is-active', isActive);
                    item.setAttribute('aria-selected', isActive);
                });

                panes.forEach((pane) => {
                    const isActive = pane.dataset.tabsPane === targetId;
                    pane.classList.toggle('is-active', isActive);
                });
            });
        });
    });
}
