// ===== HÀM ĐỊNH DẠNG TIỀN TỆ VND =====
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// ===== HÀM CHUYỂN TRANG =====
// Được gọi khi click vào menu sidebar
function showPage(pageId) {
    // Bước 1: Ẩn tất cả các trang (loại bỏ class 'active')
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => page.classList.remove('active'));
    
    // Bước 2: Hiển thị trang được chọn (thêm class 'active')
    const selectedPage = document.getElementById(pageId + '-page');
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // Bước 3: Cập nhật trạng thái menu (đánh dấu mục nào đang active)
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Tìm và đánh dấu menu item tương ứng
    const activeNavItem = document.querySelector(`[onclick="showPage('${pageId}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Đóng sidebar trên mobile sau khi chọn menu
    closeSidebarOnMobile();
    
    // Ngăn chặn hành vi mặc định của thẻ <a>
    return false;
}

// ===== HÀM ĐĂNG XUẤT =====
// Được gọi khi click vào "Xin chào, Admin"
function handleLogout() {
    try {
        // Xóa thông tin đăng nhập khỏi bộ nhớ trình duyệt
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminName');
        sessionStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập
    } catch (e) {
        // Bỏ qua lỗi nếu không thể truy cập sessionStorage
    }
    // Không sử dụng localStorage để lưu đăng nhập theo máy -> không cần xóa localStorage
    // Chuyển hướng về trang đăng nhập (replace để không lưu lại history)
    window.location.replace('login.html');
}

// ===== TOGGLE SIDEBAR CHO MOBILE =====
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay') || createSidebarOverlay();
    
    sidebar.classList.toggle('open');
    
    if (sidebar.classList.contains('open')) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function createSidebarOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = toggleSidebar; // Đóng sidebar khi click overlay
    document.body.appendChild(overlay);
    return overlay;
}

// Đóng sidebar khi click vào menu item trên mobile
function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    }
}

// ===== MODAL QUẢN LÝ SẢN PHẨM =====

// Dữ liệu mẫu cho sản phẩm
const sampleProducts = {
    1: {
        code: 'SKU001',
        name: 'Naruto',
        category: 'naruto',
        description: 'Figure Naruto ở chế độ Sage Mode với chi tiết tinh xảo',
        unit: 'cái',
        quantity: 125,
        image: 'Images/NARUTO/Naruto.png',
        costPrice: 300000,
        suggestedPrice: 300000,
        profitMargin: 90,
        supplier: 'Nhà cung cấp A',
        status: 'selling'
    },
    2: {
        code: 'SKU002', 
        name: 'Tanjiro Kamado',
        category: 'demon-slayer',
        description: 'Figure Tanjiro với thanh kiếm và hiệu ứng nước',
        unit: 'cái',
        quantity: 89,
        image: 'tanjiro_water.jpg',
        costPrice: 300000,
        suggestedPrice: 300000,
        profitMargin: 60,
        supplier: 'Nhà cung cấp B',
        status: 'selling'
    },
    3: {
        code: 'SKU003',
        name: 'Miku',
        category: 'miku',
        description: 'Miku kute',
        unit: 'cái',
        quantity: 45,
        image: 'raiden_shogun.jpg',
        costPrice: 300000,
        suggestedPrice: 300000,
        profitMargin: 75,
        supplier: 'Nhà cung cấp C',
        status: 'selling'
    },
    4: {
        code: 'SKU004',
        name: 'Hinata',
        category: 'naruto',
        description: 'Figure Hinata ra ta ta',
        unit: 'cái',
        quantity: 0,
        image: 'miku_racing.jpg',
        costPrice: 300000,
        suggestedPrice: 300000,
        profitMargin: 65,
        supplier: 'Nhà cung cấp D',
        status: 'out-of-stock'
    },
    5: {
        code: 'SKU005',
        name: 'Sasuke',
        category: 'naruto',
        description: 'Figure Sasuke ở dạng quỷ với hiệu ứng lửa hồng',
        unit: 'cái',
        quantity: 78,
        image: 'nezuko_demon.jpg',
        costPrice: 300000,
        suggestedPrice: 300000,
        profitMargin: 70,
        supplier: 'Nhà cung cấp B',
        status: 'hidden'
    }
};

// Dữ liệu người dùng mẫu (client-side demo)
const usersData = {
    'USER001': {
        id: 'USER001',
        fullName: 'Nguyễn Văn A',
        contact: 'a@example.com',
        role: 'khach-hang',
        status: 'active',
        notes: ''
    },
    'USER002': {
        id: 'USER002',
        fullName: 'Trần Thị B',
        contact: '0912345678',
        role: 'khach-hang',
        status: 'active',
        notes: 'Khách hàng VIP'
    },
    'USER003': {
        id: 'USER003',
        fullName: 'Lê Văn C',
        contact: 'levanc@gmail.com',
        role: 'nhan-vien',
        status: 'active',
        notes: 'Nhân viên bán hàng'
    },
    'USER004': {
        id: 'USER004',
        fullName: 'Phạm Thị D',
        contact: '0987654321',
        role: 'khach-hang',
        status: 'disabled',
        notes: ''
    },
    'USER005': {
        id: 'USER005',
        fullName: 'Hoàng Văn E',
        contact: 'hoangvane@yahoo.com',
        role: 'quan-tri-vien',
        status: 'active',
        notes: 'Quản trị viên hệ thống'
    }
};

// Biến giữ trạng thái đang chỉnh sửa (nếu có)
let editingUserId = null;

// Hiển thị modal thêm sản phẩm
function showAddProductModal() {
    document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm mới';
    document.getElementById('productModalSubmit').textContent = 'Thêm sản phẩm';
    document.getElementById('productForm').reset();
    document.getElementById('currentImageSection').style.display = 'none';
    document.getElementById('productModal').style.display = 'block';
}

// Hiển thị modal sửa sản phẩm
function showEditProductModal(productId) {
    const product = sampleProducts[productId];
    if (!product) {
        alert('Sản phẩm không tồn tại!');
        return;
    }

    // Đặt tiêu đề và nút submit
    document.getElementById('productModalTitle').textContent = 'Sửa sản phẩm';
    document.getElementById('productModalSubmit').textContent = 'Cập nhật sản phẩm';
    
    // Reset form trước
    document.getElementById('productForm').reset();
    
    // Điền dữ liệu vào form
    document.getElementById('productCode').value = product.code || '';
    document.getElementById('productName').value = product.name || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productQuantity').value = product.quantity || 0;
    document.getElementById('productProfitMargin').value = product.profitMargin || 0;
    document.getElementById('productSupplier').value = product.supplier || '';
    document.getElementById('productStatus').value = product.status || 'selling';
    
    // Set giá vốn nếu field tồn tại
    const costPriceInput = document.getElementById('productCostPrice');
    if (costPriceInput) {
        costPriceInput.value = product.costPrice || 0;
    }
   
    
    // Lưu ID sản phẩm đang chỉnh sửa
    document.getElementById('productForm').setAttribute('data-editing-id', productId);
    
    // Xóa flag xóa hình ảnh nếu có
    document.getElementById('productForm').removeAttribute('data-remove-image');
    
    // Hiển thị modal
    document.getElementById('productModal').style.display = 'block';
    
    console.log('Đang sửa sản phẩm:', product);
}

// Đóng modal
function hideProductModal() {
    document.getElementById('productModal').style.display = 'none';
    document.getElementById('currentImageSection').style.display = 'none';
    document.getElementById('productForm').reset();
    document.getElementById('productForm').removeAttribute('data-editing-id');
    document.getElementById('productForm').removeAttribute('data-remove-image');
}

// Bỏ hình ảnh hiện tại
function removeCurrentImage() {
    document.getElementById('currentImageSection').style.display = 'none';
    document.getElementById('currentImageInfo').textContent = '';
    // Đánh dấu là sẽ xóa hình khi submit
    document.getElementById('productForm').setAttribute('data-remove-image', 'true');
    alert('Hình ảnh sẽ được xóa khi lưu sản phẩm');
}

// Lọc sản phẩm theo danh mục
function filterByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const rows = document.querySelectorAll('#products-page table.data-table tbody tr');
    let visibleCount = 0;

    rows.forEach(row => {
        const categoryData = row.getAttribute('data-category');
        if (!selectedCategory || categoryData === selectedCategory) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });

    // Cập nhật số lượng hiển thị
    const resultsInfo = document.querySelector('#products-page .results-info');
    if (resultsInfo) {
        resultsInfo.textContent = `Hiển thị ${visibleCount} kết quả`;
    }
}

// Cập nhật dòng sản phẩm trong bảng
function updateProductRow(productId, product) {
    const row = document.querySelector(`tr[data-product-id="${productId}"]`);
    if (!row) {
        console.error('Không tìm thấy dòng sản phẩm:', productId);
        return;
    }

    // Lấy các ô trong dòng
    const cells = row.cells;
    
    // Cập nhật tên sản phẩm (cell 0)
    const productNameDiv = cells[0].querySelector('.product-name');
    if (productNameDiv) {
        productNameDiv.textContent = product.name;
    }
    
    // Cập nhật category
    const productCategoryDiv = cells[0].querySelector('.product-category');
    if (productCategoryDiv) {
        const categoryMap = {
            'naruto': 'Naruto',
            'demon-slayer': 'Demon Slayer',
            'genshin': 'Genshin Impact',
            'miku': 'Hatsune Miku'
        };
        productCategoryDiv.textContent = categoryMap[product.category] || product.category;
    }
    
    // Cập nhật SKU (cell 1)
    if (cells[1]) cells[1].textContent = product.code;
    
    // Cập nhật giá vốn (cell 2)
    if (cells[2]) cells[2].textContent = (product.costPrice || 0).toLocaleString('vi-VN') + ' ₫';
    
    // Cập nhật giá bán (cell 3)
    if (cells[3]) cells[3].textContent = (product.suggestedPrice || 0).toLocaleString('vi-VN') + ' ₫';
    
    // Cập nhật số lượng (cell 4)
    if (cells[4]) cells[4].textContent = product.quantity || 0;
    
    // Cập nhật trạng thái (cell 5)
    const statusBadge = document.getElementById(`status-${productId}`);
    if (statusBadge) {
        const statusMap = {
            'selling': { text: 'Đang bán', class: 'status-active' },
            'out-of-stock': { text: 'Hết hàng', class: 'status-warning' },
            'discontinued': { text: 'Ngừng bán', class: 'status-discontinued' },
            'hidden': { text: 'Ẩn', class: 'status-disabled' }
        };
        const statusInfo = statusMap[product.status] || statusMap['selling'];
        statusBadge.textContent = statusInfo.text;
        statusBadge.className = 'status-badge ' + statusInfo.class;
    }
    
    // Đồng bộ % lợi nhuận sang trang Định giá
    const profitInput = document.getElementById(`profit-${product.code}`);
    if (profitInput && product.profitMargin !== undefined) {
        profitInput.value = product.profitMargin;
    }
    
    // Cập nhật data-category attribute
    row.setAttribute('data-category', product.category);
    
    console.log('✅ Đã cập nhật dòng sản phẩm:', productId, product);
}

// Xử lý submit form sản phẩm
function handleProductSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const editingId = form.getAttribute('data-editing-id');
    const removeImage = form.getAttribute('data-remove-image') === 'true';
    
    const formData = new FormData(form);
    const productData = {};
    
    // Thu thập dữ liệu từ form
    for (let [key, value] of formData.entries()) {
        if (key !== 'image' || value.size > 0) { // Chỉ thêm file nếu có chọn file mới
            productData[key] = value;
        }
    }
    
    if (editingId) {
        // Cập nhật sản phẩm hiện có
        const product = sampleProducts[editingId];
        if (product) {
            // Cập nhật thông tin cơ bản
            product.code = productData.code || product.code;
            product.name = productData.name || product.name;
            product.category = productData.category || product.category;
            product.description = productData.description || product.description;
            product.quantity = parseInt(productData.quantity) || product.quantity;
            // Giữ nguyên suggestedPrice, không update từ form
            product.profitMargin = parseFloat(productData.profitMargin) || product.profitMargin;
            product.supplier = productData.supplier || product.supplier;
            product.status = productData.status || product.status;
            
            // Xử lý hình ảnh
            if (removeImage) {
                product.image = ''; // Xóa hình ảnh
            } else if (productData.image && productData.image.size > 0) {
                // Có upload file mới
                product.image = productData.image.name;
            }
            // Nếu không có removeImage và không có file mới thì giữ nguyên hình cũ
            
            // Cập nhật hiển thị trong bảng
            updateProductRow(editingId, product);
            
            console.log('Đã cập nhật sản phẩm:', product);
            alert(`Đã cập nhật sản phẩm ${product.name} thành công!`);
        }
    } else {
        // Thêm sản phẩm mới
        const newId = Date.now().toString();
        const newProduct = {
            code: productData.code,
            name: productData.name,
            category: productData.category,
            description: productData.description,
            quantity: parseInt(productData.quantity) || 0,
            suggestedPrice: 300000, // Giá mặc định
            profitMargin: parseFloat(productData.profitMargin) || 0,
            supplier: productData.supplier,
            status: productData.status || 'selling',
            image: productData.image ? productData.image.name : ''
        };
        
        sampleProducts[newId] = newProduct;
        
        console.log('Đã thêm sản phẩm mới:', newProduct);
        alert(`Đã thêm sản phẩm ${newProduct.name} thành công!`);
    }
    
    hideProductModal();
}

// Toggle trạng thái sản phẩm
function toggleProductStatus(productId) {
    const product = sampleProducts[productId];
    if (!product) return;

    const currentStatus = product.status;
    let newStatus, statusText, statusClass, buttonText;

    // Xác định trạng thái mới
    if (currentStatus === 'selling') {
        newStatus = 'hidden';
        statusText = 'Ẩn';
        statusClass = 'status-disabled';
        buttonText = 'Hiện';
    } else if (currentStatus === 'hidden') {
        newStatus = 'selling';
        statusText = 'Đang bán';
        statusClass = 'status-active';
        buttonText = 'Ẩn';
    } else if (currentStatus === 'out-of-stock') {
        newStatus = 'hidden';
        statusText = 'Ẩn';
        statusClass = 'status-disabled';
        buttonText = 'Hiện';
    } else {
        // Các trạng thái khác (discontinued, etc.)
        newStatus = 'selling';
        statusText = 'Đang bán';
        statusClass = 'status-active';
        buttonText = 'Ẩn';
    }

    const confirmed = confirm(`Bạn có chắc muốn thay đổi trạng thái sản phẩm thành "${statusText}"?`);
    if (!confirmed) return;

    // Cập nhật dữ liệu
    product.status = newStatus;

    // Cập nhật UI
    const statusBadge = document.getElementById(`status-${productId}`);
    const toggleButton = document.getElementById(`toggle-btn-${productId}`);

    if (statusBadge) {
        statusBadge.textContent = statusText;
        statusBadge.className = `status-badge ${statusClass}`;
    }

    if (toggleButton) {
        toggleButton.textContent = buttonText;
    }

    alert(`Đã thay đổi trạng thái sản phẩm thành "${statusText}"`);
}

// Đóng modal khi click bên ngoài
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target === modal) {
        hideProductModal();
    }
    
    const userModal = document.getElementById('userModal');
    if (event.target === userModal) {
        hideUserModal();
    }
    
    const receiptModal = document.getElementById('receiptModal');
    if (event.target === receiptModal) {
        hideReceiptModal();
    }
    
    const orderDetailModal = document.getElementById('orderDetailModal');
    if (event.target === orderDetailModal) {
        hideOrderDetailModal();
    }
    const receiptDetailModal = document.getElementById('receiptDetailModal');
    if (event.target === receiptDetailModal) {
    hideReceiptDetailModal(); 
    }
}

// ===== MODAL QUẢN LÝ NGƯỜI DÙNG =====

// Hiển thị modal thêm người dùng
function showAddUserModal() {
    document.getElementById('userModalTitle').textContent = 'Thêm người dùng mới';
    document.getElementById('userModalSubmit').textContent = 'Thêm người dùng';
    document.getElementById('userForm').reset();
    
    // Chuyển sang chế độ thêm mới: password fields bắt buộc
    setupPasswordFieldsForAdd();
    
    document.getElementById('userModal').style.display = 'block';
}

// Đóng modal người dùng
function hideUserModal() {
    document.getElementById('userModal').style.display = 'none';
    document.getElementById('userForm').reset();
    editingUserId = null;
}

// Hiển thị modal sửa thông tin người dùng
function showEditUserModal(userId) {
    const u = usersData[userId];
    if (!u) {
        alert('Người dùng không tồn tại!');
        return;
    }

    editingUserId = userId;
    document.getElementById('userModalTitle').textContent = 'Sửa người dùng';
    document.getElementById('userModalSubmit').textContent = 'Cập nhật người dùng';

    // Chuyển sang chế độ chỉnh sửa: password generator
    setupPasswordFieldsForEdit();

    // Điền dữ liệu vào form (IDs theo form hiện tại)
    document.getElementById('userName').value = u.fullName || '';
    document.getElementById('userContact').value = u.contact || '';
    // Set role value - sử dụng role code Vietnamese
    document.getElementById('userRole').value = u.role || 'khach-hang';
    document.getElementById('userNotes').value = u.notes || '';

    // Xóa trường mật khẩu để admin có thể khởi tạo mật khẩu nếu muốn
    document.getElementById('generatedPassword').value = '';

    document.getElementById('userModal').style.display = 'block';
}

// Cập nhật hiển thị hàng người dùng sau khi chỉnh sửa
function updateUserRow(userId) {
    const u = usersData[userId];
    const row = document.getElementById('user-row-' + userId);
    if (!u || !row) return;

    row.cells[0].textContent = u.fullName;
    row.cells[1].textContent = u.contact;
    // Hiển thị role bằng tiếng Việt
    row.cells[2].textContent = getRoleDisplayText(u.role);

    const statusSpan = document.getElementById('user-status-' + userId);
    if (statusSpan) {
        if (u.status === 'active') {
            statusSpan.textContent = 'Hoạt động';
            statusSpan.className = 'status-badge status-active';
        } else {
            statusSpan.textContent = 'Khóa';
            statusSpan.className = 'status-badge status-disabled';
        }
    }
    
    // Cập nhật text nút khóa/mở dựa trên trạng thái
    const actionButtons = row.cells[4].querySelector('.action-buttons');
    if (actionButtons) {
        const lockButton = actionButtons.children[1]; // Nút thứ 2 là nút khóa
        if (lockButton) {
            lockButton.textContent = u.status === 'active' ? 'Khóa' : 'Mở';
        }
    }
}

// Khóa/Mở khóa người dùng (chuyển đổi trạng thái)
function lockUser(userId) {
    const u = usersData[userId];
    if (!u) {
        alert('Người dùng không tồn tại!');
        return;
    }

    if (u.status === 'active') {
        // Khóa tài khoản
        const confirmed = confirm(`Bạn có chắc muốn khóa tài khoản của ${u.fullName}?`);
        if (!confirmed) return;

        u.status = 'disabled';
        updateUserRow(userId);
        alert(`Tài khoản ${u.fullName} đã bị khóa.`);
    } else {
        // Mở khóa tài khoản
        const confirmed = confirm(`Bạn có chắc muốn mở khóa tài khoản của ${u.fullName}?`);
        if (!confirmed) return;

        u.status = 'active';
        updateUserRow(userId);
        alert(`Tài khoản ${u.fullName} đã được mở khóa.`);
    }
}

// Tạo mật khẩu ngẫu nhiên
function generateRandomPassword() {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('generatedPassword').value = password;
}

// Chuyển đổi role từ code sang text hiển thị
function getRoleDisplayText(roleCode) {
    const roleMap = {
        'khach-hang': 'Khách hàng',
        'nhan-vien': 'Nhân viên', 
        'quan-tri-vien': 'Quản trị viên',
        // Tương thích ngược với code cũ
        'customer': 'Khách hàng',
        'staff': 'Nhân viên',
        'admin': 'Quản trị viên'
    };
    return roleMap[roleCode] || roleCode;
}

// Thiết lập form cho chế độ thêm mới (password bắt buộc)
function setupPasswordFieldsForAdd() {
    const passwordGroup = document.getElementById('passwordGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    // Thay đổi nội dung password group để có input thông thường
    passwordGroup.innerHTML = `
        <label for="userPassword">Mật khẩu <span class="required">*</span></label>
        <input type="password" id="userPassword" name="password" required placeholder="Nhập mật khẩu" minlength="6" autocomplete="off">
    `;
    
    // Hiển thị confirm password group
    confirmPasswordGroup.style.display = 'block';
    document.getElementById('userPasswordConfirm').required = true;
}

// Thiết lập form cho chế độ chỉnh sửa (password generator)
function setupPasswordFieldsForEdit() {
    const passwordGroup = document.getElementById('passwordGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    // Khôi phục password group về dạng generator
    passwordGroup.innerHTML = `
        <label>Khởi tạo mật khẩu</label>
        <div style="display: flex; gap: 10px; align-items: center;">
            <button type="button" id="generatePasswordBtn" onclick="generateRandomPassword()" class="action-button">Tạo mật khẩu</button>
            <input type="text" id="generatedPassword" name="password" readonly placeholder="Mật khẩu sẽ hiển thị ở đây" style="flex: 1;" autocomplete="off">
        </div>
    `;
    
    // Ẩn confirm password group
    confirmPasswordGroup.style.display = 'none';
    document.getElementById('userPasswordConfirm').required = false;
}

// Xử lý submit form người dùng
function handleUserSubmit(event) {
    event.preventDefault();
    
    // Kiểm tra thông tin liên hệ đã được nhập
    const contact = document.getElementById('userContact').value.trim();
    if (!contact) {
        alert('Vui lòng nhập thông tin liên hệ!');
        return;
    }
    
    // Kiểm tra định dạng email hoặc số điện thoại
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    
    if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
        alert('Vui lòng nhập email hợp lệ (vd: example@gmail.com) hoặc số điện thoại hợp lệ (10-11 số)!');
        return;
    }
    
    // Kiểm tra mật khẩu cho chế độ thêm mới
    if (!editingUserId) {
        const password = document.getElementById('userPassword').value;
        const passwordConfirm = document.getElementById('userPasswordConfirm').value;
        
        if (password !== passwordConfirm) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
    }
    
    const formData = new FormData(event.target);
    const userData = {};
    
    for (let [key, value] of formData.entries()) {
        userData[key] = value;
    }
    
    // Nếu đang chỉnh sửa user hiện có
    if (editingUserId) {
        const u = usersData[editingUserId];
        if (!u) {
            alert('Người dùng không tồn tại.');
            hideUserModal();
            editingUserId = null;
            return;
        }

        // Cập nhật các trường cơ bản
        u.fullName = userData.fullName || u.fullName;
        u.contact = userData.contact || u.contact;
        u.role = userData.role || u.role;
        u.notes = userData.notes || u.notes;

        // Nếu có mật khẩu được tạo thì cập nhật (mock)
        if (userData.password) {
            u.password = userData.password; // chỉ demo, không lưu plaintext trong production
        }

        // Cập nhật hiển thị trong bảng
        updateUserRow(editingUserId);

        console.log('Cập nhật người dùng:', u);
        alert('Cập nhật người dùng thành công!');
        editingUserId = null;
        hideUserModal();
        return;
    }

    // Nếu không phải chỉnh sửa, thêm user mới
    // Tạo ID đơn giản dựa trên timestamp
    const newId = 'USER' + Date.now();
    const newUser = {
        id: newId,
        fullName: userData.fullName || '',
        contact: userData.contact || '',
        role: userData.role || 'khach-hang',
        status: 'active', // Mặc định active khi tạo mới
        notes: userData.notes || ''
    };

    if (userData.password) {
        newUser.password = userData.password; // demo only
    }

    usersData[newId] = newUser;

    // Append new row to users table
    const tbody = document.querySelector('#users-page table.data-table tbody');
    const tr = document.createElement('tr');
    tr.setAttribute('data-user-id', newId);
    tr.id = 'user-row-' + newId;
    tr.innerHTML = `
        <td>${newUser.fullName}</td>
        <td>${newUser.contact}</td>
        <td>${getRoleDisplayText(newUser.role)}</td>
        <td><span class="status-badge ${newUser.status === 'active' ? 'status-active' : 'status-disabled'}" id="user-status-${newId}">${newUser.status === 'active' ? 'Hoạt động' : 'Khóa'}</span></td>
        <td>
            <div class="action-buttons">
                <button class="action-button" onclick="showEditUserModal('${newId}')">Sửa</button>
                <button class="action-button" onclick="lockUser('${newId}')">${newUser.status === 'active' ? 'Khóa' : 'Mở'}</button>
            </div>
        </td>
    `;

    tbody.appendChild(tr);

    console.log('Dữ liệu người dùng mới:', newUser);
    alert('Thêm người dùng thành công!');
    hideUserModal();
}

// ===== MODAL QUẢN LÝ PHIẾU NHẬP KHO =====

// Dữ liệu mẫu cho phiếu nhập
const sampleReceipts = {
    'PN001': {
        code: 'PN001',
        date: '2025-09-01',
        supplier: 'Nhà cung cấp A',
        status: 'completed',
        items: [
            { productCode: 'SKU001', productName: 'Sản phẩm mẫu 1', quantity: 100, unitPrice: 1200000, total: 120000000 },
            { productCode: 'SKU002', productName: 'Sản phẩm mẫu 2', quantity: 50, unitPrice: 800000, total: 40000000 }
        ]
    },
    'PN002': {
        code: 'PN002',
        date: '2025-09-08',
        supplier: 'Nhà cung cấp B',
        status: 'draft',
        items: [
            { productCode: 'SKU003', productName: 'Sản phẩm mẫu 3', quantity: 75, unitPrice: 900000, total: 67500000 }
        ]
    }
};

// Dữ liệu sản phẩm để tìm kiếm
const availableProducts = [
    { code: 'SKU001', name: 'Sản phẩm mẫu 1' },
    { code: 'SKU002', name: 'Sản phẩm mẫu 2' },
    { code: 'SKU003', name: 'Sản phẩm mẫu 3' },
    { code: 'SKU004', name: 'Sản phẩm mẫu 4' }
];

// Danh sách sản phẩm trong phiếu nhập hiện tại
let currentReceiptItems = [];

// Hiển thị modal thêm phiếu nhập
function showAddReceiptModal() {
    document.getElementById('receiptModalTitle').textContent = 'Tạo phiếu nhập kho';
    document.getElementById('receiptModalSubmit').textContent = 'Tạo phiếu nhập';
    document.getElementById('receiptForm').reset();
    currentReceiptItems = [];
    updateReceiptItemsTable();
    document.getElementById('receiptModal').style.display = 'block';
}

// Hiển thị modal sửa phiếu nhập
function showEditReceiptModal(receiptCode) {
    const receipt = sampleReceipts[receiptCode];
    if (!receipt || receipt.status === 'completed') {
        alert('Không thể sửa phiếu nhập đã hoàn thành!');
        return;
    }

    document.getElementById('receiptModalTitle').textContent = 'Sửa phiếu nhập kho';
    document.getElementById('receiptModalSubmit').textContent = 'Cập nhật phiếu nhập';
    
    // Điền dữ liệu vào form
    document.getElementById('receiptCode').value = receipt.code;
    const isoDate = receipt.date;
const parts = isoDate.split('-');
const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

const dateInput = document.getElementById('receiptDate');
dateInput.value = formattedDate;
dateInput.setAttribute('data-iso-value', isoDate);
    document.getElementById('receiptSupplier').value = receipt.supplier;
    
    // Load danh sách sản phẩm
    currentReceiptItems = [...receipt.items];
    updateReceiptItemsTable();
    
    document.getElementById('receiptModal').style.display = 'block';
}

// Đóng modal phiếu nhập
function hideReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
    document.getElementById('receiptForm').reset();
    currentReceiptItems = [];
}

// Tìm kiếm sản phẩm
function searchProduct() {
    const query = document.getElementById('productSearch').value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const results = availableProducts.filter(product => 
        product.code.toLowerCase().includes(query) || 
        product.name.toLowerCase().includes(query)
    );
    
    resultsContainer.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="selectProduct('${product.code}', '${product.name}')">
            <strong>${product.code}</strong> - ${product.name}
        </div>
    `).join('');
}

