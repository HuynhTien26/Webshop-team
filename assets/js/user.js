/**
 * ===================================================================
 * MAIN.JS - POCKY DOLL
 * ===================================================================
 * Mô tả: File JavaScript chính, xử lý toàn bộ logic cho trang web:
 * - Hiển thị sản phẩm
 * - Lọc sản phẩm theo danh mục
 * - Phân trang
 * - Hiển thị chi tiết sản phẩm trong modal
 * - Xử lý giỏ hàng (demo)
 * - Hiệu ứng slider cho banner
 * - Tìm kiếm sản phẩm
 * ===================================================================
 */

// ===================================================================
// 1. DỮ LIỆU VÀ CẤU HÌNH (Data & Configuration)
// ===================================================================

/**
 * @const {Array<Object>} PRODUCTS
 * Mảng chứa thông tin của tất cả sản phẩm.
 * Mỗi sản phẩm là một object có các thuộc tính: id, name, anime, price, img, desc, size.
 */
const PRODUCTS = [
  // Trang 1
  {
    id: 1,
    name: "Kamado Tanjiro",
    anime: "Demon Slayer",
    price: 329000,
    img: "assets/img/DEMON SLAYER/Kamado Tanjiro.png",
    desc: "Tanjiro phiên bản sát quỷ đoàn có xương.",
    size: "15cm",
  },
  {
    id: 2,
    name: "Hashibira Inosuke",
    anime: "Demon Slayer",
    price: 349000,
    img: "assets/img/DEMON SLAYER/Hashibira Inosuke.png",
    desc: "Inosune phiên bản phố đèn đỏ có xương.",
    size: "15cm",
  },
  {
    id: 3,
    name: "Agatsuma Zenitsu",
    anime: "Demon Slayer",
    price: 350000,
    img: "assets/img/DEMON SLAYER/Agatsuma Zenitsu.png",
    desc: "Zenitsu ver em bé cute có xương.",
    size: "15cm",
  },
  {
    id: 4,
    name: "Uzumaki Naruto",
    anime: "Naruto",
    price: 329000,
    img: "assets/img/NARUTO/Naruto.png",
    desc: "Naruto cute có xương.",
    size: "16cm",
  },
  {
    id: 5,
    name: "Uchiha Sasuke",
    anime: "Naruto",
    price: 359000,
    img: "assets/img/NARUTO/Sasuke.png",
    desc: "Sasuke phiên bản chiến đấu có xương.",
    size: "18cm",
  },
  {
    id: 6,
    name: "Kakashi",
    anime: "Naruto",
    price: 300000,
    img: "assets/img/NARUTO/Kakashi.png",
    desc: "Kakashi nghiêm túc có xương.",
    size: "17cm",
  },
  {
    id: 7,
    name: "Miku in Wonderland",
    anime: "Hatsune Miku",
    price: 350000,
    img: "assets/img/HATSUNE MIKU/Alice in Wonderland.png",
    desc: "Miku phiên bản xứ sở thần tiên có xương.",
    size: "15cm",
  },
  {
    id: 8,
    name: "Miku Vocaloid Stage",
    anime: "Hatsune Miku",
    price: 319000,
    img: "assets/img/HATSUNE MIKU/Vocaloid Stage Ver.png",
    desc: "Miku ca sĩ thế giới ảo có xương.",
    size: "14cm",
  },
  {
    id: 9,
    name: "Miku JK",
    anime: "Hatsune Miku",
    price: 329000,
    img: "assets/img/HATSUNE MIKU/Miku 1.png",
    desc: "Miku phiên bản học sinh có xương.",
    size: "14cm",
  },

  // Trang 2
  {
    id: 10,
    name: "Shikanoin Heizou",
    anime: "Genshin Impact",
    price: 300000,
    img: "assets/img/GESHIN IMPACT/Shikanoin-Heizou.png",
    desc: "Heizou thám tử có xương.",
    size: "14cm",
  },
  {
    id: 11,
    name: "Miku Vampire",
    anime: "Hatsune Miku",
    price: 400000,
    img: "assets/img/HATSUNE MIKU/Miku 3.png",
    desc: "Miku ma cà rồng có xương.",
    size: "15cm",
  },
  {
    id: 12,
    name: "Miku Hams",
    anime: "Hatsune Miku",
    price: 369000,
    img: "assets/img/HATSUNE MIKU/Miku 4.png",
    desc: "Miku cùng người bạn Hamster có xương.",
    size: "15cm",
  },
  {
    id: 13,
    name: "Sigewinne",
    anime: "Genshin Impact",
    price: 389000,
    img: "assets/img/GESHIN IMPACT/Sigewinne.png",
    desc: "Sigewinne bản tiểu thơ đáng yêu có xương.",
    size: "17cm",
  },
  {
    id: 14,
    name: "Yae Miko",
    anime: "Genshin Impact",
    price: 269000,
    img: "assets/img/GESHIN IMPACT/Yae-Miko.png",
    desc: "Miko nữ tế đền thờ có xương.",
    size: "16cm",
  },
  {
    id: 15,
    name: "Nahida",
    anime: "Genshin Impact",
    price: 500000,
    img: "assets/img/GESHIN IMPACT/Nahida.png",
    desc: "Nahida tiểu thư quý tộc có xương.",
    size: "15cm",
  },
];

