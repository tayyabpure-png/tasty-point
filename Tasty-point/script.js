// script.js

// 1. Initialize Cart from LocalStorage
let cart = JSON.parse(localStorage.getItem('tastyCart')) || [];

// 2. Update the little number badge in the header
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if(countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.innerText = totalItems;
    }
}

// 3. Add Item to Cart
function addToCart(id, name, price) {
    // Check if item already exists
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    // Save to browser memory
    localStorage.setItem('tastyCart', JSON.stringify(cart));
    
    updateCartCount();
    alert(`${name} added to cart!`);
}

// 4. Load Cart Items (for cart.html)
function loadCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total');
    
    if (!cartContainer) return; // Not on cart page

    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartContainer.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.price} Rs x ${item.quantity}</small>
                    </div>
                    <div>
                        <strong>${itemTotal} Rs</strong>
                        <button class="remove-btn" onclick="removeItem(${index})">X</button>
                    </div>
                </div>
            `;
        });
    }

    if (totalElement) {
        totalElement.innerText = total + ' Rs';
    }
}

// 5. Remove Item
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem('tastyCart', JSON.stringify(cart));
    loadCartItems();
    updateCartCount();
}

// 6. Handle Order Type Change (Show/Hide Address)
function toggleAddress() {
    const orderType = document.getElementById('order-type').value;
    const addressGroup = document.getElementById('address-group');
    if (orderType === 'delivery') {
        addressGroup.style.display = 'block';
    } else {
        addressGroup.style.display = 'none';
    }
}

// 7. Send to WhatsApp
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderType = document.getElementById('order-type').value;
    const name = document.getElementById('customer-name').value;
    const address = document.getElementById('customer-address').value;

    if (!name) {
        alert("Please enter your name.");
        return;
    }
    if (orderType === 'delivery' && !address) {
        alert("Please enter delivery address.");
        return;
    }

    // Build the message
    let message = `*New Order for Tasty Point* \n\n`;
    message += `*Customer:* ${name}\n`;
    message += `*Type:* ${orderType.toUpperCase()}\n`;
    if(orderType === 'delivery') message += `*Address:* ${address}\n`;
    message += `\n*Items:*\n`;

    let grandTotal = 0;
    cart.forEach(item => {
        message += `- ${item.name} x${item.quantity} (${item.price * item.quantity} Rs)\n`;
        grandTotal += item.price * item.quantity;
    });

    message += `\n*Total Bill: ${grandTotal} Rs*`;

    // WhatsApp API URL
    const phoneNumber = "923160050548"; 
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(url, '_blank');
    
    // Optional: Clear cart after ordering
    // localStorage.removeItem('tastyCart');
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadCartItems();
});