// Chọn sản phẩm từ kết quả tìm kiếm
function selectProduct(code, name) {
    document.getElementById('selectedProductCode').value = code;
    document.getElementById('selectedProductName').value = name;
    document.getElementById('productSearch').value = `${code} - ${name}`;
    document.getElementById('searchResults').innerHTML = '';
}

// Thêm sản phẩm vào phiếu nhập
function addProductToReceipt() {
    const code = document.getElementById('selectedProductCode').value;
    const name = document.getElementById('selectedProductName').value;
    const quantity = parseInt(document.getElementById('productQuantity').value);
    const unitPrice = parseInt(document.getElementById('productUnitPrice').value);
    
    if (!code || !quantity || !unitPrice) {
        alert('Vui lòng điền đầy đủ thông tin sản phẩm!');
        return;
    }
    
    // Kiểm tra sản phẩm đã tồn tại
    const existingIndex = currentReceiptItems.findIndex(item => item.productCode === code);
    
    if (existingIndex >= 0) {
        // Cập nhật số lượng và giá
        currentReceiptItems[existingIndex].quantity = quantity;
        currentReceiptItems[existingIndex].unitPrice = unitPrice;
        currentReceiptItems[existingIndex].total = quantity * unitPrice;
    } else {
        // Thêm sản phẩm mới
        currentReceiptItems.push({
            productCode: code,
            productName: name,
            quantity: quantity,
            unitPrice: unitPrice,
            total: quantity * unitPrice
        });
    }
    
    // Reset form thêm sản phẩm
    document.getElementById('productSearch').value = '';
    document.getElementById('selectedProductCode').value = '';
    document.getElementById('selectedProductName').value = '';
    document.getElementById('productQuantity').value = '';
    document.getElementById('productUnitPrice').value = '';
    
    updateReceiptItemsTable();
}

// Cập nhật bảng danh sách sản phẩm
function updateReceiptItemsTable() {
    const tbody = document.getElementById('receiptItemsTable');
    const totalElement = document.getElementById('receiptTotal');
    
    let total = 0;
    tbody.innerHTML = currentReceiptItems.map((item, index) => {
        total += item.total;
        return `
            <tr>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice.toLocaleString('vi-VN')} ₫</td>
                <td>${item.total.toLocaleString('vi-VN')} ₫</td>
                <td>
                    <button type="button" class="action-button" onclick="removeProductFromReceipt(${index})">Xóa</button>
                </td>
            </tr>
        `;
    }).join('');
    
    totalElement.textContent = total.toLocaleString('vi-VN') + ' ₫';
}

