// menuOrder.js - FULL & FINAL VERSION (2025)

let cart = [];
let selectedTable = null;        // For checkout
let selectedSeat = null;         // For "Available Seats" on landing page

/* ===================== CART FUNCTIONS ===================== */

function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) sidebar.classList.toggle("open");
}

function closeCart() {
    const sidebar = document.getElementById("cartSidebar");
    if (sidebar) sidebar.classList.remove("open");
}

// Add item to cart when clicking "+" button
document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        const card = this.closest(".item-card") || this.closest(".menu-card");
        if (!card) return;

        const name = card.querySelector("h3").textContent;
        const priceText = card.querySelector(".price").textContent;
        const price = parseInt(priceText.replace("₱", "").replace(",", ""));

        const existing = cart.find((item) => item.name === name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ name, price, qty: 1 });
        }

        updateCart();
        const sidebar = document.getElementById("cartSidebar");
        if (sidebar) sidebar.classList.add("open");
    });
});

function updateCart() {
    const list = document.getElementById("cartItemsList");
    const count = document.getElementById("cartItemCount");
    const badge = document.getElementById("cartBadge");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");

    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:#888; margin-top:40px;">Your cart is empty. Add some delicious items!</p>`;
        if (count) count.textContent = "0";
        if (badge) badge.textContent = "0";
        if (subtotalEl) subtotalEl.textContent = "₱0";
        if (totalEl) totalEl.textContent = "₱0";
        return;
    }

    let totalItems = 0;
    let subtotal = 0;

    list.innerHTML = "";
    cart.forEach((item, index) => {
        totalItems += item.qty;
        subtotal += item.price * item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";
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

    const total = subtotal; // You can add delivery fee later
    if (count) count.textContent = totalItems;
    if (badge) badge.textContent = totalItems;
    if (subtotalEl) subtotalEl.textContent = `₱${subtotal}`;
    if (totalEl) totalEl.textContent = `₱${total}`;
}

function changeQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

/* ===================== CHECKOUT TABLE SELECTION ===================== */

document.querySelectorAll(".checkout-btn").forEach(btn => {
    btn.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Your cart is empty! Add some items first.");
            return;
        }
        openTableModal(); // Same as "Proceed to Checkout"
    });
});

function openTableModal() {
    const modal = document.getElementById("tableModal");
    const grid = document.getElementById("tableGrid");
    if (!modal || !grid) return;

    grid.innerHTML = "";
    selectedTable = null;
    const confirmBtn = document.getElementById("confirmTableBtn");
    if (confirmBtn) confirmBtn.disabled = true;

    const totalTables = 20;
    const occupiedChance = 0.35;

    for (let i = 1; i <= totalTables; i++) {
        const status = Math.random() < occupiedChance ? "occupied" : "available";
        const seat = document.createElement("div");
        seat.className = `table-seat ${status}`;
        seat.textContent = `Table ${i}`;
        seat.dataset.tableId = i;

        if (status === "available") {
            seat.addEventListener("click", () => selectTable(seat));
        }
        grid.appendChild(seat);
    }

    modal.classList.add("open");
}

function closeTableModal() {
    const modal = document.getElementById("tableModal");
    if (modal) modal.classList.remove("open");
}

function selectTable(seat) {
    document.querySelectorAll(".table-seat.selected").forEach(s => s.classList.remove("selected"));
    seat.classList.add("selected");
    selectedTable = seat.dataset.tableId;
    const confirmBtn = document.getElementById("confirmTableBtn");
    if (confirmBtn) confirmBtn.disabled = false;
}

document.getElementById("confirmTableBtn")?.addEventListener("click", () => {
    if (selectedTable) {
        alert(`Order placed successfully!\nYour table: Table ${selectedTable}\nEnjoy your meal!`);
        closeTableModal();
        cart = [];
        updateCart();
    }
});

/* ===================== AVAILABLE SEATS BUTTON (Landing Page) ===================== */

function openAvailableSeatsModal() {
    const modal = document.getElementById("availableSeatsModal");
    const grid = document.getElementById("tableGrid");
    if (!modal || !grid) return;

    grid.innerHTML = "";
    selectedSeat = null;
    const confirmBtn = document.getElementById("confirmSeatBtn");
    if (confirmBtn) confirmBtn.disabled = true;

    const totalTables = 20;
    const occupiedChance = 0.35;

    for (let i = 1; i <= totalTables; i++) {
        const status = Math.random() < occupiedChance ? "occupied" : "available";
        const seat = document.createElement("div");
        seat.className = `table-seat ${status}`;
        seat.textContent = `Table ${i}`;
        seat.dataset.tableId = i;

        if (status === "available") {
            seat.addEventListener("click", () => selectSeat(seat));
        }
        grid.appendChild(seat);
    }

    modal.style.display = "block";
}

function closeAvailableSeatsModal() {
    const modal = document.getElementById("availableSeatsModal");
    if (modal) modal.style.display = "none";
}

function selectSeat(seat) {
    document.querySelectorAll(".table-seat.selected").forEach(s => s.classList.remove("selected"));
    seat.classList.add("selected");
    selectedSeat = seat.dataset.tableId;
    const confirmBtn = document.getElementById("confirmSeatBtn");
    if (confirmBtn) confirmBtn.disabled = false;
}

// Confirm seat selection (optional)
document.getElementById("confirmSeatBtn")?.addEventListener("click", () => {
    if (selectedSeat) {
        alert(`Great! Table ${selectedSeat} is reserved for you!`);
        closeAvailableSeatsModal();
    }
});

/* ===================== INITIALIZE "Available Seats" BUTTON ===================== */

window.addEventListener("load", () => {
    const link = document.getElementById("availableSeatsLink");
    if (link) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            openAvailableSeatsModal();
        });
    }
});

/* ===================== CATEGORY FILTERING (Dashboard Menu) ===================== */

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        this.classList.add("active");

        const category = this.dataset.category;
        document.querySelectorAll(".item-card").forEach(card => {
            if (category === "all" || card.dataset.category === category) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});
