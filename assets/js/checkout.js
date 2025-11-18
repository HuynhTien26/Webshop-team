// Định dạng tiền tệ VND
const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
});

// --- LOGIC TẢI DỮ LIỆU NGƯỜI DÙNG TỪ LOCAL STORAGE ---
const getLoggedInUserAddress = () => {
    const logged = sessionStorage.getItem('loggedInUser');
    const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const user = accounts.find(a => a.username === logged);

    // Kiểm tra đăng nhập
    if (!logged || !user) {
         // Trường hợp không đăng nhập hoặc user bị xóa
         return {
            name: "Vui lòng đăng nhập",
            phone: "N/A",
            address: "Không thể tải địa chỉ. Vui lòng đăng nhập lại.",
            fullAddress: "Không thể tải địa chỉ. Vui lòng đăng nhập lại."
        };
    }
    
    // Đảm bảo các đối tượng tồn tại
    user.profile = user.profile || {};
    user.profile.address = user.profile.address || {};
    
    const profile = user.profile;
    const address = profile.address;

    // Lấy thông tin Tên hiển thị (TỪ SELECT BOX CỦA TRANG PROFILE.HTML)
    // Lưu ý: Đây là cách mô phỏng vì chúng ta không có logic AJAX hay API server
    // Giả định rằng TÊN của Quận, Huyện, Tỉnh sẽ được lấy chính xác.
    
    // Chú ý: Vì code không thể truy cập DOM của profile.html để lấy tên Phường/Xã (chỉ có value), 
    // nên ta chỉ có thể nối chuỗi các value và hiển thị tên Tỉnh/Thành phố nếu có element
    
    let fullAddressString = `${address.street}, `;
    
    // Thêm các thành phần địa chỉ theo thứ tự từ nhỏ đến lớn (nếu có value)
    fullAddressString += address.ward ? `${address.ward}, ` : '';
    fullAddressString += address.district ? `${address.district}, ` : '';
    fullAddressString += address.city ? `${address.city}` : '';
    
    // Thay thế value bằng tên đầy đủ khi hiển thị (tùy chọn)
    
    // Sử dụng dữ liệu thực tế
    return {
        name: profile.fullName || user.username,
        phone: profile.contact || 'N/A',
        address: fullAddressString.replace(/, $/, ''),
        fullAddress: fullAddressString.replace(/, $/, '') 
    };
};

const USER_SAVED_ADDRESS = getLoggedInUserAddress();
let isNewAddressMode = false; // Trạng thái mặc định là dùng địa chỉ có sẵn

// --- LOGIC CUSTOM MODAL ---

function showCustomSuccessModal(message, orderId) {
    const backdrop = document.getElementById('customModalBackdrop');
    const messageEl = document.getElementById('modalMessage');
    const closeBtn = document.getElementById('modalCloseBtn');
    
    messageEl.innerHTML = message;
    backdrop.style.display = 'flex'; // Hiển thị Modal

    // Xử lý đóng Modal
    closeBtn.onclick = () => {
        backdrop.style.display = 'none';
        // Chuyển hướng sau khi đóng Modal
        window.location.href = '../../index.html'; 
    };
}

// --- LOGIC CHUYỂN ĐỔI CHẾ ĐỘ ĐỊA CHỈ ---
function toggleAddressMode(isNewMode) {
    isNewAddressMode = isNewMode;
    const existingMode = document.getElementById('existingAddressMode');
    const newMode = document.getElementById('newAddressMode');
    const existingBtn = document.getElementById('useExistingAddressBtn');
    const newBtn = document.getElementById('useNewAddressBtn');
    
    if (isNewMode) {
        existingMode.style.display = 'none';
        newMode.style.display = 'block';
        existingBtn.classList.remove('active');
        newBtn.classList.add('active');
    } else {
        existingMode.style.display = 'block';
        newMode.style.display = 'none';
        existingBtn.classList.add('active');
        newBtn.classList.remove('active');
    }
}

