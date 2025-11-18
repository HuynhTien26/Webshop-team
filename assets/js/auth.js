// Password visibility toggle
document.querySelectorAll('.password-toggle').forEach(btn => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('.eye-icon');
      btn.addEventListener('click', () => {
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
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
const defaultAccount = { 
	username: 'khachhang1', 
	password: '123456',
	profile: {
		fullName: 'Khách Hàng Mẫu',
		contact: '0901234567',
		address: {
			street: '123 Đường ABC',
			ward: 'P1',
			district: 'TB',
			city: 'HCM'
		}
	}
};
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
if (!accounts.find(acc => acc.username === defaultAccount.username)) {
  accounts.push(defaultAccount);
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

// =========================================================
// LOGIC ĐĂNG NHẬP (LOGIN)
// =========================================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const user = loginForm.username.value.trim();
    const pass = loginForm.password.value.trim();
    const found = accounts.find(a => a.username === user && a.password === pass);
    
    if (found) {
      sessionStorage.setItem('loggedInUser', found.username);
      localStorage.removeItem('currentUser'); 
      alert('Đăng nhập thành công!');
      location.href = '../../index.html'; // Về trang chủ
    } else {
      alert('Sai tài khoản hoặc mật khẩu.');
    }
  });
}

// =========================================================
// LOGIC ĐĂNG KÝ (SIGNUP)
// =========================================================

const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
	
	// Lấy tất cả giá trị từ form mới
    const user = signupForm.username.value.trim();
    const pass = signupForm.password.value.trim();
	const confirmPass = signupForm.confirmPassword.value.trim();
	const fullName = signupForm.fullName.value.trim();
	const contact = signupForm.contact.value.trim();
	const street = signupForm.address_street.value.trim();
	const ward = signupForm.address_ward.value;
	const district = signupForm.address_district.value;
	const city = signupForm.address_city.value;

	// --- Validation ---
    if (accounts.find(a => a.username === user)) {
      alert('Tài khoản đã tồn tại.');
      return;
    }
	if (pass !== confirmPass) {
		alert('Xác nhận mật khẩu không khớp!');
		return;
	}
	if (pass.length < 6) {
		alert('Mật khẩu phải có tối thiểu 6 kí tự.');
		return;
	}
    if (!user || !pass || !fullName || !contact || !street || !ward || !district || !city) {
      alert('Vui lòng nhập đủ thông tin có dấu *.');
      return;
    }

	// Tạo đối tượng tài khoản mới với đầy đủ profile
    const newAcc = { 
		username: user, 
		password: pass,
		profile: {
			fullName: fullName,
			contact: contact,
			address: {
				street: street,
				ward: ward,
				district: district,
				city: city
			}
		}
	};

    accounts.push(newAcc);
    localStorage.setItem('accounts', JSON.stringify(accounts));
	
	// Tự động đăng nhập sau khi đăng ký
	sessionStorage.setItem('loggedInUser', newAcc.username);

    alert('Đăng kí thành công! Bạn đã được tự động đăng nhập.');
	
	// Chuyển về trang chủ (index.html)
    location.href = '../../index.html'; 
  });
}

// =========================================================
// Render header khi đã đăng nhập
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
      const headerRight = document.getElementById('headerRight');
      if (!headerRight) return; 

      const loggedUsername = sessionStorage.getItem('loggedInUser');
      if (!loggedUsername) return; 

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
                        <div class="icon-with-label user-menu user-menu-active" aria-label="Tài khoản" tabindex="0">
                              <div class="icon-wrap"><i class="fa-solid fa-user"></i></div>
                              <div class="icon-label">${currentUser.username}</div>
                              <div class="user-dropdown" style="display:none;">
                                    <a href="pages/user/profile.html" id="profileBtn">Thông tin</a>
                                    <button id="logoutBtn" type="button">Đăng xuất</button>
                              </div>
                        </div>
      `;

      const userMenu = headerRight.querySelector('.user-menu');
      const dropdown = headerRight.querySelector('.user-dropdown');
      const logoutBtn = headerRight.querySelector('#logoutBtn');

      const goHome = () => {
            if (location.pathname && (location.pathname.includes('/pages/') || location.pathname.includes('/assets/'))) {
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
            userMenu.addEventListener('click', (e) => {
                  e.stopPropagation();
                  toggleDropdown();
            });
            userMenu.addEventListener('keydown', (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown();
                  } else if (e.key === 'Escape') {
                        dropdown.style.display = 'none';
                  }
            });
            document.addEventListener('click', () => {
                  dropdown.style.display = 'none';
            });
      }

      if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                  sessionStorage.removeItem('loggedInUser');
                  goHome();
            });
      }
});