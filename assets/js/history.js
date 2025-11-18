
// Định dạng tiền tệ VND
const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
});

// ----------------------------------------------------------------------
// ⭐️ LOGIC MỚI: TẢI DỮ LIỆU TỪ LOCAL STORAGE
// ----------------------------------------------------------------------
function loadOrderHistory() {
    const historyString = localStorage.getItem('orderHistory');
    try {
        // Trả về mảng rỗng nếu không có dữ liệu
        return historyString ? JSON.parse(historyString) : [];
    } catch (e) {
        console.error("Lỗi khi đọc lịch sử đơn hàng:", e);
        return [];
    }
}
// ----------------------------------------------------------------------

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

    // Sắp xếp đơn hàng theo ngày giảm dần
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    const historyHTML = orders.map(order => {
        // Tạo HTML cho danh sách sản phẩm
        const productListHTML = order.products.map(p => `
            <li class="product-item">
                <span>${p.name} (x${p.quantity})</span>
                <small>${formatter.format(p.price * p.quantity)}</small>
            </li>
        `).join('');

        // 💥 LOGIC HIỂN THỊ THÔNG TIN GIAO HÀNG ĐÃ ĐƯỢC CẬP NHẬT 💥
        const deliveryDetailsHTML = `
            <div style="font-size: 0.9em; margin-bottom: 10px; line-height: 1.6;">
                <p style="margin: 0;">
                    Người nhận: 
                    <span style="font-weight: bold; color: var(--primary);">
                        ${order.receiverName || '---'}
                    </span>
                </p>
                <p style="margin: 0; color: var(--muted);">
                    SĐT: 
                    <span style="font-style: italic;">
                        ${order.receiverPhone || '---'}
                    </span>
                </p>
                <p style="margin: 0;">
                    Địa chỉ: 
                    ${order.deliveryAddress || order.address || '---'}
                </p>
            </div>
        `;

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

                ${deliveryDetailsHTML} 

                <ul class="product-list">
                    ${productListHTML}
                </ul>

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
    // ⭐️ GỌI HÀM MỚI ĐỂ TẢI DỮ LIỆU THỰC
    const userHistory = loadOrderHistory(); 
    renderOrderHistory(userHistory);
});