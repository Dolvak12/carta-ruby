/* =========================
   assets/js/index.js
   ========================= */

// Configuración optimizada para móvil
const CONFIG = {
    toName: "Ruby",
    toNamePhoto: "Ruby",
    signature: "Diego",
    letterText:
        `My Ruby,

I know you have difficult days sometimes, but I want to remind you how incredible you are.

I love you very much and I appreciate you with all my heart. You have no idea how much I miss you.

You are the best.

I made this to remind you that I am here for you and to bring a smile to your face, because you deserve everything beautiful.

I send you a huge hug.

With all my love,
Diego`,
    // Mobile optimization: relaxed and romantic
    maxPetalsMobile: 50,
    petalIntervalMobile: 400,
    // URL of the local MP3 file
    songPath: "assets/song.mp3"
};

document.addEventListener('DOMContentLoaded', () => {
    // =========================
    // INTRO ANIMATION
    // =========================
    const intro = document.getElementById('intro-container');
    if (intro) {
        // Wait for animation (approx 6s) then fade out
        setTimeout(() => {
            intro.classList.add('fade-out');
            setTimeout(() => {
                intro.style.display = 'none';
            }, 1500); // Tarda 1.5s en desvanecerse
        }, 6000); // 6s de animación del dibujo
    }

    // Establecer textos
    const toNameEl = document.getElementById("toName");
    const toNamePhotoEl = document.getElementById("toNamePhoto");
    const signatureEl = document.getElementById("signature");
    const profilePhoto = document.getElementById("profilePhoto");
    const photoPlaceholder = document.getElementById("photoPlaceholder");

    if (toNameEl) toNameEl.textContent = CONFIG.toName;
    if (toNamePhotoEl) toNamePhotoEl.textContent = CONFIG.toNamePhoto;
    if (signatureEl) signatureEl.textContent = "— " + CONFIG.signature;

    // Verificar carga de foto (corrección de race condition)
    function showUserPhoto() {
        if (photoPlaceholder) photoPlaceholder.style.display = 'none';
        if (profilePhoto) profilePhoto.style.display = 'block';
    }

    function showFallback() {
        if (photoPlaceholder) photoPlaceholder.style.display = 'flex';
        if (profilePhoto) profilePhoto.style.display = 'none';
    }

    if (profilePhoto) {
        if (profilePhoto.complete) {
            if (profilePhoto.naturalHeight !== 0) {
                showUserPhoto();
            } else {
                showFallback();
            }
        } else {
            profilePhoto.onload = showUserPhoto;
            profilePhoto.onerror = showFallback;
        }
    }

    // Carta con efecto "typing"
    const letterEl = document.getElementById("letter");
    const typingTarget = document.getElementById("typingTarget");
    const openBtn = document.getElementById("openLetter");
    const closeBtn = document.getElementById("closeLetter");
    const skipBtn = document.getElementById("skipTyping");
    const scrollArea = document.querySelector('.letter-scroll-area'); // Área de scroll

    let typedOnce = false;
    let typingInterval = null;
    let isTyping = false;
    let isUserScrolling = false; // Flag para detectar interacción

    // Detectar si el usuario toca para cancelar auto-scroll
    if (scrollArea) {
        scrollArea.addEventListener('touchstart', () => { isUserScrolling = true; }, { passive: true });
        scrollArea.addEventListener('wheel', () => { isUserScrolling = true; }, { passive: true });
        scrollArea.addEventListener('scroll', () => {
            // Si el scroll no está al fondo y el usuario escrollea, asumimos interacción
            if (scrollArea.scrollTop + scrollArea.clientHeight < scrollArea.scrollHeight - 10) {
                // Logic could go here, but touchstart is safer
            }
        });
    }

    // TypeText modificado para aceptar velocidad y auto-scroll
    function typeText(text, speed = 75) {
        if (!typingTarget) return;

        isTyping = true;
        isUserScrolling = false; // Resetear al inicio
        skipBtn.style.display = 'inline-flex';
        typingTarget.textContent = "";
        let i = 0;

        if (typingInterval) clearInterval(typingInterval);

        typingInterval = setInterval(() => {
            if (i < text.length) {
                typingTarget.textContent += text[i] || "";
                i++;

                // AUTO-SCROLL: Si el usuario no ha tocado, bajamos suavemente
                if (!isUserScrolling && scrollArea) {
                    scrollArea.scrollTo({
                        top: scrollArea.scrollHeight,
                        behavior: 'smooth'
                    });
                }

            } else {
                clearInterval(typingInterval);
                skipBtn.style.display = 'none';
                isTyping = false;
            }
        }, speed);
    }

    function skipTyping() {
        if (typingInterval) {
            clearInterval(typingInterval);
            if (typingTarget && CONFIG.letterText) {
                typingTarget.textContent = CONFIG.letterText;
            }
            skipBtn.style.display = 'none';
            isTyping = false;
        }
    }

    // NEW: Robust Audio Player using HTML5 Audio
    let audioInstance = null;

    function mountYouTubePlayer() {
        const playSection = document.querySelector('.play-section.compact');
        if (!playSection) return;

        // Limpiar sección para el nuevo reproductor
        playSection.innerHTML = '';
        playSection.style.padding = "15px";
        playSection.style.background = "rgba(0, 0, 0, 0.4)";
        playSection.style.backdropFilter = "blur(10px)";
        playSection.style.borderRadius = "12px";
        playSection.style.display = "flex";
        playSection.style.flexDirection = "column";
        playSection.style.alignItems = "center";
        playSection.style.justifyContent = "center";
        playSection.style.minHeight = "120px";

        const container = document.createElement('div');
        container.style.textAlign = 'center';
        container.style.width = '100%';

        // Información de la canción
        const songInfo = document.createElement('div');
        songInfo.style.marginBottom = '10px';
        songInfo.style.color = 'white';
        songInfo.style.fontSize = '14px';
        songInfo.style.fontWeight = 'bold';
        songInfo.innerHTML = '🎵 Everything Has Changed <br> <small style="font-weight: normal; opacity: 0.8;">but it\'s even better with you by my side</small>';
        container.appendChild(songInfo);

        // Reproductor de audio estándar
        const audio = document.createElement('audio');
        audio.src = CONFIG.songPath;
        audio.controls = true;
        audio.autoplay = true;
        audio.style.width = "100%";
        audio.style.height = "35px";
        audio.style.borderRadius = "30px";

        // Manejo de errores
        audio.onerror = () => {
            songInfo.innerHTML = '<span style="color: #ff4757;">⚠️ Waiting for song.mp3...</span>';
            const tip = document.createElement('div');
            tip.style.fontSize = '11px';
            tip.style.color = '#ddd';
            tip.style.marginTop = '8px';
            tip.textContent = 'Please make sure assets/song.mp3 exists';
            container.appendChild(tip);
        };

        container.appendChild(audio);
        playSection.appendChild(container);
        audioInstance = audio;
    }

    function resetMusicPlayer() {
        const playSection = document.querySelector('.play-section.compact');
        if (!playSection) return;

        playSection.innerHTML = `
            <div class="play-title">♪ Listen to our song ♪</div>
            <button class="play-button small" id="playButton" aria-label="Play song">
                <span>▶</span>
            </button>
            <div class="play-hint">"Everything has Changed" - Taylor Swift ft. Ed Sheeran</div>
        `;
        playSection.style.padding = "";
        playSection.style.background = "";
        playSection.style.height = "";

        // Reasignar evento
        const btn = document.getElementById('playButton');
        if (btn) {
            btn.addEventListener('click', () => {
                mountYouTubePlayer();
                burstPetals(10);
            });
        }
    }

    function toggleLetter() {
        if (letterEl.classList.contains("open")) {
            letterEl.classList.remove("open");
            openBtn.innerHTML = 'Abrir mi carta';
            openBtn.setAttribute('aria-expanded', 'false');

            // DETENER MÚSICA AL CERRAR
            resetMusicPlayer();

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // ... (keep existing open logic)
            letterEl.classList.add("open");
            openBtn.innerHTML = 'Close letter';
            openBtn.setAttribute('aria-expanded', 'true');

            if (!typedOnce) {
                typedOnce = true;
                // Velocidad 75ms para efecto lento y romántico
                typeText(CONFIG.letterText, 75);
            }

            // Pétalos suaves al abrir
            burstPetals(8);

            // AUTO-PLAY / MONTAR VIDEO AL ABRIR
            setTimeout(() => {
                mountYouTubePlayer();
            }, 600);

            setTimeout(() => {
                const cardRect = document.querySelector('.card').getBoundingClientRect();
                const letterRect = letterEl.getBoundingClientRect();
                const scrollTop = window.pageYOffset + letterRect.top - cardRect.top - 20;

                window.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth'
                });
            }, 300);
        }
    }

    if (openBtn) {
        openBtn.addEventListener("click", toggleLetter);
        openBtn.setAttribute('aria-expanded', 'false');
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (letterEl.classList.contains("open")) {
                letterEl.classList.remove("open");
                openBtn.innerHTML = 'Open my letter';
                openBtn.setAttribute('aria-expanded', 'false');

                resetMusicPlayer(); // Detener música

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    if (skipBtn) {
        skipBtn.addEventListener("click", skipTyping);
    }

    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', () => {
            mountYouTubePlayer();
            burstPetals(10);
        });
    }

    // Pétalos flotando
    const petalsLayer = document.getElementById("petals");
    const isMobile = window.innerWidth <= 768;
    const maxPetals = isMobile ? CONFIG.maxPetalsMobile : 40; // Aumentamos base desktop

    function spawnPetal(x) {
        if (!petalsLayer) return;

        if (petalsLayer.children.length >= maxPetals) {
            petalsLayer.removeChild(petalsLayer.firstChild);
        }

        const p = document.createElement("div");
        const isHeart = Math.random() < 0.35; // 35% de chance de ser corazón

        if (isHeart) {
            p.className = "heart-particle";
            p.innerHTML = Math.random() < 0.7 ? "❤" : "✨"; // A veces brillitos
            if (Math.random() < 0.3) p.classList.add("shiny"); // 30% dorados
            p.style.fontSize = (Math.random() * 10 + 10) + "px";
        } else {
            p.className = "petal";
            const sizeVariation = 0.8 + Math.random() * 0.6;
            p.style.transform = `scale(${sizeVariation}) rotate(25deg)`;
        }
        const startX = (x ?? Math.random() * window.innerWidth);

        // Movimiento más suave
        const dx = (Math.random() * 160 - 80) + "px";
        const rot = (Math.random() * 360 - 180) + "deg";
        // Duración más lenta: 5s a 10s
        const duration = (Math.random() * 5 + 5).toFixed(2) + "s";
        const delay = (Math.random() * 2).toFixed(2) + "s";

        const sizeVariation = 0.8 + Math.random() * 0.6;
        p.style.transform = `scale(${sizeVariation}) rotate(25deg)`;
        p.style.zIndex = "1";

        p.style.left = startX + "px";
        p.style.top = (-30 - Math.random() * 70) + "px";
        p.style.setProperty("--dx", dx);
        p.style.setProperty("--rot", rot);
        p.style.animationDuration = duration;
        p.style.animationDelay = delay;

        petalsLayer.appendChild(p);

        const animationDuration = parseFloat(duration) + parseFloat(delay);
        setTimeout(() => {
            if (p.parentNode === petalsLayer) {
                petalsLayer.removeChild(p);
            }
        }, animationDuration * 1000 + 100);
    }

    function gentleRain() {
        spawnPetal();
        if (Math.random() < 0.4) spawnPetal();
    }

    function burstPetals(n = 12) {
        const count = isMobile ? Math.min(n, 15) : n;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                spawnPetal(window.innerWidth * (0.3 + Math.random() * 0.4));
            }, i * (isMobile ? 80 : 50));
        }
    }

    // Iniciar lluvia
    const petalInterval = setInterval(gentleRain, isMobile ? CONFIG.petalIntervalMobile : 650);

    // Lluvia inicial
    setTimeout(() => {
        const initialPetals = isMobile ? 6 : 12;
        for (let i = 0; i < initialPetals; i++) {
            setTimeout(() => { spawnPetal(); }, i * 500);
        }
    }, 300);

    window.addEventListener('pagehide', () => {
        clearInterval(petalInterval);
        if (typingInterval) clearInterval(typingInterval);
    });

    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) event.preventDefault();
    }, { passive: false });
});
