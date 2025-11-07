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

  // Ensure profile object exists
  user.profile = user.profile || {};

  // Populate form fields
  const usernameInput = document.getElementById('username');
  const currentPasswordInput = document.getElementById('currentPassword');
  const newPasswordInput = document.getElementById('newPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const fullNameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('email');
  const addressInput = document.getElementById('address');

  usernameInput.value = user.username;
  fullNameInput.value = user.profile.fullName || '';
  emailInput.value = user.profile.email || '';
  addressInput.value = user.profile.address || '';

  // Save changes
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newUsername = usernameInput.value.trim();
    const currentPw = currentPasswordInput.value;
    const newPw = newPasswordInput.value;
    const confirmPw = confirmPasswordInput.value;

    // Username change: check uniqueness
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

    // Password change (optional). If user entered a new password, require current password and confirmation
    if (newPw || confirmPw) {
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
      if (newPw.length < 6) {
        alert('Mật khẩu mới phải có tối thiểu 6 kí tự.');
        return;
      }
      user.password = newPw;
    }

    // Update profile fields
    user.profile.fullName = fullNameInput.value.trim() || '';
    user.profile.email = emailInput.value.trim() || '';
    user.profile.address = addressInput.value.trim() || '';

    // Apply username change (if any)
    if (newUsername !== user.username) {
      // update the array entry
      const idx = accounts.findIndex(a => a.username === user.username);
      if (idx > -1) accounts[idx].username = newUsername;
      // update sessionStorage
      sessionStorage.setItem('loggedInUser', newUsername);
    }

    // Persist
    localStorage.setItem('accounts', JSON.stringify(accounts));

    // Clear password inputs for safety
    currentPasswordInput.value = '';
    newPasswordInput.value = '';
    confirmPasswordInput.value = '';

    alert('Cập nhật thông tin thành công!');
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    alert('Đã đăng xuất.');
    location.href = '../../index.html';
  });

  // Delete account flow: show confirmation area and require typing username
  const deleteText = document.getElementById('deleteAccountText');
  const deleteArea = document.getElementById('deleteConfirmArea');
  const currentUsernameLabel = document.getElementById('currentUsernameLabel');
  const deleteConfirmInput = document.getElementById('deleteConfirmInput');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  currentUsernameLabel.textContent = user.username;

  deleteText.addEventListener('click', () => {
    alert('Bạn sắp xóa tài khoản. Hành động này không thể hoàn tác.');
    deleteArea.style.display = 'block';
    deleteConfirmInput.focus();
  });

  cancelDeleteBtn.addEventListener('click', () => {
    deleteArea.style.display = 'none';
    deleteConfirmInput.value = '';
  });

  confirmDeleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const typed = deleteConfirmInput.value.trim();
    if (typed !== user.username) {
      alert('Tên đăng nhập nhập không khớp. Vui lòng gõ chính xác tên đăng nhập để xóa.');
      return;
    }

    // remove account and persist
    accounts = accounts.filter(a => a.username !== user.username);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    sessionStorage.removeItem('loggedInUser');
    alert('Tài khoản đã được xóa.');
    location.href = '../../index.html';
  });

})();
