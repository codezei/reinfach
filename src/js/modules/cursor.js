export default function () {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (cursorGlow) {

        const moveXGlow = gsap.quickTo(cursorGlow, "x", { duration: 0.5, ease: "power3.out" });
        const moveYGlow = gsap.quickTo(cursorGlow, "y", { duration: 0.5, ease: "power3.out" });


        window.addEventListener('mousemove', (e) => {

            moveXGlow(e.clientX - 400);
            moveYGlow(e.clientY - 400);
        });
    }
}
