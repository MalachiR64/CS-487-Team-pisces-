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

// Notification system
function setupNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.querySelector('.watch-screen').appendChild(notificationContainer);
    }

    // Set up event listeners for each button
    const buttons = document.querySelectorAll('.state-buttons button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            let notificationContent = '';
            let notificationType = '';
            
            // Create different notifications based on button clicked
            switch (buttonText) {
                case 'Fall Detection':
                    notificationContent = 'ALERT: Fall detected! Are you okay?';
                    notificationType = 'emergency';
                    break;
                case 'Notification':
                    notificationContent = 'New message from John: "Hey, how are you?"';
                    notificationType = 'message';
                    break;
                case 'Calendar Reminder':
                    notificationContent = 'Meeting with Dr. Smith in 15 minutes';
                    notificationType = 'calendar';
                    break;
                case 'Medication Reminder':
                    notificationContent = 'Time to take your medication';
                    notificationType = 'medication';
                    break;
            }
            
            showNotification(notificationContent, notificationType);
        });
    });
}

// Show notification function
function showNotification(content, type) {
    const notificationContainer = document.querySelector('.notification-container');
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create notification content
    notification.innerHTML = `
        <div class="notification-header">
            <span class="notification-type">${type.toUpperCase()}</span>
            <span class="notification-close">×</span>
        </div>
        <div class="notification-content">${content}</div>
    `;
    
    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Add active class after a brief delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Setup close button
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300); // Match transition duration
    });
    
    // Auto-dismiss after 5 seconds (except for emergency notifications)
    if (type !== 'emergency') {
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.classList.remove('active');
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Vibration pattern function - simulates device vibration
function vibrateDevice(pattern) {
    // This is just visual simulation for the prototype
    const watchScreen = document.querySelector('.watch-screen');
    watchScreen.classList.add('vibrate');
    
    setTimeout(() => {
        watchScreen.classList.remove('vibrate');
    }, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setInterval(updateTime, 1000);
    updateTime(); // initial call
    setupHamburgerMenu();
    setupNotificationSystem();
});