document.addEventListener("DOMContentLoaded", () => {
  const folder = "images/";
  const ext = ".jpg";
  const maxTry = 500;
  const gallery = document.querySelector(".images_wrapper");
  const counterEls = document.querySelectorAll(".counter");
  const topBtn = document.querySelector(".top");
  const downBtn = document.querySelector(".down");

  let totalImages = 0;

  // === 1. Загружаем список изображений (определяем, какие существуют) ===
  async function getImageCount() {
    let found = 0;
    for (let i = 1; i <= maxTry; i++) {
      try {
        const res = await fetch(`${folder}${i}${ext}`, { method: "HEAD" });
        if (res.ok) found++;
        else break;
      } catch {
        break;
      }
    }
    return found;
  }

  // === 2. Генерируем ленивые изображения ===
  function createLazyImages(count) {
    for (let i = 1; i <= count; i++) {
      const img = document.createElement("img");
      img.dataset.src = `${folder}${i}${ext}`;
      img.loading = "lazy";
      img.alt = `image ${i}`;
      img.className = "lazy-img";
      gallery.appendChild(img);
    }
  }

  // === 3. Ленивая подгрузка через IntersectionObserver ===
  function enableLazyLoad() {
    const images = document.querySelectorAll(".lazy-img");
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          obs.unobserve(img);
        }
      });
    }, { rootMargin: "200px" });
    images.forEach(img => observer.observe(img));
  }

  // === 4. Счётчик ===
  function setInitialCounter() {
    counterEls.forEach(span => {
      span.textContent = `0/${totalImages}`;
      span.classList.add("counter-appear");
    });
  }

  function updateCounter() {
    const imgs = Array.from(gallery.querySelectorAll("img"));
    if (!imgs.length) return;

    const mostVisible = getMostVisible(imgs);
    const current = mostVisible ? mostVisible.dataset.index || 0 : 0;

    counterEls.forEach(span => {
      span.textContent = `${current}/${totalImages}`;
    });
  }

  function getMostVisible(images) {
    let maxVisible = 0;
    let best = null;
    images.forEach(img => {
      const rect = img.getBoundingClientRect();
      const visible = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
      );
      if (visible > maxVisible) {
        maxVisible = visible;
        best = img;
      }
    });
    return best;
  }

  // === 5. Навигация ===
  topBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  downBtn?.addEventListener("click", () => window.scrollTo({ top: window.innerHeight, behavior: "smooth" }));

  // === 6. Запуск ===
  (async () => {
    totalImages = await getImageCount();
    createLazyImages(totalImages);

    // Пронумеровываем их, чтобы счётчик понимал порядок
    document.querySelectorAll(".lazy-img").forEach((img, i) => {
      img.dataset.index = i + 1;
    });

    setInitialCounter();
    enableLazyLoad();

    // Обновляем счётчик только при скролле (чтобы не прыгал в 1/NN на старте)
    window.addEventListener("scroll", updateCounter);
    window.addEventListener("resize", updateCounter);
  })();
});
