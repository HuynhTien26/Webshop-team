// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(btn => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('.eye-icon');
      btn.addEventListener('click', () => {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            // Toggle Font Awesome eye / eye-slash classes
            if (icon) {
                  if (show) {
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                  } else {
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                  }
            }
      });
});

// Initialize accounts with default one
const defaultAccount = { username: 'khachhang1', password: '123456' };
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
if (!accounts.find(acc => acc.username === defaultAccount.username)) {
  accounts.push(defaultAccount);
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// =========================================================
// ✅ CHỈNH SỬA LOGIC ĐĂNG NHẬP (LOGIN)
// =========================================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = loginForm.username.value.trim();
    const pass = loginForm.password.value.trim();
    const found = accounts.find(a => a.username === user && a.password === pass);
    
    if (found) {
      
      // ⭐️ ĐIỀU CHỈNH QUAN TRỌNG: 
      // LƯU TÊN NGƯỜI DÙNG VÀO sessionStorage với key 'loggedInUser'
      // để khớp với kiểm tra trong cart.js.
      sessionStorage.setItem('loggedInUser', found.username);
      
      // Xóa currentUser cũ (nếu có, vì nó không còn cần thiết cho giỏ hàng)
      localStorage.removeItem('currentUser');

      alert('Đăng nhập thành công!');
      location.href = '../../index.html';
    } else {
      alert('Sai tài khoản hoặc mật khẩu.');
    }
  });
}

// =========================================================
// LOGIC ĐĂNG KÝ (SIGNUP) - Giữ nguyên
// =========================================================

const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = signupForm.username.value.trim();
    const pass = signupForm.password.value.trim();

    if (accounts.find(a => a.username === user)) {
      alert('Tài khoản đã tồn tại.');
      return;
    }
    if (!user || !pass) {
      alert('Vui lòng nhập đủ thông tin.');
      return;
    }

    const newAcc = { username: user, password: pass };
    accounts.push(newAcc);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    alert('Đăng kí thành công! Bạn có thể đăng nhập ngay.');
    location.href = 'login.html';
  });
}

// =========================================================
// Render signed-in header (if a header with id `headerRight` exists)
// This will replace the default guest links with a user menu showing
// username + dropdown (Profile / Logout) when sessionStorage.loggedInUser is set.
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
      const headerRight = document.getElementById('headerRight');
      if (!headerRight) return; // nothing to do on pages without the header

      const loggedUsername = sessionStorage.getItem('loggedInUser');
      if (!loggedUsername) return; // guest view: keep existing markup

      // load accounts to try to get more user info (fallback to username)
      const accountsList = JSON.parse(localStorage.getItem('accounts')) || [];
      const currentUser = accountsList.find(a => a.username === loggedUsername) || { username: loggedUsername };

      headerRight.innerHTML = `
                        <a href="index.html" class="icon-with-label" aria-label="Trang chủ">
                              <div class="icon-wrap"><i class="fa-solid fa-house"></i></div>
                              <div class="icon-label">Trang chủ</div>
                        </a>
                        <a href="pages/user/cart.html" class="icon-with-label" aria-label="Giỏ hàng">
                              <div class="icon-wrap"><i class="fa-solid fa-cart-shopping"></i></div>
                              <div class="icon-label">Giỏ hàng</div>
                        </a>
                        <div class="icon-with-label user-menu" aria-label="Tài khoản" tabindex="0">
                              <div class="icon-wrap"><i class="fa-solid fa-user"></i></div>
                              <div class="icon-label">${currentUser.username}</div>
                              <div class="user-dropdown" style="display:none;">
                                    <a href="pages/user/profile.html" id="profileBtn">Hồ sơ</a>
                                    <button id="logoutBtn" type="button">Đăng xuất</button>
                              </div>
                        </div>
      `;

      const userMenu = headerRight.querySelector('.user-menu');
      const dropdown = headerRight.querySelector('.user-dropdown');
      const logoutBtn = headerRight.querySelector('#logoutBtn');

      // helper to compute appropriate path back to site root
      const goHome = () => {
            if (location.pathname && location.pathname.includes('/pages/')) {
                  location.href = '../../index.html';
            } else {
                  location.href = 'index.html';
            }
      };

      if (userMenu && dropdown) {
            const toggleDropdown = () => {
                  const shown = dropdown.style.display === 'block';
                  dropdown.style.display = shown ? 'none' : 'block';
            };

            // click to toggle
            userMenu.addEventListener('click', (e) => {
                  e.stopPropagation();
                  toggleDropdown();
            });

            // keyboard accessibility
            userMenu.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown();
                  } else if (e.key === 'Escape') {
                        dropdown.style.display = 'none';
                  }
            });

            // close when clicking outside
            document.addEventListener('click', () => {
                  dropdown.style.display = 'none';
            });
      }

      if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                  // clear session login and redirect to home
                  sessionStorage.removeItem('loggedInUser');
                  // keep any persistent cart/account data intact in localStorage
                  goHome();
            });
      }
});