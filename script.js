window.onload = () => {
    // === ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ ИЗОБРАЖЕНИЙ ===
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/"; // папка с фото
    const extension = ".jpg"; // расширение
    const maxTry = 40; // максимум проверяемых номеров

    async function imageExists(url) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    }

    (async () => {
        let count = 0;
        for (let i = 1; i <= maxTry; i++) {
            const imgPath = `${folder}${i}${extension}`;
            if (await imageExists(imgPath)) {
                const img = document.createElement("img");
                img.dataset.count = count + 1; // для счётчика
                img.src = imgPath;
                img.loading = "lazy";
                img.style.opacity = 0;
                img.style.transition = "opacity 0.5s";
                wrapper.appendChild(img);
                // плавное появление при загрузке изображения
                img.onload = () => img.style.opacity = 1;
                count++;
            }
        }

        // после того как все картинки добавлены — запускаем остальной код
        initGalleryLogic(count);
    })();

    function initGalleryLogic(totalImages) {
        const counter1 = document.getElementsByClassName("counter")[0];
        const counter2 = document.getElementsByClassName("counter")[1];
        const top_button = document.querySelector(".scroll.top");
        const down_button = document.querySelector(".scroll.down");

        // Изначальный счётчик 0/X с плавной анимацией
        [counter1, counter2].forEach(el => {
            el.innerText = `0/${totalImages}`;
            el.style.opacity = 0;
            el.style.transition = "opacity 0.5s";
            setTimeout(() => el.style.opacity = 1, 50);
        });

        const images = document.querySelectorAll("div.images_wrapper > img");

        function getMostVisibleElement(els) {
            const viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;

            els.forEach(el => {
                const rect = el.getBoundingClientRect();
                const height = rect.bottom - rect.top;
                let visiblePx = 0;

                if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                    visiblePx = height; // полностью виден
                } else if (rect.top < viewportHeight && rect.bottom >= viewportHeight) {
                    visiblePx = viewportHeight - rect.top;
                } else if (rect.top < 0 && rect.bottom > 0) {
                    visiblePx = rect.bottom;
                }

                if (visiblePx > max) {
                    max = visiblePx;
                    mostVisibleEl = el;
                }
            });

            return mostVisibleEl;
        }

        function updateCounter() {
            const img = getMostVisibleElement(images);
            if (!img) {
                counter1.innerText = `0/${totalImages}`;
                counter2.innerText = `0/${totalImages}`;
            } else {
                const index = parseInt(img.dataset.count);
                counter1.innerText = `${index}/${totalImages}`;
                counter2.innerText = `${index}/${totalImages}`;
            }
        }

        window.addEventListener("scroll", updateCounter);

        // Скролл вверх и вниз
        top_button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        down_button.addEventListener("click", () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }));

        // Изначальный апдейт
        updateCounter();
    }
};
