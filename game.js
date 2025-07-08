// Canvas elementini ve 2D çizim bağlamını alıyoruz.
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Oyun alanının boyutlarını ayarlıyoruz.
canvas.width = 800;
canvas.height = 600;

// OYUNCU AYARLARI
const player = {
    x: canvas.width / 2 - 25, // Başlangıç X konumu (ortada)
    y: canvas.height / 2 - 25, // Başlangıç Y konumu (ortada)
    width: 50,
    height: 50,
    color: 'cyan',
    speed: 5,
    dx: 0, // X eksenindeki hareket
    dy: 0, // Y eksenindeki hareket
    lastDirection: 'right' // Ateş etmek için son yönü saklar
};

// MERMİLER
let bullets = [];
const bulletSpeed = 7;

// KLAVYE KONTROLÜ
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

// Klavye tuşuna basıldığında
document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
    // Boşluk tuşuna basıldığında ateş et
    if (e.code === 'Space') {
        shoot();
    }
});

// Klavye tuşu bırakıldığında
document.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// Oyuncu hareketini güncelleyen fonksiyon
function movePlayer() {
    // Önce hareketi sıfırla
    player.dx = 0;
    player.dy = 0;

    // Basılan tuşlara göre hareketi ve son yönü ayarla
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

    // Yeni konumu hesapla
    player.x += player.dx;
    player.y += player.dy;
    
    // Sınır kontrolü (oyuncunun ekran dışına çıkmasını engelle)
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// Ateş etme fonksiyonu
function shoot() {
    const bullet = {
        x: player.x + player.width / 2 - 5, // Merminin başlangıç X'i (oyuncunun ortası)
        y: player.y + player.height / 2 - 5, // Merminin başlangıç Y'si
        width: 10,
        height: 10,
        color: 'red',
        dx: 0,
        dy: 0
    };

    // Merminin gideceği yönü oyuncunun son baktığı yöne göre ayarla
    switch (player.lastDirection) {
        case 'up':
            bullet.dy = -bulletSpeed;
            break;
        case 'down':
            bullet.dy = bulletSpeed;
            break;
        case 'left':
            bullet.dx = -bulletSpeed;
            break;
        case 'right':
            bullet.dx = bulletSpeed;
            break;
    }
    
    bullets.push(bullet); // Mermiyi mermiler dizisine ekle
}

// Mermileri hareket ettirme ve çizme
function handleBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let bullet = bullets[i];
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;

        // Mermiyi çiz
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // Mermi ekran dışına çıkarsa diziden sil
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
    // Ekranı her karede temizle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oyuncuyu çiz
    drawPlayer();
    
    // Oyuncuyu hareket ettir
    movePlayer();
    
    // Mermileri yönet
    handleBullets();

    // Bu fonksiyonu sürekli olarak tekrar çağırarak animasyon oluştur
    requestAnimationFrame(update);
}

// Oyunu başlat
update();