/**
 * @const {number} ITEMS_PER_PAGE
 * Số lượng sản phẩm tối đa hiển thị trên một trang.
 */
const ITEMS_PER_PAGE = 12; // Bố cục 4x3

// Biến lưu trạng thái hiện tại của trang
let currentPage = 1;
let currentCategory = "all";

// ===================================================================
// 2. LẤY CÁC PHẦN TỬ HTML (DOM Elements)
// ===================================================================
const topicsEl = document.getElementById("topics");
const gridEl = document.getElementById("grid");
const pagerEl = document.getElementById("pager");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalEl = document.getElementById("modal");
const heroTextEl = document.getElementById("heroText");
const heroCta = document.getElementById("heroCta");
const heroDots = document.getElementById("heroDots");
const searchInput = document.getElementById("searchInput");

// ===================================================================
// 3. CÁC HÀM XỬ LÝ CHÍNH
// ===================================================================

/**
 * Hiển thị các nút lọc danh mục sản phẩm.
 */
function renderTopics() {
  const CATS = [
    "Tất cả",
    "Demon Slayer",
    "Genshin Impact",
    "Hatsune Miku",
    "Naruto",
  ];
  topicsEl.innerHTML = CATS.map(
    (c) => `<button class="topic-btn" data-cat="${c}">${c}</button>`,
  ).join("");

  // Gán sự kiện click cho từng nút
  document.querySelectorAll(".topic-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      currentCategory = cat === "Tất cả" ? "all" : cat;
      currentPage = 1; // Quay về trang 1 khi lọc

      // Cập nhật trạng thái active cho nút được chọn
      document
        .querySelectorAll(".topic-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      renderProducts();
    });
  });
}

/**
 * Lấy danh sách sản phẩm đã được lọc theo danh mục hiện tại.
 * @returns {Array<Object>} Mảng sản phẩm đã được lọc.
 */
function getFilteredProducts() {
  if (currentCategory === "all") {
    return PRODUCTS.slice(); // Trả về bản sao của toàn bộ danh sách
  }
  return PRODUCTS.filter((p) => p.anime === currentCategory);
}

/**
 * Hiển thị danh sách sản phẩm ra lưới (grid) dựa trên trang và danh mục hiện tại.
 */
function renderProducts() {
  const filtered = getFilteredProducts();
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  // Đảm bảo trang hiện tại không lớn hơn tổng số trang
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const itemsOnPage = filtered.slice(start, start + ITEMS_PER_PAGE);

  gridEl.innerHTML = itemsOnPage
    .map(
      (p) => `
    <div class="card" tabindex="0" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='assets/img/placeholder.png'">
      <div class="title">${p.name}</div>
      <div class="desc">Description</div>
      <div class="row">
        <div class="price">${p.price.toLocaleString()} ₫</div>
        <button class="add-btn" data-id="${p.id}" aria-label="Thêm vào giỏ">
          <i class="fa-solid fa-bag-shopping"></i>
        </button>
      </div>
    </div>
  `,
    )
    .join("");

  // Gán lại sự kiện click cho các card sản phẩm mới được tạo
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => showDetail(+card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") showDetail(+card.dataset.id);
    });
  });

  document.querySelectorAll(".add-btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click lan ra card cha, tránh mở modal
      addToCart(+b.dataset.id);
    });
  });

  renderPager(totalPages);
}

/**
 * Hiển thị thanh phân trang.
 * @param {number} totalPages - Tổng số trang cần hiển thị.
 */
function renderPager(totalPages) {
  pagerEl.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    pagerEl.appendChild(btn);
  }
}

/**
 * Hiển thị cửa sổ modal với thông tin chi tiết của sản phẩm.
 * @param {number} id - ID của sản phẩm cần hiển thị.
 */
function showDetail(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return; // Không tìm thấy sản phẩm thì không làm gì

  modalEl.innerHTML = `
    <button class="close-round" aria-label="Đóng"></button>
    <div class="modal-left">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='img/placeholder.png'">
    </div>
    <div class="modal-right">
      <h2>${p.name}</h2>
      <h4>${p.anime}</h4>
      <div class="info">
        <p>${p.desc}</p>
        <p>Kích thước: ${p.size || "—"}</p>
      </div>
      <div class="meta">
        <div class="price">${p.price.toLocaleString()} ₫</div>
        <button class="add-btn-modal" data-id="${p.id}">
          <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
        </button>
      </div>
    </div>
  `;
  modalBackdrop.classList.add("show"); // Hiển thị modal

  // Gán các sự kiện cho modal
  modalBackdrop.onclick = (e) => {
    if (e.target === modalBackdrop) closeModal(); // Đóng khi click ra ngoài
  };
  modalEl.querySelector(".close-round").onclick = closeModal; // Đóng khi click nút X
  modalEl.querySelector(".add-btn-modal").addEventListener("click", (ev) => {
    ev.stopPropagation();
    addToCart(+ev.currentTarget.dataset.id);
  });
}

