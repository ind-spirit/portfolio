window.onload = () => {
    // const ifMobile = window.matchMedia('screen and (max-aspect-ratio: 8/11)').matches;
    // if (ifMobile) {
    //     document.body.style.height = `${window.innerHeight}px`;
    // }

    // let total = 38,
    //         gallery = document.getElementsByClassName('gallery')[0],
    //         collection,
    //         arr,
    //         back_wrapper = $('.back-wrapper')[0],
    //         fs_image = document.querySelectorAll('img.fs-image')[0],
    //         root_styles = getComputedStyle(document.body),
    //         height = parseInt(root_styles.getPropertyValue('--height')),
    //         ratio = parseFloat(root_styles.getPropertyValue('--ratio')),
    //         fs_size = parseFloat(root_styles.getPropertyValue('--fullscreen-size')),
    //         grid_size = parseInt(root_styles.getPropertyValue('--grid-size')),
    //         width = height * ratio,
    //         path = "https://ik.imagekit.io/indspirit/",
    //         jpg = `.jpg?tr=h-${grid_size},w-${grid_size * ratio},fo-auto,f-auto`,
    //         preview = `.jpg?tr=h-5:h-${height},w-${width},f-auto`,
    //         fs_src = `.jpg?tr=w-${fs_size},h-${fs_size},c-at_max,f-auto`,
    //         fs_preview = `.jpg?tr=h-10,c-at_least:w-${fs_size},h-${fs_size},c-at_least,f-auto`,
    //         back_btn = document.getElementsByClassName('back-btn')[0],
    //         left_btn = $('.left-btn')[0],
    //         right_btn = $('.right-btn')[0];

    let header = document.getElementsByClassName("header")[0];
    let top_button = document.getElementsByClassName("top")[0];
    let down_button = document.getElementsByClassName("down")[0];
    const counter1 = document.getElementsByClassName("counter")[0];
    const counter2 = document.getElementsByClassName("counter")[1];
    const images = document.querySelectorAll("div.images_wrapper > img");
    let images_counter = images.length;

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
    })
    
    // function lazyLoading() {
        
        
    //     images.forEach((el, index) => {
    //         el.setAttribute("data-count", `${index + 1}`);
    //         console.log(el.dataset.count);
    //     });
    //     console.log("ll");
    //     const targets = document.querySelectorAll("div.images_wrapper > img");
    //     const lazyLoad = (target) => {
    //         console.log(target);
    //         const io = new IntersectionObserver((entries, observer) => {
    //             entries.forEach((entry) => {
    //                 console.log(entry);
    //                 if (entry.isIntersecting) {
    //                     const img = entry.target;
    //                     counter1.innerText = `${img.dataset.count}/${images_counter}`;
    //                     counter2.innerText = `${img.dataset.count}/${images_counter}`;
    //                     console.log(`${img.dataset.count}/${images_counter}`);
    //                     console.log(counter2.innerText);
    //                     console.log(counter2);
    //                     //ADD TRANSITION EFFECT
    //                     // observer.disconnect();
    //                 }
    //             });
    //         });
    //         io.observe(target);
    //     };
    //     targets.forEach(lazyLoad);
    // }
    images.forEach((el, index) => {
        el.setAttribute("data-count", `${index + 1}`);
        console.log(el.dataset.count);
    });
    let data_count = document.querySelectorAll('[data-count]')
    window.onscroll = () => {
        console.log(getMostVisibleElement(data_count));
        let img = getMostVisibleElement(data_count)
        counter1.innerText = `${img.dataset.count}/${images_counter}`;
        counter2.innerText = `${img.dataset.count}/${images_counter}`;
    }

    // lazyLoading();
    // function lazyLoading() {
    //     const targets = document.querySelectorAll('div.images_wrapper > img');
    //     const lazyLoad = target => {
    //         const io = new IntersectionObserver((entries, observer) => {
    //             entries.forEach(entry => {
    //                 if (entry.isIntersecting) {
    //                     const img = entry.target;
    //                     const src = img.getAttribute('data-src');
    //                     img.src = src;
    //                     //ADD TRANSITION EFFECT
    //                     setTimeout(() => {
    //                         img.removeAttribute("data-src");
    //                     }, 1);
    //                     observer.disconnect();
    //                 }
    //             });
    //         });
    //         io.observe(target)
    //     };
    //     targets.forEach(lazyLoad);
    // }
    function getMostVisibleElement (els) {

        var viewportHeight = window.innerHeight
      
        var max = 0
        var mostVisibleEl = null
      
        for (var el of Array.from(els)) {
      
          var rect = el.getBoundingClientRect()
          var height = rect.bottom - rect.top
          var visible = {
            top: rect.top >= 0 && rect.top < viewportHeight,
            bottom: rect.bottom > 0 && rect.bottom < viewportHeight
          }
      
          var visiblePx = 0
          if ( visible.top && visible.bottom ) {
            visiblePx = height // Whole element is visible
          } else if ( visible.top ) {
            visiblePx = viewportHeight - rect.top
          } else if ( visible.bottom ) {
            visiblePx = rect.bottom
          } else if ( height > viewportHeight && rect.top < 0 ) {
            var absTop = Math.abs( rect.top )
            if ( absTop < height ) {
              visiblePx = height - absTop // Part of the element is visible
            }
          }
      
          if ( visiblePx > max ) {
            max = visiblePx
            mostVisibleEl = el
          }
      
        }
      
        return mostVisibleEl
      
      }
};