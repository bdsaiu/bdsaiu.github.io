// ======================================================
// GALLERY: album slideshows, "show all" grids, lightbox
// ======================================================

// ===========================================
// Swipe helper (touch screens)
// ===========================================

function onSwipe(element, onLeft, onRight) {

    let startX = null;

    element.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    element.addEventListener("touchend", (e) => {

        if (startX === null) return;

        const dx = e.changedTouches[0].clientX - startX;

        if (dx < -40) onLeft();
        if (dx > 40) onRight();

        startX = null;
    });
}


// ===========================================
// Slideshows
// ===========================================

document.querySelectorAll(".album-slider").forEach((slider) => {

    const slides = slider.querySelectorAll(".slider-slide");
    const dots = slider.querySelectorAll(".slider-dot");
    const counter = slider.querySelector(".slider-current");
    const delay = parseInt(slider.dataset.autoplay, 10) || 5000;

    let current = 0;
    let timer;

    function show(index) {

        current = (index + slides.length) % slides.length;

        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === current);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === current);
        });

        counter.textContent = current + 1;

        // load the next photo ahead of time
        const next = slides[(current + 1) % slides.length].querySelector("img");
        next.loading = "eager";
    }

    function start() {
        stop();
        timer = setInterval(() => show(current + 1), delay);
    }

    function stop() {
        clearInterval(timer);
    }

    slider.querySelector(".slider-next").addEventListener("click", () => {
        show(current + 1);
        start();
    });

    slider.querySelector(".slider-prev").addEventListener("click", () => {
        show(current - 1);
        start();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            show(i);
            start();
        });
    });

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    onSwipe(slider, () => { show(current + 1); start(); }, () => { show(current - 1); start(); });

    start();
});


// ===========================================
// "Show all photos" buttons
// ===========================================

document.querySelectorAll(".album-section").forEach((album) => {

    const button = album.querySelector(".show-more-button");

    if (!button) return;

    button.addEventListener("click", () => {

        album.querySelectorAll(".grid-item.is-hidden").forEach((item) => {
            item.classList.remove("is-hidden");
        });

        button.parentElement.remove();
    });
});


// ===========================================
// Lightbox
// ===========================================

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxCounter = lightbox.querySelector(".lightbox-counter");

let albumPhotos = [];
let photoIndex = 0;

function showPhoto(index) {

    photoIndex = (index + albumPhotos.length) % albumPhotos.length;

    lightboxImage.src = albumPhotos[photoIndex].href;
    lightboxImage.alt = albumPhotos[photoIndex].querySelector("img").alt;

    lightboxCounter.textContent = (photoIndex + 1) + " / " + albumPhotos.length;
}

function openLightbox(album, index) {

    albumPhotos = Array.from(album.querySelectorAll(".grid-item"));

    showPhoto(index);

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeLightbox() {

    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

document.querySelectorAll(".album-section").forEach((album) => {

    album.querySelectorAll(".grid-item").forEach((item) => {

        item.addEventListener("click", (e) => {
            e.preventDefault();
            openLightbox(album, parseInt(item.dataset.index, 10));
        });
    });
});

lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(photoIndex + 1));
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(photoIndex - 1));
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);

// click on the dark background closes
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {

    if (!lightbox.classList.contains("open")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showPhoto(photoIndex + 1);
    if (e.key === "ArrowLeft") showPhoto(photoIndex - 1);
});

onSwipe(lightbox, () => showPhoto(photoIndex + 1), () => showPhoto(photoIndex - 1));
