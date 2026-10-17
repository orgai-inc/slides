const slides = Array.from(document.querySelectorAll(".slide"));
const viewport = document.querySelector(".viewport");
const counter = document.querySelector("[data-counter]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const slideWidth = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue("--slide-width"),
);

let index = readIndex();

function readIndex() {
  const hash = Number(location.hash.replace("#", ""));
  if (!Number.isInteger(hash) || hash < 1 || hash > slides.length) {
    return 0;
  }
  return hash - 1;
}

function fit() {
  const scale = viewport.clientWidth / slideWidth;
  for (const slide of slides) {
    slide.style.transform = `scale(${scale})`;
  }
}

function show(nextIndex) {
  index = Math.max(0, Math.min(slides.length - 1, nextIndex));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === index);
  });
  counter.textContent = `${index + 1} / ${slides.length}`;
  prevButton.disabled = index === 0;
  nextButton.disabled = index === slides.length - 1;
  const nextHash = `#${index + 1}`;
  if (location.hash !== nextHash) {
    history.replaceState(null, "", nextHash);
  }
}

prevButton.addEventListener("click", () => show(index - 1));
nextButton.addEventListener("click", () => show(index + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " " || event.key === "PageDown") {
    event.preventDefault();
    show(index + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    show(index - 1);
  }
  if (event.key === "Home") show(0);
  if (event.key === "End") show(slides.length - 1);
});

window.addEventListener("resize", fit);
window.addEventListener("hashchange", () => show(readIndex()));

fit();
show(index);
