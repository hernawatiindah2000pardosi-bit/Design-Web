// Mengambil elemen-elemen DOM yang dibutuhkan
const playBtn = document.getElementById('play-btn');
const startScreen = document.getElementById('start-screen');
const appContainer = document.getElementById('app-container');

const videoElement = document.getElementById('webcam');
const loadingStatus = document.getElementById('status-loading');
const scrollContainer = document.getElementById('scrollContainer');
const scrollWrapper = document.getElementById('scrollWrapper');

// --- LOGIKA 1: AUTO SCROLL TEKS (TELEPROMPTER) ---
let scrollPosition = 0;

/* KECEPATAN TEKS (DIPERLAMBAT DRAMATIS):
   Nilai 'speed' diubah dari 0.6 menjadi 0.25 agar sangat nyaman dibaca.
   Semakin kecil angka ini, gerakan teks akan semakin lambat.
*/
const speed = 0.25; 
let animationFrameId;

function autoScrollText() {
    scrollPosition += speed;
    
    // Jika teks sudah tergulir habis ke atas, reset posisinya kembali ke bawah
    if (scrollPosition > scrollWrapper.clientHeight) {
        scrollPosition = -scrollContainer.clientHeight;
    }
    
    scrollWrapper.style.transform = `translateY(${-scrollPosition}px)`;
    animationFrameId = requestAnimationFrame(autoScrollText);
}


// --- LOGIKA 2: DETEKSI JARI ANDAL (MEDIAPIPE HANDS) ---
function onResults(results) {
    if (loadingStatus) loadingStatus.style.display = 'none';

    let detectPeaceSign = false;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
            
            // 1. Jari TERBUKA (Telunjuk & Tengah) - Logika andal
            const isIndexUp = landmarks[8].y < landmarks[6].y;
            const isMiddleUp = landmarks[12].y < landmarks[10].y;

            // 2. Jari TERTUTUP (Manis & Kelingking) - Logika andal (Tip vs MCP)
            const isRingDown = landmarks[16].y > landmarks[13].y;
            const isPinkyDown = landmarks[20].y > landmarks[17].y;

            if (isIndexUp && isMiddleUp && isRingDown && isPinkyDown) {
                detectPeaceSign = true;
                break;
            }
        }
    }

    /* Catatan: Untuk intensitas blur yang sangat tinggi (sampai wajah tidak terlihat),
       pastikan kamu telah mengubah CSS '.blur-active' di style.css.
       Misalnya: filter: blur(70px);
    */
    if (detectPeaceSign) {
        videoElement.classList.add('blur-active');
    } else {
        videoElement.classList.remove('blur-active');
    }
}

// Konfigurasi Hands - Tetap sama
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

hands.onResults(onResults);


// --- PERBAIKAN: HIDUPKAN KAMERA DENGAN OPSI NON-MIRROR ---
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480,
    // BARU: Tambahkan opsi ini untuk mematikan mode cermin
    mirrored: false 
});

// --- LOGIKA 3: EVENT LISTENER TOMBOL PLAY ---
playBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    appContainer.classList.remove('hidden');

    autoScrollText();
    camera.start();
});