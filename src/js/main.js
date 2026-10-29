import header from './modules/header';
import baSlider from './modules/baSlider';
import cursor from './modules/cursor';
import magnet from './modules/magnet';
import reviews from './modules/reviews';
import works from './modules/works';
import video from './modules/video';
import toggler from './modules/toggler';
import tabs from './modules/tabs';
import services from './modules/services';

document.addEventListener('DOMContentLoaded', function () {
    ScrollTrigger.config({
        ignoreMobileResize: true
    });



    header();
    baSlider();
    cursor();
    magnet();
    services();
    reviews();
    works();
    video();
    toggler();
    tabs()









    // let categoriesNavigation = [
    //     ...document.querySelectorAll(".categories-navigation-swiper"),
    // ];
    // let categoriesContent = [
    //     ...document.querySelectorAll(".categories-content-swiper"),
    // ];

    // categoriesNavigation.map((categoriesNavigationSwiper) => {
    //     let swiper = new Swiper(categoriesNavigationSwiper, {
    //         spaceBetween: 8,
    //         slidesPerView: 3,
    //         watchSlidesProgress: true,
    //         slideToClickedSlide: true,
    //         initialSlide: 0,
    //         roundLengths: true,
    //         on: {
    //             click(swiper) {
    //                 const clickedIndex = swiper.clickedIndex;
    //                 if (clickedIndex !== undefined) {
    //                     swiper.slideTo(clickedIndex);
    //                 }
    //             },
    //         },
    //     });

    //     return swiper;
    // });

    // categoriesContent.map((categoriesContentSwiper, categoriesContentSwiperIndex) => {
    //     let swiper = new Swiper(categoriesContentSwiper, {
    //         spaceBetween: 0,
    //         allowTouchMove: categoriesContentSwiper.dataset.disallowTouch ? false : true,
    //         slideToClickedSlide: true,
    //         watchSlidesProgress: true,
    //         autoHeight: categoriesContentSwiper.dataset.autoHeight ? true : false,
    //         initialSlide: 0,
    //         effect: 'fade',
    //         fadeEffect: {
    //             crossFade: true
    //         },
    //         speed: 600,
    //         navigation: {
    //             nextEl: ".swiper-navigation-button-next",
    //             prevEl: ".swiper-navigation-button-prev",
    //         },
    //         thumbs: {
    //             swiper: categoriesNavigation[categoriesContentSwiperIndex].swiper,
    //             multipleActiveThumbs: false,
    //         },
    //         pagination: {
    //             el: '.swiper-pagination',
    //             type: 'fraction',
    //         },

    //         on: {
    //             init(swiper) {
    //                 const updateHeightButtons = swiper.el.querySelectorAll('.swiper-height-update');

    //                 updateHeightButtons.forEach(button => {
    //                     button.addEventListener('click', () => {
    //                         setTimeout(function () {
    //                             swiper.updateAutoHeight(200);
    //                         }, 10)
    //                     });
    //                 });
    //             },
    //         },
    //     });
    //     return swiper;
    // }
    // );

    // categoriesNavigation.forEach(
    //     (categoriesNavigationSwiper, categoriesNavigationSwiperIndex) => {
    //         categoriesNavigationSwiper.swiper.on("slideChange", function (swiper) {
    //             if (categoriesContent[categoriesNavigationSwiperIndex]) {
    //                 categoriesContent[categoriesNavigationSwiperIndex].swiper.slideTo(
    //                     swiper.activeIndex
    //                 );
    //             }
    //         });
    //     }
    // );
    // categoriesContent.forEach(
    //     (categoriesContentSwiper, categoriesContentSwiperIndex) => {
    //         categoriesContentSwiper.swiper.on("slideChange", function (swiper) {
    //             if (categoriesNavigation[categoriesContentSwiperIndex]) {
    //                 categoriesNavigation[categoriesContentSwiperIndex].swiper.slideTo(
    //                     swiper.activeIndex
    //                 );
    //             }
    //         });
    //     }
    // );

});
