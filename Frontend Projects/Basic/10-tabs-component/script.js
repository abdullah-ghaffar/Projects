document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.content-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');

            // 1. Remove active class from all buttons
            tabs.forEach(t => t.classList.remove('active'));
            
            // 2. Remove active class from all content items
            contents.forEach(c => c.classList.remove('active'));

            // 3. Add active class to clicked button
            tab.classList.add('active');

            // 4. Show the corresponding content
            document.getElementById(target).classList.add('active');
        });
    });
});