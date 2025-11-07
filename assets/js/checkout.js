// Định dạng tiền tệ VND
const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
});

// --- DỮ LIỆU MÔ PHỎNG ---
const MOCK_SAVED_ADDRESS = {
    name: "Nguyễn Văn A",
    phone: "0901 234 567",
    address: "Số 123, Đường Lạc Long Quân, Phường 3, Quận Tân Bình, TP. Hồ Chí Minh",
    fullAddress: "Số 123, Đường Lạc Long Quân, Phường 3, Quận Tân Bình, TP. Hồ Chí Minh"
};
let isNewAddressMode = false; // Trạng thái mặc định là dùng địa chỉ có sẵn

// Hàm chính để tải và hiển thị dữ liệu
function loadCheckoutDetails() {
    const productContainer = document.getElementById('product-items-container');
    const totalElement = document.getElementById('final-total');

    const addressElement = document.getElementById('shipping-address');
    const phoneElement = document.getElementById('shipping-phone');
    const nameElement = document.querySelector('#saved-address-display p:first-child');
    
    // 1. Lấy dữ liệu từ Local Storage
    const checkoutDataString = localStorage.getItem('checkoutItems');

    if (checkoutDataString) {
        try {
            const checkoutData = JSON.parse(checkoutDataString);
            const products = checkoutData.products || [];
            const totalAmount = checkoutData.totalAmount || 0;
            
            let productHTML = '';
            
            // 2. TẠO HTML CHO DANH SÁCH SẢN PHẨM
            if (products.length > 0) {
                productHTML = products.map(item => {
                    const lineTotal = item.price * item.quantity;
                    return `
                        <div class="product-item">
                            <img src="${item.image}" alt="${item.name}" class="product-image" 
                                onerror="this.src='https://placehold.co/80x80/CCCCCC/000000?text=SP'; this.onerror=null;" />
                            <div class="product-details">
                                <strong>${item.name}</strong>
                                <span>Số lượng: ${item.quantity} | Đơn giá: ${formatter.format(item.price)}</span>
                            </div>
                            <div class="item-total">
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
            
            // 3. HIỂN THỊ THÔNG TIN VẬN CHUYỂN CÓ SẴN (TỪ MOCK DATA)
            if (nameElement) nameElement.textContent = MOCK_SAVED_ADDRESS.name;
            if (addressElement) addressElement.textContent = MOCK_SAVED_ADDRESS.address;
            if (phoneElement) phoneElement.textContent = MOCK_SAVED_ADDRESS.phone;
            
        } catch (e) {
            productContainer.innerHTML = '<p style="text-align: center; color: red;">Lỗi: Dữ liệu giỏ hàng không hợp lệ. Vui lòng quay lại giỏ hàng.</p>';
            console.error("Lỗi khi phân tích dữ liệu giỏ hàng:", e);
        }
    } else {
        productContainer.innerHTML = '<p style="text-align: center; opacity: 0.7; padding: 20px;">Không tìm thấy dữ liệu giỏ hàng đã chọn. Vui lòng quay lại <a href="cart.html" style="color: #ffc107;">Giỏ hàng</a>.</p>';
        totalElement.textContent = formatter.format(0);
    }
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

// --- XỬ LÝ NÚT HOÀN TẤT ĐẶT HÀNG VÀ GHI LỊCH SỬ ---
document.getElementById('confirmOrderBtn').addEventListener('click', () => {
    let finalAddress = {};

    if (isNewAddressMode) {
        // Lấy dữ liệu từ form nhập liệu mới
        const newName = document.getElementById('new_name').value.trim();
        const newPhone = document.getElementById('new_phone').value.trim();
        const newAddressDetail = document.getElementById('new_address_detail').value.trim();
        const newProvinceSelect = document.getElementById('new_province');
        const newDistrictSelect = document.getElementById('new_district');
        const newProvince = newProvinceSelect.value;
        const newDistrict = newDistrictSelect.value;
        
        // Kiểm tra validation đơn giản
        if (!newName || !newPhone || !newAddressDetail || !newProvince || !newDistrict) {
            alert('Vui lòng điền đầy đủ thông tin vào form địa chỉ mới.');
            return;
        }

        // Gán địa chỉ mới
        finalAddress = {
            name: newName,
            phone: newPhone,
            fullAddress: `${newAddressDetail}, ${newDistrictSelect.options[newDistrictSelect.selectedIndex].text}, ${newProvinceSelect.options[newProvinceSelect.selectedIndex].text}`
        };
    } else {
        // Dùng địa chỉ có sẵn
        finalAddress = MOCK_SAVED_ADDRESS;
    }

    // Lấy phương thức thanh toán và dữ liệu giỏ hàng
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const checkoutDataString = localStorage.getItem('checkoutItems');
    const totalAmountText = document.getElementById('final-total').textContent; 

    // Kiểm tra dữ liệu
    if (!checkoutDataString) {
        alert('Lỗi: Không tìm thấy dữ liệu đơn hàng. Vui lòng quay lại giỏ hàng.');
        return;
    }

    try {
        const checkoutData = JSON.parse(checkoutDataString);

        // ⭐️ GHI LỊCH SỬ MUA HÀNG
        const newOrder = {
            id: 'DH' + Date.now().toString().slice(-6), // Mã đơn hàng tạm thời
            date: new Date().toISOString().slice(0, 10), 
            status: 'pending', // Trạng thái ban đầu
            total: checkoutData.totalAmount, // Tổng tiền (dạng số)
            products: checkoutData.products, // Danh sách sản phẩm
            address: finalAddress.fullAddress || finalAddress.address,
            payment: paymentMethod
        };
        
        // Lấy lịch sử cũ và thêm đơn hàng mới
        let history = JSON.parse(localStorage.getItem('orderHistory')) || [];
        history.unshift(newOrder); // Thêm đơn hàng mới lên đầu
        localStorage.setItem('orderHistory', JSON.stringify(history));


        // Log ra console để kiểm tra dữ liệu cuối cùng
        console.log("--- Đơn hàng được xác nhận ---");
        console.log("Mã Đơn Hàng:", newOrder.id);
        console.log("Địa chỉ giao hàng:", finalAddress);
        console.log("Phương thức thanh toán:", paymentMethod);
        console.log("Tổng tiền:", totalAmountText);
        
        alert(`Đơn hàng (${newOrder.id}) của bạn đã được gửi thành công!\nGiao đến: ${finalAddress.fullAddress || finalAddress.address}\nTổng tiền: ${totalAmountText}\nPhương thức: ${paymentMethod}`);
        
        // *** Xóa dữ liệu giỏ hàng sau khi đặt hàng thành công ***
        localStorage.removeItem('checkoutItems'); 

        // Tùy chọn chuyển hướng đến trang lịch sử
        // window.location.href = 'profile.html'; // Giả sử profile.html chứa lịch sử
        
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