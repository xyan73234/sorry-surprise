const TOTAL_IMAGES = 10;
const LETTER_STAGGER_MS = 32;
const REVEAL_DURATION_MS = 900;

initStarfield();
initTextAnimations();
initMusic();

function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let stars = [];
  let orbs = [];
  let sparkles = [];
  let shootingStars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    const count = Math.floor((canvas.width * canvas.height) / 5500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.2,
      alpha: Math.random() * 0.7 + 0.15,
      twinkleSpeed: Math.random() * 0.02 + 0.006,
      twinkleOffset: Math.random() * Math.PI * 2,
      driftX: (Math.random() - 0.5) * 0.12,
      driftY: Math.random() * 0.12 + 0.03,
      pink: Math.random() > 0.65,
    }));
  }

  function createOrbs() {
    orbs = Array.from({ length: 14 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 90 + 40,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.08 + 0.04,
      hue: Math.random() > 0.5 ? "255, 160, 200" : "255, 220, 240",
    }));
  }

  function createSparkles() {
    sparkles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 1,
      life: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
    }));
  }

  function maybeAddShootingStar() {
    if (Math.random() > 0.985) {
      shootingStars.push({
        x: Math.random() * canvas.width * 0.9,
        y: Math.random() * canvas.height * 0.4,
        length: Math.random() * 90 + 50,
        speed: Math.random() * 8 + 5,
        alpha: 1,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = performance.now() * 0.001;

    for (const orb of orbs) {
      orb.x += orb.vx;
      orb.y += orb.vy;
      if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
      if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
      if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

      const pulse = 0.85 + Math.sin(time * 0.8 + orb.x * 0.01) * 0.15;
      const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      gradient.addColorStop(0, `rgba(${orb.hue}, ${orb.alpha * pulse})`);
      gradient.addColorStop(1, "rgba(255, 160, 200, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    for (const star of stars) {
      const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset);
      const alpha = Math.min(1, Math.max(0.12, star.alpha + twinkle * 0.4));

      ctx.beginPath();
      ctx.fillStyle = star.pink
        ? `rgba(255, 170, 210, ${alpha})`
        : `rgba(255, 248, 252, ${alpha})`;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      star.x += star.driftX;
      star.y += star.driftY;
      if (star.y > canvas.height + 4) {
        star.y = -4;
        star.x = Math.random() * canvas.width;
      }
      if (star.x < -4) star.x = canvas.width + 4;
      if (star.x > canvas.width + 4) star.x = -4;
    }

    for (const sparkle of sparkles) {
      sparkle.life += sparkle.speed;
      if (sparkle.life > 1) sparkle.life = 0;

      const sparkleAlpha = Math.sin(sparkle.life * Math.PI) * 0.7;
      ctx.save();
      ctx.translate(sparkle.x, sparkle.y);
      ctx.rotate(sparkle.life * Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 220, 240, ${sparkleAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-sparkle.size, 0);
      ctx.lineTo(sparkle.size, 0);
      ctx.moveTo(0, -sparkle.size);
      ctx.lineTo(0, sparkle.size);
      ctx.stroke();
      ctx.restore();
    }

    shootingStars = shootingStars.filter((shot) => {
      const gradient = ctx.createLinearGradient(
        shot.x,
        shot.y,
        shot.x + shot.length,
        shot.y + shot.length * 0.35
      );
      gradient.addColorStop(0, "rgba(255, 220, 240, 0)");
      gradient.addColorStop(0.4, `rgba(255, 200, 225, ${shot.alpha})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(shot.x, shot.y);
      ctx.lineTo(shot.x + shot.length, shot.y + shot.length * 0.35);
      ctx.stroke();

      shot.x += shot.speed;
      shot.y += shot.speed * 0.35;
      shot.alpha -= 0.022;
      return shot.alpha > 0 && shot.x < canvas.width + 120;
    });

    maybeAddShootingStar();
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  createOrbs();
  createSparkles();
  draw();

  window.addEventListener("resize", () => {
    resize();
    createStars();
    createOrbs();
    createSparkles();
  });
}

function initMusic() {
  const music = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");
  const fingerprintBtn = document.getElementById("fingerprint-btn");

  if (!music || !toggle) return;

  music.volume = 0.35;
  music.muted = false;

  function playMusic() {
    music.play()
      .then(() => toggle.classList.remove("paused"))
      .catch(() => {});
  }

  if (fingerprintBtn) {
  fingerprintBtn.addEventListener("touchend", playMusic, { once: true });
  fingerprintBtn.addEventListener("click", playMusic, { once: true });
}

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();

    if (music.paused) {
      playMusic();
    } else {
      music.pause();
      toggle.classList.add("paused");
    }
  });

  music.addEventListener("play", () => toggle.classList.remove("paused"));
  music.addEventListener("pause", () => toggle.classList.add("paused"));
}

const YOUR_IMAGE_NAMES = Array.from({ length: TOTAL_IMAGES }, (_, i) => `image-${i + 1}.jpg`);
const PLACEHOLDER_NAMES = Array.from({ length: TOTAL_IMAGES }, (_, i) => `placeholder-${i + 1}.svg`);

function imageSrc(index) {
  return `images/${YOUR_IMAGE_NAMES[index]}`;
}

function placeholderSrc(index) {
  return `images/${PLACEHOLDER_NAMES[index]}`;
}

const pages = {
  apology: document.getElementById("page-apology"),
  compensation: document.getElementById("page-compensation"),
  gallery: document.getElementById("page-gallery"),
};

const galleryEl = document.getElementById("gallery");
const revealedCountEl = document.getElementById("revealed-count");
const galleryHintEl = document.getElementById("gallery-hint");

let revealedCount = 0;

function showPage(name) {
  Object.values(pages).forEach((page) => {
    page.classList.remove("page-active", "page-gallery-active");
  });

  if (name === "gallery") {
    pages.gallery.classList.add("page-gallery-active");
    if (!galleryEl.hasChildNodes()) {
      buildGallery();
    }
    replayHeadline(pages.gallery.querySelector(".gallery-title"));
  } else {
    pages[name].classList.add("page-active");
    replayHeadline(pages[name].querySelector(".headline"));
    animatePageControls(pages[name]);
  }
}

function initTextAnimations() {
  document.querySelectorAll(".headline, .gallery-title").forEach(splitHeadline);
  replayHeadline(document.querySelector(".page-active .headline"));
  animatePageControls(document.querySelector(".page-active"));
}

function splitHeadline(element) {
  if (!element || element.dataset.split === "true") return;

  const nodes = Array.from(element.childNodes);
  element.setAttribute("aria-label", element.textContent.trim());
  element.textContent = "";

  let letterIndex = 0;

  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      [...node.textContent].forEach((char) => {
        element.appendChild(createLetterSpan(char, letterIndex));
        letterIndex += 1;
      });
    } else if (node.nodeName === "BR") {
      element.appendChild(document.createElement("br"));
    }
  });

  element.dataset.split = "true";
}

function createLetterSpan(char, index) {
  const span = document.createElement("span");
  span.className = char === " " || char === "\u00a0" ? "letter letter-space" : "letter";
  span.textContent = char === " " ? "\u00a0" : char;
  span.style.animationDelay = `${index * (LETTER_STAGGER_MS / 1000)}s`;
  span.setAttribute("aria-hidden", "true");
  return span;
}

function replayHeadline(element) {
  if (!element) return;

  const letters = element.querySelectorAll(".letter");
  letters.forEach((letter, index) => {
    letter.classList.remove("letter-pop");
    letter.style.animationDelay = `${index * (LETTER_STAGGER_MS / 1000)}s`;
  });

  void element.offsetWidth;

  letters.forEach((letter) => {
    letter.classList.add("letter-pop");
  });
}

function animatePageControls(page) {
  if (!page) return;

  page.querySelectorAll(".page-controls").forEach((control) => {
    control.classList.remove("show");
  });

  const headline = page.querySelector(".headline");
  const letterCount = headline ? headline.querySelectorAll(".letter").length : 0;
  const delay = letterCount * LETTER_STAGGER_MS + 120;

  setTimeout(() => {
    page.querySelectorAll(".page-controls").forEach((control) => {
      control.classList.add("show");
    });
  }, delay);
}

document.querySelectorAll("[data-next]").forEach((el) => {
  el.addEventListener("click", () => {
    showPage(el.dataset.next);
  });
});

function buildGallery() {
  for (let index = 0; index < TOTAL_IMAGES; index += 1) {
    const item = document.createElement("div");
    item.className = "gallery-item";

    const card = document.createElement("button");
    card.type = "button";
    card.className = "card-item";
    card.setAttribute("aria-label", `Reveal picture ${index + 1}`);

    const media = document.createElement("div");
    media.className = "card-media";

    const img = document.createElement("img");
    img.alt = `Surprise picture ${index + 1}`;
    img.loading = "lazy";
    img.src = imageSrc(index);
    img.dataset.index = String(index);
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholderSrc(index);
    };

    const veil = document.createElement("div");
    veil.className = "pink-veil";

    const number = document.createElement("span");
    number.className = "card-number";
    number.textContent = String(index + 1);

    media.append(img, veil);
    card.append(number, media);
    card.addEventListener("click", () => revealCard(card, item, img, index));

    const downloadBtn = document.createElement("button");
    downloadBtn.type = "button";
    downloadBtn.className = "download-btn";
    downloadBtn.setAttribute("aria-label", `Download picture ${index + 1}`);
    downloadBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>Save</span>
    `;
    downloadBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      downloadImage(index, img);
    });

    item.append(card, downloadBtn);
    galleryEl.appendChild(item);

    requestAnimationFrame(() => {
      card.classList.add("dealing");
      card.style.animationDelay = `${index * 0.08}s`;
    });
  }
}

function revealCard(card, item, img, index) {
  if (card.classList.contains("revealed") || card.classList.contains("revealing")) return;

  card.classList.add("revealing");

  setTimeout(() => {
    card.classList.remove("revealing");
    card.classList.add("revealed");
    item.classList.add("is-revealed");

    revealedCount += 1;
    revealedCountEl.textContent = String(revealedCount);

    if (revealedCount === TOTAL_IMAGES) {
      galleryHintEl.textContent = "Thats all i hope you're happy now :3";
      galleryHintEl.classList.add("done");
    }
  }, REVEAL_DURATION_MS);
}

async function downloadImage(index, img) {
  const filename = `surprise-${index + 1}.jpg`;

  try {
    const response = await fetch(img.src);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  } catch {
    const link = document.createElement("a");
    link.href = img.src;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
const fingerprintBtn = document.getElementById("fingerprint-btn");
const introPage = document.getElementById("page-intro");

if (fingerprintBtn && introPage) {
  fingerprintBtn.addEventListener("click", () => {

    const music = document.getElementById("bg-music");
    const toggle = document.getElementById("music-toggle");

    if (music) {
        music.volume = 0.35;
        music.muted = false;

        music.play().then(() => {
            if (toggle) {
                toggle.classList.remove("paused");
            }
        }).catch(() => {});
    }

    fingerprintBtn.classList.add("scanner-unlocked");

    setTimeout(() => {
        introPage.classList.remove("page-active");
        showPage("apology");
    }, 700);

});
}
const okayBtn = document.getElementById("okay-btn");
const maybeBtn = document.getElementById("maybe-btn");
const compensationTitle = document.getElementById("compensation-title");

function setCompensationText(html) {
  compensationTitle.innerHTML = html;
  delete compensationTitle.dataset.split;
  splitHeadline(compensationTitle);
  showPage("compensation");
}

if (okayBtn && compensationTitle) {
  okayBtn.addEventListener("click", () => {
    setCompensationText(`
      Love youuu ❤️
      <br>
      Here's the compensatiion :P
    `);
  });
}

if (maybeBtn && compensationTitle) {
  maybeBtn.addEventListener("click", () => {
    setCompensationText(`
      Sorry...
      <br>
      Here's the compensatiion :(
    `);
  });
}
