const navBtn = document.querySelector('.nav-button');
const mobileNav = document.querySelector('.mobile-nav');
const body = document.body;

function toggleMobileNav() {
    mobileNav.classList.toggle('mobile-nav-active');
    navBtn.classList.toggle('nav-button-close');
    body.classList.toggle('no-scroll');
}

// Burger click
navBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMobileNav();
})

//click on window outside navbar
window.addEventListener('click', () => {

    if(body.classList.contains('no-scroll')) {
        toggleMobileNav();
    }
})

mobileNav.addEventListener('click', (event) => {
    event.stopPropagation();
})

//smooth scroll 
document.querySelectorAll('a[href^="#"').forEach(link => {

    link.addEventListener('click', function(e) {
        e.preventDefault();

        let href = this.getAttribute('href').substring(1);

        const scrollTarget = document.getElementById(href);

        //const topOffset = document.querySelector('.scrollto').offsetHeight;
        const topOffset = 0; // если не нужен отступ сверху 
        const elementPosition = scrollTarget.getBoundingClientRect().top;
        const offsetPosition = elementPosition - topOffset;

        window.scrollBy({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});