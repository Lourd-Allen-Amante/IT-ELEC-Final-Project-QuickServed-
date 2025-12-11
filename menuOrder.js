// menuOrder.js - UPDATED WITH ORDER SUMMARY

let cart = [];
let selectedTable = null;
let selectedSeat = null;
const SERVICE_FEE = 50;

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

    const total = subtotal;
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
        openTableModal();
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

// Updated: Show order summary instead of directly placing order
document.getElementById("confirmTableBtn")?.addEventListener("click", () => {
    if (selectedTable) {
        closeTableModal();
        showOrderSummary();
    }
});

/* ===================== ORDER SUMMARY MODAL ===================== */

function showOrderSummary() {
    const modal = document.getElementById("orderSummaryModal");
    const itemsList = document.getElementById("orderItemsList");
    const tableDisplay = document.getElementById("selectedTableDisplay");
    const subtotalEl = document.getElementById("summarySubtotal");
    const grandTotalEl = document.getElementById("summaryGrandTotal");
    const prepTimeEl = document.getElementById("prepTimeDisplay");
    const mainContent = document.getElementById("summaryMainContent");
    const successContent = document.getElementById("summarySuccessContent");

    if (!modal || !itemsList) return;

    // Show main content, hide success screen
    if (mainContent) mainContent.style.display = "block";
    if (successContent) successContent.style.display = "none";

    // Update table number
    if (tableDisplay) tableDisplay.textContent = `Table ${selectedTable}`;

    // Calculate totals and prep time
    let subtotal = 0;
    let totalItems = 0;
    itemsList.innerHTML = "";

    cart.forEach(item => {
        subtotal += item.price * item.qty;
        totalItems += item.qty;

        const div = document.createElement("div");
        div.className = "summary-item";
        div.innerHTML = `
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Qty: ${item.qty} × ₱${item.price}</div>
            </div>
            <div class="item-price">₱${item.price * item.qty}</div>
        `;
        itemsList.appendChild(div);
    });

    // Calculate estimated prep time based on number of items
    let prepTimeMin, prepTimeMax;
    if (totalItems <= 3) {
        prepTimeMin = 10;
        prepTimeMax = 15;
    } else if (totalItems <= 6) {
        prepTimeMin = 15;
        prepTimeMax = 20;
    } else if (totalItems <= 10) {
        prepTimeMin = 20;
        prepTimeMax = 25;
    } else {
        prepTimeMin = 25;
        prepTimeMax = 30;
    }

    if (prepTimeEl) {
        prepTimeEl.textContent = `${prepTimeMin}-${prepTimeMax} minutes`;
    }

    const grandTotal = subtotal + SERVICE_FEE;

    if (subtotalEl) subtotalEl.textContent = `₱${subtotal}`;
    if (grandTotalEl) grandTotalEl.textContent = `₱${grandTotal}`;

    modal.classList.add("open");
}

function closeOrderSummary() {
    const modal = document.getElementById("orderSummaryModal");
    if (modal) modal.classList.remove("open");
    
    // Reset to main content view
    const mainContent = document.getElementById("summaryMainContent");
    const successContent = document.getElementById("summarySuccessContent");
    if (mainContent) mainContent.style.display = "block";
    if (successContent) successContent.style.display = "none";
}

function goBackToTableSelection() {
    closeOrderSummary();
    openTableModal();
}

function confirmOrder() {
    // Generate random order number
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    
    // Show success screen
    const mainContent = document.getElementById("summaryMainContent");
    const successContent = document.getElementById("summarySuccessContent");
    const orderNumberDisplay = document.getElementById("orderNumberDisplay");
    const confirmTableDisplay = document.getElementById("confirmTableDisplay");

    if (mainContent) mainContent.style.display = "none";
    if (successContent) successContent.style.display = "block";
    if (orderNumberDisplay) orderNumberDisplay.textContent = `Order #${orderNumber}`;
    if (confirmTableDisplay) confirmTableDisplay.textContent = `Table ${selectedTable}`;

    // Clear cart after short delay
    setTimeout(() => {
        cart = [];
        updateCart();
        closeCart();
    }, 2000);
}

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
