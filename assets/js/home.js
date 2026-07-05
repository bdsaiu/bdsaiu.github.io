// ======================================================
// HERO IMAGE SLIDER
// ======================================================

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let current = 0;
let timer;

// ===========================================
// Show Slide
// ===========================================

function showSlide(index) {

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    current = index;
}

// ===========================================
// Next
// ===========================================

function nextSlide() {

    let next = current + 1;

    if (next >= slides.length)
        next = 0;

    showSlide(next);

}

// ===========================================
// Previous
// ===========================================

function prevSlide() {

    let prev = current - 1;

    if (prev < 0)
        prev = slides.length - 1;

    showSlide(prev);

}

// ===========================================
// Buttons
// ===========================================

nextBtn.addEventListener("click", () => {

    nextSlide();

    restartTimer();

});

prevBtn.addEventListener("click", () => {

    prevSlide();

    restartTimer();

});

// ===========================================
// Dot Navigation
// ===========================================

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

        restartTimer();

    });

});

// ===========================================
// Auto Play
// ===========================================

function startTimer() {

    timer = setInterval(() => {

        nextSlide();

    }, 4000);

}

function restartTimer() {

    clearInterval(timer);

    startTimer();

}

startTimer();