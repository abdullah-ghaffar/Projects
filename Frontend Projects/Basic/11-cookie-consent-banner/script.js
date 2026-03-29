document.addEventListener("DOMContentLoaded", function() {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const closeIcon = document.getElementById("close-icon");

    // 1. Check karein ke kya user pehle hi accept kar chuka hai?
    const hasAccepted = localStorage.getItem("cookieConsent");

    if (!hasAccepted) {
        // Agar accept nahi kiya, toh banner show karein
        cookieBanner.style.display = "flex";
    }

    // 2. Accept button par click ka logic
    acceptBtn.addEventListener("click", () => {
        // Local storage mein save karein
        localStorage.setItem("cookieConsent", "true");
        
        // Banner ko hide kar dein
        cookieBanner.style.display = "none";
    });

    // 3. Close icon par click (sirf temporary hide karne ke liye)
    closeIcon.addEventListener("click", () => {
        cookieBanner.style.display = "none";
    });
});