export default function () {
    let servicesSwiper = new Swiper('.services-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        autoHeight: true,
        pagination: {
            el: '.services-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: ".services-navigation-button-next",
            prevEl: ".services-navigation-button-prev",
        },
        breakpoints: {
            576: {
                slidesPerView: 1.25,
            },
            768: {
                slidesPerView: 1.5,
            },
            992: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 2.5,
            },
        },
    });
}
