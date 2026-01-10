/**
 * Cultura Yoruba - Global Main JS
 * Handles mobile menu and global UI elements.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        });
        
        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Sticky Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });

    // Initialize Global Cart Count
    updateGlobalCartCount();
});

function updateGlobalCartCount() {
    const cart = JSON.parse(localStorage.getItem('culturaYorubaCart')) || [];
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-count');
    badges.forEach(b => b.textContent = totalCount);
}

// Export for use in sub-scripts if needed
window.updateGlobalCartCount = updateGlobalCartCount;
