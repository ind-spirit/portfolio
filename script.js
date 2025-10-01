window.onload = () => {
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/";
    const extension = ".jpg";
    const maxTry = 40;

    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];

    // Появление счётчика сразу (0/0), не ждём HEAD-запросы
    [counter1, counter2].forEach(el => {
        el.innerText = `0/0`;
        el.style.opacity = 0;
        el.style.transition = "opacity 0.5s";
        requestAnimationFrame(() => el.style.opacity = 1);
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

        for (let i = 1; i <= maxTry; i++) {
            const path = `${folder}${i}${extension}`;
            if (await imageExists(path)) {
                const img = document.createElement("img");
                img.src = path;
                img.loading = "lazy";
                wrapper.appendChild(img);
                imagesLoaded.push(img);
            }
        }

        initGallery(imagesLoaded);
    })();

    function initGallery(images) {
        const totalImages = images.length;

        // назначаем data-count
        images.forEach((img, index) => img.setAttribute("data-count", index + 1));

        // обновляем общий счётчик
        [counter1, counter2].forEach(el => {
            el.innerText = `0/${totalImages}`;
        });

        function getMostVisibleElement(els) {
            let viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;

            els.forEach(el => {
                const rect = el.getBoundingClientRect();
                const height = rect.height;

                // считаем видимой даже небольшую часть (20% высоты)
                const visibleTop = Math.max(0, 0 - rect.top);
                const visibleBottom = Math.max(0, viewportHeight - rect.top);
                const visibleHeight = Math.min(visibleBottom, height) - visibleTop;

                // если видно хотя бы 20% — засчитываем
                if (visibleHeight / height > 0.2 && visibleHeight > max) {
                    max = visibleHeight;
                    mostVisibleEl = el;
                }
            });

            return mostVisibleEl;
        }

        // обновление счётчика на скролле
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
