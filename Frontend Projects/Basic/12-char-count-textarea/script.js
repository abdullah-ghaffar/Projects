document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('message');
    const currentCount = document.getElementById('current');
    const container = document.getElementById('container');
    const maxLength = 250;

    textarea.addEventListener('input', () => {
        const textLength = textarea.value.length;
        
        // 1. Update the number on screen
        currentCount.textContent = textLength;

        // 2. Check if limit is reached
        if (textLength >= maxLength) {
            container.classList.add('limit-reached');
        } else {
            container.classList.remove('limit-reached');
        }
    });
});