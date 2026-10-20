(function () {
  'use strict';

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function header() {
    var header = document.querySelector('.header');
    var burger = document.querySelector('.js-burger');
    if (!header || !burger) return;
    var root = document.documentElement;
    var menu = document.querySelector('.widget');
    var widgetLinks = menu ? menu.querySelectorAll('.widget__menu a') : [];
    var footerBtn = menu ? menu.querySelector('.widget__btn') : null; // 1. Ініціалізація GSAP-таймлайну мобільного меню (якщо .widget є на сторінці)

    var menuTl = null;

    if (menu) {
      menuTl = gsap.timeline({
        paused: true,
        reversed: true
      });
      menuTl.to(menu, {
        clipPath: "circle(150% at calc(100% - 30px) 30px)",
        duration: 0.7,
        ease: "expo.inOut"
      }, 0);

      if (widgetLinks.length) {
        menuTl.from(widgetLinks, {
          yPercent: 120,
          rotation: 4,
          opacity: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: "power4.out"
        }, "-=0.35");
      }

      if (footerBtn) {
        menuTl.from(footerBtn, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        }, "-=0.3");
      }
    } // 2. Єдина функція керування станом меню (синхронізує клас, aria та GSAP)


    function setMenuState(isOpen) {
      root.classList.toggle('open-menu', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));

      if (menuTl) {
        isOpen ? menuTl.play() : menuTl.reverse();
      }
    } // Клік по бургеру


    burger.addEventListener('click', function () {
      var isOpen = !root.classList.contains('open-menu');
      setMenuState(isOpen);
    }); // Закриття меню при кліку на будь-яке посилання в шапці або віджеті

    var handleLinkClick = function handleLinkClick(e) {
      if (e.target.closest('a') && root.classList.contains('open-menu')) {
        setMenuState(false);
      }
    };

    header.addEventListener('click', handleLinkClick);

    if (menu && !header.contains(menu)) {
      menu.addEventListener('click', handleLinkClick);
    } // Закриття меню клавішею Escape (покращує UX та доступність)


    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('open-menu')) {
        setMenuState(false);
      }
    }); // 4. Підсвічування активного пункту меню при скролі

    var sections = document.querySelectorAll('[data-nav]');
    var navLinks = document.querySelectorAll('[data-link]');

    if (sections.length && navLinks.length) {
      var setActiveLink = function setActiveLink(navKey) {
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', Boolean(navKey && link.dataset.link === navKey));
        });
      };

      sections.forEach(function (section) {
        var navKey = section.dataset.nav;
        ScrollTrigger.create({
          trigger: section,
          start: "top 40%",
          end: "bottom 40%",
          onEnter: function onEnter() {
            return setActiveLink(navKey);
          },
          onEnterBack: function onEnterBack() {
            return setActiveLink(navKey);
          }
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    ScrollTrigger.config({
      ignoreMobileResize: true // Ігнорує зміну висоти в'юпорту при хованні адресного рядка на мобілках

    }); // Ініціалізуємо модуль хедера

    header(); // Загальні змінні, необхідні іншим модулям

    var cursorGlow = document.querySelector('.cursor-glow'); // ---------------------------------------------------------
    // Модуль 1: Універсальний Event Delegation для Toggles (.js-toggle)
    // ---------------------------------------------------------
    // Використовуємо delegation: один слухач на документі замість тисячі на кожній кнопці.
    // Це більш продуктивно, менше пам'яті та працює для динамічного контенту.

    document.addEventListener('click', function (e) {
      // Знаходимо найближчий елемент або батька з класом .js-toggle
      var toggleElement = e.target.closest('.js-toggle');
      if (!toggleElement) return; // Визначаємо ціль кліку

      var targetSelector = toggleElement.dataset.target;
      var actualTarget = targetSelector ? toggleElement.querySelector(targetSelector) : toggleElement; // Перевіряємо, чи клік відбувся по actualTarget (або всередині неї)
      // e.target.closest('.') - це надійний спосіб перевірити ієрархію

      if (e.target.closest(actualTarget.tagName.toLowerCase())) {
        toggleElement.classList.toggle('is-active');
      }
    }); // ---------------------------------------------------------
    // Модуль 2: Оптимізовані Магнітні Кнопки та Синхронізація Світіння
    // ---------------------------------------------------------

    var magnetBtns = document.querySelectorAll('.magnet-btn');

    if (magnetBtns.length) {
      magnetBtns.forEach(function (btn) {
        var textElement = btn.querySelector('.magnet-text'); // --- Створення quickTo для кожної кнопки/тексту окремо ---
        // quickTo - це стандартний та найбільш продуктивний спосіб GSAP анімувати
        // речі, які часто змінюються під курсором, не створюючи нових tween у mousemove.

        var btnMoveX = gsap.quickTo(btn, "x", {
          duration: 0.5,
          ease: "power2.out"
        });
        var btnMoveY = gsap.quickTo(btn, "y", {
          duration: 0.5,
          ease: "power2.out"
        });
        var textMoveX = null,
            textMoveY = null;

        if (textElement) {
          textMoveX = gsap.quickTo(textElement, "x", {
            duration: 0.5,
            ease: "power2.out"
          });
          textMoveY = gsap.quickTo(textElement, "y", {
            duration: 0.5,
            ease: "power2.out"
          });
        } // Слухач Mousemove: тільки оновлюємо координати в quickTo (дуже швидко)


        btn.addEventListener('mousemove', function (e) {
          var rect = btn.getBoundingClientRect(); // Вираховуємо відстань від курсора до центру кнопки

          var centerX = rect.left + rect.width / 2;
          var centerY = rect.top + rect.height / 2;
          var x = e.clientX - centerX;
          var y = e.clientY - centerY;
          btnMoveX(x * 0.3);
          btnMoveY(y * 0.3);

          if (textElement) {
            textMoveX(x * 0.15);
            textMoveY(y * 0.15);
          }
        }); // Слухач Mouseleave: ОБ'ЄДНАНА логіка повернення та світіння

        btn.addEventListener('mouseleave', function () {
          // 1. Повертаємо кнопку на місце з ефектом затухаючої пружини
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.3)" // 1 - амплітуда, 0.3 - жорсткість

          });

          if (textElement) {
            gsap.to(textElement, {
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "elastic.out(1, 0.3)"
            });
          } // 2. Повертаємо світіння у звичайний розсіяний стан


          if (cursorGlow) {
            gsap.to(cursorGlow, {
              scale: 1,
              opacity: 1,
              duration: 0.3
            });
          }
        }); // Слухач Mouseenter: тільки світіння

        btn.addEventListener('mouseenter', function () {
          // Робимо світіння концентрованим при наведенні на кнопку
          if (cursorGlow) {
            gsap.to(cursorGlow, {
              scale: 0.5,
              opacity: 1,
              duration: 0.3
            });
          }
        });
      });
    } // ---------------------------------------------------------
    // Модуль 3: Оптимізована Плямя-Курсор (Base logic)
    // ---------------------------------------------------------


    if (cursorGlow) {
      // Створюємо оптимізовані функції для анімації по осях X та Y.
      // duration: 0.5 створює ефект плавного відставання (шлейф).
      var moveXGlow = gsap.quickTo(cursorGlow, "x", {
        duration: 0.5,
        ease: "power3.out"
      });
      var moveYGlow = gsap.quickTo(cursorGlow, "y", {
        duration: 0.5,
        ease: "power3.out"
      }); // Швидкий слухач window.mousemove для плямы

      window.addEventListener('mousemove', function (e) {
        // Віднімаємо половину розміру, щоб центр плями був під курсором
        // (припускаємо, що пляма 800х800, як у твоїй математиці)
        moveXGlow(e.clientX - 400);
        moveYGlow(e.clientY - 400);
      });
    } // ---------------------------------------------------------
    // Модуль 4: Scroll Animations (ScrollTrigger)
    // ---------------------------------------------------------
    // 1. Поява контенту (Fade-in-up) при скролі


    gsap.utils.toArray('.fade-on-scroll').forEach(function (element) {
      gsap.fromTo(element, {
        opacity: 0,
        y: 50
      }, // Початковий зсув вниз
      {
        opacity: 1,
        y: 0,
        ease: "none",
        // Для scrub краще відключати easing
        scrollTrigger: {
          trigger: element,
          start: "top 90%",
          // Початок: верх елемента на 90% екрана
          end: "top 60%",
          // Кінець: коли центр елемента на 60% екрана
          scrub: 1 // Прив'язка до скролу з легкою інерцією

        }
      });
    }); // 2. Ефект розчинення (fade-out) та зсуву вгору при скролі першої секції

    gsap.to('.fade-out-on-scroll', {
      opacity: 0,
      y: -100,
      // Контент відлітає трохи вгору, створюючи паралакс
      ease: "none",
      scrollTrigger: {
        trigger: '.promo',
        // Обгортка першої секції
        start: "top 0%",
        // Початок: верх секції торкається верху екрана (тобто одразу)
        end: "bottom 0%",
        // Кінець: коли низ секції доходить до середини екрана
        scrub: 1 // Змінили true на 1, щоб синхронізувати інерцію появи контенту

      }
    }); // ---------------------------------------------------------
    // Модуль 5: Sticky Promo Section Class
    // ---------------------------------------------------------

    var promoSection = document.querySelector(".promo.section-sticky"); // Null-check захищає консоль, якщо секції .promo немає на сторінці

    if (promoSection) {
      // Вмикаємо на 100vh (і ніколи не вимикаємо внизу сторінки)
      ScrollTrigger.create({
        start: function start() {
          return window.innerHeight;
        },
        onEnter: function onEnter() {
          return promoSection.classList.add("is-stuck");
        }
      }); // Вимикаємо тільки при поверненні вгору з буфером (на 80% висоти екрана)

      ScrollTrigger.create({
        start: function start() {
          return window.innerHeight * 0.8;
        },
        onLeaveBack: function onLeaveBack() {
          return promoSection.classList.remove("is-stuck");
        }
      });
    } // 1. Анімація форми (дихання маски)


    var paths = ["M0.5,0.075 C0.75,0.05 0.925,0.225 0.925,0.5 C0.925,0.725 0.775,0.925 0.5,0.95 C0.225,0.975 0.05,0.75 0.075,0.5 C0.1,0.25 0.225,0.1 0.5,0.075 Z", "M0.5,0.1 C0.725,0.125 0.95,0.25 0.95,0.5 C0.95,0.775 0.725,0.9 0.5,0.925 C0.25,0.95 0.075,0.725 0.075,0.5 C0.075,0.25 0.25,0.075 0.5,0.1 Z", "M0.5,0.05 C0.775,0.075 0.9,0.2 0.925,0.5 C0.95,0.75 0.75,0.95 0.5,0.925 C0.225,0.9 0.05,0.775 0.075,0.5 C0.1,0.225 0.225,0.025 0.5,0.05 Z"];
    var tlMask = gsap.timeline({
      repeat: -1
    });
    tlMask.to("#blob-path", {
      duration: 4,
      attr: {
        d: paths[1]
      },
      ease: "sine.inOut"
    }).to("#blob-path", {
      duration: 4,
      attr: {
        d: paths[2]
      },
      ease: "sine.inOut"
    }).to("#blob-path", {
      duration: 4,
      attr: {
        d: paths[0]
      },
      ease: "sine.inOut"
    }); // 3. Асинхронний рух орбітальних бульбашок

    gsap.to(".blob-bubble--1", {
      y: 20,
      x: -10,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
    gsap.to(".blob-bubble--2", {
      y: -15,
      x: 15,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    });
    gsap.to(".blob-bubble--3", {
      y: 25,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1
    });
    video();
    var worksSwiper = new Swiper('.works-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.works-pagination',
        clickable: true
      },
      navigation: {
        nextEl: ".works-navigation-button-next",
        prevEl: ".works-navigation-button-prev"
      },
      breakpoints: {
        576: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 3
        },
        992: {
          slidesPerView: 4
        }
      }
    });
    var reviewsSwiper = new Swiper('.reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: {
        el: '.reviews-pagination',
        clickable: true
      },
      navigation: {
        nextEl: ".reviews-navigation-button-next",
        prevEl: ".reviews-navigation-button-prev"
      },
      breakpoints: {
        576: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 2
        },
        992: {
          slidesPerView: 3
        }
      }
    });

    var categoriesNavigation = _toConsumableArray(document.querySelectorAll(".categories-navigation-swiper"));

    var categoriesContent = _toConsumableArray(document.querySelectorAll(".categories-content-swiper"));

    categoriesNavigation.map(function (categoriesNavigationSwiper) {
      var swiper = new Swiper(categoriesNavigationSwiper, {
        spaceBetween: 8,
        slidesPerView: 3,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        initialSlide: 0,
        roundLengths: true,
        on: {
          click: function click(swiper) {
            var clickedIndex = swiper.clickedIndex;

            if (clickedIndex !== undefined) {
              swiper.slideTo(clickedIndex);
            }
          }
        }
      });
      return swiper;
    });
    categoriesContent.map(function (categoriesContentSwiper, categoriesContentSwiperIndex) {
      var swiper = new Swiper(categoriesContentSwiper, {
        spaceBetween: 40,
        allowTouchMove: categoriesContentSwiper.dataset.disallowTouch ? false : true,
        slideToClickedSlide: true,
        watchSlidesProgress: true,
        autoHeight: categoriesContentSwiper.dataset.autoHeight ? true : false,
        initialSlide: 0,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        speed: 600,
        navigation: {
          nextEl: ".swiper-navigation-button-next",
          prevEl: ".swiper-navigation-button-prev"
        },
        thumbs: {
          swiper: categoriesNavigation[categoriesContentSwiperIndex].swiper,
          multipleActiveThumbs: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        on: {
          init: function init(swiper) {
            var updateHeightButtons = swiper.el.querySelectorAll('.swiper-height-update');
            updateHeightButtons.forEach(function (button) {
              button.addEventListener('click', function () {
                setTimeout(function () {
                  swiper.updateAutoHeight(200);
                }, 10);
              });
            });
          }
        }
      });
      return swiper;
    });
    categoriesNavigation.forEach(function (categoriesNavigationSwiper, categoriesNavigationSwiperIndex) {
      categoriesNavigationSwiper.swiper.on("slideChange", function (swiper) {
        if (categoriesContent[categoriesNavigationSwiperIndex]) {
          categoriesContent[categoriesNavigationSwiperIndex].swiper.slideTo(swiper.activeIndex);
        }
      });
    });
    categoriesContent.forEach(function (categoriesContentSwiper, categoriesContentSwiperIndex) {
      categoriesContentSwiper.swiper.on("slideChange", function (swiper) {
        if (categoriesNavigation[categoriesContentSwiperIndex]) {
          categoriesNavigation[categoriesContentSwiperIndex].swiper.slideTo(swiper.activeIndex);
        }
      });
    });
  });

  function video() {
    var videoCards = document.querySelectorAll('.js-video');
    videoCards.forEach(function (card) {
      card.addEventListener('click', function () {
        var _this = this;

        var videoSrc = this.dataset.videoSrc;
        var video = this.querySelector('video'); // 1. Перший клік: Створюємо тег <video> і вантажимо файл (Lazy Load)

        if (!video) {
          var wrapper = this.querySelector('.video__player-wrap');
          video = document.createElement('video');
          video.src = videoSrc;
          video.playsInline = true;
          video.muted = true;
          video.controls = false;
          video.loop = true; // video.autoplay = true;

          wrapper.appendChild(video);
          this.classList.add('is-loaded'); // Якщо відео закінчилось - скидаємо стан

          video.addEventListener('ended', function () {
            _this.classList.remove('is-playing');
          });
        } // 2. Ставимо на паузу всі інші відео на сторінці


        pauseAllOtherVideos(video); // 3. Перемикаємо стан поточного відео (Play/Pause)

        if (video.paused) {
          video.play();
          this.classList.add('is-playing');
        } else {
          video.pause();
          this.classList.remove('is-playing');
        }
      });
    }); // Функція зупинки інших відео

    function pauseAllOtherVideos(currentVideo) {
      var allVideos = document.querySelectorAll('.js-video video');
      allVideos.forEach(function (vid) {
        if (vid !== currentVideo && !vid.paused) {
          vid.pause(); // Знаходимо батьківську картку і знімаємо клас is-playing

          var parentCard = vid.closest('.js-video');

          if (parentCard) {
            parentCard.classList.remove('is-playing');
          }
        }
      });
    }
  }

}());
//# sourceMappingURL=main.js.map
