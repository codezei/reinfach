export default function () {
    document.addEventListener('click', function (e) {

        const toggleElement = e.target.closest('.js-toggle');
        if (!toggleElement) return;

        // Визначаємо ціль кліку
        const targetSelector = toggleElement.dataset.target;
        const actualTarget = targetSelector ? toggleElement.querySelector(targetSelector) : toggleElement;

        if (e.target.closest(actualTarget.tagName.toLowerCase())) {
            toggleElement.classList.toggle('is-active');
        }
    });
}
