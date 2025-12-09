let cart = [];

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
}


document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.item-card');
        const name = card.querySelector('h3').textContent;
        const priceText = card.querySelector('.price').textContent;
        const price = parseInt(priceText.replace('₱', '').replace(',', ''));

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        updateCart();
        document.getElementById('cartSidebar').classList.add('open'); // Auto open
    });
});

function updateCart() {
    const list = document.getElementById('cartItemsList');
    const count = document.getElementById('cartItemCount');
    const badge = document.getElementById('cartBadge');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');

    if (cart.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#888; margin-top:40px;">Your cart is empty. Add some delicious items! </p>`;
        count.textContent = '0';
        badge.textContent = '0';
        subtotalEl.textContent = '₱0';
        totalEl.textContent = '₱49';
        return;
    }

    let totalItems = 0;
    let subtotal = 0;

    list.innerHTML = '';
    cart.forEach((item, index) => {
        totalItems += item.qty;
        subtotal += item.price * item.qty;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQty(${index}, -1)">−</button>
                    <span>${item.qty}</span>
                    <button class="quantity-btn" onclick="changeQty(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">₱${(item.price * item.qty)}</div>
        `;
        list.appendChild(div);
    });

    const total = subtotal + 49;
    count.textContent = totalItems;
    badge.textContent = totalItems;
    subtotalEl.textContent = `₱${subtotal}`;
    totalEl.textContent = `₱${total}`;
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        const category = this.dataset.category;
        document.querySelectorAll('.item-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});