// Xóa sản phẩm khỏi phiếu nhập
function removeProductFromReceipt(index) {
    currentReceiptItems.splice(index, 1);
    updateReceiptItemsTable();
}

// Xử lý submit form phiếu nhập
function handleReceiptSubmit(event) {
    event.preventDefault();
    
    if (currentReceiptItems.length === 0) {
        alert('Vui lòng thêm ít nhất 1 sản phẩm vào phiếu nhập!');
        return;
    }
    
    const receiptData = {
        code: document.getElementById('receiptCode').value,
        date: document.getElementById('receiptDate').getAttribute('data-iso-value'),
        supplier: document.getElementById('receiptSupplier').value,
        items: currentReceiptItems,
        status: 'draft'
    };
    
    console.log('Dữ liệu phiếu nhập:', receiptData);
    alert('Lưu phiếu nhập thành công! (Dữ liệu đã được log ra console)');
    hideReceiptModal();
}

// Hoàn thành phiếu nhập
function completeReceipt(receiptCode) {
    const confirmed = confirm('Xác nhận hoàn thành phiếu nhập? Sau khi hoàn thành sẽ không thể sửa đổi.');
    if (confirmed) {
        console.log('Hoàn thành phiếu nhập:', receiptCode);
        alert('Đã hoàn thành phiếu nhập ' + receiptCode);
        // Cập nhật trạng thái trong database
    }
}

// Xem chi tiết phiếu nhập
function viewReceiptDetails(receiptCode) {
    const receipt = sampleReceipts[receiptCode];
    if (receipt) {
        alert(`Chi tiết phiếu ${receiptCode}:\n- Ngày: ${receipt.date}\n- NCC: ${receipt.supplier}\n- Số sản phẩm: ${receipt.items.length}`);
    }
}

// ===== QUẢN LÝ GIÁ BÁN VÀ LỢI NHUẬN =====

// Dữ liệu sản phẩm với thông tin định giá
const pricingData = {
    'SKU001': {
        code: 'SKU001',
        name: 'Naruto Sage Mode',
        category: 'naruto',
        costPrice: 300000,
        profitMargin: 90,
        retailPrice: 300000,
        lastUpdated: '25/10/2025'
    },
    'SKU002': {
        code: 'SKU002',
        name: 'Tanjiro Kamado',
        category: 'demon-slayer',
        costPrice: 300000,
        profitMargin: 60,
        retailPrice: 300000,
        lastUpdated: '23/10/2025'
    },
    'SKU003': {
        code: 'SKU003',
        name: 'Raiden Shogun',
        category: 'genshin',
        costPrice: 300000,
        profitMargin: 75,
        retailPrice: 300000,
        lastUpdated: '20/10/2025'
    },
    'SKU004': {
        code: 'SKU004',
        name: 'Hatsune Miku Racing',
        category: 'miku',
        costPrice: 300000,
        profitMargin: 65,
        retailPrice: 300000,
        lastUpdated: '18/10/2025'
    },
    'SKU005': {
        code: 'SKU005',
        name: 'Nezuko Demon Form',
        category: 'demon-slayer',
        costPrice: 300000,
        profitMargin: 70,
        retailPrice: 300000,
        lastUpdated: '22/10/2025'
    }
};

// Tính toán giá bán lẻ khi thay đổi % lợi nhuận
function calculateRetailPrice(input, productCode) {
    // Không tính toán gì cả - % lợi nhuận chỉ để hiển thị
    const profitMargin = parseFloat(input.value) || 0;
    const product = pricingData[productCode];
    
    if (product) {
        // Chỉ cập nhật % lợi nhuận, không thay đổi giá
        product.profitMargin = profitMargin;
        
        // Cập nhật thống kê (chỉ tính trung bình %)
        updatePricingSummary();
    }
}

// Lưu thông tin định giá
function savePricing(productCode) {
    const product = pricingData[productCode];
    const input = document.querySelector(`input[data-product="${productCode}"]`);
    
    if (product && input) {
        const profitMargin = parseFloat(input.value) || 0;
        
        // Chỉ lưu % lợi nhuận, không tính toán giá
        product.profitMargin = profitMargin;
        product.lastUpdated = new Date().toLocaleDateString('vi-VN');
        
        // Cập nhật ngày cập nhật trong bảng
        const row = input.closest('tr');
        if (row) {
            const lastUpdatedCell = row.querySelector('.last-updated');
            if (lastUpdatedCell) {
                lastUpdatedCell.textContent = product.lastUpdated;
            }
        }
        
        updatePricingSummary();
        
        console.log('Lưu % lợi nhuận:', product);
        alert(`Đã lưu thông tin cho ${product.name}\n- % Lợi nhuận: ${profitMargin}%\n- Giá bán: 300.000 ₫ (cố định)`);
    }
}

// Lọc sản phẩm theo danh mục
function filterPricingByCategory(category) {
    const rows = document.querySelectorAll('#pricingTableBody tr');
    
    rows.forEach(row => {
        const rowCategory = row.getAttribute('data-category');
        if (!category || rowCategory === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updatePricingSummary();
}

// Tìm kiếm sản phẩm trong bảng định giá
function searchPricingProducts(query) {
    const rows = document.querySelectorAll('#pricingTableBody tr');
    const searchTerm = query.toLowerCase();
    
    rows.forEach(row => {
        const productName = row.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const productCode = row.cells[0]?.textContent.toLowerCase() || '';
        const category = row.querySelector('.product-category')?.textContent.toLowerCase() || '';
        
        if (productName.includes(searchTerm) || 
            productCode.includes(searchTerm) || 
            category.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
    
    updatePricingSummary();
}

// Cập nhật thống kê tổng quan
function updatePricingSummary() {
    const visibleRows = document.querySelectorAll('#pricingTableBody tr:not([style*="display: none"])');
    let totalProducts = 0;
    let totalCostPrice = 0;
    let totalRetailPrice = 0;
    let totalProfitMargin = 0;
    
    visibleRows.forEach(row => {
        const productCode = row.cells[0].textContent;
        const product = pricingData[productCode];
        
        if (product) {
            totalProducts++;
            totalCostPrice += product.costPrice;
            totalRetailPrice += product.retailPrice;
            totalProfitMargin += product.profitMargin;
        }
    });
    
    const avgProfitMargin = totalProducts > 0 ? (totalProfitMargin / totalProducts) : 0;
    
    // Cập nhật UI
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('avgProfitMargin').textContent = avgProfitMargin.toFixed(2) + '%';
    document.getElementById('totalCostPrice').textContent = totalCostPrice.toLocaleString('vi-VN') + ' ₫';
    document.getElementById('totalRetailPrice').textContent = totalRetailPrice.toLocaleString('vi-VN') + ' ₫';
}

// Khởi tạo trang định giá khi load
document.addEventListener('DOMContentLoaded', function() {
    updatePricingSummary();
    // setDefaultDateFilter(); // Bỏ thiết lập mặc định để input trống như Phiếu nhập kho
    // setDefaultReportDates(); // Bỏ thiết lập mặc định để input tồn kho trống như Phiếu nhập kho
    generateInventoryReport(); // Tạo báo cáo tồn kho ban đầu
    
    // Khởi tạo thống kê đơn hàng
    setTimeout(() => {
        filterOrders(); // Tính toán lại thống kê với logic mới
    }, 100);
});

// ===== QUẢN LÝ ĐƠN HÀNG =====

// Dữ liệu đơn hàng mẫu
const ordersData = {
    'ORDER001': {
        code: 'ORDER001',
        date: '2025-10-26',
        customer: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            email: 'nguyenvana@gmail.com'
        },
        shippingAddress: {
            full: '123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé'
        },
        items: [
            { code: 'SKU001', name: 'Naruto Sage Mode', quantity: 1, price: 300000, total: 300000 }
        ],
        totalAmount: 300000,
        status: 'pending',
        notes: 'Giao hàng trong giờ hành chính'
    },
    'ORDER002': {
        code: 'ORDER002',
        date: '2025-10-25',
        customer: {
            name: 'Trần Thị B',
            phone: '0912345678',
            email: 'tranthib@gmail.com'
        },
        shippingAddress: {
            full: '456 Đường Huỳnh Tấn Phát, Phường Tân Thuận Đông, Quận 7, TP.HCM',
            district: 'Quận 7',
            ward: 'Phường Tân Thuận Đông'
        },
        items: [
            { code: 'SKU002', name: 'Tanjiro Kamado', quantity: 2, price: 300000, total: 600000 }
        ],
        totalAmount: 600000,
        status: 'confirmed',
        notes: 'Khách yêu cầu gói quà'
    },
    'ORDER003': {
        code: 'ORDER003',
        date: '2025-10-24',
        customer: {
            name: 'Lê Văn C',
            phone: '0923456789',
            email: 'levanc@gmail.com'
        },
        shippingAddress: {
            full: '789 Đường Võ Văn Tần, Phường 6, Quận 3, TP.HCM',
            district: 'Quận 3',
            ward: 'Phường 6'
        },
        items: [
            { code: 'SKU003', name: 'Raiden Shogun', quantity: 1, price: 300000, total: 300000 }
        ],
        totalAmount: 300000,
        status: 'delivered',
        notes: 'Đã giao thành công'
    },
    'ORDER004': {
        code: 'ORDER004',
        date: '2025-10-23',
        customer: {
            name: 'Phạm Thị D',
            phone: '0934567890',
            email: 'phamthid@gmail.com'
        },
        shippingAddress: {
            full: '321 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
            district: 'Quận 1',
            ward: 'Phường Bến Thành'
        },
        items: [
            { code: 'SKU004', name: 'Hatsune Miku Racing', quantity: 1, price: 300000, total: 300000 }
        ],
        totalAmount: 300000,
        status: 'cancelled',
        notes: 'Khách hủy do thay đổi ý định'
    },
    'ORDER005': {
        code: 'ORDER005',
        date: '2025-10-30',
        customer: {
            name: 'Hoàng Văn E',
            phone: '0945678901',
            email: 'hoangvane@gmail.com'
        },
        shippingAddress: {
            full: '159 Đường Pasteur, Phường 6, Quận 3, TP.HCM',
            district: 'Quận 3',
            ward: 'Phường 6'
        },
        items: [
            { code: 'SKU005', name: 'Nezuko Demon Form', quantity: 1, price: 300000, total: 300000 }
        ],
        totalAmount: 300000,
        status: 'pending',
        notes: 'Đơn hàng đơn sản phẩm'
    }
};

// Dữ liệu phiếu nhập kho
const receiptsData = {
    'PN001': {
        code: 'PN001',
        date: '2025-10-25',
        supplier: 'Nhà cung cấp A',
        status: 'completed',
        batchNumber: 'LOT001-251025',
        items: [
            { 
                code: 'SKU001', 
                name: 'Naruto Sage Mode', 
                quantity: 1, 
                costPrice: 300000, 
                total: 300000,
                batch: 'LOT001-251025-SKU001'
            }
        ],
        totalItems: 1,
        totalAmount: 300000,
        notes: 'Lô hàng tháng 10 - Chất lượng tốt',
        createdBy: 'Admin',
        completedDate: '2025-10-25'
    },
    'PN002': {
        code: 'PN002',
        date: '2025-10-28',
        supplier: 'Nhà cung cấp B',
        status: 'draft',
        batchNumber: 'LOT002-281025',
        items: [
            { 
                code: 'SKU004', 
                name: 'Hatsune Miku Racing', 
                quantity: 1, 
                costPrice: 300000, 
                total: 300000,
                batch: 'LOT002-281025-SKU004'
            }
        ],
        totalItems: 1,
        totalAmount: 300000,
        notes: 'Phiếu nhập đang chờ xác nhận',
        createdBy: 'Admin',
        completedDate: null
    },
    'PN003': {
        code: 'PN003',
        date: '2025-10-30',
        supplier: 'Nhà cung cấp C',
        status: 'draft',
        batchNumber: 'LOT003-301025',
        items: [
            { 
                code: 'SKU001', 
                name: 'Naruto Sage Mode', 
                quantity: 1, 
                costPrice: 300000, 
                total: 300000,
                batch: 'LOT003-301025-SKU001'
            }
        ],
        totalItems: 1,
        totalAmount: 300000,
        notes: 'Nhập bổ sung do bán chạy',
        createdBy: 'Admin',
        completedDate: null
    }
};

// Thiết lập bộ lọc ngày mặc định (7 ngày gần nhất)
function setDefaultDateFilter() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Format dd/mm/yyyy cho input text
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    
    // Set giá trị hiển thị và data-iso-value
    const fromInput = document.getElementById('dateFrom');
    const toInput = document.getElementById('dateTo');
    
    fromInput.value = formatDate(weekAgo);
    fromInput.setAttribute('data-iso-value', weekAgo.toISOString().split('T')[0]);
    
    toInput.value = formatDate(today);
    toInput.setAttribute('data-iso-value', today.toISOString().split('T')[0]);
}

// Lọc đơn hàng theo các tiêu chí
// Cập nhật màu nền cho dropdown dựa trên giá trị
function updateDropdownBackground(selectId, value) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Reset tất cả màu nền
    select.style.backgroundColor = '';
    
    // Áp dụng màu nền theo giá trị với màu tươi và dễ phân biệt
    switch(value) {
        case 'pending':
            select.style.backgroundColor = '#fff3cd'; // Vàng nhạt
            select.style.color = '#856404';
            break;
        case 'confirmed':
            select.style.backgroundColor = '#d1ecf1'; // Xanh dương nhạt
            select.style.color = '#0c5460';
            break;
        case 'delivered':
            select.style.backgroundColor = '#d4edda'; // Xanh lá nhạt
            select.style.color = '#155724';
            break;
        case 'cancelled':
            select.style.backgroundColor = '#f8d7da'; // Đỏ nhạt
            select.style.color = '#721c24';
            break;
        default:
            select.style.backgroundColor = 'white';
            select.style.color = '#333';
    }
}

function filterOrders() {
    const fromInput = document.getElementById('dateFrom');
    const toInput = document.getElementById('dateTo');
    
    // Lấy giá trị từ data-iso-value hoặc chuyển đổi từ dd/mm/yyyy sang yyyy-mm-dd
    let dateFrom = fromInput.getAttribute('data-iso-value') || '';
    let dateTo = toInput.getAttribute('data-iso-value') || '';
    
    // Nếu không có data-iso-value, thử chuyển đổi từ value (dd/mm/yyyy)
    if (!dateFrom && fromInput.value) {
        const match = fromInput.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) dateFrom = `${match[3]}-${match[2]}-${match[1]}`;
    }
    if (!dateTo && toInput.value) {
        const match = toInput.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) dateTo = `${match[3]}-${match[2]}-${match[1]}`;
    }
    
    const statusFilter = document.getElementById('statusFilter').value;
    
    // Cập nhật màu nền cho dropdown trạng thái
    updateDropdownBackground('statusFilter', statusFilter);
    
    const rows = document.querySelectorAll('#ordersTableBody tr');
    let visibleCount = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let deliveredCount = 0;
    let totalRevenue = 0;
    
    rows.forEach(row => {
        const orderDate = row.getAttribute('data-date');
        const orderStatus = row.getAttribute('data-status');
        let showRow = true;
        
        // Lọc theo thời gian (so sánh yyyy-mm-dd)
        if (dateFrom && orderDate < dateFrom) showRow = false;
        if (dateTo && orderDate > dateTo) showRow = false;
        
        // Lọc theo trạng thái
        if (statusFilter && orderStatus !== statusFilter) showRow = false;
        
        if (showRow) {
            row.style.display = '';
            visibleCount++;
            
            // Thống kê
            if (orderStatus === 'pending') pendingCount++;
            if (orderStatus === 'confirmed') confirmedCount++;
            if (orderStatus === 'delivered') deliveredCount++;
            
            // Tính doanh thu (tính cả đã xác nhận và đã giao)
            if (orderStatus === 'confirmed' || orderStatus === 'delivered') {
                const priceText = row.querySelector('.price-text').textContent;
                const price = parseInt(priceText.replace(/[₫,.\s]/g, ''));
                totalRevenue += price;
            }
        } else {
            row.style.display = 'none';
        }
    });
    
    // Cập nhật thống kê
    updateOrderSummary(visibleCount, pendingCount, confirmedCount, deliveredCount, totalRevenue);
}

// Sắp xếp đơn hàng theo địa chỉ giao hàng
function sortOrders() {
    const sortBy = document.getElementById('sortBy').value;
    const tbody = document.getElementById('ordersTableBody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
        } else if (sortBy === 'ward') {
            // Sắp xếp theo phường
            const wardA = a.getAttribute('data-ward');
            const wardB = b.getAttribute('data-ward');
            return wardA.localeCompare(wardB, 'vi', { sensitivity: 'base' });
        } else if (sortBy === 'district') {
            // Sắp xếp theo quận
            const districtA = a.getAttribute('data-district');
            const districtB = b.getAttribute('data-district');
            return districtA.localeCompare(districtB, 'vi', { sensitivity: 'base' });
        }
        return 0;
    });
    
    // Cập nhật DOM
    rows.forEach(row => tbody.appendChild(row));
    
    console.log(`Đã sắp xếp đơn hàng theo: ${sortBy}`);
}

