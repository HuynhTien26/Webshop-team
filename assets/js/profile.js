// Check if user is logged in
(function () {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("Vui lòng đăng nhập để truy cập trang này.");
    window.location.href = "login.html";
    return;
  }

  // Load user data
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find((u) => u.username === currentUser);

  if (!user) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
    return;
  }

  // Populate form
  document.getElementById("displayUsername").value = user.username;
  document.getElementById("fullName").value = user.profile.fullName || "";
  document.getElementById("email").value = user.profile.email || "";
  document.getElementById("phone").value = user.profile.phone || "";

  // Handle form submission
  document.getElementById("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();

    user.profile.fullName = document.getElementById("fullName").value;
    user.profile.email = document.getElementById("email").value;
    user.profile.phone = document.getElementById("phone").value;

    localStorage.setItem("users", JSON.stringify(users));
    alert("Cập nhật thông tin thành công!");
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Đã đăng xuất.");
    window.location.href = "../../index.html";
  });

  // Delete account
  document.getElementById("deleteAccountBtn").addEventListener("click", () => {
    if (
      confirm(
        "Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác.",
      )
    ) {
      const updatedUsers = users.filter((u) => u.username !== currentUser);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.removeItem("currentUser");
      alert("Tài khoản đã được xóa.");
      window.location.href = "../../index.html";
    }
  });
})();
