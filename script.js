window.onload = () => {
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "imageswebp/";
    const extension = ".webp";
    const maxTry = 40;

    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];

    // Прячем счётчик до загрузки списка изображений
    [counter1, counter2].forEach(el => {
        el.style.opacity = 0;
    });

    async function imageExists(url) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    }

    (async () => {
        let imagesLoaded = [];
        let missCount = 0; // счётчик подряд пропущенных картинок

        for (let i = 1; i <= maxTry; i++) {
            const path = `${folder}${i}${extension}`;
            if (await imageExists(path)) {
                const img = document.createElement("img");
                img.src = path;
                img.loading = "lazy";
                wrapper.appendChild(img);
                imagesLoaded.push(img);
                missCount = 0; // сбрасываем, если нашли
            } else {
                missCount++;
                if (missCount >= 2) break; // две подряд пропущены — выходим
            }
        }

        // после загрузки всех существующих картинок
        initGallery(imagesLoaded);
    })();

    function initGallery(images) {
        const totalImages = images.length;

        // назначаем data-count
        images.forEach((img, index) => img.setAttribute("data-count", index + 1));

        // показываем счётчик только теперь
        [counter1, counter2].forEach(el => {
            el.innerText = `0/${totalImages}`;
            el.style.transition = "opacity 0.6s";
            requestAnimationFrame(() => el.style.opacity = 1);
        });

        // Определяем «видимую» фотографию
        function getMostVisibleElement(els) {
            let viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;

            els.forEach(el => {
                const rect = el.getBoundingClientRect();
                const height = rect.height;

                // Засчитываем фото раньше (20% вхождения)
                const visibleTop = Math.max(0, 0 - rect.top);
                const visibleBottom = Math.max(0, viewportHeight - rect.top);
                const visibleHeight = Math.min(visibleBottom, height) - visibleTop;

                if (visibleHeight / height > 0.2 && visibleHeight > max) {
                    max = visibleHeight;
                    mostVisibleEl = el;
                }
            });

            return mostVisibleEl;
        }

        // Обновляем счётчик на скролле
        window.addEventListener("scroll", () => {
            let num = 0;
            const visibleImg = getMostVisibleElement(images);
            if (visibleImg) {
                num = Array.from(images).indexOf(visibleImg) + 1;
            }
            counter1.innerText = `${num}/${totalImages}`;
            counter2.innerText = `${num}/${totalImages}`;
        });

        // кнопки скролла
        const topBtn = document.querySelector(".scroll.top");
        const downBtn = document.querySelector(".scroll.down");

        if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        if (downBtn) downBtn.addEventListener("click", () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }));
    }
};