// Reset bộ lọc đơn hàng
function resetOrderFilters() {
    // Xóa trắng các input ngày
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    
    // Xóa các thuộc tính data-iso-value
    document.getElementById('dateFrom').removeAttribute('data-iso-value');
    document.getElementById('dateTo').removeAttribute('data-iso-value');
    
    // Đặt lại dropdown về "Tất cả"
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortBy').value = 'date';
    
    // Cập nhật lại bảng để hiển thị tất cả đơn hàng
    filterOrders();
    sortOrders(); // Áp dụng sắp xếp mặc định
    
    console.log('✅ Đã đặt lại tất cả bộ lọc đơn hàng');
}

// Cập nhật trạng thái đơn hàng
function updateOrderStatus(orderCode, newStatus) {
    const confirmed = confirm(`Xác nhận thay đổi trạng thái đơn hàng ${orderCode}?`);
    if (confirmed) {
        // Cập nhật dữ liệu
        if (ordersData[orderCode]) {
            ordersData[orderCode].status = newStatus;
        }
        
        // Cập nhật data-status trong bảng
        const row = document.querySelector(`tr[data-status] td a[onclick*="${orderCode}"]`).closest('tr');
        if (row) {
            row.setAttribute('data-status', newStatus);
            
            // Cập nhật màu nền cho dropdown trong hàng này
            const select = row.querySelector('.status-select');
            if (select) {
                updateDropdownBackground(select.id || 'status-' + orderCode, newStatus);
            }
        }
        
        console.log(`Đã cập nhật trạng thái đơn ${orderCode} thành: ${newStatus}`);
        filterOrders(); // Cập nhật lại thống kê
        
        // Thông báo thành công
        const statusLabels = {
            'pending': 'Chưa xử lý',
            'confirmed': 'Đã xác nhận',
            'delivered': 'Đã giao thành công',
            'cancelled': 'Đã hủy'
        };
        alert(`Đã cập nhật trạng thái đơn hàng ${orderCode} thành: ${statusLabels[newStatus]}`);
    } else {
        // Reset lại select về giá trị cũ
        const select = event.target;
        select.value = ordersData[orderCode]?.status || 'pending';
    }
}

