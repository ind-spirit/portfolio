window.onload = () => {
    // === ПАРАМЕТРЫ ===
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/";      // папка с фото
    const extension = ".jpg";      // расширение
    const maxImages = 40;          // максимум изображений
    const imagesToLoad = Array.from({length: maxImages}, (_, i) => i + 1); // [1,2,...,40]

    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];

    // === ДИНАМИЧЕСКАЯ ПОДГРУЗКА ===
    imagesToLoad.forEach(num => {
        const img = document.createElement("img");
        img.src = `${folder}${num}${extension}`;
        img.loading = "lazy";
        img.setAttribute("data-count", num);
        wrapper.appendChild(img);
    });

    const images = wrapper.querySelectorAll("img");
    const totalImages = images.length;

    // === Счётчик с анимацией появления ===
    [counter1, counter2].forEach(el => {
        el.innerText = `0/${totalImages}`;
        el.style.opacity = 0;
        el.style.transition = "opacity 0.5s";
        requestAnimationFrame(() => {
            el.style.opacity = 1;
        });
    });

    // === Функция определения самого видимого изображения ===
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

    // === Обновление счётчика при скролле ===
    window.addEventListener("scroll", () => {
        let num = 0; // по умолчанию 0
        const firstImg = images[0];
        if (firstImg) {
            const rect = firstImg.getBoundingClientRect();
            if (rect.top <= 0) {
                // первый элемент прокручен вверх — ищем самый видимый
                const img = getMostVisibleElement(images);
                if (img) {
                    num = Array.from(images).indexOf(img) + 1;
                }
            }
        }
        counter1.innerText = `${num}/${totalImages}`;
        counter2.innerText = `${num}/${totalImages}`;
    });

    // === Скролл по кнопкам ===
    const topBtn = document.querySelector(".scroll.top");
    const downBtn = document.querySelector(".scroll.down");

    if (topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (downBtn) {
        downBtn.addEventListener("click", () => {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
        });
    }
};
