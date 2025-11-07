// Định dạng tiền tệ VND
const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
});

// --- DỮ LIỆU MÔ PHỎNG LỊCH SỬ MUA HÀNG ---
// Trong ứng dụng thực, dữ liệu này sẽ được lấy từ API hoặc Database
const mockOrderHistory = [
    {
        id: "DH1001",
        date: "2023-11-25",
        status: "completed",
        total: 2100000,
        products: [
            { name: "Doll Zenitsu Agatsuma", quantity: 2, price: 350000 },
            { name: "Áo Phông Anime", quantity: 3, price: 400000 }
        ],
        address: "Số 10, Đường ABC, Quận 1, TP. HCM"
    },
    {
        id: "DH1002",
        date: "2023-12-01",
        status: "pending",
        total: 950000,
        products: [
            { name: "Balo Vải Canvas", quantity: 1, price: 450000 },
            { name: "Móc Khóa Nezuko", quantity: 5, price: 100000 }
        ],
        address: "Số 20, Đường XYZ, Quận Hai Bà Trưng, Hà Nội"
    },
    {
        id: "DH1003",
        date: "2024-01-10",
        status: "cancelled",
        total: 1200000,
        products: [
            { name: "Mô Hình Lắp Ráp", quantity: 1, price: 1200000 }
        ],
        address: "Số 5, Ngõ 1, Quận 5, TP. HCM"
    },
];

// Hàm lấy class CSS cho trạng thái
function getStatusClass(status) {
    switch (status) {
        case 'completed': return 'status-completed';
        case 'pending': return 'status-pending';
        case 'cancelled': return 'status-cancelled';
        default: return '';
    }
}

// Hàm dịch trạng thái sang tiếng Việt
function getStatusText(status) {
    switch (status) {
        case 'completed': return 'Đã Giao Thành Công';
        case 'pending': return 'Đang Xử Lý';
        case 'cancelled': return 'Đã Hủy';
        default: return 'Không rõ';
    }
}

// Hàm render (vẽ) lịch sử đơn hàng
function renderOrderHistory(orders) {
    const container = document.getElementById('order-history-container');
    const noMessage = document.getElementById('no-history-message');

    if (!orders || orders.length === 0) {
        container.innerHTML = '';
        noMessage.style.display = 'block';
        return;
    }

    noMessage.style.display = 'none';
    
    const historyHTML = orders.map(order => {
        // Tạo HTML cho danh sách sản phẩm
        const productListHTML = order.products.map(p => `
            <li class="product-item">
                <span>${p.name} (x${p.quantity})</span>
                <small>${formatter.format(p.price * p.quantity)}</small>
            </li>
        `).join('');

        return `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Mã ĐH: ${order.id}</span>
                        &nbsp;|&nbsp;
                        <small>Ngày đặt: ${order.date}</small>
                    </div>
                    <span class="order-status ${getStatusClass(order.status)}">
                        ${getStatusText(order.status)}
                    </span>
                </div>
                
                <p style="font-size: 0.9em; margin-bottom: 5px;">
                    Địa chỉ: <span style="font-style: italic;">${order.address}</span>
                </p>

                <ul class="product-list">
                    ${productListHTML}
                </ul>
SS
                <div class="order-total">
                    Tổng tiền: <span style="color: var(--primary);">${formatter.format(order.total)}</span>
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = historyHTML;
}

// Khởi tạo khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    renderOrderHistory(mockOrderHistory);
});