// Hiển thị modal chi tiết đơn hàng
function showOrderDetailModal(orderCode) {
    const order = ordersData[orderCode];
    if (!order) {
        alert('Không tìm thấy thông tin đơn hàng!');
        return;
    }
    
    // Cập nhật thông tin modal
    document.getElementById('orderDetailCode').textContent = order.code;
    document.getElementById('orderDetailCodeText').textContent = order.code;
    document.getElementById('orderDetailDate').textContent = new Date(order.date).toLocaleDateString('vi-VN');
    document.getElementById('orderDetailCustomer').textContent = order.customer.name;
    document.getElementById('orderDetailPhone').textContent = order.customer.phone;
    document.getElementById('orderDetailEmail').textContent = order.customer.email;
    document.getElementById('orderDetailAddress').textContent = order.shippingAddress.full;
    document.getElementById('orderDetailNotes').textContent = order.notes || 'Không có ghi chú';
    
    // Cập nhật trạng thái
    const statusLabels = {
        'pending': 'Chưa xử lý',
        'confirmed': 'Đã xác nhận',
        'delivered': 'Đã giao thành công',
        'cancelled': 'Đã hủy'
    };
    document.getElementById('orderDetailStatus').textContent = statusLabels[order.status];
    document.getElementById('orderDetailStatus').className = `status-badge status-${order.status}`;
    
    // Tính tổng số lượng
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('orderDetailTotalItems').textContent = totalItems;
    
    // Cập nhật tổng tiền
    document.getElementById('orderDetailTotal').textContent = order.totalAmount.toLocaleString('vi-VN') + ' ₫';
    
    // Cập nhật danh sách sản phẩm compact
    const itemsContainer = document.getElementById('orderDetailItems');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="product-item-compact">
            <div class="product-info-compact">
                <span class="product-code">${item.code}</span>
                <span class="product-name">${item.name}</span>
            </div>
            <div class="product-details-compact">
                <span class="quantity">SL: ${item.quantity}</span>
                <span class="price">${item.total.toLocaleString('vi-VN')} ₫</span>
            </div>
        </div>
    `).join('');
    
    // Hiển thị modal
    document.getElementById('orderDetailModal').style.display = 'block';
}

// Đóng modal chi tiết đơn hàng
function hideOrderDetailModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

// Sửa đơn hàng (placeholder)
function editOrder(orderCode) {
    alert(`Chức năng sửa đơn hàng ${orderCode} sẽ được phát triển trong phiên bản tiếp theo.`);
}

// Cập nhật thống kê đơn hàng
function updateOrderSummary(total, pending, confirmed, delivered, revenue) {
    document.getElementById('totalOrders').textContent = total;
    document.getElementById('pendingOrders').textContent = pending;
    document.getElementById('deliveredOrders').textContent = confirmed + delivered; // Tổng đã xử lý
    document.getElementById('totalRevenue').textContent = revenue.toLocaleString('vi-VN') + ' ₫';
}

// ===== QUẢN LÝ PHIẾU NHẬP KHO =====

// Tìm kiếm phiếu nhập
function searchReceipts() {
    const searchTerm = document.getElementById('receiptSearch').value.toLowerCase();
    const rows = document.querySelectorAll('#receiptsTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const shouldShow = text.includes(searchTerm);
        row.style.display = shouldShow ? '' : 'none';
    });
}

// Lọc phiếu nhập
function filterReceipts() {
    const fromInput = document.getElementById('receiptDateFrom');
    const toInput = document.getElementById('receiptDateTo');
    
    // Lấy giá trị từ data-iso-value hoặc chuyển đổi từ dd/mm/yyyy sang yyyy-mm-dd
    let dateFrom = fromInput.getAttribute('data-iso-value') || '';
    let dateTo = toInput.getAttribute('data-iso-value') || '';
    
    // Nếu không có data-iso-value, thử chuyển đổi từ value (dd/mm/yyyy)
    if (!dateFrom && fromInput.value) {
        const match = fromInput.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) dateFrom = `${match[3]}-${match[2]}-${match[1]}`;
    }
    if (!dateTo && toInput.value) {
        const match = toInput.value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (match) dateTo = `${match[3]}-${match[2]}-${match[1]}`;
    }
    
    const supplierFilter = document.getElementById('supplierFilter').value;
    const statusFilter = document.getElementById('receiptStatusFilter').value;
    
    const rows = document.querySelectorAll('#receiptsTableBody tr');
    let visibleCount = 0;
    let draftCount = 0;
    let completedCount = 0;
    let totalValue = 0;
    
    rows.forEach(row => {
        const rowDate = row.getAttribute('data-date');
        const rowSupplier = row.getAttribute('data-supplier');
        const rowStatus = row.getAttribute('data-status');
        let showRow = true;
        
        // Lọc theo ngày (so sánh yyyy-mm-dd)
        if (dateFrom && rowDate < dateFrom) showRow = false;
        if (dateTo && rowDate > dateTo) showRow = false;
        
        // Lọc theo nhà cung cấp
        if (supplierFilter && rowSupplier !== supplierFilter) showRow = false;
        
        // Lọc theo trạng thái
        if (statusFilter && rowStatus !== statusFilter) showRow = false;
        
        if (showRow) {
            row.style.display = '';
            visibleCount++;
            
            // Thống kê
            if (rowStatus === 'draft') draftCount++;
            if (rowStatus === 'completed') completedCount++;
            
            // Tính tổng giá trị
            const priceText = row.cells[4].textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''));
            totalValue += price;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Cập nhật thống kê
    document.getElementById('totalReceipts').textContent = visibleCount;
    document.getElementById('draftReceipts').textContent = draftCount;
    document.getElementById('completedReceipts').textContent = completedCount;
    document.getElementById('totalReceiptValue').textContent = totalValue.toLocaleString('vi-VN') + ' ₫';
}

// Đặt lại tất cả bộ lọc phiếu nhập
function resetReceiptFilters() {
    // Xóa trắng các input ngày
    document.getElementById('receiptDateFrom').value = '';
    document.getElementById('receiptDateTo').value = '';
    
    // Xóa các thuộc tính data-iso-value
    document.getElementById('receiptDateFrom').removeAttribute('data-iso-value');
    document.getElementById('receiptDateTo').removeAttribute('data-iso-value');
    
    // Đặt lại dropdown về "Tất cả"
    document.getElementById('supplierFilter').value = '';
    document.getElementById('receiptStatusFilter').value = '';
    
    // Xóa các trường lọc bổ sung (nếu có)
    const priceFrom = document.getElementById('priceFrom');
    const priceTo = document.getElementById('priceTo');
    const quantityFrom = document.getElementById('quantityFrom');
    const quantityTo = document.getElementById('quantityTo');
    if (priceFrom) priceFrom.value = '';
    if (priceTo) priceTo.value = '';
    if (quantityFrom) quantityFrom.value = '';
    if (quantityTo) quantityTo.value = '';
    
    // Xóa thanh tìm kiếm
    const receiptSearch = document.getElementById('receiptSearch');
    if (receiptSearch) receiptSearch.value = '';
    
    // Cập nhật lại bảng để hiển thị tất cả phiếu nhập
    searchReceipts(); // Tải lại bộ lọc tìm kiếm
    filterReceipts(); // Áp dụng lại filter
    
    console.log('✅ Đã đặt lại tất cả bộ lọc phiếu nhập');
}// Biến global để quản lý date picker
let currentDatePicker = null;

// Logic mới: Chỉ định dạng khi người dùng nhập xong
function formatDateInputOnBlur(input) {
    let value = input.value;
    let numbersOnly = value.replace(/[^\d]/g, '');

    // Nếu không có số thì xóa trắng
    if (numbersOnly.length === 0) {
        input.value = '';
        return;
    }

    // Giới hạn 8 số
    if (numbersOnly.length > 8) {
        numbersOnly = numbersOnly.substring(0, 8);
    }

    let formattedValue = '';
    // Ưu tiên xử lý các trường hợp đặc biệt như "2009" -> "20/09"
    if (numbersOnly.length === 4) { // vd: 2009 -> 20/09
        formattedValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2, 4);
    } else if (numbersOnly.length > 4) {
        formattedValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2, 4) + '/' + numbersOnly.substring(4);
    } else if (numbersOnly.length > 2) {
        formattedValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2);
    } else {
        formattedValue = numbersOnly;
    }
    
    input.value = formattedValue;
    convertDateFormat(input); // Validate sau khi format
}

// Xử lý khi nhấn Enter
function handleDateEnter(input, event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        formatDateInputOnBlur(input); // Dùng chung logic format
        input.blur(); // Thoát khỏi input
    }
}

// Xử lý sự kiện bàn phím
function handleDateKeydown(input, event) {
    // Cho phép các phím điều hướng và xóa
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (allowedKeys.includes(event.key)) {
        // Đóng date picker khi nhấn Backspace/Delete
        if (currentDatePicker && ['Backspace', 'Delete'].includes(event.key)) {
            try {
                document.body.removeChild(currentDatePicker);
            } catch (e) {
                // Ignore error if element already removed
            }
            currentDatePicker = null;
        }
        return;
    }
    
    // Chỉ cho phép số
    if (!/^\d$/.test(event.key)) {
        event.preventDefault();
        return;
    }
    
    // Kiểm tra độ dài hiện tại (không cho nhập quá 8 số)
    const currentNumbers = input.value.replace(/[^\d]/g, '');
    if (currentNumbers.length >= 8) {
        event.preventDefault();
        return;
    }
    
    // Đóng date picker khi nhấn số
    if (currentDatePicker) {
        try {
            document.body.removeChild(currentDatePicker);
        } catch (e) {
            // Ignore error if element already removed
        }
        currentDatePicker = null;
    }
}

// Mở date picker khi click vào icon
function openDatePicker(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Đóng date picker cũ nếu có
    if (currentDatePicker) {
        try {
            document.body.removeChild(currentDatePicker);
        } catch (e) {
            // Ignore error if element already removed
        }
        currentDatePicker = null;
    }
    
    // Tạo input type="date" ẩn
    const hiddenDateInput = document.createElement('input');
    hiddenDateInput.type = 'date';
    hiddenDateInput.style.position = 'absolute';
    hiddenDateInput.style.left = '-9999px';
    hiddenDateInput.style.opacity = '0';
    
    // Chuyển đổi giá trị hiện tại sang format yyyy-mm-dd nếu cần
    let currentValue = input.value;
    if (currentValue && /^\d{2}\/\d{2}\/\d{4}$/.test(currentValue)) {
        const parts = currentValue.split('/');
        currentValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    hiddenDateInput.value = currentValue || '';
    
    document.body.appendChild(hiddenDateInput);
    currentDatePicker = hiddenDateInput;
    
    // Xử lý khi chọn ngày
    hiddenDateInput.addEventListener('change', function() {
        if (this.value) {
            const parts = this.value.split('-');
            input.value = `${parts[2]}/${parts[1]}/${parts[0]}`;
            input.setAttribute('data-iso-value', this.value);
            convertDateFormat(input);
        }
        try {
            if (document.body.contains(this)) {
                document.body.removeChild(this);
            }
        } catch (e) {
            // Ignore error if element already removed
        }
        currentDatePicker = null;
    });
    
    // Xử lý khi đóng picker
    hiddenDateInput.addEventListener('blur', function() {
        setTimeout(() => {
            try {
                if (document.body.contains(this)) {
                    document.body.removeChild(this);
                }
            } catch (e) {
                // Ignore error if element already removed
            }
            currentDatePicker = null;
        }, 100);
    });
    
    // Mở date picker
    try {
        hiddenDateInput.showPicker();
    } catch (e) {
        // Fallback nếu showPicker không được hỗ trợ
        hiddenDateInput.focus();
        hiddenDateInput.click();
    }
}

// Chuyển đổi và validate ngày khi nhấn Enter
function convertDateFormat(input) {
    const value = input.value.trim();
    if (!value) {
        input.removeAttribute('data-iso-value');
        // Xác định input thuộc về trang nào
        if (input.id === 'dateFrom' || input.id === 'dateTo') {
            filterOrders();
        } else if (input.id === 'receiptDateFrom' || input.id === 'receiptDateTo') {
            filterReceipts();
        }
        return;
    }
    
    // Kiểm tra định dạng dd/mm/yyyy
    const dateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = parseInt(dateMatch[3]);
        
        // Kiểm tra phạm vi hợp lệ
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
            // Kiểm tra tính hợp lệ của ngày
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() === year && date.getMonth() === (month - 1) && date.getDate() === day) {
                const formattedDay = day.toString().padStart(2, '0');
                const formattedMonth = month.toString().padStart(2, '0');
                
                // Cập nhật hiển thị với format đẹp
                input.value = `${formattedDay}/${formattedMonth}/${year}`;
                input.setAttribute('data-iso-value', `${year}-${formattedMonth}-${formattedDay}`);
                
                // Xác định input thuộc về trang nào và gọi filter tương ứng
                if (input.id === 'dateFrom' || input.id === 'dateTo') {
                    filterOrders();
                } else if (input.id === 'receiptDateFrom' || input.id === 'receiptDateTo') {
                    filterReceipts();
                }
                
                // Hiển thị thông báo thành công
                console.log(`✅ Ngày hợp lệ: ${input.value}`);
                return;
            }
        }
        
        // Ngày không hợp lệ
        alert('❌ Ngày không hợp lệ. Vui lòng kiểm tra lại ngày/tháng/năm.');
        input.focus();
        input.select();
    } else if (value.length > 0) {
        // Định dạng không đúng
        alert('❌ Vui lòng nhập đầy đủ theo định dạng dd/mm/yyyy (ví dụ: 25/10/2025)');
        input.focus();
        input.select();
    }
}

// Copy logic xử lý ngày cho Tồn kho (Inventory)
function formatInventoryDate(input) {
    let value = input.value;
    let numbersOnly = value.replace(/[^\d]/g, '');

    // Nếu không có số thì xóa trắng
    if (numbersOnly.length === 0) {
        input.value = '';
        return;
    }

    // Giới hạn 8 số
    if (numbersOnly.length > 8) {
        numbersOnly = numbersOnly.substring(0, 8);
    }

    let formattedValue = '';
    // Ưu tiên xử lý các trường hợp đặc biệt như "2009" -> "20/09"
    if (numbersOnly.length === 4) { // vd: 2009 -> 20/09
        formattedValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2, 4);
    } else if (numbersOnly.length > 4) {
        formattedValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2, 4) + '/' + numbersOnly.substring(4);
    } else if (numbersOnly.length > 2) {
        formattedValue = numbersOnly.substring(0, 2) + '/' + numbersOnly.substring(2);
    } else {
        formattedValue = numbersOnly;
    }
    
    input.value = formattedValue;
    convertInventoryDateFormat(input); // Validate sau khi format
}

// Chuyển đổi và validate ngày cho Tồn kho
function convertInventoryDateFormat(input) {
    const value = input.value.trim();
    if (!value) {
        input.removeAttribute('data-iso-value');
        generateInventoryReport();
        return;
    }
    
    // Kiểm tra định dạng dd/mm/yyyy
    const dateMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
        const day = parseInt(dateMatch[1]);
        const month = parseInt(dateMatch[2]);
        const year = parseInt(dateMatch[3]);
        
        // Kiểm tra phạm vi hợp lệ
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2100) {
            // Kiểm tra tính hợp lệ của ngày
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() === year && date.getMonth() === (month - 1) && date.getDate() === day) {
                const formattedDay = day.toString().padStart(2, '0');
                const formattedMonth = month.toString().padStart(2, '0');
                
                // Cập nhật hiển thị với format đẹp
                input.value = `${formattedDay}/${formattedMonth}/${year}`;
                input.setAttribute('data-iso-value', `${year}-${formattedMonth}-${formattedDay}`);
                generateInventoryReport();
                
                // Hiển thị thông báo thành công
                console.log(`✅ Ngày hợp lệ: ${input.value}`);
                return;
            }
        }
        
        // Ngày không hợp lệ
        alert('❌ Ngày không hợp lệ. Vui lòng kiểm tra lại ngày/tháng/năm.');
        input.focus();
        input.select();
    } else if (value.length > 0) {
        // Định dạng không đúng
        alert('❌ Vui lòng nhập đầy đủ theo định dạng dd/mm/yyyy (ví dụ: 25/10/2025)');
        input.focus();
        input.select();
    }
}

// Xử lý khi nhấn Enter cho Tồn kho
function handleInventoryDateEnter(input, event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        formatInventoryDate(input);
        input.blur();
    }
}

// Đặt lại tất cả bộ lọc tồn kho
function resetInventoryFilters() {
    // Xóa trắng các input
    const productSearchInput = document.getElementById('productSearch');
    const categoryFilterSelect = document.getElementById('categoryFilter');
    
    if (productSearchInput) {
        productSearchInput.value = '';
    }
    
    if (categoryFilterSelect) {
        categoryFilterSelect.value = '';
    }
    
    // Cập nhật lại báo cáo và tìm kiếm
    searchInventory('');
    filterInventoryByCategory('');
    
    console.log('✅ Đã đặt lại tất cả bộ lọc tồn kho');
}

// Format input giá tiền
function formatPriceInput(input) {
    // Xóa tất cả ký tự không phải số
    let value = input.value.replace(/[^\d]/g, '');
    
    // Nếu có giá trị, format theo kiểu Việt Nam
    if (value) {
        // Hiển thị tooltip với format tiền
        const formattedValue = parseInt(value).toLocaleString('vi-VN');
        input.title = `${formattedValue} ₫`;
    } else {
        input.title = input.getAttribute('data-original-title') || 'Nhập số tiền';
    }
}

// Hỗ trợ nhập ngày từ bàn phím
function setupDateInputSupport() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Lưu title gốc
        if (input.title) {
            input.setAttribute('data-original-title', input.title);
        }
        
        // Thêm sự kiện keypress để hỗ trợ nhập dd/mm/yyyy
        input.addEventListener('keypress', function(e) {
            // Cho phép nhập số và dấu /
            if (!/[\d/]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        // Thêm sự kiện blur để chuyển đổi format dd/mm/yyyy sang yyyy-mm-dd
        input.addEventListener('blur', function() {
            const value = this.value;
            if (value && value.includes('/')) {
                const parts = value.split('/');
                if (parts.length === 3) {
                    const day = parts[0].padStart(2, '0');
                    const month = parts[1].padStart(2, '0');
                    const year = parts[2];
                    
                    // Kiểm tra năm hợp lệ
                    if (year.length === 4 && !isNaN(year)) {
                        this.value = `${year}-${month}-${day}`;
                        filterReceipts(); // Áp dụng filter ngay
                    }
                }
            }
        });
    });
}

// Hiển thị modal tạo phiếu nhập mới
function showAddReceiptModal() {
    document.getElementById('receiptModalTitle').textContent = 'Tạo phiếu nhập mới';
    document.getElementById('receiptForm').reset();
    document.getElementById('receiptForm').removeAttribute('data-editing-id');
    
    // Tạo mã phiếu tự động dựa trên mã đã có +1
    const existingCodes = [];
    // Lấy tất cả mã phiếu nhập hiện có từ bảng
    document.querySelectorAll('#receiptsTableBody tr').forEach(row => {
        const codeCell = row.querySelector('td:first-child a');
        if (codeCell) {
            const code = codeCell.textContent.trim();
            if (code.startsWith('PN')) {
                const num = parseInt(code.substring(2));
                if (!isNaN(num)) {
                    existingCodes.push(num);
                }
            }
        }
    });
    
    // Tìm số lớn nhất và +1
    const maxNum = existingCodes.length > 0 ? Math.max(...existingCodes) : 0;
    const nextNum = maxNum + 1;
    const newCode = 'PN' + String(nextNum).padStart(3, '0');
    document.getElementById('receiptCode').value = newCode;
    
    // Set ngày hiện tại
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    const isoDate = `${year}-${month}-${day}`;

    const dateInput = document.getElementById('receiptDate');
    dateInput.value = formattedDate;
    // Lưu giá trị chuẩn YYYY-MM-DD vào data-attribute để xử lý
    dateInput.setAttribute('data-iso-value', isoDate);
    // Xóa danh sách sản phẩm
    document.getElementById('receiptItemsContainer').innerHTML = '';
    updateReceiptTotal();
    
    document.getElementById('receiptModal').style.display = 'block';
}

// Hiển thị modal sửa phiếu nhập
function showEditReceiptModal(receiptCode) {
    const receipt = receiptsData[receiptCode];
    if (!receipt || receipt.status === 'completed') {
        alert('Không thể sửa phiếu nhập đã hoàn thành!');
        return;
    }
    
    document.getElementById('receiptModalTitle').textContent = 'Sửa phiếu nhập';
    document.getElementById('receiptForm').setAttribute('data-editing-id', receiptCode);
    
    // Điền thông tin
    document.getElementById('receiptCode').value = receipt.code;
    document.getElementById('receiptDate').value = receipt.date;
    document.getElementById('receiptSupplier').value = receipt.supplier;
    document.getElementById('receiptBatch').value = receipt.batchNumber;
    document.getElementById('receiptNotes').value = receipt.notes;
    
    // Điền danh sách sản phẩm
    const container = document.getElementById('receiptItemsContainer');
    container.innerHTML = '';
    
    receipt.items.forEach(item => {
        addReceiptItem(item.code, item.name, item.quantity, item.costPrice);
    });
    
    updateReceiptTotal();
    document.getElementById('receiptModal').style.display = 'block';
}

// Xem chi tiết phiếu nhập
function viewReceiptDetails(receiptCode) {
    const receipt = receiptsData[receiptCode];
    if (!receipt) return;
    
    document.getElementById('receiptDetailCode').textContent = receipt.code;
    document.getElementById('receiptDetailDate').textContent = new Date(receipt.date).toLocaleDateString('vi-VN');
    document.getElementById('receiptDetailSupplier').textContent = receipt.supplier;
    document.getElementById('receiptDetailBatch').textContent = receipt.batchNumber;
    document.getElementById('receiptDetailStatus').textContent = receipt.status === 'completed' ? 'Hoàn thành' : 'Đang tạo';
    document.getElementById('receiptDetailStatus').className = `status-badge ${receipt.status === 'completed' ? 'status-active' : 'status-pending'}`;
    document.getElementById('receiptDetailNotes').textContent = receipt.notes || 'Không có ghi chú';
    
    // Hiển thị danh sách sản phẩm
const itemsContainer = document.getElementById('receiptDetailItems');
itemsContainer.innerHTML = receipt.items.map(item => `
    <div class="product-item-compact" 
         style="display: flex; justify-content: space-between; align-items: flex-start; padding: 16px 10px; border-bottom: 1px solid #f0f0f0;">

        <div class="product-info-compact" style="flex: 1; min-width: 0;">
            <span class="product-code" style="display: block; margin-bottom: 4px; font-weight: 600; font-family: monospace; font-size: 13px; color: #666;">${item.code}</span>
            <span class="product-name" style="display: block; line-height: 1.3; font-size: 14px; font-weight: 500; white-space: normal;">${item.name}</span>
        </div>

        <div class="product-details-compact" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px; margin-left: 15px; flex-shrink: 0;">
            <span style="font-weight: 500; font-size: 13px; color: #333;">SL: ${item.quantity}</span>
            <span style="color: #666; font-size: 13px;">Giá: ${item.costPrice.toLocaleString('vi-VN')} ₫</span>
            <span style="font-weight: 600; color: #059669; font-size: 14px; white-space: nowrap;">Tổng: ${item.total.toLocaleString('vi-VN')} ₫</span>
        </div>
    </div>
`).join('');
    // Hiển thị tổng kết
    document.getElementById('receiptDetailTotalItems').textContent = receipt.totalItems;
    document.getElementById('receiptDetailTotal').textContent = receipt.totalAmount.toLocaleString('vi-VN') + ' ₫';
    
    document.getElementById('receiptDetailModal').style.display = 'block';
}

// Đóng modal chi tiết phiếu nhập
function hideReceiptDetailModal() {
    document.getElementById('receiptDetailModal').style.display = 'none';
}

// Hoàn thành phiếu nhập
function completeReceipt(receiptCode) {
    if (confirm('Xác nhận hoàn thành phiếu nhập này? Sau khi hoàn thành sẽ không thể sửa đổi.')) {
        const receipt = receiptsData[receiptCode];
        if (receipt) {
            receipt.status = 'completed';
            receipt.completedDate = new Date().toISOString().split('T')[0];
            
            // Cập nhật hiển thị
            updateReceiptsTable();
            alert('Phiếu nhập đã được hoàn thành!');
        }
    }
}

// Cập nhật bảng phiếu nhập
function updateReceiptsTable() {
    const tbody = document.getElementById('receiptsTableBody');
    tbody.innerHTML = Object.values(receiptsData).map(receipt => {
        const statusClass = receipt.status === 'completed' ? 'status-active' : 'status-pending';
        const statusText = receipt.status === 'completed' ? 'Hoàn thành' : 'Đang tạo';
        const actions = receipt.status === 'draft' 
            ? `<button class="action-button" onclick="showEditReceiptModal('${receipt.code}')">Sửa</button>
               <button class="action-button" onclick="completeReceipt('${receipt.code}')">Hoàn thành</button>`
            : `<button class="action-button" onclick="viewReceiptDetails('${receipt.code}')">Chi tiết</button>`;
        
        return `
            <tr data-status="${receipt.status}" data-date="${receipt.date}" data-supplier="${receipt.supplier}">
                <td><a href="#" onclick="viewReceiptDetails('${receipt.code}')" class="order-link">${receipt.code}</a></td>
                <td>${new Date(receipt.date).toLocaleDateString('vi-VN')}</td>
                <td>${receipt.supplier}</td>
                <td>${receipt.totalItems} sản phẩm</td>
                <td>${receipt.totalAmount.toLocaleString('vi-VN')} ₫</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td><div class="action-buttons">${actions}</div></td>
            </tr>
        `;
    }).join('');
    
    filterReceipts(); // Cập nhật thống kê
}

// Đóng modal phiếu nhập
function hideReceiptModal() {
    document.getElementById('receiptModal').style.display = 'none';
    document.getElementById('receiptForm').reset();
    document.getElementById('receiptItemsContainer').innerHTML = '';
    document.getElementById('productSearchResults').innerHTML = '';
}

// Tìm kiếm sản phẩm cho phiếu nhập
function searchProductsForReceipt() {
    const searchTerm = document.getElementById('productSearchInput').value.toLowerCase();
    const resultsContainer = document.getElementById('productSearchResults');
    
    if (searchTerm.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    const filteredProducts = Object.values(sampleProducts).filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.code.toLowerCase().includes(searchTerm)
    );
    
    resultsContainer.innerHTML = filteredProducts.map(product => `
        <div class="search-result-item" onclick="selectProductForReceipt('${product.code}', '${product.name}')">
            <div class="product-info">
                <strong>${product.code}</strong> - ${product.name}
                <span class="product-category">${product.category}</span>
            </div>
        </div>
    `).join('');
}

// Chọn sản phẩm cho phiếu nhập
function selectProductForReceipt(productCode, productName) {
    document.getElementById('productSearchInput').value = '';
    document.getElementById('productSearchResults').innerHTML = '';
    addReceiptItem(productCode, productName, 1, 300000);
}

// Thêm sản phẩm vào phiếu nhập
function addReceiptItem(productCode, productName, quantity = 1, costPrice = 300000) {
    const container = document.getElementById('receiptItemsContainer');
    const itemId = `item_${productCode}_${Date.now()}`;
    
    const itemHtml = `
        <div class="receipt-item" id="${itemId}">
            <div class="item-info">
                <strong>${productCode}</strong> - ${productName}
            </div>
            <div class="item-controls">
                <input type="number" value="${quantity}" min="1" placeholder="Số lượng" 
                       onchange="updateReceiptItem('${itemId}')" class="quantity-input">
                <input type="number" value="${costPrice}" min="0" step="1000" placeholder="Giá nhập" 
                       onchange="updateReceiptItem('${itemId}')" class="price-input">
                <span class="item-total">${(quantity * costPrice).toLocaleString('vi-VN')} ₫</span>
                <button type="button" onclick="removeReceiptItem('${itemId}')" class="remove-btn">Xóa</button>
            </div>
            <input type="hidden" name="itemCode" value="${productCode}">
            <input type="hidden" name="itemName" value="${productName}">
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHtml);
    updateReceiptTotal();
}

