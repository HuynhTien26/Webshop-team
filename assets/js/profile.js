// Profile management using sessionStorage.loggedInUser and localStorage.accounts
(function () {
  const logged = sessionStorage.getItem('loggedInUser');
  if (!logged) {
    alert('Vui lòng đăng nhập để truy cập trang này.');
    location.href = 'login.html'; 
    return;
  }

  let accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  const user = accounts.find(a => a.username === logged);

  if (!user) {
    sessionStorage.removeItem('loggedInUser');
    alert('Người dùng không tồn tại. Vui lòng đăng nhập lại.');
    location.href = 'login.html';
    return;
  }

  // Ensure profile and address objects exist
  user.profile = user.profile || {};
  user.profile.address = user.profile.address || {};

  // Lấy các trường form mới
  const usernameInput = document.getElementById('username');
  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  const fullNameInput = document.getElementById('fullName');
  const contactInput = document.getElementById('contact'); 
  
  const streetInput = document.getElementById('address_street');
  const wardInput = document.getElementById('address_ward');
  const districtInput = document.getElementById('address_district');
  const cityInput = document.getElementById('address_city');

  // Điền dữ liệu vào form
  usernameInput.value = user.username;
  fullNameInput.value = user.profile.fullName || '';
  contactInput.value = user.profile.contact || ''; 
  
  streetInput.value = user.profile.address.street || '';
  wardInput.value = user.profile.address.ward || '';
  districtInput.value = user.profile.address.district || '';
  cityInput.value = user.profile.address.city || '';


  // Save changes
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newUsername = usernameInput.value.trim();
    const currentPw = currentPasswordInput.value;
    const newPw = newPasswordInput.value;
    const confirmPw = confirmPasswordInput.value;

    if (!newUsername) {
      alert('Tên đăng nhập không được để trống.');
      return;
    }
    if (newUsername !== user.username) {
      if (accounts.find(a => a.username === newUsername)) {
        alert('Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.');
        return;
      }
    }

    if (newPw || confirmPw || currentPw) { 
      if (!currentPw) {
        alert('Vui lòng nhập mật khẩu hiện tại để thay đổi mật khẩu.');
        return;
      }
      if (currentPw !== user.password) {
        alert('Mật khẩu hiện tại không đúng.');
        return;
      }
      if (newPw !== confirmPw) {
        alert('Mật khẩu mới và xác nhận không khớp.');
        return;
      }
      // Chỉ cập nhật mật khẩu nếu mật khẩu MỚI được nhập
      if (newPw) { 
          if (newPw.length < 6) {
            alert('Mật khẩu mới phải có tối thiểu 6 kí tự.');
            return;
          }
          user.password = newPw; 
      }
    }

    // Cập nhật profile
    user.profile.fullName = fullNameInput.value.trim() || '';
    user.profile.contact = contactInput.value.trim() || '';
    user.profile.address = {
		street: streetInput.value.trim() || '',
		ward: wardInput.value || '',
		district: districtInput.value || '',
		city: cityInput.value || ''
	};
	
	if (!user.profile.fullName || !user.profile.contact || !user.profile.address.street || !user.profile.address.city || !user.profile.address.district || !user.profile.address.ward) {
		alert('Vui lòng điền đầy đủ thông tin có dấu *.');
		return;
	}

    let usernameChanged = false;
    if (newUsername !== user.username) {
      const idx = accounts.findIndex(a => a.username === user.username);
      if (idx > -1) accounts[idx].username = newUsername;
      sessionStorage.setItem('loggedInUser', newUsername);
      usernameChanged = true;
    }

    localStorage.setItem('accounts', JSON.stringify(accounts));

    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    alert('Cập nhật thông tin thành công!');
    
    // ✅ [THAY ĐỔI] Chuyển về trang chủ sau khi lưu
    location.href = '../../index.html';
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    alert('Đã đăng xuất.');
    location.href = '../../index.html';
  });

  // Delete account (Logic giữ nguyên)
  const deleteText = document.getElementById('deleteAccountText');
  const deleteArea = document.getElementById('deleteConfirmArea');
  const currentUsernameLabel = document.getElementById('currentUsernameLabel');
  const deleteConfirmInput = document.getElementById('deleteConfirmInput');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  if(currentUsernameLabel) currentUsernameLabel.textContent = user.username;

  if(deleteText) deleteText.addEventListener('click', () => {
    alert('Bạn sắp xóa tài khoản. Hành động này không thể hoàn tác.');
    if(deleteArea) deleteArea.style.display = 'block';
    if(deleteConfirmInput) deleteConfirmInput.focus();
  });

  if(cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', () => {
    if(deleteArea) deleteArea.style.display = 'none';
    if(deleteConfirmInput) deleteConfirmInput.value = '';
  });

  if(confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const typed = deleteConfirmInput.value.trim();
    if (typed !== user.username) {
      alert('Tên đăng nhập nhập không khớp. Vui lòng gõ chính xác tên đăng nhập để xóa.');
      return;
    }

    accounts = accounts.filter(a => a.username !== user.username);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    sessionStorage.removeItem('loggedInUser');
    alert('Tài khoản đã được xóa.');
    location.href = '../../index.html';
  });

})();