/**
 * Đóng cửa sổ modal.
 */
function closeModal() {
  modalBackdrop.classList.remove("show");
}

/**
 * Logic thêm sản phẩm vào giỏ hàng, sử dụng Local Storage để lưu trữ.
 * @param {number} id - ID của sản phẩm được thêm.
 */
function addToCart(id) {
    const productToAdd = PRODUCTS.find((x) => x.id === id);
    if (!productToAdd) return;

    // 1. Đọc giỏ hàng hiện tại từ Local Storage (Dùng key 'cartItems')
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // 2. Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cartItems.find(item => item.id === id);
    let currentQuantity = 1;

    if (existingItem) {
        // Nếu có, tăng số lượng lên 1
        existingItem.quantity += 1;
        currentQuantity = existingItem.quantity;
    } else {
        // Nếu chưa, thêm sản phẩm mới vào (với số lượng = 1 và đầy đủ data)
        cartItems.push({
            id: productToAdd.id,
            name: productToAdd.name,
            price: productToAdd.price,
            image: productToAdd.img,
            quantity: 1,
            desc: productToAdd.desc // Thêm desc để hiển thị chi tiết trong cart
        });
    }

    // 3. Lưu lại giỏ hàng vào Local Storage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    alert(`${productToAdd.name} đã được thêm vào giỏ hàng!`);
    console.log("Giỏ hàng đã lưu vào Local Storage. Số lượng:", currentQuantity);
}

/**
 * Xử lý hiệu ứng tự động trượt cho banner (hero slider).
 */
function initializeHeroSlider() {
  const HERO_TEXTS = [
    "Sản phẩm mới: Figure phiên bản giới hạn",
    "Ưu đãi hôm nay - Giảm 10% cho đơn hàng đầu tiên",
    "Mua 2 tặng 1 cho thể loại Naruto",
  ];
  let heroIndex = 0;
  const heroSlides = document.querySelectorAll(".hero-slide");

  function updateHero() {
    // Cập nhật slide ảnh
    heroSlides.forEach((s, i) => s.classList.toggle("active", i === heroIndex));
    // Cập nhật text
    if (heroTextEl) heroTextEl.textContent = HERO_TEXTS[heroIndex];
    // Cập nhật các dấu chấm điều hướng
    if (heroDots) {
      heroDots.innerHTML = HERO_TEXTS.map(
        (_, i) =>
          `<button class="${i === heroIndex ? "active" : ""}" data-i="${i}"></button>`,
      ).join("");
      heroDots.querySelectorAll("button").forEach((b) =>
        b.addEventListener("click", () => {
          heroIndex = +b.dataset.i;
          updateHero();
        }),
      );
    }
  }
  updateHero();
  setInterval(() => {
    heroIndex = (heroIndex + 1) % HERO_TEXTS.length;
    updateHero();
  }, 4000); // Tự động chuyển sau mỗi 4 giây
}

/**
 * Xử lý sự kiện nhập liệu trên thanh tìm kiếm.
 */
function initializeSearch() {
  searchInput?.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    // Lọc sản phẩm theo tên hoặc series anime
    const searchResults = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.anime.toLowerCase().includes(query),
    );

    // Hiển thị kết quả tìm kiếm (phiên bản đơn giản, không phân trang)
    renderSearchResults(searchResults);
  });
}

/**
 * Hiển thị kết quả tìm kiếm ra lưới.
 * @param {Array<Object>} list - Danh sách sản phẩm từ kết quả tìm kiếm.
 */
function renderSearchResults(list) {
  gridEl.innerHTML = list
    .map(
      (p) => `
    <div class="card" tabindex="0" data-id="${p.id}">
      <img src="${p.img}" alt="${p.name}" onerror="this.src='img/placeholder.png'">
      <div class="title">${p.name}</div>
      <div class="desc">Description</div>
      <div class="row">
        <div class="price">${p.price.toLocaleString()} ₫</div>
        <button class="add-btn" data-id="${p.id}" aria-label="Thêm vào giỏ">
          <i class="fa-solid fa-bag-shopping"></i>
        </button>
      </div>
    </div>
  `,
    )
    .join("");

  // Ẩn thanh phân trang khi đang tìm kiếm
  pagerEl.innerHTML = "";

  // Gán lại sự kiện click cho các card sản phẩm
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => showDetail(+card.dataset.id));
  });
}

// ===================================================================
// 4. KHỞI TẠO (Initialization)
// ===================================================================

/**
 * Hàm khởi tạo chính, chạy tất cả các chức năng cần thiết khi trang được tải.
 */
function initializeApp() {
  renderTopics();
  renderProducts();
  initializeHeroSlider();
  initializeSearch();

  // Đặt trạng thái active cho nút "Tất cả" ban đầu
  document
    .querySelector('.topic-btn[data-cat="Tất cả"]')
    .classList.add("active");
}

// Chạy ứng dụng
initializeApp();