// Cập nhật item trong phiếu nhập
function updateReceiptItem(itemId) {
    const item = document.getElementById(itemId);
    const quantity = parseInt(item.querySelector('.quantity-input').value) || 0;
    const price = parseInt(item.querySelector('.price-input').value) || 0;
    const total = quantity * price;
    
    item.querySelector('.item-total').textContent = total.toLocaleString('vi-VN') + ' ₫';
    updateReceiptTotal();
}

// Xóa item khỏi phiếu nhập
function removeReceiptItem(itemId) {
    document.getElementById(itemId).remove();
    updateReceiptTotal();
}

// Cập nhật tổng phiếu nhập
function updateReceiptTotal() {
    const items = document.querySelectorAll('.receipt-item');
    let totalQuantity = 0;
    let totalAmount = 0;
    
    items.forEach(item => {
        const quantity = parseInt(item.querySelector('.quantity-input').value) || 0;
        const price = parseInt(item.querySelector('.price-input').value) || 0;
        totalQuantity += quantity;
        totalAmount += quantity * price;
    });
    
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalAmount').textContent = totalAmount.toLocaleString('vi-VN') + ' ₫';
}

// Lưu phiếu nhập
function saveReceipt(event) {
    event.preventDefault();
    
    const form = document.getElementById('receiptForm');
    const editingId = form.getAttribute('data-editing-id');
    const items = [];
    
    // Thu thập dữ liệu sản phẩm
    document.querySelectorAll('.receipt-item').forEach(item => {
        const code = item.querySelector('input[name="itemCode"]').value;
        const name = item.querySelector('input[name="itemName"]').value;
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const costPrice = parseInt(item.querySelector('.price-input').value);
        const batch = `${document.getElementById('receiptBatch').value || 'LOT'}-${code}`;
        
        items.push({
            code: code,
            name: name,
            quantity: quantity,
            costPrice: costPrice,
            total: quantity * costPrice,
            batch: batch
        });
    });
    
    if (items.length === 0) {
        alert('Vui lòng thêm ít nhất một sản phẩm!');
        return;
    }
    
    const receiptData = {
        code: document.getElementById('receiptCode').value,
        date: document.getElementById('receiptDate').value,
        supplier: document.getElementById('receiptSupplier').value,
        status: 'draft',
        batchNumber: document.getElementById('receiptBatch').value || `LOT${Date.now()}`,
        items: items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: items.reduce((sum, item) => sum + item.total, 0),
        notes: document.getElementById('receiptNotes').value,
        createdBy: 'Admin',
        completedDate: null
    };
    
    if (editingId) {
        // Cập nhật phiếu nhập hiện có
        receiptsData[editingId] = { ...receiptsData[editingId], ...receiptData };
        alert('Phiếu nhập đã được cập nhật!');
    } else {
        // Tạo phiếu nhập mới
        receiptsData[receiptData.code] = receiptData;
        alert('Phiếu nhập đã được tạo!');
    }
    
    updateReceiptsTable();
    hideReceiptModal();
}

// ===== QUẢN LÝ TỒN KHO VÀ BÁO CÁO =====

// Dữ liệu tồn kho mẫu (đồng bộ với sampleProducts)
const inventoryData = {
    'SKU001': {
        code: 'SKU001',
        name: 'Naruto Sage Mode',
        category: 'naruto',
        currentStock: 126, // Tồn đầu 125 + nhập 1 (PN001 completed) = 126
        lastImport: { date: '25/10/2025', quantity: 1 },
        lastExport: { date: '', quantity: 0 },
        threshold: 50,
        reorderLevel: 30,
        history: [
            { date: '25/10/2025', type: 'import', quantity: 1, note: 'Phiếu nhập PN001 - Lô hàng tháng 10 (Hoàn thành)' }
        ]
    },
    'SKU002': {
        code: 'SKU002',
        name: 'Tanjiro Kamado',
        category: 'demon-slayer',
        currentStock: 92, // Tồn đầu 91 + nhập 1 (PN001 completed) = 92
        lastImport: { date: '25/10/2025', quantity: 1 },
        lastExport: { date: '', quantity: 0 },
        threshold: 40,
        reorderLevel: 25,
        history: [
            { date: '25/10/2025', type: 'import', quantity: 1, note: 'Phiếu nhập PN001 - Lô hàng tháng 10 (Hoàn thành)' }
        ]
    },
    'SKU003': {
        code: 'SKU003',
        name: 'Raiden Shogun',
        category: 'genshin',
        currentStock: 47, // Tồn đầu 47 + nhập 1 (PN001) - xuất 1 (ORDER003 delivered) = 47
        lastImport: { date: '25/10/2025', quantity: 1 },
        lastExport: { date: '24/10/2025', quantity: 1 },
        threshold: 30,
        reorderLevel: 20,
        history: [
            { date: '24/10/2025', type: 'export', quantity: 1, note: 'Đơn hàng ORDER003 - Lê Văn C (Đã giao thành công)' },
            { date: '25/10/2025', type: 'import', quantity: 1, note: 'Phiếu nhập PN001 - Lô hàng tháng 10 (Hoàn thành)' }
        ]
    },
    'SKU004': {
        code: 'SKU004',
        name: 'Miku Racing',
        category: 'miku',
        currentStock: 1, // Tồn đầu 1, không có giao dịch hoàn thành = 1
        lastImport: { date: '', quantity: 0 },
        lastExport: { date: '', quantity: 0 },
        threshold: 15,
        reorderLevel: 10,
        history: [
            // Không có giao dịch nào hoàn thành
        ]
    },
    'SKU005': {
        code: 'SKU005',
        name: 'Nezuko Demon Form',
        category: 'demon-slayer',
        currentStock: 80, // Tồn đầu 80, không có giao dịch hoàn thành = 80
        lastImport: { date: '', quantity: 0 },
        lastExport: { date: '', quantity: 0 },
        threshold: 35,
        reorderLevel: 20,
        history: [
            // Không có giao dịch nào hoàn thành
        ]
    }
};

