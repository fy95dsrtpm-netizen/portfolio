const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const galleryItems = Array.from(document.querySelectorAll(".work-grid article"))
  .map((article) => {
    const image = article.querySelector("img");
    const title = article.querySelector("h3")?.textContent.trim() || image?.alt || "";
    const category = article.querySelector("p")?.textContent.trim() || "";

    return image ? { image, title, category } : null;
  })
  .filter(Boolean);

if (year) {
  year.textContent = new Date().getFullYear();
}

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 20);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (galleryItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "photo-lightbox";
  lightbox.hidden = true;
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Large photo view");

  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close photo">x</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Previous photo">&lt;</button>
    <figure class="lightbox-frame">
      <img alt="">
      <figcaption>
        <span data-lightbox-category></span>
        <strong data-lightbox-title></strong>
      </figcaption>
    </figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Next photo">&gt;</button>
  `;

  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const lightboxTitle = lightbox.querySelector("[data-lightbox-title]");
  const lightboxCategory = lightbox.querySelector("[data-lightbox-category]");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const previousButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");
  let activeIndex = 0;

  const showPhoto = (index) => {
    activeIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[activeIndex];

    lightboxImage.src = item.image.currentSrc || item.image.src;
    lightboxImage.alt = item.image.alt;
    lightboxTitle.textContent = item.title;
    lightboxCategory.textContent = item.category;
  };

  const openLightbox = (index) => {
    showPhoto(index);
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    galleryItems[activeIndex].image.focus();
  };

  galleryItems.forEach((item, index) => {
    item.image.tabIndex = 0;
    item.image.setAttribute("role", "button");
    item.image.setAttribute("aria-label", `Open ${item.title}`);
    item.image.addEventListener("click", () => openLightbox(index));
    item.image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(index);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);
  previousButton.addEventListener("click", () => showPhoto(activeIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(activeIndex + 1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      showPhoto(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showPhoto(activeIndex + 1);
    }
  });
}
