export default function () {
    let reviewsSwiper = new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        pagination: {
            el: '.reviews-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: ".reviews-navigation-button-next",
            prevEl: ".reviews-navigation-button-prev",
        },
        breakpoints: {
            // 576: {
            //     slidesPerView: 1.5,
            // },
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            },
        },
    });
}
