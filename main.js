function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('phone-time').textContent = `${hours}:${minutes}`;
    document.getElementById('watch-time').textContent = `${hours}:${minutes}`;
}

// Hamburger menu functionality
function setupHamburgerMenu() {
    const hamburger = document.getElementById('watch-hamburger');
    const nav = document.getElementById('watch-nav');
    const navItems = document.querySelectorAll('.nav-item');
    
    // Toggle menu when hamburger is clicked
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
    });
    
    // Close menu when a nav item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            nav.classList.remove('active');
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setInterval(updateTime, 1000);
    updateTime(); // initial call
    setupHamburgerMenu();
});