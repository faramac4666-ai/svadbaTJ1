const weddingDate = new Date("2026-12-31T14:00:00");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const loader = document.querySelector("#loader");
const scrollProgress = document.querySelector("#scrollProgress");
const particleField = document.querySelector("#particleField");
const musicToggle = document.querySelector("#musicToggle");
const bgMusic = document.querySelector("#bgMusic");
bgMusic.volume = 0.3;
const themeToggle = document.querySelector("#themeToggle");
const backToTop = document.querySelector("#backToTop");
const rsvpForm = document.querySelector("#rsvpForm");
const formStatus = document.querySelector("#formStatus");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector("#lightboxClose");


let isMusicPlaying = false;

document.body.classList.add("is-loading");

function hideLoader() {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
    revealInitialHero();
  }, 650);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
} else {
  hideLoader();
}

function revealInitialHero() {
  document.querySelectorAll(".hero [data-reveal]").forEach((element) => {
    element.classList.add("is-visible");
  });
}

function createParticles() {
  const count = Math.min(68, Math.floor(window.innerWidth / 7));
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.setProperty("--size", `${Math.random() * 3.2 + 1.2}px`);
    particle.style.setProperty("--alpha", `${Math.random() * 0.34 + 0.15}`);
    particle.style.setProperty("--duration", `${Math.random() * 14 + 13}s`);
    particle.style.setProperty("--delay", `${Math.random() * -18}s`);
    particle.style.setProperty("--drift", `${(Math.random() - 0.5) * 36}vw`);
    fragment.appendChild(particle);
  }

  particleField.replaceChildren(fragment);
}

function updateCountdown() {
  const difference = Math.max(weddingDate.getTime() - Date.now(), 0);
  const secondsTotal = Math.floor(difference / 1000);
  const days = Math.floor(secondsTotal / 86400);
  const hours = Math.floor((secondsTotal % 86400) / 3600);
  const minutes = Math.floor((secondsTotal % 3600) / 60);
  const seconds = secondsTotal % 60;

  setCountdownValue("days", days);
  setCountdownValue("hours", hours);
  setCountdownValue("minutes", minutes);
  setCountdownValue("seconds", seconds);
}

function setCountdownValue(id, value) {
  const element = document.querySelector(`#${id}`);
  const nextValue = String(value).padStart(2, "0");

  if (element.textContent === nextValue) return;

  if (!prefersReducedMotion) {
    element.animate(
      [
        { opacity: 0.35, transform: "translateY(-10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 320, easing: "cubic-bezier(.16,1,.3,1)" }
    );
  }

  element.textContent = nextValue;
}

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.18 }
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  backToTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.7);
}

async function toggleMusic() {
    if (bgMusic.paused) {
        await bgMusic.play();
        isMusicPlaying = true;
    } else {
        bgMusic.pause();
        isMusicPlaying = false;
    }

    musicToggle.classList.toggle("is-playing", isMusicPlaying);
}



function toggleMusicState(forceState) {
  isMusicPlaying = typeof forceState === "boolean" ? forceState : !isMusicPlaying;
  musicToggle.classList.toggle("is-playing", isMusicPlaying);
  musicToggle.setAttribute("aria-label", isMusicPlaying ? "Pause music" : "Play music");
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
}

function initGallery() {
  document.querySelectorAll(".gallery-item img").forEach((image) => {
    image.closest("button").addEventListener("click", () => {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function handleRsvpSubmit(event) {
  event.preventDefault();
  const formData = new FormData(rsvpForm);
  const name = formData.get("name")?.toString().trim() || "guest";
  formStatus.textContent = `Thank you, ${name}. Your RSVP has been prepared.`;

  if (!prefersReducedMotion) {
    rsvpForm.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.012)" },
        { transform: "scale(1)" },
      ],
      { duration: 520, easing: "cubic-bezier(.16,1,.3,1)" }
    );
  }
}

function bindEvents() {
  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", createParticles);
  musicToggle.addEventListener("click", toggleMusic);
  themeToggle.addEventListener("click", toggleTheme);
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  rsvpForm.addEventListener("submit", handleRsvpSubmit);
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

createParticles();
initRevealObserver();
initGallery();
bindEvents();
updateScrollState();
updateCountdown();
window.setInterval(updateCountdown, 1000);
