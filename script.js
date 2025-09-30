window.onload = () => {
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/";
    const extension = ".jpg";
    const maxTry = 40; // проверяем максимум 40

    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];

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

        // после загрузки всех существующих картинок
        initGallery(imagesLoaded);
    })();

    function initGallery(images) {
        const totalImages = images.length;

        // установка data-count и анимация счётчика
        images.forEach((img, index) => img.setAttribute("data-count", index + 1));

        [counter1, counter2].forEach(el => {
            el.innerText = `0/${totalImages}`;
            el.style.opacity = 0;
            el.style.transition = "opacity 0.5s";
            requestAnimationFrame(() => el.style.opacity = 1);
        });

        function getMostVisibleElement(els) {
            let viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;

            els.forEach(el => {
                const rect = el.getBoundingClientRect();
                const height = rect.bottom - rect.top;
                let visiblePx = 0;

                if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                    visiblePx = height;
                } else if (rect.top < viewportHeight && rect.bottom > 0) {
                    visiblePx = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                }

                if (visiblePx > max) {
                    max = visiblePx;
                    mostVisibleEl = el;
                }
            });

            return mostVisibleEl;
        }

        window.addEventListener("scroll", () => {
            let num = 0;
            const firstImg = images[0];
            if (firstImg) {
                const rect = firstImg.getBoundingClientRect();
                if (rect.top <= 0) {
                    const img = getMostVisibleElement(images);
                    if (img) num = Array.from(images).indexOf(img) + 1;
                }
            }
            counter1.innerText = `${num}/${totalImages}`;
            counter2.innerText = `${num}/${totalImages}`;
        });

        // кнопки скролла
        const topBtn = document.querySelector(".scroll.top");
        const downBtn = document.querySelector(".scroll.down");

        if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
        if (downBtn) downBtn.addEventListener("click", () => window.scrollTo({top:window.innerHeight, behavior:"smooth"}));
    }
};
