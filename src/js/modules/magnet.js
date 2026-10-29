export default function () {
    const magnetBtns = document.querySelectorAll('.magnet-btn');
    const cursorGlow = document.querySelector('.cursor-glow');
    if (magnetBtns.length) {
        magnetBtns.forEach(btn => {
            const textElement = btn.querySelector('.magnet-text');

            const btnMoveX = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power2.out" });
            const btnMoveY = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power2.out" });

            let textMoveX = null, textMoveY = null;
            if (textElement) {
                textMoveX = gsap.quickTo(textElement, "x", { duration: 0.5, ease: "power2.out" });
                textMoveY = gsap.quickTo(textElement, "y", { duration: 0.5, ease: "power2.out" });
            }

            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();

                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const x = e.clientX - centerX;
                const y = e.clientY - centerY;

                btnMoveX(x * 0.3);
                btnMoveY(y * 0.3);

                if (textElement) {
                    textMoveX(x * 0.15);
                    textMoveY(y * 0.15);
                }
            });


            btn.addEventListener('mouseleave', () => {

                gsap.to(btn, {
                    x: 0, y: 0,
                    duration: 0.9,
                    ease: "elastic.out(1, 0.3)"
                });

                if (textElement) {
                    gsap.to(textElement, {
                        x: 0, y: 0,
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


            btn.addEventListener('mouseenter', () => {

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
