// Định dạng tiền tệ VND
const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
});

// === CÁC BIẾN CHUNG ===
const selectAllCheckboxTop = document.getElementById("selectAllProductsTop");
const selectAllCheckboxBottom = document.getElementById(
    "selectAllProductsBottom"
);
const selectedCountSpan = document.getElementById("selectedCount");
const checkoutTotalAmountSpan = document.getElementById("checkoutTotalAmount");
const totalLabel = document.querySelector(".checkout-total-group .label");
const simpleBuyButton = document.getElementById("simpleBuyButton");

// Các phần tử cần ẩn khi giỏ hàng trống
const cartHeader = document.querySelector(".cart-header");
const cartSection = document.querySelector(".cart-section");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const cartContainer = document.querySelector(".cart-container");
const cartIcon = document.getElementById("cartIcon");
const checkoutBar = document.querySelector(".checkout-bar");

const LOGIN_PAGE_URL = './login.html'; // Đường dẫn đến trang đăng nhập


function getProductCheckboxes() {
    return document.querySelectorAll(".product-checkbox");
}

function parseVietnameseCurrency(text) {
    // Loại bỏ dấu chấm, chữ 'đ', '₫' và khoảng trắng
    return parseInt(
        text.replace(/\./g, "").replace("₫", "").replace("đ", "").trim()
    );
}

// === LOGIC KIỂM TRA ĐĂNG NHẬP ===
function checkAndRedirectToLogin() {
    // Kiểm tra giá trị 'loggedInUser' trong sessionStorage mà auth.js đang dùng
    const loggedInUsername = sessionStorage.getItem('loggedInUser');
    
    // Nếu không có tên người dùng nào được lưu, coi như chưa đăng nhập
    if (!loggedInUsername) {
        window.location.href = LOGIN_PAGE_URL; 
        return false; // Trả về false để dừng các hàm giỏ hàng chạy
    }
    return true; // Đã đăng nhập
}


// ----------------------------------------------------------------------
// 🛒 LOGIC TẢI VÀ HIỂN THỊ SẢN PHẨM (MỚI THÊM)
// ----------------------------------------------------------------------

/**
 * Tạo chuỗi HTML cho một sản phẩm trong giỏ hàng.
 */
function createCartItemHTML(item) {
    const itemTotal = item.price * item.quantity;
    const correctedImagePath = item.image.startsWith('../../') ? item.image : '../../' + item.image;
    
    // Đảm bảo data-id và data-price được set từ item
 return `
        <div class="cart-item" data-id="${item.id}" data-price="${item.price}">
            <div><input type="checkbox" class="product-checkbox" aria-label="Chọn sản phẩm" /></div>
            <div class="col-product">
                <img src="${correctedImagePath}" alt="${item.name}" class="product-image item-thumbnail">
                <div class="product-info">
                    <h3 class="item-name">${item.name}</h3>
                    <p style="font-size: 13px; color: var(--muted);">${item.desc || 'Phân loại: Mặc định'}</p>
                </div>
            </div>
            <div class="col-price">${formatter.format(item.price)}</div>
            <div class="col-quantity">
                <div class="quantity-control">
                    <button type="button" class="quantity-btn minus-btn">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
                    <button type="button" class="quantity-btn plus-btn">+</button>
                </div>
            </div>
            <div class="col-total">${formatter.format(itemTotal)}</div>
            <div class="col-action">
                <a href="#" class="delete-item-btn">Xóa</a>
            </div>
        </div>
    `;
}

/**
 * Tải dữ liệu giỏ hàng từ Local Storage và chèn vào DOM.
 */
function loadCartItems() {
    // Đọc từ localStorage với key 'cartItems' (KHỚP với user.js)
    const cartItemsJson = localStorage.getItem('cartItems'); 
    const cartSection = document.querySelector(".cart-section");

    // Xóa nội dung cũ để tránh trùng lặp
    if (cartSection) cartSection.innerHTML = ''; 

    if (cartItemsJson && cartSection) {
        const items = JSON.parse(cartItemsJson);
        
        if (items.length > 0) {
            items.forEach(item => {
                cartSection.insertAdjacentHTML('beforeend', createCartItemHTML(item));
            });
        }
    }
}


