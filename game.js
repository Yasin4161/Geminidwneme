// Canvas elementini ve 2D çizim bağlamını alıyoruz.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun alanının boyutlarını ayarlıyoruz.
// Mobil cihazlarda daha iyi görünmesi için ekran boyutuna göre ayar yapıyoruz.
canvas.width = Math.min(window.innerWidth, 800);
canvas.height = Math.min(window.innerHeight * 0.7, 600);


// OYUNCU AYARLARI
const player = {
    x: canvas.width / 2 - 25, // Başlangıç X konumu (ortada)
    y: canvas.height / 2 - 25, // Başlangıç Y konumu (ortada)
    width: 35, // Mobil için biraz küçülttük
    height: 35,
    color: 'cyan',
    speed: 4, // Mobil için hızı biraz düşürdük
    dx: 0, // X eksenindeki hareket
    dy: 0, // Y eksenindeki hareket
    lastDirection: 'right' // Ateş etmek için son yönü saklar
};

// MERMİLER
let bullets = [];
const bulletSpeed = 7;

// KLAVYE & BUTON KONTROLÜ
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// --- KLAVYE KONTROLLERİ ---
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
    if (e.code === 'Space') {
        shoot();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});


// --- DOKUNMATİK BUTON KONTROLLERİ ---
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const shootBtn = document.getElementById('shootBtn');

// Butona dokunulduğunda (touchstart) veya fare ile basıldığında (mousedown)
function handleButtonPress(e) {
    e.preventDefault(); // Sayfanın kaymasını veya zoom yapmasını engelle
    switch (e.target.id) {
        case 'upBtn': keys.ArrowUp = true; break;
        case 'downBtn': keys.ArrowDown = true; break;
        case 'leftBtn': keys.ArrowLeft = true; break;
        case 'rightBtn': keys.ArrowRight = true; break;
        case 'shootBtn': shoot(); break;
    }
}

// Buton bırakıldığında (touchend) veya fare kaldırıldığında (mouseup)
function handleButtonRelease(e) {
    e.preventDefault();
    // Dokunma olayları için hangi butonun bırakıldığını anlamak biraz daha karmaşık.
    // Bu yüzden tüm hareket tuşlarını false yapıyoruz.
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
}

// Butonlara olay dinleyicilerini ekle
const controlButtons = document.querySelectorAll('.control-btn');
controlButtons.forEach(button => {
    button.addEventListener('mousedown', handleButtonPress);
    button.addEventListener('mouseup', handleButtonRelease);
    button.addEventListener('touchstart', handleButtonPress, { passive: false });
    button.addEventListener('touchend', handleButtonRelease);
});


// Oyuncu hareketini güncelleyen fonksiyon (Değişiklik yok)
function movePlayer() {
    player.dx = 0;
    player.dy = 0;

    if (keys.ArrowUp) {
        player.dy = -player.speed;
        player.lastDirection = 'up';
    }
    if (keys.ArrowDown) {
        player.dy = player.speed;
        player.lastDirection = 'down';
    }
    if (keys.ArrowLeft) {
        player.dx = -player.speed;
        player.lastDirection = 'left';
    }
    if (keys.ArrowRight) {
        player.dx = player.speed;
        player.lastDirection = 'right';
    }

    player.x += player.dx;
    player.y += player.dy;
    
    // Sınır kontrolü
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Ateş etme fonksiyonu (Değişiklik yok)
function shoot() {
    const bullet = {
        x: player.x + player.width / 2 - 5,
        y: player.y + player.height / 2 - 5,
        width: 10,
        height: 10,
        color: 'red',
        dx: 0,
        dy: 0
    };

    switch (player.lastDirection) {
        case 'up': bullet.dy = -bulletSpeed; break;
        case 'down': bullet.dy = bulletSpeed; break;
        case 'left': bullet.dx = -bulletSpeed; break;
        case 'right': bullet.dx = bulletSpeed; break;
    }
    
    bullets.push(bullet);
}

// Mermileri yönetme (Değişiklik yok)
function handleBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
        }
    }
}

// Çizim Fonksiyonları
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Ana Oyun Döngüsü
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    movePlayer();
    handleBullets();
    requestAnimationFrame(update);
}

// Oyunu başlat
update();