// Tìm kiếm sản phẩm trong tồn kho
function searchInventory(query) {
    const rows = document.querySelectorAll('#inventoryTableBody tr');
    const searchTerm = query.toLowerCase();
    
    rows.forEach(row => {
        const productCode = row.cells[0]?.textContent.toLowerCase() || '';
        const productName = row.cells[1]?.textContent.toLowerCase() || '';
        const category = row.querySelector('.category-badge')?.textContent.toLowerCase() || '';
        
        if (productCode.includes(searchTerm) || 
            productName.includes(searchTerm) || 
            category.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Lọc tồn kho theo loại sản phẩm
function filterInventoryByCategory(category) {
    const rows = document.querySelectorAll('#inventoryTableBody tr');
    
    rows.forEach(row => {
        const rowCategory = row.getAttribute('data-category');
        if (!category || rowCategory === category) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Cập nhật tồn kho theo thời điểm
function updateInventoryByDate(date) {
    if (!date) return;
    
    console.log(`Cập nhật tồn kho tại thời điểm: ${date}`);
    // Ở đây có thể gọi API để lấy dữ liệu tồn kho tại thời điểm cụ thể
    alert(`Đã cập nhật tồn kho tại ngày ${new Date(date).toLocaleDateString('vi-VN')}`);
}

// Làm mới dữ liệu tồn kho
function refreshInventory() {
    document.getElementById('productSearch').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('inventoryDate').value = '';
    
    // Hiển thị lại tất cả rows
    const rows = document.querySelectorAll('#inventoryTableBody tr');
    rows.forEach(row => row.style.display = '');
    
    console.log('Đã làm mới dữ liệu tồn kho');
    alert('Đã làm mới dữ liệu tồn kho!');
}

// Tạo báo cáo nhập-xuất-tồn nâng cao
function generateInventoryReport() {
    const dateFromInput = document.getElementById('reportDateFrom');
    const dateToInput = document.getElementById('reportDateTo');
    
    // SỬA Ở ĐÂY: Đọc 'data-iso-value'
    const dateFrom = dateFromInput.getAttribute('data-iso-value') || dateFromInput.value;
    const dateTo = dateToInput.getAttribute('data-iso-value') || dateToInput.value;
    
    if (!dateFrom || !dateTo || !dateFromInput.getAttribute('data-iso-value')) {
        // Nếu không chọn ngày, hiển thị báo cáo tổng quan
        updateSummaryStats();
        return;
    }
    
    // Tính toán thống kê trong khoảng thời gian
    let totalImport = 0;
    let totalExport = 0;
    let currentStock = 0;
    let lowStockCount = 0;
    const reportDetails = [];
    
    Object.values(inventoryData).forEach(product => {
        // Lọc lịch sử trong khoảng thời gian
        const filteredHistory = product.history.filter(record => {
            const recordDate = new Date(record.date.split('/').reverse().join('-'));
            const fromDate = new Date(dateFrom);
            const toDate = new Date(dateTo);
            return recordDate >= fromDate && recordDate <= toDate;
        });
        
        let productImport = 0;
        let productExport = 0;
        
        // Tính tổng nhập và xuất cho sản phẩm này
        filteredHistory.forEach(record => {
            if (record.type === 'import') {
                productImport += record.quantity;
                totalImport += record.quantity;
            } else if (record.type === 'export') {
                productExport += record.quantity;
                totalExport += record.quantity;
            }
        });
        
        currentStock += product.currentStock;
        
        // Đếm sản phẩm sắp hết hàng
        if (product.currentStock <= product.threshold) {
            lowStockCount++;
        }
        
        // Thêm vào báo cáo chi tiết nếu có hoạt động
        if (productImport > 0 || productExport > 0) {
            reportDetails.push({
                code: product.code,
                name: product.name,
                import: productImport,
                export: productExport,
                currentStock: product.currentStock
            });
        }
    });
    
    // Cập nhật UI báo cáo
    document.getElementById('totalImport').textContent = totalImport;
    document.getElementById('totalExport').textContent = totalExport;
    document.getElementById('currentStock').textContent = currentStock;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    
    // Hiển thị báo cáo chi tiết
    showDetailedReport(dateFrom, dateTo, reportDetails, {
        totalImport,
        totalExport,
        currentStock,
        lowStockCount
    });
}

// Hiển thị báo cáo chi tiết
function showDetailedReport(dateFrom, dateTo, details, summary) {
    let reportHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 800px; margin: 50px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <h3>📊 Báo cáo nhập-xuất-tồn</h3>
            <div style="margin-bottom: 20px;">
                <strong>Thời gian:</strong> ${new Date(dateFrom).toLocaleDateString('vi-VN')} - ${new Date(dateTo).toLocaleDateString('vi-VN')}
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 20px;">
                <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${summary.totalImport}</div>
                    <div style="color: #666;">Tổng nhập</div>
                </div>
                <div style="background: #fce8e8; padding: 15px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${summary.totalExport}</div>
                    <div style="color: #666;">Tổng xuất</div>
                </div>
                <div style="background: #e8f4fd; padding: 15px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #007bff;">${summary.currentStock}</div>
                    <div style="color: #666;">Tồn hiện tại</div>
                </div>
                <div style="background: #fff3cd; padding: 15px; border-radius: 6px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #856404;">${summary.lowStockCount}</div>
                    <div style="color: #666;">Cảnh báo</div>
                </div>
            </div>
            
            <h4>Chi tiết theo sản phẩm:</h4>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f5f5f5;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mã SP</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tên sản phẩm</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Nhập</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Xuất</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Tồn</th>
                    </tr>
                </thead>
                <tbody>
    `;

    if (details.length === 0) {
        reportHTML += `
            <tr>
                <td colspan="5" style="border: 1px solid #ddd; padding: 20px; text-align: center; color: #666;">
                    Không có hoạt động nhập/xuất trong khoảng thời gian này
                </td>
            </tr>
        `;
    } else {
        details.forEach(item => {
            reportHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.code}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: #28a745;">${item.import}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; color: #dc3545;">${item.export}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.currentStock}</td>
                </tr>
            `;
        });
    }

    reportHTML += `
                </tbody>
            </table>
            <div style="margin-top: 20px; text-align: center;">
                <button onclick="document.body.removeChild(this.parentElement.parentElement); document.body.style.overflow='auto';" 
                        style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
                    Đóng báo cáo
                </button>
            </div>
        </div>
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;" 
             onclick="document.body.removeChild(this); document.body.style.overflow='auto';"></div>
    `;

    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.zIndex = '1001';
    modal.innerHTML = reportHTML;
    document.body.style.overflow = 'hidden';
    document.body.appendChild(modal);

    console.log(`Báo cáo từ ${dateFrom} đến ${dateTo}:`, summary);
}

// Cập nhật thống kê tổng quan
function updateSummaryStats() {
    let totalImport = 0;
    let totalExport = 0;
    let currentStock = 0;
    let lowStockCount = 0;

    Object.values(inventoryData).forEach(product => {
        // Tính tổng từ lịch sử
        product.history.forEach(record => {
            if (record.type === 'import') {
                totalImport += record.quantity;
            } else if (record.type === 'export') {
                totalExport += record.quantity;
            }
        });

        currentStock += product.currentStock;
        
        if (product.currentStock <= product.threshold) {
            lowStockCount++;
        }
    });

    document.getElementById('totalImport').textContent = totalImport;
    document.getElementById('totalExport').textContent = totalExport;
    document.getElementById('currentStock').textContent = currentStock;
    document.getElementById('lowStockCount').textContent = lowStockCount;
}

// Nhập hàng nhanh
function quickRestock(productCode) {
    const product = inventoryData[productCode];
    if (!product) return;
    
    const quantity = prompt(`Nhập số lượng cần bổ sung cho ${product.name}:`, '50');
    if (quantity && !isNaN(quantity) && parseInt(quantity) > 0) {
        const newQuantity = parseInt(quantity);
        
        // Cập nhật tồn kho
        product.currentStock += newQuantity;
        product.lastImport = {
            date: new Date().toLocaleDateString('vi-VN'),
            quantity: newQuantity
        };
        
        // Thêm vào lịch sử
        product.history.push({
            date: new Date().toLocaleDateString('vi-VN'),
            type: 'import',
            quantity: newQuantity,
            note: 'Nhập nhanh từ cảnh báo'
        });
        
        // Cập nhật UI (trong thực tế sẽ reload data)
        updateInventoryDisplay();
        
        alert(`Đã nhập ${newQuantity} sản phẩm ${product.name}. Tồn kho hiện tại: ${product.currentStock}`);
    }
}

// Hiển thị modal tra cứu tồn kho chi tiết (phiên bản mới)
function showStockLookup() {
    const currentTime = new Date().toLocaleString('vi-VN');
    const categoryStats = getCategoryStats();
    const totalProducts = Object.keys(inventoryData).length;
    const totalStock = Object.values(inventoryData).reduce((sum, p) => sum + p.currentStock, 0);
    const lowStockCount = Object.values(inventoryData).filter(p => p.currentStock <= p.threshold).length;

    let reportHTML = `
        <div id="stockLookupModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; overflow: hidden;" onclick="if(event.target === this) closeStockLookup()">
            <div style="background: white; border-radius: 16px; max-width: 900px; width: 90%; max-height: 85vh; overflow-y: auto; margin: 20px; display: flex; flex-direction: column;">
                <div style="background: #70c1e1; color: white; padding: 20px; border-radius: 16px 16px 0 0; position: relative; flex-shrink: 0;">
                    <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Thống kê</h2>
                    <p style="margin: 8px 0 0 0; opacity: 0.9;">Cập nhật: ${currentTime}</p>
                    <button onclick="closeStockLookup()" style="position: absolute; top: 15px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='scale(1.1)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)'">
                        ×
                    </button>
                </div>
                
                <div style="padding: 20px; flex: 1; overflow-y: auto; min-height: 0;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                        <div style="background: #B8E6B8; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #2c5530;">${totalProducts}</div>
                            <div style="color: #2c5530; margin-top: 5px; opacity: 0.8;">Tổng mặt hàng</div>
                        </div>
                        <div style="background: #91bef8; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #1c4966;">${totalStock}</div>
                            <div style="color: #1c4966; margin-top: 5px; opacity: 0.8;">Tổng tồn kho</div>
                        </div>
                        <div style="background: #fdcb46; padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 28px; font-weight: bold; color: #8B6914;">${lowStockCount}</div>
                            <div style="color: #8B6914; margin-top: 5px; opacity: 0.8;">Cần cảnh báo</div>
                        </div>
                    </div>

                    <div style="border-bottom: 2px solid #f0f0f0; margin-bottom: 20px;">
                        <div style="display: flex; gap: 4px;">
                            <button onclick="switchTab('products')" id="tab-products" style="padding: 12px 24px; border: none; background: #2f9bf3; color: white; cursor: pointer; border-radius: 12px 12px 0 0; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='#1c6ea4'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#2f9bf3'; this.style.transform='translateY(0)'">
                                Danh sách sản phẩm
                            </button>
                            <button onclick="switchTab('categories')" id="tab-categories" style="padding: 12px 24px; border: none; background: #e0e0e0; color: #666; cursor: pointer; border-radius: 12px 12px 0 0; transition: all 0.3s ease;" onmouseover="this.style.background='#d0d0d0'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#e0e0e0'; this.style.transform='translateY(0)'">
                                Thống kê theo loại
                            </button>
                            <button onclick="switchTab('dateStats')" id="tab-dateStats" style="padding: 12px 24px; border: none; background: #e0e0e0; color: #666; cursor: pointer; border-radius: 12px 12px 0 0; transition: all 0.3s ease;" onmouseover="this.style.background='#d0d0d0'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#e0e0e0'; this.style.transform='translateY(0)'">
                                Thống kê theo ngày
                            </button>
                            <button onclick="switchTab('history')" id="tab-history" style="padding: 12px 24px; border: none; background: #e0e0e0; color: #666; cursor: pointer; border-radius: 12px 12px 0 0; transition: all 0.3s ease;" onmouseover="this.style.background='#d0d0d0'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='#e0e0e0'; this.style.transform='translateY(0)'">
                                Lịch sử thay đổi
                            </button>
                        </div>
                    </div>

                    <div id="products-tab" style="display: block;">
                        <div style="margin-bottom: 15px;">
                            <input type="text" id="lookup-search" placeholder="Tìm sản phẩm..." 
                                   style="width: 100%; padding: 12px 20px; border: 2px solid #e0e0e0; border-radius: 25px; font-size: 14px; outline: none; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                                   onkeyup="filterLookupTable(this.value)" onfocus="this.style.borderColor='#2f9bf3'; this.style.boxShadow='0 4px 12px rgba(47, 155, 243, 0.3)'" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'">
                        </div>
                        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 6px;">
                            <table id="lookup-products-table" style="width: 100%; border-collapse: collapse;">
                                <thead style="background: #f8f9fa; position: sticky; top: 0;">
                                    <tr>
                                        <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: left; font-weight: 600;">Mã SP</th>
                                        <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: left; font-weight: 600;">Tên sản phẩm</th>
                                        <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: center; font-weight: 600;">Loại</th>
                                        <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: center; font-weight: 600;">Tồn kho</th>
                                        <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: center; font-weight: 600;">Ngưỡng</th>
                                        <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: center; font-weight: 600;">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>`;

    Object.values(inventoryData).forEach(product => {
        const status = getStockStatus(product);
        reportHTML += `
            <tr style="border-bottom: 1px solid #f0f0f0;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                <td style="padding: 12px; font-weight: 600; color: #333;">${product.code}</td>
                <td style="padding: 12px; color: #555;">${product.name}</td>
                <td style="padding: 12px; text-align: center;">
                    <span style="background: ${getCategoryColor(product.category).bg}; color: ${getCategoryColor(product.category).color}; padding: 6px 12px; border-radius: 8px !important; font-size: 12px; font-weight: 600; display: inline-block; text-transform: uppercase;">
                        ${getCategoryDisplayName(product.category)}
                    </span>
                </td>
                <td style="padding: 12px; text-align: center; font-weight: 600; font-size: 16px;">${product.currentStock}</td>
                <td style="padding: 12px; text-align: center; color: #666;">${product.threshold}</td>
                <td style="padding: 12px; text-align: center;">
                    <span style="background: ${status.color}15; color: ${status.color}; padding: 6px 12px; border-radius: 8px !important; font-size: 12px; font-weight: 600; display: inline-block; text-transform: uppercase;">
                        ${status.text}
                    </span>
                </td>
            </tr>
        `;
    });

    reportHTML += `
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div id="categories-tab" style="display: none;">
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; min-height: 200px;">`;

    Object.entries(categoryStats).forEach(([category, stats]) => {
        const percentage = totalStock > 0 ? ((stats.totalStock / totalStock) * 100).toFixed(1) : 0;
        const categoryColors = {
            'naruto': 'linear-gradient(135deg, #ff9a6b 0%, #ff8a50 100%)',
            'demon-slayer': 'linear-gradient(135deg, #e8667e 0%, #e04e73 100%)', 
            'genshin': 'linear-gradient(135deg, #8b9bf8 0%, #7a8df0 100%)',
            'miku': 'linear-gradient(135deg, #4fb3d9 0%, #3ba7d1 100%)'
        };
        const cardBackground = categoryColors[category] || 'linear-gradient(135deg, #f5a3d0 0%, #f0a0cc 100%)';
        
        reportHTML += `
            <div style="border: 2px solid #e0e0e0; border-radius: 16px; padding: 20px; background: ${cardBackground}; color: white; display: flex; flex-direction: column; justify-content: space-between;">
                <h4 style="margin: 0 0 20px 0; font-size: 18px; text-align: center;">${getCategoryDisplayName(category)}</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="text-align: center;">
                        <div style="font-size: 28px; font-weight: bold;">${stats.count}</div>
                        <div style="opacity: 0.9; font-size: 14px;">Mặt hàng</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 28px; font-weight: bold;">${stats.totalStock}</div>
                        <div style="opacity: 0.9; font-size: 14px;">Tồn kho</div>
                    </div>
                </div>
                <div style="text-align: center;">
                    <button onclick="showCategoryDetails('${category}')" style="background: rgba(255,255,255,0.9); color: #333; padding: 8px 16px; border: none; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(255,255,255,1)'; this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.9)'; this.style.transform='scale(1)'; this.style.boxShadow='none'">
                        Xem chi tiết
                    </button>
                </div>
            </div>
        `;
    });

    reportHTML += `
                        </div>
                    </div>

                    <div id="dateStats-tab" style="display: none;">
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; gap: 12px; align-items: end;">
                                <div class="filter-item">
                                    <label>Từ ngày:</label>
                                    <div class="date-input-wrapper">
                                        <input type="text" id="dateStats-from" placeholder="ngày/tháng/năm" 
                                               onkeydown="handleDateKeydown(this, event); handleDateEnter(this, event)"
                                               onblur="formatAndValidateDate(this)"
                                               title="Nhập dd/mm/yyyy, nhấn Enter để xác nhận">
                                        <span class="calendar-icon" onclick="openDatePicker('dateStats-from')" title="Chọn ngày từ lịch">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                                                <rect x="3" y="4" width="18" height="15" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div class="filter-item">
                                    <label>Đến ngày:</label>
                                    <div class="date-input-wrapper">
                                        <input type="text" id="dateStats-to" placeholder="ngày/tháng/năm" 
                                               onkeydown="handleDateKeydown(this, event); handleDateEnter(this, event)"
                                               onblur="formatAndValidateDate(this)"
                                               title="Nhập dd/mm/yyyy, nhấn Enter để xác nhận">
                                        <span class="calendar-icon" onclick="openDatePicker('dateStats-to')" title="Chọn ngày từ lịch">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;">
                                                <rect x="3" y="4" width="18" height="15" rx="2" ry="2"></rect>
                                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                                <line x1="3" y1="10" x2="21" y2="10"></line>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button onclick="filterByDateRange()" style="padding: 10px 16px; background: #2f9bf3; color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='#1c6ea4'" onmouseout="this.style.background='#2f9bf3'">
                                        Lọc
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div id="dateStats-result" style="display: none;">
                            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                                    <div style="text-align: center;">
                                        <div id="dateStats-imports" style="font-size: 28px; font-weight: bold; color: #28a745;">0</div>
                                        <div style="color: #666; font-size: 14px; margin-top: 4px;">Lượt nhập</div>
                                    </div>
                                    <div style="text-align: center;">
                                        <div id="dateStats-exports" style="font-size: 28px; font-weight: bold; color: #dc3545;">0</div>
                                        <div style="color: #666; font-size: 14px; margin-top: 4px;">Lượt xuất</div>
                                    </div>
                                    <div style="text-align: center;">
                                        <div id="dateStats-total" style="font-size: 28px; font-weight: bold; color: #2f9bf3;">0</div>
                                        <div style="color: #666; font-size: 14px; margin-top: 4px;">Tổng giao dịch</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="max-height: 400px; overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 6px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <thead style="background: #f8f9fa; position: sticky; top: 0;">
                                        <tr>
                                            <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: left; font-weight: 600;">Ngày</th>
                                            <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: left; font-weight: 600;">Sản phẩm</th>
                                            <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: center; font-weight: 600;">Loại GD</th>
                                            <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: center; font-weight: 600;">Số lượng</th>
                                            <th style="padding: 12px; border-bottom: 2px solid #e0e0e0; text-align: left; font-weight: 600;">Ghi chú</th>
                                        </tr>
                                    </thead>
                                    <tbody id="dateStats-tbody">
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div id="dateStats-empty" style="text-align: center; padding: 60px 20px; color: #999;">

                            <p style="font-size: 16px; margin: 0;">Chọn khoảng thời gian để xem thống kê</p>
                        </div>
                    </div>

                    <div id="history-tab" style="display: none;">
                        <p style="color: #666; margin-bottom: 20px;">Lịch sử nhập-xuất gần đây (7 ngày qua)</p>
                        <div style="max-height: 400px; overflow-y: auto;">`;

    // Tạo lịch sử gần đây từ tất cả sản phẩm
    let allHistory = [];
    Object.values(inventoryData).forEach(product => {
        product.history.forEach(record => {
            allHistory.push({
                ...record,
                productCode: product.code,
                productName: product.name
            });
        });
    });

    // Sắp xếp theo ngày (mới nhất trước)
    allHistory.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB - dateA;
    });

    // Chỉ lấy 20 record gần nhất
    allHistory.slice(0, 20).forEach(record => {
        const isImport = record.type === 'import';
        reportHTML += `
            <div style="display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #f0f0f0; border-left: 4px solid ${isImport ? '#28a745' : '#dc3545'};">
                <div style="width: 40px; height: 40px; border-radius: 50%; background: ${isImport ? '#28a745' : '#dc3545'}15; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                    <span style="font-size: 18px;">${isImport ? '📥' : '📤'}</span>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #333; margin-bottom: 4px;">
                        ${record.productCode} - ${record.productName}
                    </div>
                    <div style="color: #666; font-size: 14px;">
                        ${isImport ? 'Nhập' : 'Xuất'} ${record.quantity} sản phẩm • ${record.date}
                    </div>
                    ${record.note ? `<div style="color: #888; font-size: 12px; margin-top: 2px;">${record.note}</div>` : ''}
                </div>
                <div style="text-align: right; color: ${isImport ? '#28a745' : '#dc3545'}; font-weight: 600;">
                    ${isImport ? '+' : '-'}${record.quantity}
                </div>
            </div>
        `;
    });

    reportHTML += `
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', reportHTML);
    document.body.style.overflow = 'hidden';
}

// Đóng modal tra cứu
function closeStockLookup() {
    const modal = document.getElementById('stockLookupModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Hiển thị chi tiết các mặt hàng theo loại
function showCategoryDetails(category) {
    const categoryName = getCategoryDisplayName(category);
    const categoryProducts = Object.values(inventoryData).filter(product => product.category === category);
    
    // Tạo modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal';
    modalOverlay.id = 'categoryDetailModal';
    modalOverlay.style.display = 'block';
    modalOverlay.style.zIndex = '1002';
    
    // Thêm sự kiện click để đóng modal khi click vào overlay
    modalOverlay.onclick = function(event) {
        if (event.target === modalOverlay) {
            closeCategoryDetail();
        }
    };
    
    // Tạo modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.maxWidth = '800px';

    let detailHTML = `
        <div class="modal-header">
            <h2>Chi tiết tồn kho - ${categoryName}</h2>
            <span class="close" onclick="closeCategoryDetail()">&times;</span>
        </div>
        
        <div class="modal-form">
            <div style="margin-bottom: 20px; padding: 10px 15px; background: #f8f9fa; border-radius: 6px;">
                <span style="color: #6c757d; font-size: 14px; font-weight: 500;">Tổng ${categoryProducts.length} sản phẩm trong danh mục</span>
            </div>
            
            <div style="max-height: 500px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 6px;">
                <table class="data-table" style="width: 100%; margin: 0;">
                    <thead style="background: #f8f9fa; position: sticky; top: 0; z-index: 1;">
                        <tr>
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600; color: #495057;">Mã SP</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6; font-weight: 600; color: #495057;">Tên sản phẩm</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6; font-weight: 600; color: #495057;">Tồn kho</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6; font-weight: 600; color: #495057;">Ngưỡng</th>
                            <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6; font-weight: 600; color: #495057;">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>`;

    categoryProducts.forEach((product, index) => {
        const status = getStockStatus(product);
        const bgColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
        detailHTML += `
            <tr style="background: ${bgColor}; transition: background 0.2s;" onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='${bgColor}'">
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6; font-family: 'Courier New', monospace; color: #495057; font-weight: 600;">${product.code}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6; color: #212529;">${product.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6; text-align: center; font-weight: 700; font-size: 16px; color: ${status.color};">${product.currentStock}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6; text-align: center; color: #6c757d;">${product.threshold}</td>
                <td style="padding: 12px; border-bottom: 1px solid #dee2e6; text-align: center;">
                    <span style="background: ${status.color}15; color: ${status.color}; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                        ${status.text}
                    </span>
                </td>
            </tr>`;
    });

    detailHTML += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    modalContent.innerHTML = detailHTML;
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';
}

// Đóng modal chi tiết loại
function closeCategoryDetail() {
    const modal = document.getElementById('categoryDetailModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Chuyển đổi tab
function switchTab(tabName) {
    // Ẩn tất cả tab content
    document.getElementById('products-tab').style.display = 'none';
    document.getElementById('categories-tab').style.display = 'none';
    document.getElementById('dateStats-tab').style.display = 'none';
    document.getElementById('history-tab').style.display = 'none';

    // Reset tất cả tab buttons về trạng thái inactive
    const allTabs = ['products', 'categories', 'dateStats', 'history'];
    allTabs.forEach(tab => {
        const button = document.getElementById('tab-' + tab);
        button.style.background = '#e0e0e0';
        button.style.color = '#666';
        button.style.transform = 'translateY(0)';
        // Reset hover effects cho inactive tabs
        button.onmouseover = function() {
            if (this.style.background === 'rgb(224, 224, 224)') { // inactive tab
                this.style.background = '#d0d0d0';
                this.style.transform = 'translateY(-2px)';
            }
        };
        button.onmouseout = function() {
            if (this.style.background === 'rgb(208, 208, 208)') { // was hovered inactive
                this.style.background = '#e0e0e0';
                this.style.transform = 'translateY(0)';
            }
        };
    });

    // Hiển thị tab được chọn và set active style
    document.getElementById(tabName + '-tab').style.display = 'block';
    const activeButton = document.getElementById('tab-' + tabName);
    activeButton.style.background = '#2f9bf3';
    activeButton.style.color = 'white';
    activeButton.style.transform = 'translateY(0)';
    
    // Set hover effects cho active tab
    activeButton.onmouseover = function() {
        this.style.background = '#1c6ea4';
        this.style.transform = 'translateY(-2px)';
    };
    activeButton.onmouseout = function() {
        this.style.background = '#2f9bf3';
        this.style.transform = 'translateY(0)';
    };
}

// Lọc theo khoảng ngày
function filterByDateRange() {
    const fromInput = document.getElementById('dateStats-from');
    const toInput = document.getElementById('dateStats-to');
    
    if (!fromInput || !toInput) return;
    
    const fromDateStr = fromInput.value.trim();
    const toDateStr = toInput.value.trim();
    
    if (!fromDateStr || !toDateStr) {
        alert('Vui lòng nhập đầy đủ khoảng thời gian');
        return;
    }
    
    // Chuyển đổi dd/mm/yyyy sang Date object
    const fromParts = fromDateStr.split('/');
    const toParts = toDateStr.split('/');
    
    if (fromParts.length !== 3 || toParts.length !== 3) {
        alert('Định dạng ngày không hợp lệ. Vui lòng nhập theo định dạng ngày/tháng/năm');
        return;
    }
    
    const startDate = new Date(fromParts[2], fromParts[1] - 1, fromParts[0]);
    const endDate = new Date(toParts[2], toParts[1] - 1, toParts[0]);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Ngày không hợp lệ');
        return;
    }
    
    if (startDate > endDate) {
        alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        return;
    }
    
    // Lọc lịch sử theo khoảng ngày
    let filteredHistory = [];
    let importCount = 0;
    let exportCount = 0;
    
    Object.values(inventoryData).forEach(product => {
        product.history.forEach(record => {
            // Chuyển đổi dd/mm/yyyy sang Date
            const dateParts = record.date.split('/');
            const recordDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            
            if (recordDate >= startDate && recordDate <= endDate) {
                filteredHistory.push({
                    ...record,
                    productCode: product.code,
                    productName: product.name,
                    dateObj: recordDate
                });
                
                if (record.type === 'import') {
                    importCount++;
                } else {
                    exportCount++;
                }
            }
        });
    });
    
    // Sắp xếp theo ngày (mới nhất trước)
    filteredHistory.sort((a, b) => b.dateObj - a.dateObj);
    
    // Cập nhật thống kê
    document.getElementById('dateStats-imports').textContent = importCount;
    document.getElementById('dateStats-exports').textContent = exportCount;
    document.getElementById('dateStats-total').textContent = importCount + exportCount;
    
    // Hiển thị kết quả
    const tbody = document.getElementById('dateStats-tbody');
    tbody.innerHTML = '';
    
    if (filteredHistory.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: #999;">
                    <div style="font-size: 36px; margin-bottom: 10px;">📭</div>
                    <div>Không có giao dịch nào trong khoảng thời gian này</div>
                </td>
            </tr>
        `;
    } else {
        filteredHistory.forEach((record, index) => {
            const isImport = record.type === 'import';
            const bgColor = index % 2 === 0 ? 'white' : '#f8f9fa';
            
            tbody.innerHTML += `
                <tr style="background: ${bgColor}; border-bottom: 1px solid #f0f0f0;" onmouseover="this.style.background='#e9f5ff'" onmouseout="this.style.background='${bgColor}'">
                    <td style="padding: 12px; font-weight: 500; color: #555;">${record.date}</td>
                    <td style="padding: 12px;">
                        <div style="font-weight: 600; color: #333; font-family: monospace; font-size: 13px;">${record.productCode}</div>
                        <div style="color: #666; font-size: 13px; margin-top: 2px;">${record.productName}</div>
                    </td>
                    <td style="padding: 12px; text-align: center;">
                        <span style="background: ${isImport ? '#28a745' : '#dc3545'}20; color: ${isImport ? '#28a745' : '#dc3545'}; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                            ${isImport ? 'NHẬP' : 'XUẤT'}
                        </span>
                    </td>
                    <td style="padding: 12px; text-align: center; font-weight: 700; font-size: 16px; color: ${isImport ? '#28a745' : '#dc3545'};">
                        ${isImport ? '+' : '-'}${record.quantity}
                    </td>
                    <td style="padding: 12px; color: #666; font-size: 13px;">${record.note || '-'}</td>
                </tr>
            `;
        });
    }
    
    // Hiển thị kết quả, ẩn empty state
    document.getElementById('dateStats-result').style.display = 'block';
    document.getElementById('dateStats-empty').style.display = 'none';
}

// Lọc bảng tra cứu
function filterLookupTable(searchTerm) {
    const table = document.getElementById('lookup-products-table');
    const rows = table.getElementsByTagName('tr');
    
    for (let i = 1; i < rows.length; i++) { // Bỏ qua header row
        const row = rows[i];
        const code = row.cells[0].textContent.toLowerCase();
        const name = row.cells[1].textContent.toLowerCase();
        const category = row.cells[2].textContent.toLowerCase();
        
        if (code.includes(searchTerm.toLowerCase()) || 
            name.includes(searchTerm.toLowerCase()) || 
            category.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Xuất dữ liệu Excel (demo)
function exportStockData() {
    alert('Chức năng xuất Excel sẽ được triển khai trong phiên bản tiếp theo!\n\nDữ liệu sẽ bao gồm:\n- Tồn kho theo sản phẩm\n- Thống kê theo loại\n- Lịch sử nhập/xuất');
}

// Lấy trạng thái tồn kho
function getStockStatus(product) {
    if (product.currentStock === 0) {
        return { text: 'Hết hàng', color: '#dc3545' };
    } else if (product.currentStock <= product.reorderLevel) {
        return { text: 'Cần nhập ', color: '#dc3545' };
    } else if (product.currentStock <= product.threshold) {
        return { text: 'Sắp hết', color: '#ffc107' };
    } else {
        return { text: 'Đủ hàng', color: '#28a745' };
    }
}

// Thống kê theo loại
function getCategoryStats() {
    const stats = {};
    Object.values(inventoryData).forEach(product => {
        if (!stats[product.category]) {
            stats[product.category] = {
                count: 0,
                totalStock: 0,
                lowStockCount: 0
            };
        }
        stats[product.category].count++;
        stats[product.category].totalStock += product.currentStock;
        if (product.currentStock <= product.threshold) {
            stats[product.category].lowStockCount++;
        }
    });

    // Thêm status cho mỗi category
    Object.keys(stats).forEach(category => {
        const catStats = stats[category];
        if (catStats.totalStock === 0) {
            catStats.status = { text: 'Hết hàng', color: '#dc3545' };
        } else if (catStats.lowStockCount > catStats.count / 2) {
            catStats.status = { text: 'Cần nhập', color: '#fd7e14' };
        } else if (catStats.lowStockCount > 0) {
            catStats.status = { text: 'Theo dõi', color: '#ffc107' };
        } else {
            catStats.status = { text: 'ĐỦ HÀNG', color: '#28a745' };
        }
    });

    return stats;
}

// Lấy tên hiển thị của loại sản phẩm
function getCategoryDisplayName(category) {
    const names = {
        'naruto': 'NARUTO',
        'demon-slayer': 'DEMON SLAYER',
        'genshin': 'GENSHIN IMPACT',
        'miku': 'HATSUNE MIKU'
    };
    return names[category] || category;
}

// Lấy màu sắc cho từng loại sản phẩm
function getCategoryColor(category) {
    const colors = {
        'naruto': { bg: '#ffccbb', color: '#8b4513' },
        'demon-slayer': { bg: '#ffcccc', color: '#8b0000' },
        'genshin': { bg: '#cce5ff', color: '#1e40af' },
        'miku': { bg: '#ccf5f2', color: '#0d7377' }
    };
    return colors[category] || { bg: '#f8f9fa', color: '#343a40' };
}

// Cập nhật hiển thị tồn kho (re-render bảng từ dữ liệu inventoryData)
function updateInventoryDisplay() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    let rowsHtml = '';
    Object.values(inventoryData).forEach(product => {
        const status = getStockStatus(product);
        // map status color/text to small classes used in markup
        let statusClass = 'good';
        if (status.text === 'Hết hàng') statusClass = 'danger';
        else if (status.text === 'Cần nhập' || status.text === 'Sắp hết') statusClass = 'warning';

        rowsHtml += `
            <tr data-category="${product.category}" data-stock="${product.currentStock}">
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td><span class="badge-sm ${product.category}">${getCategoryDisplayName(product.category)}</span></td>
                <td class="stock-qty ${statusClass}">${product.currentStock}</td>
                <td><span class="status-sm ${statusClass}">${status.text}</span></td>
                <td><button class="btn-sm ${statusClass === 'danger' ? 'danger' : ''}" onclick="quickRestock('${product.code}')">Nhập</button></td>
            </tr>
        `;
    });

    tbody.innerHTML = rowsHtml;

    // Cập nhật summary và category list
    updateSummaryStats();

    const categoryStats = getCategoryStats();
    const categoryRows = document.querySelectorAll('#inventory-page .category-list-compact .category-row');
    categoryRows.forEach(row => {
        const badge = row.querySelector('.badge-sm');
        if (!badge) return;
        const cat = badge.className.split(' ').find(c => c !== 'badge-sm');
        if (cat && categoryStats[cat]) {
            const countEl = row.querySelector('.count');
            if (countEl) countEl.textContent = categoryStats[cat].totalStock;
            const statusEl = row.querySelector('.status-xs');
            if (statusEl) {
                statusEl.textContent = categoryStats[cat].status.text;
                // Cập nhật class CSS dựa trên trạng thái
                statusEl.className = 'status-xs';
                if (categoryStats[cat].status.text === 'Hết hàng') {
                    statusEl.classList.add('danger');
                } else if (categoryStats[cat].status.text === 'Cần nhập' || categoryStats[cat].status.text === 'Theo dõi') {
                    statusEl.classList.add('warning');
                } else if (categoryStats[cat].status.text === 'ĐỦ HÀNG') {
                    statusEl.classList.add('good');
                }
            }
        }
    });

    // Cập nhật alert list (đơn giản: rebuild từ sản phẩm dưới ngưỡng)
    const alertList = document.querySelector('#inventory-page .alert-list-compact');
    if (alertList) {
        let alertHtml = '';
        Object.values(inventoryData).forEach(p => {
            const s = getStockStatus(p);
            if (s.text === 'Hết hàng' || s.text === 'Cần nhập gấp' || s.text === 'Sắp hết') {
                const btnClass = s.text === 'Hết hàng' ? 'urgent' : '';
                alertHtml += `
                    <div class="alert-item-sm ${s.text === 'Hết hàng' ? 'danger' : (s.text === 'Sắp hết' ? 'warning' : 'warning')}">
                        <span class="alert-text">${p.code}: ${p.currentStock} còn lại</span>
                        <button class="btn-xs ${btnClass}" onclick="quickRestock('${p.code}')">Nhập</button>
                    </div>
                `;
            }
        });
        alertList.innerHTML = alertHtml;
    }

    console.log('Cập nhật hiển thị tồn kho');
}

// Thiết lập ngày mặc định cho báo cáo (30 ngày gần nhất)
function setDefaultReportDates() {
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    document.getElementById('reportDateFrom').value = monthAgo.toISOString().split('T')[0];
    document.getElementById('reportDateTo').value = today.toISOString().split('T')[0];
    document.getElementById('inventoryDate').value = today.toISOString().split('T')[0];
}

// Khởi tạo hệ thống nhập ngày đơn giản
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo các input ngày
    const dateInputs = document.querySelectorAll('#receiptDateFrom, #receiptDateTo');
    dateInputs.forEach(input => {
        if (input) {
            // Thêm event listener để xử lý paste
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const paste = e.clipboardData.getData('text');
                const numbersOnly = paste.replace(/[^\d]/g, '');
                if (numbersOnly.length >= 8) {
                    // Format paste data ddmmyyyy
                    const formatted = numbersOnly.substring(0, 2) + '/' + 
                                    numbersOnly.substring(2, 4) + '/' + 
                                    numbersOnly.substring(4, 8);
                    this.value = formatted;
                    convertDateFormat(this);
                } else {
                    // Paste ngắn hơn, để user tiếp tục nhập
                    this.value = numbersOnly;
                    handleDateInput(this);
                }
            });
        }
    });
    
    // Thêm placeholder mặc định cho các input giá
    const priceInputs = document.querySelectorAll('#priceFrom, #priceTo');
    priceInputs.forEach(input => {
        if (input) input.setAttribute('data-original-title', input.title || '');
    });
    
    console.log('✅ Hệ thống nhập ngày đơn giản đã khởi tạo');
    console.log(' Cách sử dụng:');
    console.log('   1️⃣ Nhập 2 số đầu → tự động thêm /');
    console.log('   2️⃣ Nhập 2 số tiếp → tự động thêm /');  
    console.log('   3️⃣ Nhập 4 số cuối (năm)');
    console.log('   4️⃣ Nhấn Enter để validate và áp dụng');
    console.log('   📅 Ví dụ: 25102025 → 25/10/2025');
});

// Khởi tạo màu nền dropdown khi trang load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Cập nhật dropdown lọc chính
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            updateDropdownBackground('statusFilter', statusFilter.value);
        }
        
        // Cập nhật tất cả dropdown trạng thái trong bảng
        const statusSelects = document.querySelectorAll('.status-select');
        statusSelects.forEach((select, index) => {
            const value = select.value;
            if (value) {
                // Tạo ID unique nếu chưa có
                if (!select.id) {
                    select.id = 'status-select-' + index;
                }
                updateDropdownBackground(select.id, value);
            }
        });
        
        console.log('Đã khởi tạo màu nền cho dropdown trạng thái');
    }, 100);
});