// --- LOGIC CHỌN TẤT CẢ VÀ TÍNH TỔNG CỘNG ---

function syncSelectAllCheckboxes(isChecked) {
    if (selectAllCheckboxTop) selectAllCheckboxTop.checked = isChecked;
    if (selectAllCheckboxBottom) selectAllCheckboxBottom.checked = isChecked;
}

//Tính tổng tiền VÀ TỔNG SỐ LƯỢNG sản phẩm
function calculateCartTotal() {
    const currentCheckboxes = getProductCheckboxes();
    const totalProducts = currentCheckboxes.length;
    let totalAmount = 0;
    let totalQuantity = 0;
    let checkedCount = 0;

    // LOGIC KIỂM TRA GIỎ HÀNG TRỐNG
    if (totalProducts === 0) {
        if (cartHeader) cartHeader.style.display = "none";
        if (cartSection) cartSection.style.display = "none";
        if (cartContainer) cartContainer.style.display = "none";
        if (emptyCartMessage) emptyCartMessage.style.display = "block";
        if (checkoutBar) checkoutBar.style.display = "none";

        if (selectedCountSpan) selectedCountSpan.textContent = 0;
        if (totalLabel) totalLabel.innerHTML = `Tổng cộng (0 sản phẩm):`;
        if (checkoutTotalAmountSpan)
            checkoutTotalAmountSpan.textContent = formatter.format(0);
        return;
    } else {
        // Cập nhật hiển thị khi có sản phẩm
        if (cartHeader) {
            // Tạm thời ẩn cột tiêu đề trên mobile
            cartHeader.style.display = window.innerWidth > 600 ? "grid" : "none";
        }
        if (cartSection) cartSection.style.display = "block";
        if (cartContainer) cartContainer.style.display = "flex";
        if (emptyCartMessage) emptyCartMessage.style.display = "none";
        if (checkoutBar) checkoutBar.style.display = "block";
    }

    currentCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkedCount++;
            const cartItem = checkbox.closest(".cart-item");
            
            // Lấy số lượng
            const quantityInput = cartItem.querySelector(".quantity-input");
            const quantity = parseInt(quantityInput?.value) || 0; 
            totalQuantity += quantity;

            // Lấy giá trị tổng tiền
            const totalText = cartItem.querySelector(".col-total").textContent;
            const itemTotal = parseVietnameseCurrency(totalText);

            if (!isNaN(itemTotal)) {
                totalAmount += itemTotal;
            }
        }
    });

    // Cập nhật hiển thị TỔNG SỐ LƯỢNG
    if (selectedCountSpan) selectedCountSpan.textContent = checkedCount;
    if (totalLabel)
        totalLabel.innerHTML = `Tổng cộng (${totalQuantity} sản phẩm):`;
    if (checkoutTotalAmountSpan) {
        checkoutTotalAmountSpan.textContent = formatter.format(totalAmount);
    }

    // Cập nhật trạng thái Chọn Tất Cả
    const allChecked = totalProducts > 0 && checkedCount === totalProducts;
    syncSelectAllCheckboxes(allChecked);

    // Vô hiệu hóa nút Mua Hàng nếu không có sản phẩm nào được chọn
    if (simpleBuyButton) {
        simpleBuyButton.disabled = checkedCount === 0;
        simpleBuyButton.style.opacity = checkedCount === 0 ? 0.6 : 1;
    }
}

function handleSelectAllChange(event) {
    const isChecked = event.target.checked;
    syncSelectAllCheckboxes(isChecked);

    getProductCheckboxes().forEach((checkbox) => {
        checkbox.checked = isChecked;
    });

    calculateCartTotal();
}

// --- LOGIC TĂNG/GIẢM SỐ LƯỢNG VÀ CẬP NHẬT TỔNG TIỀN ---

