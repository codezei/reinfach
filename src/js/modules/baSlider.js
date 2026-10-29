export default function () {
    const sliders = document.querySelectorAll('[data-ba-slider]');

    sliders.forEach((slider) => {
        let isDragging = false;

        const setPosition = (percent) => {
            const clamped = Math.max(0, Math.min(100, percent));
            slider.style.setProperty('--pos', `${clamped}%`);
            slider.setAttribute('aria-valuenow', Math.round(clamped));
        };

        const updateFromClientX = (clientX) => {
            const rect = slider.getBoundingClientRect();
            if (!rect.width) return;
            const percent = ((clientX - rect.left) / rect.width) * 100;
            setPosition(percent);
        };

        // Затискання пальця або кнопки миші
        slider.addEventListener('pointerdown', (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            isDragging = true;
            slider.classList.add('is-dragging');
            slider.setPointerCapture(e.pointerId); // Фіксує захват пальця/курсора за цим слайдером
            updateFromClientX(e.clientX);
        });

        // Перетягування в реальному часі
        slider.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            updateFromClientX(e.clientX);
        });

        // Відпускання пальця або скасування жесту
        const stopDragging = (e) => {
            if (!isDragging) return;
            isDragging = false;
            slider.classList.remove('is-dragging');
            if (slider.hasPointerCapture(e.pointerId)) {
                slider.releasePointerCapture(e.pointerId);
            }
        };

        slider.addEventListener('pointerup', stopDragging);
        slider.addEventListener('pointercancel', stopDragging);

        // Доступність з клавіатури (стрілки Вліво / Вправо)
        slider.addEventListener('keydown', (e) => {
            const current = parseFloat(slider.getAttribute('aria-valuenow')) || 50;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setPosition(current - 5);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setPosition(current + 5);
            }
        });
    });
}
