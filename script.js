window.onload = () => {
    // === НАСТРОЙКИ ===
    const folder = "images/";
    const extension = ".jpg";
    const maxTry = 500;

    // === ЭЛЕМЕНТЫ ===
    const galleryWrapper = document.querySelector(".images_wrapper");
    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];
    const topButton = document.querySelector(".top");
    const downButton = document.querySelector(".down");
    const aboutBtn = document.querySelector("#about-btn");
    const contactBtn = document.querySelector("#contact-btn");

    let articleWrapper, aboutArticle, contactsArticle;

    // === 1. Проверяем наличие картинки ===
    async function imageExists(url) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    }

    // === 2. Динамическая подгрузка изображений ===
    (async () => {
        for (let i = 1; i <= maxTry; i++) {
            const imgPath = `${folder}${i}${extension}`;
            if (await imageExists(imgPath)) {
                const img = document.createElement("img");
                img.src = imgPath;
                img.loading = "lazy";
                galleryWrapper.appendChild(img);
            }
        }

        initGalleryLogic();
    })();

    // === 3. Основная логика после загрузки картинок ===
    function initGalleryLogic() {
        const images = document.querySelectorAll(".images_wrapper > img");
        const totalImages = images.length;

        // Добавляем data-count для каждой картинки
        images.forEach((img, i) => img.setAttribute("data-count", `${i + 1}`));

        // === СЧЁТЧИК ===
        counter1.innerText = `1/${totalImages}`;
        counter2.innerText = `1/${totalImages}`;

        function updateCounter() {
            const visible = getMostVisibleElement(images);
            if (visible) {
                const index = visible.dataset.count;
                counter1.innerText = `${index}/${totalImages}`;
                counter2.innerText = `${index}/${totalImages}`;
            }
        }

        window.addEventListener("scroll", updateCounter);

        // === КНОПКИ СКРОЛЛА ===
        topButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        downButton.addEventListener("click", () => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        });

        // === АДАПТИВ ===
        function updateLayout() {
            if (window.matchMedia("screen and (max-width: 900px)").matches) {
                articleWrapper = document.querySelector(".mobile_article-wrapper");
                aboutArticle = document.querySelector(".about_article");
                contactsArticle = document.querySelector(".contacts_article");
            } else {
                articleWrapper = document.querySelector(".hidden-wrapper");
                aboutArticle = document.querySelectorAll(".about_article")[1];
                contactsArticle = document.querySelectorAll(".contacts_article")[1];
            }
        }

        updateLayout();
        window.addEventListener("resize", updateLayout);

        // === ПЕРЕКЛЮЧЕНИЕ ABOUT / CONTACTS ===
        aboutBtn.addEventListener("click", () => {
            const isActive = aboutBtn.classList.contains("underline");
            articleWrapper.classList.toggle("hidden", isActive);
            contactsArticle.classList.add("hidden");
            aboutArticle.classList.toggle("hidden");
            aboutBtn.classList.toggle("underline");
            contactBtn.classList.remove("underline");
        });

        contactBtn.addEventListener("click", () => {
            const isActive = contactBtn.classList.contains("underline");
            articleWrapper.classList.toggle("hidden", isActive);
            aboutArticle.classList.add("hidden");
            contactsArticle.classList.toggle("hidden");
            contactBtn.classList.toggle("underline");
            aboutBtn.classList.remove("underline");
        });
    }

    // === 4. Определяем самую видимую картинку ===
    function getMostVisibleElement(elements) {
        let viewportHeight = window.innerHeight;
        let maxVisible = 0;
        let mostVisible = null;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const height = rect.height;
            let visiblePx = 0;

            if (rect.top >= 0 && rect.bottom <= viewportHeight) {
                visiblePx = height;
            } else if (rect.top < viewportHeight && rect.bottom > 0) {
                visiblePx = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
            }

            if (visiblePx > maxVisible) {
                maxVisible = visiblePx;
                mostVisible = el;
            }
        });

        return mostVisible;
    }
};