function updateItemTotal(inputField) {
    const cartItem = inputField.closest(".cart-item");
    const unitPrice = parseFloat(cartItem.dataset.price); 
    let quantity = parseInt(inputField.value);

    if (isNaN(quantity) || quantity < 1) {
        quantity = 1;
        inputField.value = 1;
    }
    
    if (quantity > 99) {
        quantity = 99;
        inputField.value = 99;
    }

    const colTotal = cartItem.querySelector(".col-total");

    const newTotal = unitPrice * quantity;
    colTotal.textContent = formatter.format(newTotal);

    // Cập nhật số lượng trong Local Storage (MỚI THÊM)
    updateQuantityInLocalStorage(cartItem.dataset.id, quantity);

    calculateCartTotal();
}

/**
 * Cập nhật số lượng sản phẩm trong Local Storage khi người dùng thay đổi.
 * @param {string} productId - ID sản phẩm.
 * @param {number} newQuantity - Số lượng mới.
 */
function updateQuantityInLocalStorage(productId, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const id = parseInt(productId);
    
    const itemIndex = cartItems.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        cartItems[itemIndex].quantity = newQuantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}

function setupQuantityControl() {
    const quantityControls = document.querySelectorAll(".quantity-control");

    quantityControls.forEach((control) => {
        const minusBtn = control.querySelector(".quantity-btn:first-child");
        const plusBtn = control.querySelector(".quantity-btn:last-child");
        const inputField = control.querySelector(".quantity-input");

        // Đảm bảo không gắn sự kiện nhiều lần
        minusBtn.onclick = null;
        plusBtn.onclick = null;
        inputField.onchange = null;
        inputField.oninput = null;

        // Xử lý nút GIẢM (-)
        minusBtn.onclick = () => {
            let currentValue = parseInt(inputField.value);
            if (currentValue > 1) {
                inputField.value = currentValue - 1;
                updateItemTotal(inputField);
            }
        };

        // Xử lý nút TĂNG (+)
        plusBtn.onclick = () => {
            let currentValue = parseInt(inputField.value);
            if (currentValue < 99) { 
                inputField.value = currentValue + 1;
                updateItemTotal(inputField);
            }
        };

        // Đảm bảo giá trị nhập tay không nhỏ hơn 1 và luôn cập nhật
        inputField.onchange = () => {
            updateItemTotal(inputField);
        };
        inputField.oninput = () => {
            let value = parseInt(inputField.value);
            if (isNaN(value)) inputField.value = 1;
            if (value < 1) inputField.value = 1;
            if (value > 99) inputField.value = 99;
        };
    });
}

// --- CHỨC NĂNG XÓA SẢN PHẨM ---
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll(".delete-item-btn");

    deleteButtons.forEach((button) => {
        button.onclick = null;

        button.onclick = (e) => {
            e.preventDefault();
            const cartItem = button.closest(".cart-item");
            const productId = cartItem.dataset.id; // Lấy ID sản phẩm

            if (cartItem) {
                // Xóa khỏi DOM
                cartItem.remove();

                // Xóa khỏi Local Storage (MỚI THÊM)
                deleteItemFromLocalStorage(productId);

                setupEventListeners(); 
                calculateCartTotal();
                console.log("Đã xóa sản phẩm khỏi giỏ hàng!");
            }
        };
    });
}

/**
 * Xóa sản phẩm khỏi Local Storage.
 * @param {string} productId - ID sản phẩm cần xóa.
 */
function deleteItemFromLocalStorage(productId) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const id = parseInt(productId);

    // Lọc ra các sản phẩm không có ID này
    const updatedCart = cartItems.filter(item => item.id !== id);

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
}

// ----------------------------------------------------------------------
// 🚀 LOGIC CHECKOUT MỚI
// ----------------------------------------------------------------------

/**
 * Thu thập dữ liệu sản phẩm đã chọn và lưu vào Local Storage.
 * @returns {number} Số lượng sản phẩm đã lưu.
 */