// Hàm chính để tải và hiển thị dữ liệu
function loadCheckoutDetails() {
    const productContainer = document.getElementById('product-items-container');
    const totalElement = document.getElementById('final-total');

    const nameElement = document.getElementById('shipping-name');
    const addressElement = document.getElementById('shipping-address');
    const phoneElement = document.getElementById('shipping-phone');
    
    const checkoutDataString = localStorage.getItem('checkoutItems');

    if (checkoutDataString) {
        try {
            const checkoutData = JSON.parse(checkoutDataString);
            const products = checkoutData.products || [];
            const totalAmount = checkoutData.totalAmount || 0;
            
            let productHTML = '';
            
            if (products.length > 0) {
                productHTML = products.map(item => {
                    const lineTotal = item.price * item.quantity;
                    const correctedImagePath = item.image.includes('http') ? item.image : (item.image ? '../../' + item.image.replace('../../', '') : 'https://placehold.co/80x80?text=SP');

                    return `
                        <div class="product-summary">
                            <img src="${correctedImagePath}" alt="${item.name}" class="product-image" 
                                onerror="this.src='https://placehold.co/80x80?text=SP'; this.onerror=null;" />
                            <div class="product-details">
                                <strong>${item.name}</strong>
                                <span>Số lượng: ${item.quantity} | Đơn giá: ${formatter.format(item.price)}</span>
                            </div>
                            <div class="price-total">
                                ${formatter.format(lineTotal)}
                            </div>
                        </div>
                    `;
                }).join('');
            } else {
                productHTML = '<p style="text-align: center; opacity: 0.7; padding: 20px;">Không có sản phẩm nào được chọn.</p>';
            }

            productContainer.innerHTML = productHTML;
            totalElement.textContent = formatter.format(totalAmount);
            
            // HIỂN THỊ THÔNG TIN VẬN CHUYỂN CÓ SẴN (TỪ LOCAL STORAGE)
            if (nameElement) nameElement.textContent = USER_SAVED_ADDRESS.name;
            if (addressElement) addressElement.textContent = USER_SAVED_ADDRESS.address;
            if (phoneElement) phoneElement.textContent = USER_SAVED_ADDRESS.phone;
            
        } catch (e) {
            productContainer.innerHTML = '<p style="text-align: center; color: red;">Lỗi: Dữ liệu giỏ hàng không hợp lệ. Vui lòng quay lại giỏ hàng.</p>';
            console.error("Lỗi khi phân tích dữ liệu giỏ hàng:", e);
        }
    } else {
        productContainer.innerHTML = '<p style="text-align: center; opacity: 0.7; padding: 20px;">Không tìm thấy dữ liệu giỏ hàng đã chọn. Vui lòng quay lại <a href="cart.html" style="color: #ffc107;">Giỏ hàng</a>.</p>';
        totalElement.textContent = formatter.format(0);
    }
}

// --- LOGIC XỬ LÝ ĐỊA CHỈ VÀ GHI LỊCH SỬ ---

function getFinalDeliveryAddress() {
    // 💥 Thu thập Tên, SĐT, Địa chỉ DÙNG CUỐI CÙNG
    if (isNewAddressMode) {
        // Lấy dữ liệu từ form nhập liệu mới
        const newName = document.getElementById('new_name').value.trim();
        const newPhone = document.getElementById('new_phone').value.trim();
        const newAddressDetail = document.getElementById('new_address_detail').value.trim();
        const newProvinceSelect = document.getElementById('new_province');
        const newDistrictSelect = document.getElementById('new_district');
        // const newWardSelect = document.getElementById('new_ward'); // Dòng này bị xóa/comment vì ID không tồn tại
        
        const newProvinceName = newProvinceSelect.options[newProvinceSelect.selectedIndex].text;
        const newDistrictName = newDistrictSelect.options[newDistrictSelect.selectedIndex].text;
        // const newWardName = 'N/A'; // newWardSelect.options[newWardSelect.selectedIndex].text; // Dòng này bị xóa/comment
        
        // Kiểm tra validation (Đã loại bỏ newWardSelect.value === "")
        if (!newName || !newPhone || !newAddressDetail || newProvinceSelect.value === "" || newDistrictSelect.value === "") {
            alert('Vui lòng điền đầy đủ thông tin vào form địa chỉ mới.');
            return null;
        }

        return {
            name: newName,
            phone: newPhone,
            // Cập nhật chuỗi địa chỉ (Chỉ sử dụng những gì đã có)
            fullAddress: `${newAddressDetail}, ${newDistrictName}, ${newProvinceName}`
        };
    } else {
        // Dùng địa chỉ có sẵn (Lấy từ ELEMENT đã hiển thị)
        return {
            name: document.getElementById('shipping-name').textContent,
            phone: document.getElementById('shipping-phone').textContent,
            fullAddress: document.getElementById('shipping-address').textContent
        };
    }
}

