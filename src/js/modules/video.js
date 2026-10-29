export default function () {
    const videoCards = document.querySelectorAll('.js-video');

    videoCards.forEach(card => {
        card.addEventListener('click', function () {
            const videoSrc = this.dataset.videoSrc;
            let video = this.querySelector('video');

            // 1. Перший клік: Створюємо тег <video> і вантажимо файл (Lazy Load)
            if (!video) {
                const wrapper = this.querySelector('.video__player-wrap');

                video = document.createElement('video');
                video.src = videoSrc;
                video.playsInline = true;
                video.muted = true;
                video.controls = false;
                video.loop = true;
                video.autoplay = true;

                wrapper.appendChild(video);

                this.classList.add('is-loaded');

                // Якщо відео закінчилось - скидаємо стан
                video.addEventListener('ended', () => {
                    this.classList.remove('is-playing');
                });
            }

            // 2. Ставимо на паузу всі інші відео на сторінці
            pauseAllOtherVideos(video);

            // 3. Перемикаємо стан поточного відео (Play/Pause)
            if (video.paused) {
                video.play();
                this.classList.add('is-playing');
            } else {
                video.pause();
                this.classList.remove('is-playing');
            }
        });
    });

    // Функція зупинки інших відео
    function pauseAllOtherVideos(currentVideo) {
        const allVideos = document.querySelectorAll('.js-video video');
        allVideos.forEach(vid => {
            if (vid !== currentVideo && !vid.paused) {
                vid.pause();
                // Знаходимо батьківську картку і знімаємо клас is-playing
                const parentCard = vid.closest('.js-video');
                if (parentCard) {
                    parentCard.classList.remove('is-playing');
                }
            }
        });
    }
}