function saveCheckoutData() {
    const products = [];
    let totalAmount = 0;

    getProductCheckboxes().forEach((checkbox) => {
        if (checkbox.checked) {
            const cartItem = checkbox.closest(".cart-item");
            
            // Đảm bảo các thuộc tính data-id, data-price, và các class HTML sau tồn tại
            const productId = cartItem.dataset.id;
            const productName = cartItem.querySelector(".item-name")?.textContent.trim();
            const quantity = parseInt(cartItem.querySelector(".quantity-input")?.value) || 0;
            const unitPrice = parseFloat(cartItem.dataset.price); 
            const imageSrc = cartItem.querySelector(".item-thumbnail")?.src; // Giả định có class này

            // Tính tổng tiền
            totalAmount += unitPrice * quantity;

            products.push({
                id: productId,
                name: productName,
                price: unitPrice,
                quantity: quantity,
                image: imageSrc 
            });
        }
    });

    // Lưu mảng sản phẩm và tổng tiền vào Local Storage
    localStorage.setItem('checkoutItems', JSON.stringify({
        products: products,
        totalAmount: totalAmount
    }));
    
    return products.length;
}

/**
 * Xử lý nút Mua Hàng: Lưu dữ liệu và chuyển hướng.
 */
function handleSimpleCheckout() {
    // 1. Kiểm tra lại sản phẩm được chọn
    const checkedCount = Array.from(getProductCheckboxes()).filter(
        (cb) => cb.checked
    ).length;

    if (checkedCount === 0) {
        alert("Vui lòng chọn ít nhất một sản phẩm để Mua Hàng!");
        return;
    }

    // 2. LƯU dữ liệu đã chọn vào Local Storage
    const itemsToCheckout = saveCheckoutData();

    if (itemsToCheckout > 0) {
        // 3. CHUYỂN HƯỚNG sang trang xác nhận đơn hàng (cùng thư mục)
        console.log(`Chuyển hướng đến trang thanh toán với ${itemsToCheckout} sản phẩm.`);
        window.location.href = 'checkout.html'; 
    } else {
        alert("Không có sản phẩm nào hợp lệ được chọn để thanh toán.");
    }
}


// Gán sự kiện cho nút Mua Hàng (Gọi hàm handleSimpleCheckout mới)
if (simpleBuyButton) {
    simpleBuyButton.addEventListener("click", handleSimpleCheckout);
}

// --- CHỨC NĂNG TẢI LẠI TRANG KHI NHẤN ICON GIỎ HÀNG ---
function setupCartIconReload() {
    if (cartIcon) {
        cartIcon.addEventListener("click", (e) => {
            e.preventDefault();
            // Tải lại trang hiện tại (xóa tham chiếu #hash nếu có)
            window.location.href = window.location.href.split('#')[0]; 
        });
    }
}

// HÀM THIẾT LẬP SỰ KIỆN TỔNG QUÁT
function setupEventListeners() {
    // Đảm bảo tất cả checkbox không được tích khi load (Reset)
    if (selectAllCheckboxTop) selectAllCheckboxTop.checked = false;
    if (selectAllCheckboxBottom) selectAllCheckboxBottom.checked = false;
    getProductCheckboxes().forEach((checkbox) => {
        checkbox.checked = false; 
    });

    if (selectAllCheckboxTop)
        selectAllCheckboxTop.onchange = handleSelectAllChange;
    if (selectAllCheckboxBottom)
        selectAllCheckboxBottom.onchange = handleSelectAllChange;

    getProductCheckboxes().forEach((checkbox) => {
        checkbox.onchange = calculateCartTotal;
    });

    setupQuantityControl();
    setupDeleteButtons();
}

// Khởi tạo tất cả chức năng khi trang load
document.addEventListener("DOMContentLoaded", () => {
    // ⭐️ BƯỚC QUAN TRỌNG: KIỂM TRA VÀ CHUYỂN HƯỚNG
    if (!checkAndRedirectToLogin()) return; 

    // ⭐️ Tải sản phẩm từ Local Storage và chèn vào DOM (ĐÃ THÊM)
    loadCartItems(); 

    // Các hàm giỏ hàng chỉ chạy khi đã đăng nhập
    setupEventListeners();
    calculateCartTotal(); 
    setupCartIconReload();
    window.addEventListener("resize", calculateCartTotal);
});