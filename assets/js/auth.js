// Password toggle (shared)
(function () {
  const pwd = document.getElementById("password");
  const toggle = document.getElementById("pwdToggle");
  const eyeIcon = document.getElementById("eyeIcon");
  if (!pwd || !toggle || !eyeIcon) return;

  let visible = false;
  const defaultPlaceholder = pwd.getAttribute("placeholder") || "";
  const showingPlaceholder = "ĐANG HIỆN MẬT KHẨU";

  function updatePlaceholder() {
    if (pwd.value.trim() === "") {
      pwd.setAttribute("placeholder", visible ? showingPlaceholder : defaultPlaceholder);
    } else {
      pwd.setAttribute("placeholder", "");
    }
  }

  function setIcon(open) {
    eyeIcon.textContent = open ? "visibility" : "visibility_off";
  }

  toggle.addEventListener("click", () => {
    visible = !visible;
    pwd.type = visible ? "text" : "password";
    toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
    setIcon(!visible);
    updatePlaceholder();
  });

  pwd.addEventListener("input", updatePlaceholder);
  updatePlaceholder();
  setIcon(!visible);
})();

// Shared validation + submit handler
(function () {
  const form =
    document.getElementById("loginForm") ||
    document.getElementById("signupForm");
  if (!form) return;

  const isSignup = form.id === "signupForm";

  // Initialize demo account if not exists
  const demoUser = { username: "khachhang1", password: "123456" };
  const users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.find((u) => u.username === "khachhang1")) {
    users.push(demoUser);
    localStorage.setItem("users", JSON.stringify(users));
  }

  form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const usernameEl = form.username;
    const pwdEl = form.password;
    const username = usernameEl.value.trim();
    const pass = pwdEl.value;
    const usernamePattern = /^[A-Za-z0-9._-]{3,30}$/;

    if (!username) {
      alert("Vui lòng nhập tên đăng nhập.");
      usernameEl.focus();
      return;
    }
    if (!usernamePattern.test(username)) {
      alert('Tên đăng nhập phải có 3–30 kí tự. Được phép dùng chữ cái, số, ".", "_" và "-".');
      usernameEl.focus();
      return;
    }

    if (!pass) {
      alert("Vui lòng nhập mật khẩu.");
      pwdEl.focus();
      return;
    }
    if (pass.length < 6) {
      alert("Mật khẩu phải dài ít nhất 6 kí tự.");
      pwdEl.focus();
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
      if (users.find((u) => u.username === username)) {
        alert("Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.");
        return;
      }

      users.push({ username, password: pass });
      localStorage.setItem("users", JSON.stringify(users));
      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      form.reset();
      window.location.href = "login.html";
      return;
    }

    const found = users.find((u) => u.username === username && u.password === pass);
    if (found) {
      // ✅ use localStorage consistently
      localStorage.setItem("currentUser", JSON.stringify(found));
      alert("Đăng nhập thành công! Chào, " + username + " 👋");
      form.reset();
      window.location.href = "../../index.html"; // ✅ redirects to homepage
    } else {
      alert("Sai tên đăng nhập hoặc mật khẩu.");
    }
  });
})();

// Header update after login
document.addEventListener("DOMContentLoaded", () => {
  const headerRight = document.getElementById("headerRight");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser && headerRight) {
    headerRight.innerHTML = `
      <a href="index.html" class="icon-with-label" aria-label="Trang chủ">
        <div class="icon-wrap"><i class="fa-solid fa-house"></i></div>
        <div class="icon-label">Trang chủ</div>
      </a>

      <a href="cart.html" class="icon-with-label" aria-label="Giỏ hàng">
        <div class="icon-wrap"><i class="fa-solid fa-cart-shopping"></i></div>
        <div class="icon-label">Giỏ hàng</div>
      </a>

      <div class="icon-with-label user-menu" aria-label="Tài khoản" tabindex="0">
        <div class="icon-wrap"><i class="fa-solid fa-user"></i></div>
        <div class="icon-label">${currentUser.username}</div>
        <div class="user-dropdown">
          <a href="profile.html" id="profileBtn">Hồ sơ</a>
          <button id="logoutBtn" type="button">Đăng xuất</button>
        </div>
      </div>
    `;
  }
});

