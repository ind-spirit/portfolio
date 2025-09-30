window.onload = () => {
    // === ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ ИЗОБРАЖЕНИЙ ===
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/";      // папка с фото
    const extension = ".jpg";      // расширение
    const maxTry = 40;             // максимум номеров проверяем

    async function imageExists(url) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    }

    (async () => {
        let imagesLoaded = 0;
        for (let i = 1; i <= maxTry; i++) {
            const imgPath = `${folder}${i}${extension}`;
            if (await imageExists(imgPath)) {
                const img = document.createElement("img");
                img.dataset.count = imagesLoaded + 1;
                img.src = imgPath;
                img.loading = "lazy";
                wrapper.appendChild(img);
                imagesLoaded++;
            }
        }

        // после загрузки всех изображений запускаем логику галереи
        initGalleryLogic();
    })();

    function initGalleryLogic() {
        const top_button = document.querySelector(".scroll.top");
        const down_button = document.querySelector(".scroll.down");
        const counter1 = document.getElementsByClassName("counter")[0];
        const counter2 = document.getElementsByClassName("counter")[1];
        const images = document.querySelectorAll("div.images_wrapper > img");
        const totalImages = images.length;

        // === ПЛАВНОЕ ПОЯВЛЕНИЕ СЧЕТЧИКА ===
        [counter1, counter2].forEach(el => {
            el.innerText = `0/${totalImages}`;
            el.style.opacity = 0;
            setTimeout(() => el.style.transition = "opacity 0.5s", 10);
            setTimeout(() => el.style.opacity = 1, 20);
        });

        // === ПРОКРУТКА ВВЕРХ / ВНИЗ ===
        top_button.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        down_button.addEventListener("click", () => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        });

        // === ОБНОВЛЕНИЕ СЧЕТЧИКА ===
        function getMostVisibleElement(els) {
            let viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;

            for (let el of els) {
                let rect = el.getBoundingClientRect();
                let height = rect.bottom - rect.top;
                let visiblePx = 0;

                if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                    visiblePx = height; // полностью видно
                } else if (rect.top < viewportHeight && rect.bottom > 0) {
                    visiblePx = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                }

                if (visiblePx > max) {
                    max = visiblePx;
                    mostVisibleEl = el;
                }
            }
            return mostVisibleEl;
        }

        function updateCounter() {
            const mostVisible = getMostVisibleElement(images);
            let current = mostVisible ? parseInt(mostVisible.dataset.count) - 1 : 0;
            counter1.innerText = `${current}/${totalImages}`;
            counter2.innerText = `${current}/${totalImages}`;
        }

        window.addEventListener("scroll", updateCounter);
        updateCounter();

        // === ОБРАБОТКА КНОПОК "ОБО МНЕ" И "КОНТАКТЫ" ===
        const about_btn = document.querySelector("#about-btn");
        const contact_btn = document.querySelector("#contact-btn");
        let wrapperMobile = document.querySelector(".mobile_article-wrapper");
        let wrapperHidden = document.querySelector(".hidden-wrapper");
        let about_article = document.querySelectorAll(".about_article");
        let contacts_article = document.querySelectorAll(".contacts_article");

        function isMobile() {
            return window.matchMedia("screen and (max-width: 900px)").matches;
        }

        function getWrappers() {
            if (isMobile()) {
                return { wrapper: wrapperMobile, about: about_article[0], contacts: contacts_article[0] };
            } else {
                return { wrapper: wrapperHidden, about: about_article[1], contacts: contacts_article[1] };
            }
        }

        function toggleArticle(btn, target, otherBtn, otherTarget) {
            let { wrapper, about, contacts } = getWrappers();
            if (!btn.classList.contains("underline")) wrapper.classList.remove("hidden");
            else wrapper.classList.add("hidden");
            target.classList.toggle("hidden");
            otherTarget.classList.add("hidden");
            btn.classList.toggle("underline");
            otherBtn.classList.remove("underline");
        }

        about_btn.addEventListener("click", () => {
            const { about, contacts } = getWrappers();
            toggleArticle(about_btn, about, contact_btn, contacts);
        });

        contact_btn.addEventListener("click", () => {
            const { about, contacts } = getWrappers();
            toggleArticle(contact_btn, contacts, about_btn, about);
        });

        window.addEventListener("resize", updateCounter);
    }
};
