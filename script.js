document.addEventListener("DOMContentLoaded", () => {
    // Kaydırma ile animasyonları tetikleyen fonksiyon
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Element ekrana girdi mi?
            if (entry.isIntersecting) {
                // 'is-visible' sınıfını ekle
                entry.target.classList.add('is-visible');
                // Animasyon bir kere çalıştıktan sonra observer'ı kaldır
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Elementin %10'u görününce tetikle
    });

    // '.animate-on-scroll' sınıfına sahip tüm elementleri seç
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    // Her bir elementi gözlemle
    elementsToAnimate.forEach((element) => {
        scrollObserver.observe(element);
    });
});
