window.addEventListener("DOMContentLoaded", async () => {
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/";
    const extension = ".jpg";
    const maxTry = 500;

    // === 1. ДИНАМИЧЕСКАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ===
    const imagePromises = [];
    for (let i = 1; i <= maxTry; i++) {
        const imgPath = `${folder}${i}${extension}`;
        const img = new Image();
        img.src = imgPath;
        img.loading = "lazy";

        // Проверяем, загрузилось ли фото (если 404 — не добавляем)
        const promise = new Promise((resolve) => {
            img.onload = () => {
                wrapper.appendChild(img);
                resolve();
            };
            img.onerror = () => resolve(); // просто пропускаем
        });

        imagePromises.push(promise);
    }

    // Ждём, пока все попытки завершатся
    await Promise.all(imagePromises);

    // === 2. ЗАПУСК ОСНОВНОЙ ЛОГИКИ ===
    initGalleryLogic();
});

function initGalleryLogic() {
    const topButton = document.querySelector(".top");
    const downButton = document.querySelector(".down");
    const counterSpans = document.querySelectorAll(".counter");
    const images = document.querySelectorAll(".images_wrapper > img");
    const total = images.length;

    // === 3. АНИМАЦИЯ СЧЁТЧИКА ===
    counterSpans.forEach((span) => {
        span.textContent = `0/${total}`;
        span.classList.add("counter-appear");
    });

    // === 4. СКРОЛЛ-КНОПКИ ===
    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    downButton.addEventListener("click", () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    });

    // === 5. СЧЁТЧИК ВИДИМОГО ИЗОБРАЖЕНИЯ ===
    images.forEach((img, i) => img.dataset.count = i + 1);

    function getMostVisibleElement(els) {
        let viewportHeight = window.innerHeight;
        let maxVisible = 0;
        let mostVisible = els[0];

        els.forEach((el) => {
            const rect = el.getBoundingClientRect();
            const visible = Math.max(
                0,
                Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)
            );
            if (visible > maxVisible) {
                maxVisible = visible;
                mostVisible = el;
            }
        });

        return mostVisible;
    }

    function updateCounter() {
        const visible = getMostVisibleElement(Array.from(images));
        const current = visible ? visible.dataset.count : 0;
        counterSpans.forEach((span) => {
            span.textContent = `${current}/${total}`;
        });
    }

    updateCounter();
    window.addEventListener("scroll", updateCounter);
    window.addEventListener("resize", updateCounter);
}
