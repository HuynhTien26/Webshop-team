# Webshop-team

Web bán hàng nhóm 4

## Tài nguyên bổ sung

Vì giới hạn kích thước của GitHub nên các tài nguyên sau được lưu trong Google Drive:

```pgsql
'Pocky Doll'/
├── fonts/
├── icon/
├── img/
└── logo.svg
```

Nhấn vào [đây](https://drive.google.com/drive/folders/1euCrsdR3MVViUhM-TA7L2ZPBuaOQUiEa?usp=sharing) để tải về và giải nén. Sau đó bỏ 3 thư mục và 1 file trên vào `assets/`.

## Structure

```pgsql
Webshop-team/
├── assets/
│   ├── css/
│   │   ├── auth.css         # specific styles for login and signup pages
│   │   ├── style.css        # shared general styles (fonts, layout, etc.)
│   │   ├── user.css         # specific styles for user pages
│   │   └── admin.css        # specific styles for admin pages
│   │
│   ├── img/
│   │   └── logo.svg
│   │
│   └── js/
│       ├── auth-user.js     # login/signup for user
│       ├── auth-admin.js    # login for admin
│       ├── user.js          # user dashboard scripts
│       └── admin.js         # admin dashboard scripts
│
│
├── pages/
│   ├── user/
│   │   ├── cart.html
│   │   ├── login.html       # user login
│   │   ├── profile.html
│   │   └── signup.html      # user signup
│   │
│   ├── admin/
│   │   ├── admin.html       # index but for admin (aka. dashboar)
│   │   └── login.html       # admin login
│   │
│   └── 404.html             # shared error page
│
├── index.html               # entry landing page or redirect
└── README.md

```
