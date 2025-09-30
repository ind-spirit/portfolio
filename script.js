window.onload = () => {
    // === ДИНАМИЧЕСКОЕ ДОБАВЛЕНИЕ ИЗОБРАЖЕНИЙ ===
    const wrapper = document.querySelector(".images_wrapper");
    const folder = "images/";      // папка с фото
    const extension = ".jpg";      // расширение
    const maxTry = 500;            // максимум, сколько номеров проверяем

    async function imageExists(url) {
        try {
            const res = await fetch(url, { method: "HEAD" });
            return res.ok;
        } catch {
            return false;
        }
    }

    (async () => {
        for (let i = 1; i <= maxTry; i++) {
            const imgPath = `${folder}${i}${extension}`;
            if (await imageExists(imgPath)) {
                const img = document.createElement("img");
                img.src = imgPath;
                img.loading = "lazy";
                wrapper.appendChild(img);
            }
        }

        // после того как все картинки добавлены — запускаем остальной код
        initGalleryLogic();
    })();

    function myCode() {
        let header = document.getElementsByClassName("header")[0];
        let top_button = document.getElementsByClassName("top")[0];
        let down_button = document.getElementsByClassName("down")[0];
        const counter1 = document.getElementsByClassName("counter")[0];
        const counter2 = document.getElementsByClassName("counter")[1];
        const images = document.querySelectorAll("div.images_wrapper > img");
        let images_counter = images.length;
        const about_btn = document.querySelector("#about-btn");
        const contact_btn = document.querySelector("#contact-btn");
        const hidden_wrapper = document.querySelectorAll(".hidden-wrapper")[0];
        let fixed_wrapper = document.querySelectorAll(".fixed-wrapper")[0];

        // x = {
        //     aInternal: 10,
        //     aListener: function (val) {},
        //     set a(val) {
        //         this.aInternal = val;
        //         this.aListener(val);
        //     },
        //     get a() {
        //         return this.aInternal;
        //     },
        //     registerListener: function (listener) {
        //         this.aListener = listener;
        //     },
        // };

        // console.log(
        //     document.body.style.width,
        //     document.documentElement.clientWidth
        // );
        // document.body.style.width = `${document.documentElement.clientWidth}px`;
        // console.log(document.body.style.width, window.innerWidth);

        // let vh = window.innerHeight;

        // x.registerListener(function (val) {
        //     counter1.innerText = val;
        //     counter2.innerText = val;
        //     fixed_wrapper.style.height = `${val}px`;
        //     console.log(fixed_wrapper.style.height);
        //     console.log("triger", val);
        //     // alert("Someone changed the value of x.a to " + val);
        // });

        // setInterval(function () {
        //     // x.a = `${window.innerHeight}px`;
        //     // x.a = `${document.documentElement.clientHeight}px`
        //     // console.log(x.a);
        //     counter1.innerText = 5
        //     counter2.innerText = 5
        //     // console.log(window.visualViewport.height);
        //     fixed_wrapper.style.height = `${window.visualViewport.height}px`
        // }, 0);
        // [("resize", "scroll", "touchstart", "touchmove")].forEach(function (e) {
        //     window.addEventListener(e, () => {
        //         fixed_wrapper.style.height = `${window.visualViewport.height}px`
        //         counter1.innerText = 2;
        //         // x.a = `${window.innerHeight}px`
        //         // x.a = `${document.documentElement.clientHeight}px`
        //         // let vh = window.innerHeight;
        //         // document.documentElement.style.setProperty("--vh", `${vh}px`);
        //         // let fix = document.querySelectorAll(".fix")[0];
        //         // fix
        //         // fix.forEach((el) => {
        //         //     el.style.height = `${window.innerHeight}px`;
        //         //     console.log(vh, el.style.height);
        //         //     x.a = `${window.innerHeight}px`;
        //         //     // counter1.innerText = `${vh}  ${el.style.height} ${window.innerHeight}`;
        //         //     // counter2.innerText = `${vh}  ${el.style.height} ${window.innerHeight}`;
        //         // });
        //     });
        // });

        // window.onresize = mobile()

        function mobile() {
            const ifMobile = window.matchMedia(
                // "screen and (max-aspect-ratio: 8/11)"
                "screen and (max-width: 900px)"
            ).matches;
            if (ifMobile) {
                document.querySelectorAll(".hidden-wrapper")[0].remove();
                // document.body.style.height = `${window.innerHeight}px`;
                document
                    .querySelectorAll(".mobile_article-wrapper")[0]
                    .classList.remove("hidden");
                about_article = document.querySelectorAll(".about_article")[0];
                contacts_article =
                    document.querySelectorAll(".contacts_article")[0];

                // setInterval(function () {
                //     // counter1.innerText = `${window.screen.availHeight * 0.1} - (${
                //     //     window.screen.availHeight
                //     // } - ${window.visualViewport.height})`;
                //     // counter2.innerText = `${window.screen.availHeight * 0.1} - (${
                //     //     window.screen.availHeight
                //     // } - ${window.visualViewport.height})`;
                //     // fixed_wrapper.style.height = `${window.visualViewport.height}px`;
                //     // console.log(
                //     //     `${window.screen.availHeight * 0.1} + (${
                //     //         window.screen.availHeight
                //     //     } - ${window.visualViewport.height})`
                //     // );
                //     // document.querySelectorAll(".name.fixed")[0].style.marginTop = `${
                //     //     window.screen.availHeight * 0.2 -
                //     //     (window.screen.availHeight - window.visualViewport.height)
                //     // }px`;
                //     fixed_wrapper.style.height = `${window.visualViewport.height}px`
                // });
            }
        }

        top_button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        });

        down_button.addEventListener("click", () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
            });
        });

        let wrapper;
        let about_article;
        let contacts_article;
        mobile();
        window.onresize = mobile();
        function mobile() {
            if (window.matchMedia("screen and (max-width: 900px)").matches) {
                wrapper = document.querySelectorAll(".mobile_article-wrapper")[0];
                about_article = document.querySelectorAll(".about_article")[0];
                contacts_article =
                    document.querySelectorAll(".contacts_article")[0];
            } else {
                wrapper = document.querySelectorAll(".hidden-wrapper")[0];
                about_article = document.querySelectorAll(".about_article")[1];
                contacts_article =
                    document.querySelectorAll(".contacts_article")[1];
            }
        }

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

        images.forEach((el, index) => {
            el.setAttribute("data-count", `${index + 1}`);
        });
        let data_count = document.querySelectorAll("[data-count]");
        let img = getMostVisibleElement(data_count);
        counter1.innerText += `/${images_counter}`;
        counter2.innerText += `${images_counter}`;
        window.onscroll = () => {
            let img = getMostVisibleElement(data_count);
            counter1.innerText = `${img.dataset.count}/${images_counter}`;
            counter2.innerText = `${img.dataset.count}/${images_counter}`;
        };
        function getMostVisibleElement(els) {
            var viewportHeight = window.innerHeight;

            var max = 0;
            var mostVisibleEl = null;

            for (var el of Array.from(els)) {
                var rect = el.getBoundingClientRect();
                var height = rect.bottom - rect.top;
                var visible = {
                    top: rect.top >= 0 && rect.top < viewportHeight,
                    bottom: rect.bottom > 0 && rect.bottom < viewportHeight,
                };

                var visiblePx = 0;
                if (visible.top && visible.bottom) {
                    visiblePx = height; // Whole element is visible
                } else if (visible.top) {
                    visiblePx = viewportHeight - rect.top;
                } else if (visible.bottom) {
                    visiblePx = rect.bottom;
                } else if (height > viewportHeight && rect.top < 0) {
                    var absTop = Math.abs(rect.top);
                    if (absTop < height) {
                        visiblePx = height - absTop; // Part of the element is visible
                    }
                }

                if (visiblePx > max) {
                    max = visiblePx;
                    mostVisibleEl = el;
                }
            }

            return mostVisibleEl;
        }
    };
}