window.onload = () => {
    // ---------- UI ЭЛЕМЕНТЫ ----------
    let header = document.getElementsByClassName("header")[0];
    let top_button = document.getElementsByClassName("top")[0];
    let down_button = document.getElementsByClassName("down")[0];
    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];
    const about_btn = document.querySelector("#about-btn");
    const contact_btn = document.querySelector("#contact-btn");
    let hidden_wrapper = document.querySelector(".hidden-wrapper");
    let fixed_wrapper = document.querySelector(".fixed-wrapper");

    let wrapper;
    let about_article;
    let contacts_article;

    // ---------- МОБИЛЬНАЯ ЛОГИКА ----------
    function mobile() {
        if (window.matchMedia("screen and (max-width: 900px)").matches) {
            wrapper = document.querySelector(".mobile_article-wrapper");
            about_article = document.querySelector(".about_article");
            contacts_article = document.querySelector(".contacts_article");
        } else {
            wrapper = document.querySelectorAll(".hidden-wrapper")[0];
            about_article = document.querySelectorAll(".about_article")[1];
            contacts_article = document.querySelectorAll(".contacts_article")[1];
        }
    }
    mobile();
    window.onresize = mobile;

    // ---------- ABOUT / CONTACT ----------
    about_btn.addEventListener("click", () => {
        if (!about_btn.classList.contains("underline")) {
            wrapper.classList.remove("hidden");
        } else {
            wrapper.classList.add("hidden");
        }
        contacts_article.classList.add("hidden");
        about_article.classList.toggle("hidden");
        contact_btn.classList.remove("underline");
        about_btn.classList.toggle("underline");
    });

    contact_btn.addEventListener("click", () => {
        if (!contact_btn.classList.contains("underline")) {
            wrapper.classList.remove("hidden");
        } else {
            wrapper.classList.add("hidden");
        }
        about_article.classList.add("hidden");
        contacts_article.classList.toggle("hidden");
        contact_btn.classList.toggle("underline");
        about_btn.classList.remove("underline");
    });

    // ---------- СКРОЛЛ-КНОПКИ ----------
    top_button.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    down_button.addEventListener("click", () => {
        window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    });

    // ---------- ДИНАМИЧЕСКАЯ ЗАГРУЗКА ФОТО ----------
    const folder = "images/";
    const extension = ".jpg";
    const maxTry = 40;
    const imagesWrapper = document.querySelector(".images_wrapper");

    // Прячем счётчик до загрузки списка изображений
    [counter1, counter2].forEach(el => (el.style.opacity = 0));

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
        let missCount = 0;

        for (let i = 1; i <= maxTry; i++) {
            const path = `${folder}${i}${extension}`;
            if (await imageExists(path)) {
                const img = document.createElement("img");
                img.src = path;
                img.loading = "lazy";
                imagesWrapper.appendChild(img);
                imagesLoaded.push(img);
                missCount = 0;
            } else {
                missCount++;
                if (missCount >= 2) break; // две подряд отсутствуют → останавливаем
            }
        }

        initGallery(imagesLoaded);
    })();

    // ---------- ИНИЦИАЛИЗАЦИЯ ГАЛЕРЕИ ----------
    function initGallery(images) {
        const totalImages = images.length;

        images.forEach((img, index) => img.setAttribute("data-count", index + 1));

        // показываем счётчик теперь, когда знаем итог
        [counter1, counter2].forEach(el => {
            el.innerText = `0/${totalImages}`;
            el.style.transition = "opacity 0.6s";
            requestAnimationFrame(() => (el.style.opacity = 1));
        });

        // Определяем наиболее видимую картинку
        function getMostVisibleElement(els) {
            let viewportHeight = window.innerHeight;
            let max = 0;
            let mostVisibleEl = null;

            els.forEach(el => {
                const rect = el.getBoundingClientRect();
                const height = rect.height;

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

        // Обновляем счётчик при скролле
        window.addEventListener("scroll", () => {
            let num = 0;
            const visibleImg = getMostVisibleElement(images);
            if (visibleImg) {
                num = Array.from(images).indexOf(visibleImg) + 1;
            }
            counter1.innerText = `${num}/${totalImages}`;
            counter2.innerText = `${num}/${totalImages}`;
        });
    }
};
