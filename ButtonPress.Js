// Initialize cart from LocalStorage
let cart = JSON.parse(localStorage.getItem('wewe_cart')) || [];

// Update cart counter on page load
updateCounter();

// Add to Cart Logic - Updated to capture image
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const product = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            image: card.querySelector('img').src, // Capture the image URL
            quantity: 1
        };

        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(product);
        }

        saveCart();
        alert(`${product.name} added to cart!`);
    });
});

function saveCart() {
    localStorage.setItem('wewe_cart', JSON.stringify(cart));
    updateCounter();
    if (window.location.pathname.includes('Cart.html')) renderCart();
}

function updateCounter() {
    const counter = document.getElementById('cart-count');
    if (counter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        counter.innerText = totalItems;
    }
}

// Render Cart Page
// Render Cart Page - Updated to display image
function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalEl = document.getElementById('total-price');
    if (!list) return;

    list.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        list.innerHTML += `
            <div class="cart-item">
                <div class="cart-product-details">
                    <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                    <span class="cart-item-name">${item.name}</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
                <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    totalEl.innerText = total.toFixed(2);
}

window.changeQty = (index, delta) => {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
};

if (window.location.pathname.includes('Cart.html')) renderCart();

// Function to clear the entire cart
function clearCart() {
    if (cart.length === 0) return; // Do nothing if already empty

    if (confirm("Are you sure you want to remove all items from your cart?")) {
        cart = []; // Empty the local array
        saveCart(); // Sync with localStorage and update UI
    }
}

// Event listener for the clear button (only runs if the button exists on the page)
document.addEventListener('DOMContentLoaded', () => {
    const clearBtn = document.getElementById('clear-cart-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCart);
    }
});

