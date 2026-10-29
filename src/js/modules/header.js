export default function () {
    const header = document.querySelector('.header');
    const burger = document.querySelector('.js-burger');
    if (!header || !burger) return;

    const root = document.documentElement;
    const menu = document.querySelector('.widget');
    const widgetLinks = menu ? menu.querySelectorAll('.widget__menu a') : [];
    const footerBtn = menu ? menu.querySelector('.widget__btn') : null;

    // 1. Ініціалізація GSAP-таймлайну мобільного меню (якщо .widget є на сторінці)
    let menuTl = null;

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
    }

    // 2. Єдина функція керування станом меню (синхронізує клас, aria та GSAP)
    function setMenuState(isOpen) {
        root.classList.toggle('open-menu', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));

        if (menuTl) {
            isOpen ? menuTl.play() : menuTl.reverse();
        }
    }

    // Клік по бургеру
    burger.addEventListener('click', () => {
        const isOpen = !root.classList.contains('open-menu');
        setMenuState(isOpen);
    });

    // Закриття меню при кліку на будь-яке посилання в шапці або віджеті
    const handleLinkClick = (e) => {
        if (e.target.closest('a') && root.classList.contains('open-menu')) {
            setMenuState(false);
        }
    };

    header.addEventListener('click', handleLinkClick);
    if (menu && !header.contains(menu)) {
        menu.addEventListener('click', handleLinkClick);
    }

    // Закриття меню клавішею Escape (покращує UX та доступність)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && root.classList.contains('open-menu')) {
            setMenuState(false);
        }
    });


    // 4. Підсвічування активного пункту меню при скролі
    const sections = document.querySelectorAll('[data-nav]');
    const navLinks = document.querySelectorAll('[data-link]');

    if (sections.length && navLinks.length) {
        const setActiveLink = (navKey) => {
            navLinks.forEach(link => {
                link.classList.toggle('is-active', Boolean(navKey && link.dataset.link === navKey));
            });
        };

        sections.forEach(section => {
            const navKey = section.dataset.nav;

            ScrollTrigger.create({
                trigger: section,
                start: "top 40%",
                end: "bottom 40%",
                onEnter: () => setActiveLink(navKey),
                onEnterBack: () => setActiveLink(navKey)
            });
        });
    }
}
