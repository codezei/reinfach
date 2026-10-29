export default function () {
    let worksSwiper = new Swiper('.works-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: {
            el: '.works-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: ".works-navigation-button-next",
            prevEl: ".works-navigation-button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            // 768: {
            //     slidesPerView: 2,
            // },
            992: {
                slidesPerView: 3,
            },
        },
    });
}