/**
 * @param {Array<Object>} purchasedProducts - Mảng sản phẩm đã mua
 */
function removePurchasedItemsFromCart(purchasedProducts) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Tạo set các ID của sản phẩm đã mua để kiểm tra nhanh hơn
    const purchasedIds = new Set(purchasedProducts.map(p => parseInt(p.id)));

    // Lọc ra các sản phẩm trong giỏ hàng GỐC mà KHÔNG nằm trong danh sách đã mua
    const updatedCart = cartItems.filter(item => {
        // Giữ lại item nếu ID của nó KHÔNG CÓ trong purchasedIds
        return !purchasedIds.has(parseInt(item.id));
    });

    // Cập nhật lại giỏ hàng GỐC
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
}


// --- XỬ LÝ NÚT HOÀN TẤT ĐẶT HÀNG VÀ GHI LỊCH SỬ ---
document.getElementById('confirmOrderBtn').addEventListener('click', () => {
    
    const finalAddress = getFinalDeliveryAddress();
    
    if (!finalAddress) return; 

    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const checkoutDataString = localStorage.getItem('checkoutItems');
    const totalAmountText = document.getElementById('final-total').textContent; 

    if (!checkoutDataString) {
        alert('Lỗi: Không tìm thấy dữ liệu đơn hàng. Vui lòng quay lại giỏ hàng.');
        return;
    }

    try {
        const checkoutData = JSON.parse(checkoutDataString);

        // ⭐️ GHI LỊCH SỬ MUA HÀNG
        const newOrder = {
            id: 'DH' + Date.now().toString().slice(-6), 
            date: new Date().toISOString().slice(0, 10), 
            status: 'pending', 
            total: checkoutData.totalAmount, 
            products: checkoutData.products, 
            payment: paymentMethod,

            // LƯU ĐẦY ĐỦ THÔNG TIN NGƯỜI NHẬN
            receiverName: finalAddress.name,
            receiverPhone: finalAddress.phone,
            deliveryAddress: finalAddress.fullAddress 
        };
        
        let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
        history.unshift(newOrder); 
        localStorage.setItem('orderHistory', JSON.stringify(history));


        // ⭐️⭐️ QUAN TRỌNG: XÓA GIỎ HÀNG GỐC ⭐️⭐️
        localStorage.removeItem('checkoutItems'); // Xóa dữ liệu tạm thời
        removePurchasedItemsFromCart(checkoutData.products); // CHỈ XÓA CÁC SẢN PHẨM ĐÃ MUA


        // Tạo chuỗi thông báo
        const successMessage = `
            Đơn hàng (${newOrder.id}) của bạn đã được gửi thành công!\n
            Người nhận: ${finalAddress.name}\n
            SĐT: ${finalAddress.phone}\n
            Địa chỉ: ${finalAddress.fullAddress}\n
            Tổng tiền: ${totalAmountText}\n
            Phương thức: ${paymentMethod}
        `;

        // Hiển thị modal thành công và chuyển hướng
        showCustomSuccessModal(successMessage.replace(/\n/g, '<br>'), newOrder.id);
        
    } catch (e) {
        console.error("Lỗi khi xử lý checkout:", e);
        alert('Có lỗi xảy ra trong quá trình xử lý đơn hàng.');
    }
});


// Gán sự kiện khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    loadCheckoutDetails();
    
    // Gán sự kiện cho các nút chuyển đổi chế độ địa chỉ
    document.getElementById('useExistingAddressBtn').addEventListener('click', () => toggleAddressMode(false));
    document.getElementById('useNewAddressBtn').addEventListener('click', () => toggleAddressMode(true));
});