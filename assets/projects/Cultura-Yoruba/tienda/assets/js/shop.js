/**
 * Modern Shop Logic (Unified Cart System)
 * Handles Cart adding, removing, LS storage, and UI updates.
 */

class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('culturaYorubaCart')) || [];
        this.initEventListeners();
        this.updateCartUI();
    }

    // Initialize all event listeners
    initEventListeners() {
        // Add to Cart Buttons (Delegation for dynamic content)
        document.addEventListener('click', (e) => {
            if (e.target.closest('.agregar-carrito') || e.target.classList.contains('agregar-carrito')) {
                e.preventDefault();
                const btn = e.target.closest('.agregar-carrito') || e.target;
                this.addToCart(btn);
            }
        });

        // Remove from Cart Buttons (Cart Page)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('borrar-producto') || e.target.closest('.borrar-producto')) {
                e.preventDefault();
                const btn = e.target.closest('.borrar-producto') || e.target;
                const id = btn.getAttribute('data-id');
                this.removeFromCart(id);
            }
        });

        // Process Checkout Form
        const checkoutForm = document.getElementById('procesar-pago');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processCheckout(checkoutForm);
            });
        }
    }

    // Add Item to Cart
    addToCart(btn) {
        const card = btn.closest('.product-card') || btn.closest('.card');
        if (!card) return;

        const product = {
            id: btn.getAttribute('data-id'),
            image: card.querySelector('img').src,
            title: card.querySelector('.product-title') ? card.querySelector('.product-title').textContent : card.querySelector('h5').textContent,
            price: card.querySelector('.product-price') ? card.querySelector('.product-price').textContent : card.querySelector('.precio').textContent,
            quantity: 1
        };

        // Clean price string (remove "Bs.", "$", spaces)
        product.price = product.price.replace(/[^\d.,]/g, '').replace(',', '.');

        // Check if exists
        const exists = this.cart.find(item => item.id === product.id);
        if (exists) {
            exists.quantity++;
            this.showNotification('Cantidad actualizada', 'success');
        } else {
            this.cart.push(product);
            this.showNotification('Producto agregado', 'success');
        }

        this.saveCart();
        this.updateCartUI();
    }

    // Remove Item
    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartUI();
    }

    // Save to LocalStorage
    saveCart() {
        localStorage.setItem('culturaYorubaCart', JSON.stringify(this.cart));
    }

    // Update UI (Navbar badge + Cart Page Table)
    updateCartUI() {
        // Update Badge
        const badges = document.querySelectorAll('.cart-count');
        const totalCount = this.cart.reduce((acc, item) => acc + item.quantity, 0);
        badges.forEach(b => b.textContent = totalCount);

        // Update Cart Page Table if valid
        const cartTableBody = document.querySelector('#lista-compra tbody');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        const igvEl = document.getElementById('igv');

        if (cartTableBody) {
            cartTableBody.innerHTML = '';
            let total = 0;

            this.cart.forEach(item => {
                const price = parseFloat(item.price);
                const subtotal = price * item.quantity;
                total += subtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.image}" width="50" style="border-radius:5px;"></td>
                    <td>${item.title}</td>
                    <td>${price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${subtotal.toFixed(2)}</td>
                    <td>
                        <a href="#" class="borrar-producto btn-danger" data-id="${item.id}" style="color:red; font-size:1.2rem;">
                            <i class="fas fa-times-circle"></i>
                        </a>
                    </td>
                `;
                cartTableBody.appendChild(row);
            });

            if (this.cart.length === 0) {
                cartTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem;">Tu carrito está vacío.</td></tr>';
            }

            // Calculate Totals
            if (subtotalEl) subtotalEl.textContent = total.toFixed(2);
            if (igvEl) igvEl.textContent = "0.00"; // Assuming tax included or 0 for now
            if (totalEl) totalEl.textContent = total.toFixed(2); // If input, set value too
            if (document.querySelector('input#total')) document.querySelector('input#total').value = total.toFixed(2);
        }
    }

    // Process Checkout (Simulation)
    processCheckout(form) {
        if (this.cart.length === 0) {
            this.showNotification('El carrito está vacío', 'error');
            return;
        }

        if(!form.checkValidity()) {
             form.reportValidity();
             return;
        }

        // Simulate Loading
        const loader = document.getElementById('loaders');
        if (loader) {
            loader.style.display = 'block';
            form.querySelector('input[type="submit"]').style.display = 'none';
        }

        setTimeout(() => {
            if (loader) loader.style.display = 'none';
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            
            // SweetAlert2 if available, else alert
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Compra Exitosa!',
                    text: 'Gracias por tu compra. Te contactaremos pronto.',
                    timer: 4000,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'index.html';
                });
            } else {
                alert('¡Compra Exitosa! Gracias por tu compra.');
                window.location.href = 'index.html';
            }
        }, 2000);
    }

    // Notifications Wrapper
    showNotification(msg, type) {
        if (typeof Swal !== 'undefined') {
           const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
              icon: type,
              title: msg
            });
        } else {
            // Fallback console or basic alert avoids spamming
            console.log(`${type.toUpperCase()}: ${msg}`);
        }
    }
}

// Sticky Navbar Logic
document.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Instantiate
document.addEventListener('DOMContentLoaded', () => {
    const shop = new ShoppingCart();
});
