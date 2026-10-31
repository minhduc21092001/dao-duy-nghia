# Thiệp cưới Duy Nghĩa & Thanh Hà — mẫu Minimalism Đỏ Đậm

Bản dựng lại [mẫu Minimalism Đỏ Đậm của Chung Đôi](https://chungdoi.com/vi/mau-thiep/minimalism-do-dam/demo) dưới dạng website tĩnh. Bạn sửa nội dung trong **một file Markdown**, thay ảnh trong **thư mục `anh/`**, chạy một lệnh là có website để đăng.

## Cấu trúc thư mục

```
minimalism-do-dam/
├── noi-dung.md            ← ✏️ TOÀN BỘ CHỮ TRÊN THIỆP (tên, ngày, địa chỉ, tài khoản, album…)
├── anh/                   ← 🖼️ ẢNH
│   ├── anh-cuoi/          ảnh trong phong thư ở đầu thiệp
│   ├── album/             ảnh của phần "Album Ảnh", 01.jpg, 02.jpg… theo thứ tự
│   ├── mung-cuoi/         ảnh QR ngân hàng (chú rể, cô dâu)
│   ├── chia-se/           ảnh hiện khi gửi link qua Zalo/Messenger (ảnh NGANG 1200×630, thấy rõ mặt)
│   └── trang-tri/         hoa, phong thư, nền giấy, lâu đài, biểu tượng lịch trình… (ít khi cần đổi)
├── nhac/nhac-nen.mp3      ← 🎵 nhạc nền
├── anh-goc/               ← ảnh gốc từ studio (chỉ để trên máy, KHÔNG đưa lên mạng)
├── google-sheet/          ← lưu xác nhận tham dự + lời chúc vào Google Sheet (xem HUONG-DAN.md trong đó)
├── src/                   ← khung thiệp (HTML/CSS/JS, phông chữ). Không cần sửa.
│   ├── thiep.html         khung trang thiệp, các chỗ {{…}} lấy chữ từ noi-dung.md
│   ├── tao-link.html      trang tạo link riêng cho từng khách
│   └── css/  js/  fonts/
├── netlify/               ← link ngắn cho từng khách (chạy trên Netlify)
├── build.js               ← ghép noi-dung.md + ảnh + khung → thư mục website/
├── website/               ← KẾT QUẢ để đăng lên mạng (tự tạo, đừng sửa tay)
└── _ban-cu-codex/         ← bản clone cũ (trước khi cấu trúc lại), giữ để đối chiếu — xoá được khi không cần
```

Ảnh/nhạc có mặt cả ở `anh/` lẫn `website/anh/` — `website/` là bản thành phẩm, mỗi lần build tự chép lại.

## Cần có

[Node.js](https://nodejs.org) bản 18 trở lên. Xem thử trên máy không cần cài thêm gì.

## Sửa thiệp

1. Mở terminal trong thư mục này, chạy:

   ```
   npm run dev
   ```

2. Mở <http://localhost:8080/> để xem thiệp, <http://localhost:8080/tao-link/> để tạo link.
   (Máy đang có chương trình khác dùng cổng 8080 thì chạy `set PORT=8090 && npm run dev` rồi mở `localhost:8090`.)
3. Sửa `noi-dung.md` hoặc chép ảnh mới vào `anh/`, lưu lại rồi **tải lại trang** là thấy thay đổi.

**Ngày cưới:** chỉ cần sửa `Ngày cưới` ở mục 4 (`2026-11-28`) — thứ, ngày/tháng/năm, lịch tháng có trái tim, ngày trên phong thư, đếm ngược và nút "Thêm vào lịch" đều tự cập nhật. Riêng `Ngày âm lịch` phải tự gõ.

**Đổi ảnh:** chép ảnh đè lên file cũ, **giữ nguyên tên file** (ví dụ thay `anh/album/05.jpg`). Muốn thêm/bớt ảnh album thì thêm/xoá dòng `Album ảnh NN` ở mục 5. Ảnh máy ảnh rất nặng (~20 MB) — nên thu nhỏ về khoảng 1000×1500 trước khi đưa vào `anh/` để thiệp tải nhanh.

**Ẩn bớt phần:** mục 14 trong `noi-dung.md`, ghi `không` cho phần muốn ẩn (album, xác nhận tham dự, bản đồ, dress code, lịch trình, sổ lưu bút, hộp quà).

**Tài khoản mừng cưới:** QR hiện tại là **QR DEMO** (không chuyển tiền được). Chép ảnh QR thật vào `anh/mung-cuoi/` (tên `qr-chu-re.png`, `qr-co-dau.png`) và điền đúng ngân hàng, số tài khoản, chủ tài khoản ở mục 11. Quét thử bằng app ngân hàng trước khi gửi thiệp.

**Xác nhận tham dự & sổ lưu bút:** làm theo `google-sheet/HUONG-DAN.md` để khách gửi về Google Sheet của bạn. Chưa làm thì khách vẫn bấm gửi được nhưng dữ liệu không được lưu.

## Tạo link cho khách

Mở trang `…/tao-link/` trên website của bạn, gõ **một ô duy nhất: Người nhận**, rồi bấm **Tạo link**:

- Ví dụ gõ "Anh Đức và người thương" → link ngắn `https://ten-mien/anh-duc-va-nguoi-thuong`.
- Khi gửi qua Zalo/Messenger, khung xem trước hiện "💍 Thiệp cưới Duy Nghĩa & Thanh Hà 💕" và dòng dưới "**Mời** Anh Đức và người thương".
- Trên thiệp, tên đó hiện ngay dưới chữ "Thân Mời" ở phong thư.
- Link vừa tạo tự lưu vào danh sách bên dưới (chỉ trên trình duyệt bạn đang dùng). Mọi link đều mở cùng một tấm thiệp.

Link ngắn chạy nhờ `netlify/edge-functions/link-ngan.js` (lưu trong Netlify Blobs), nên cần **deploy qua Git trên Netlify**. Kéo thả thư mục `website/` thì không có chức năng này — trang tạo link sẽ tạm dùng link dài `?khach=...`. Muốn chỉ mình bạn tạo được link: Netlify → *Site configuration → Environment variables*, thêm `MAT_KHAU_TAO_LINK`.

## Đăng lên mạng (Netlify qua GitHub)

1. Tạo repo GitHub, đưa thư mục này lên (`anh-goc/`, `_ban-cu-codex/`, `website/` đã nằm trong `.gitignore`, không bị đẩy lên).
2. Netlify → *Add new site → Import from Git* → chọn repo. Netlify tự đọc `netlify.toml` (`node build.js`, đăng thư mục `website/`).
3. Có tên miền rồi (vd. `https://duynghia-thanhha.netlify.app`) thì sửa `Địa chỉ website` ở mục 15 trong `noi-dung.md` rồi đẩy lại — **ảnh xem trước khi gửi link chỉ hiện khi địa chỉ này đúng**.
4. Thử bằng một **link mới** (Zalo/Messenger nhớ khung xem trước cũ của link đã gửi).

## Khác với mẫu gốc

- Bỏ: chữ ký/biểu tượng Chung Đôi, widget chat hỗ trợ, mã thanh toán và theo dõi của trang gốc, 10 lời chúc mẫu (tên người lạ) trong sổ lưu bút.
- Thêm: tên khách trên phong thư theo link riêng; xác nhận tham dự và lời chúc gửi về Google Sheet; nhạc thử tự phát ngay khi mở (trình duyệt chặn thì phát khi khách bấm "Mở thiệp").
- Bản đồ dùng khung Google Maps nhúng không cần API key.
- Nhạc nền hiện là bài "Em đồng ý (I do)" lấy từ mẫu; thay file `nhac/nhac-nen.mp3` nếu muốn bài khác.
