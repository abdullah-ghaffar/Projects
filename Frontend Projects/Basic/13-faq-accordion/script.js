document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');

            // 1. Pehle se khule hue tamam items ko band karein
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // 2. Agar clicked item pehle active nahi tha, to usay active kar dein
            // Is se toggle logic banti hai (ek khulay ga, doosra band hoga)
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });
});