window.onload = () => {
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/"; // папка с фото
    const ext = ".jpg";       // расширение
    const maxTry = 40;        // проверяем до 40

    // Проверка существования изображения
    async function imageExists(url) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    }

    // Считаем сколько изображений реально есть
    async function getImageCount() {
        let count = 0;
        for (let i = 1; i <= maxTry; i++) {
            if (await imageExists(`${folder}${i}${ext}`)) count++;
        }
        return count;
    }

    // Генерация img с lazy-loading
    async function loadImages() {
        for (let i = 1; i <= maxTry; i++) {
            const imgPath = `${folder}${i}${ext}`;
            if (await imageExists(imgPath)) {
                const img = document.createElement("img");
                img.src = imgPath;
                img.loading = "lazy"; // ленивый лоад
                img.dataset.count = i;
                wrapper.appendChild(img);
            }
        }
    }

    (async () => {
        const totalImages = await getImageCount();
        await loadImages();

        // Запускаем логику галереи
        initGallery(totalImages);
    })();

    function initGallery(totalImages) {
        const counter1 = document.getElementsByClassName("counter")[0];
        const counter2 = document.getElementsByClassName("counter")[1];
        const images = document.querySelectorAll("div.images_wrapper > img");

        // Счётчик сначала 0/total
        counter1.innerText = `0/${totalImages}`;
        counter2.innerText = `0/${totalImages}`;
        counter1.style.opacity = 0;
        counter2.style.opacity = 0;
        // Простая анимация появления
        setTimeout(() => {
            counter1.style.transition = "opacity 0.5s";
            counter2.style.transition = "opacity 0.5s";
            counter1.style.opacity = 1;
            counter2.style.opacity = 1;
        }, 100);

        function getMostVisibleElement(els) {
            const viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;
            for (const el of els) {
                const rect = el.getBoundingClientRect();
                const height = rect.bottom - rect.top;
                let visiblePx = 0;
                if (rect.top >= 0 && rect.bottom <= viewportHeight) visiblePx = height;
                else if (rect.top < viewportHeight && rect.bottom > viewportHeight) visiblePx = viewportHeight - rect.top;
                else if (rect.top < 0 && rect.bottom > 0) visiblePx = rect.bottom;
                if (visiblePx > max) {
                    max = visiblePx;
                    mostVisibleEl = el;
                }
            }
            return mostVisibleEl;
        }

        window.addEventListener("scroll", () => {
            const img = getMostVisibleElement(images);
            if (img) {
                const num = Array.from(images).indexOf(img) + 1;
                counter1.innerText = `${num}/${totalImages}`;
                counter2.innerText = `${num}/${totalImages}`;
            }
        });

        // Кнопки вверх/вниз
        const topBtn = document.querySelector(".scroll.top");
        const downBtn = document.querySelector(".scroll.down");
        topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        downBtn?.addEventListener("click", () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }));
    }
};
