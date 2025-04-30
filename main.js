// Store notifications in localStorage
let notificationsHistory = [];

// Load existing notifications from localStorage
function loadNotifications() {
    const storedNotifications = localStorage.getItem('watchNotifications');
    if (storedNotifications) {
        notificationsHistory = JSON.parse(storedNotifications);
    }
}

// Save notifications to localStorage
function saveNotifications() {
    localStorage.setItem('watchNotifications', JSON.stringify(notificationsHistory));
}

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

// Format time for notifications
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Notification system
function setupNotificationSystem() {
    // Create watch notification container
    if (!document.querySelector('.notification-container')) {
        const watchContainer = document.createElement('div');
        watchContainer.className = 'notification-container';
        document.querySelector('.watch-screen').appendChild(watchContainer);
    }

    // Create phone notification container
    if (!document.querySelector('.phone-notification-container')) {
        const phoneContainer = document.createElement('div');
        phoneContainer.className = 'phone-notification-container';
        document.querySelector('.phone-screen').appendChild(phoneContainer);
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
                    notificationType = 'fall-emergency';
                    break;
                case 'Health Anomaly Detection':
                    notificationContent = 'ALERT: Anomaly detected in Vitals Please check your health.';
                    notificationType = 'health-emergency';
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

    // Setup clear all button if we're on the notifications page
    const clearAllBtn = document.getElementById('clear-all');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', function() {
            notificationsHistory = [];
            saveNotifications();
            renderNotificationsList();
        });
    }
}

// Show notification function
function showNotification(content, type) {
    // Create notification for watch
    const watchContainer = document.querySelector('.notification-container');
    createNotificationElement(watchContainer, content, type);

    // Create notification for phone with modified content for health emergency
    if (type.includes('emergency') && type !== 'fall-emergency') {
        const phoneContainer = document.querySelector('.phone-notification-container');
        if (phoneContainer) {
            const phoneContent = type === 'health-emergency' ? 
                'ALERT: John Smith is having an irregular health anomaly!' : 
                content;
            createNotificationElement(phoneContainer, phoneContent, type);
        }
    }

    // Store notification in history
    const now = new Date();
    notificationsHistory.push({
        content: content,
        type: type,
        timestamp: now.toISOString(),
        formattedTime: formatTime(now)
    });
    saveNotifications();
    renderNotificationsList();
}

function createNotificationElement(container, content, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let notificationContent = `
        <div class="notification-header">
            <span class="notification-type">${type.toUpperCase()}</span>
            <span class="notification-close">×</span>
        </div>
        <div class="notification-content">${content}</div>
    `;

    // Add confirmation buttons for fall detection
    if (type === 'fall-emergency' && container.classList.contains('notification-container')) {
        let timeLeft = 15; // 15 second timer
        notificationContent += `
            <div class="notification-actions">
                <div class="timer">Responding in: ${timeLeft}s</div>
                <button class="confirm-btn yes">I'm OK</button>
                <button class="confirm-btn no">Need Help</button>
            </div>
        `;
    }

    notification.innerHTML = notificationContent;
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    // Handle fall detection confirmation
    if (type === 'fall-emergency' && container.classList.contains('notification-container')) {
        let timer = null;
        const phoneContainer = document.querySelector('.phone-notification-container');
        
        timer = setInterval(() => {
            const timerElement = notification.querySelector('.timer');
            if (timerElement) {
                timeLeft--;
                timerElement.textContent = `Responding in: ${timeLeft}s`;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    notification.remove();
                    // Only send alert to phone if timer reaches zero
                    if (phoneContainer) {
                        createNotificationElement(phoneContainer, 'ALERT: Fall detected! No response received!', type);
                    }
                }
            }
        }, 1000);

        // Handle confirmation buttons
        const yesBtn = notification.querySelector('.confirm-btn.yes');
        const noBtn = notification.querySelector('.confirm-btn.no');

        if (yesBtn && noBtn) {
            yesBtn.addEventListener('click', () => {
                clearInterval(timer);
                notification.remove();
                // No alert sent to phone when "I'm OK" is clicked
            });

            noBtn.addEventListener('click', () => {
                clearInterval(timer);
                notification.remove();
                // Only send alert to phone when "Need Help" is clicked
                if (phoneContainer) {
                    createNotificationElement(phoneContainer, 'ALERT: John Smith has fallen Help requested!', type);
                }
            });
        }
    }

    // Regular notification close button handler
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto-dismiss for non-emergency notifications
    if (!type.includes('emergency')) {
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.classList.remove('active');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Render notifications list on the notifications page
function renderNotificationsList() {
    const notificationsList = document.getElementById('notifications-list');
    if (notificationsList) {
        // Clear current list
        notificationsList.innerHTML = '';
        
        // Filter out emergency notifications and sort by time (newest first)
        const filteredNotifications = notificationsHistory
            .filter(notification => !notification.type.includes('emergency'))
            .reverse();
        
        if (filteredNotifications.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = 'No notifications yet';
            notificationsList.appendChild(emptyState);
            return;
        }
        
        // Create notification items
        filteredNotifications.forEach((notification, index) => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.type}`;
            
            notificationItem.innerHTML = `
                <div class="notification-item-header">
                    <span class="notification-item-type">${notification.type.toUpperCase()}</span>
                    <span class="notification-item-time">${notification.formattedTime}</span>
                </div>
                <div class="notification-item-content">${notification.content}</div>
                <button class="notification-item-delete" data-index="${index}">Delete</button>
            `;
            
            notificationsList.appendChild(notificationItem);
            
            // Add delete functionality
            notificationItem.querySelector('.notification-item-delete').addEventListener('click', function() {
                const reverseIndex = filteredNotifications.length - 1 - parseInt(this.dataset.index);
                if (reverseIndex >= 0 && reverseIndex < notificationsHistory.length) {
                    notificationsHistory.splice(reverseIndex, 1);
                    saveNotifications();
                    renderNotificationsList();
                }
            });
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setInterval(updateTime, 1000);
    updateTime(); // initial call
    loadNotifications(); // Load saved notifications
    setupHamburgerMenu();
    setupNotificationSystem();
    renderNotificationsList(); // Render notifications if we're on that page

    // Add send message handler
    const sendButton = document.getElementById('send-message');
    const messageInput = document.getElementById('phone-message-input');
    
    if (sendButton && messageInput) {
        sendButton.addEventListener('click', function() {
            const message = messageInput.value.trim();
            if (message) {
                showNotification(`New message: "${message}"`, 'message');
                messageInput.value = ''; // Clear input after sending
            }
        });
    }
});