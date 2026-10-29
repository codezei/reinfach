(function () {
    'use strict';

    function header () {
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

    function baSlider () {
      var sliders = document.querySelectorAll('[data-ba-slider]');
      sliders.forEach(function (slider) {
        var isDragging = false;

        var setPosition = function setPosition(percent) {
          var clamped = Math.max(0, Math.min(100, percent));
          slider.style.setProperty('--pos', "".concat(clamped, "%"));
          slider.setAttribute('aria-valuenow', Math.round(clamped));
        };

        var updateFromClientX = function updateFromClientX(clientX) {
          var rect = slider.getBoundingClientRect();
          if (!rect.width) return;
          var percent = (clientX - rect.left) / rect.width * 100;
          setPosition(percent);
        }; // Затискання пальця або кнопки миші


        slider.addEventListener('pointerdown', function (e) {
          if (e.pointerType === 'mouse' && e.button !== 0) return;
          isDragging = true;
          slider.classList.add('is-dragging');
          slider.setPointerCapture(e.pointerId); // Фіксує захват пальця/курсора за цим слайдером

          updateFromClientX(e.clientX);
        }); // Перетягування в реальному часі

        slider.addEventListener('pointermove', function (e) {
          if (!isDragging) return;
          updateFromClientX(e.clientX);
        }); // Відпускання пальця або скасування жесту

        var stopDragging = function stopDragging(e) {
          if (!isDragging) return;
          isDragging = false;
          slider.classList.remove('is-dragging');

          if (slider.hasPointerCapture(e.pointerId)) {
            slider.releasePointerCapture(e.pointerId);
          }
        };

        slider.addEventListener('pointerup', stopDragging);
        slider.addEventListener('pointercancel', stopDragging); // Доступність з клавіатури (стрілки Вліво / Вправо)

        slider.addEventListener('keydown', function (e) {
          var current = parseFloat(slider.getAttribute('aria-valuenow')) || 50;

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

    function cursor () {
      var cursorGlow = document.querySelector('.cursor-glow');

      if (cursorGlow) {
        var moveXGlow = gsap.quickTo(cursorGlow, "x", {
          duration: 0.5,
          ease: "power3.out"
        });
        var moveYGlow = gsap.quickTo(cursorGlow, "y", {
          duration: 0.5,
          ease: "power3.out"
        });
        window.addEventListener('mousemove', function (e) {
          moveXGlow(e.clientX - 400);
          moveYGlow(e.clientY - 400);
        });
      }
    }

    function magnet () {
      var magnetBtns = document.querySelectorAll('.magnet-btn');
      var cursorGlow = document.querySelector('.cursor-glow');

      if (magnetBtns.length) {
        magnetBtns.forEach(function (btn) {
          var textElement = btn.querySelector('.magnet-text');
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
          }

          btn.addEventListener('mousemove', function (e) {
            var rect = btn.getBoundingClientRect();
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
          });
          btn.addEventListener('mouseleave', function () {
            gsap.to(btn, {
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "elastic.out(1, 0.3)"
            });

            if (textElement) {
              gsap.to(textElement, {
                x: 0,
                y: 0,
                duration: 0.9,
                ease: "elastic.out(1, 0.3)"
              });
            }

            if (cursorGlow) {
              gsap.to(cursorGlow, {
                scale: 1,
                opacity: 1,
                duration: 0.3
              });
            }
          });
          btn.addEventListener('mouseenter', function () {
            if (cursorGlow) {
              gsap.to(cursorGlow, {
                scale: 0.5,
                opacity: 1,
                duration: 0.3
              });
            }
          });
        });
      }
    }

    function video () {
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
            video.loop = true;
            video.autoplay = true;
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

    function toggler () {
      document.addEventListener('click', function (e) {
        var toggleElement = e.target.closest('.js-toggle');
        if (!toggleElement) return; // Визначаємо ціль кліку

        var targetSelector = toggleElement.dataset.target;
        var actualTarget = targetSelector ? toggleElement.querySelector(targetSelector) : toggleElement;

        if (e.target.closest(actualTarget.tagName.toLowerCase())) {
          toggleElement.classList.toggle('is-active');
        }
      });
    }

    function tabs () {
      var tabContainers = document.querySelectorAll('[data-tabs]');
      tabContainers.forEach(function (container) {
        // Збираємо та кешуємо елементи один раз (з захистом від вкладених табів)
        var buttons = Array.from(container.querySelectorAll('[data-tabs-target]')).filter(function (el) {
          return el.closest('[data-tabs]') === container;
        });
        var panes = Array.from(container.querySelectorAll('[data-tabs-pane]')).filter(function (el) {
          return el.closest('[data-tabs]') === container;
        });
        if (!buttons.length || !panes.length) return;
        buttons.forEach(function (btn) {
          btn.addEventListener('click', function () {
            // Ігноруємо клік, якщо цей таб вже активний
            if (btn.classList.contains('is-active')) return;
            var targetId = btn.dataset.tabsTarget;
            buttons.forEach(function (item) {
              var isActive = item === btn;
              item.classList.toggle('is-active', isActive);
              item.setAttribute('aria-selected', isActive);
            });
            panes.forEach(function (pane) {
              var isActive = pane.dataset.tabsPane === targetId;
              pane.classList.toggle('is-active', isActive);
            });
          });
        });
      });
    }

    document.addEventListener('DOMContentLoaded', function () {
      ScrollTrigger.config({
        ignoreMobileResize: true
      });
      header();
      baSlider();
      cursor();
      magnet();
      video();
      toggler();
      tabs(); // let categoriesNavigation = [
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

}());
//# sourceMappingURL=main.js.map
