document.addEventListener("DOMContentLoaded", () => {
  // ========== НАСТРОЙКИ ==========
  const folder = "images/";
  const ext = ".jpg";
  const maxTry = 500;
  const batchSize = 12;                 // сколько картинок проверяем одновременно
  const stopAfterConsecutiveMisses = 25; // ранняя остановка при длинной пустой зоне

  // ========== DOM ==========
  const gallery = document.querySelector(".images_wrapper");
  if (!gallery) {
    console.error("Не найден .images_wrapper в DOM — проверь HTML.");
    return;
  }
  const counterEls = Array.from(document.getElementsByClassName("counter")); // 0 и 1
  const topBtn = document.querySelector(".top");
  const downBtn = document.querySelector(".down");
  const aboutBtn = document.getElementById("about-btn");
  const contactBtn = document.getElementById("contact-btn");

  // ========== Состояние ==========
  let totalImages = 0;
  let scanningFinished = false;

  // ========== Вспомогательные функции ==========
  function appendLoadedImage(imgElem, fileIdx) {
    imgElem.loading = "lazy";
    imgElem.dataset.index = fileIdx;          // реальный номер файла (1,2,7...)
    totalImages++;
    imgElem.dataset.count = totalImages;      // порядковый номер в галерее
    gallery.appendChild(imgElem);
  }

  function getMostVisibleElement(list) {
    const viewportHeight = window.innerHeight;
    let best = null;
    let bestPx = -1;
    list.forEach(el => {
      const r = el.getBoundingClientRect();
      const visiblePx = Math.max(0, Math.min(r.bottom, viewportHeight) - Math.max(r.top, 0));
      if (visiblePx > bestPx) { bestPx = visiblePx; best = el; }
    });
    return best;
  }

  function showFinalCounterAndAnimate() {
    // подставляем 0/NN и даём класс для анимации
    const text = `0/${totalImages}`;
    counterEls.forEach(span => {
      if (!span) return;
      span.textContent = text;
      span.classList.add("counter-appear");
    });
    // подпишемся на скролл только когда есть галерея
    window.addEventListener("scroll", onScrollUpdate, { passive: true });
    window.addEventListener("resize", onScrollUpdate);
    onScrollUpdate();
  }

  function onScrollUpdate() {
    const imgs = Array.from(gallery.querySelectorAll("img"));
    if (!imgs.length) return;
    const most = getMostVisibleElement(imgs);
    const curr = most ? most.dataset.count || 0 : 0;
    counterEls.forEach(span => { if (span) span.textContent = `${curr}/${totalImages}`; });
  }

  // ========== ИНИЦИАЛИЗАЦИЯ UI (кнопки, about/contact) ==========
  function initUI() {
    // пока счетчик пуст (показываем его только когда закончилась проверка)
    counterEls.forEach(span => { if (span) span.textContent = ""; span?.classList.remove("counter-appear"); });

    topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    downBtn?.addEventListener("click", () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }));

    // about/contact — адаптивно
    let articleWrapper, aboutArticle, contactsArticle;
    function layoutUpdate() {
      if (window.matchMedia("(max-width:900px)").matches) {
        articleWrapper = document.querySelector(".mobile_article-wrapper");
        aboutArticle = document.querySelector(".about_article");
        contactsArticle = document.querySelector(".contacts_article");
      } else {
        articleWrapper = document.querySelector(".hidden-wrapper");
        aboutArticle = document.querySelectorAll(".about_article")[1];
        contactsArticle = document.querySelectorAll(".contacts_article")[1];
      }
    }
    layoutUpdate();
    window.addEventListener("resize", layoutUpdate);

    aboutBtn?.addEventListener("click", () => {
      if (!articleWrapper) layoutUpdate();
      const active = aboutBtn.classList.contains("underline");
      articleWrapper?.classList.toggle("hidden", active);
      contactsArticle?.classList.add("hidden");
      aboutArticle?.classList.toggle("hidden");
      aboutBtn.classList.toggle("underline");
      contactBtn?.classList.remove("underline");
    });

    contactBtn?.addEventListener("click", () => {
      if (!articleWrapper) layoutUpdate();
      const active = contactBtn.classList.contains("underline");
      articleWrapper?.classList.toggle("hidden", active);
      aboutArticle?.classList.add("hidden");
      contactsArticle?.classList.toggle("hidden");
      contactBtn?.classList.toggle("underline");
      aboutBtn?.classList.remove("underline");
    });
  }

  initUI(); // UI работоспособен сразу

  // ========== ЗАГРУЗКА КАРТИНОК ПАЧКАМИ (Image + onload/onerror) ==========
  async function loadImagesBatched() {
    let consecutiveMisses = 0;

    for (let start = 1; start <= maxTry; start += batchSize) {
      const end = Math.min(maxTry, start + batchSize - 1);
      const promises = [];

      for (let i = start; i <= end; i++) {
        promises.push(new Promise(resolve => {
          const img = new Image();
          img.decoding = "async";
          img.src = `${folder}${i}${ext}`;
          img.onload = () => resolve({ idx: i, ok: true, img });
          img.onerror = () => resolve({ idx: i, ok: false });
        }));
      }

      const results = await Promise.all(promises);

      for (const r of results) {
        if (r.ok) {
          appendLoadedImage(r.img, r.idx);
          consecutiveMisses = 0;
        } else {
          consecutiveMisses++;
        }
      }

      // ранний init — не нужен, потому что UI уже работает.
      // Остановка по длинным пропускам:
      if (consecutiveMisses >= stopAfterConsecutiveMisses) {
        console.log(`stop scanning after ${consecutiveMisses} consecutive misses (around index ${start})`);
        break;
      }
    }

    scanningFinished = true;
    console.log("scanning finished — totalImages =", totalImages);
    showFinalCounterAndAnimate();
  }

  // старт загрузки (параллельно)
  loadImagesBatched().catch(err => console.error("Error in loadImagesBatched:", err));
});
