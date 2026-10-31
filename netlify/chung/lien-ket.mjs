/*
 * Link ngắn cho từng khách: dùng chung cho Netlify Edge Function và máy chủ xem thử (build.js --serve).
 *
 * Mỗi link ngắn (vd. /ban-duc-va-nguoi-thuong) được lưu kèm tiêu đề và tên khách.
 * Khi có người mở link (kể cả Zalo/Messenger đọc để làm khung xem trước), máy chủ chèn:
 *   - tiêu đề xem trước: "<tiêu đề thiệp> – Mời <tiêu đề bạn nhập>"
 *   - tên khách vào dòng "Thư Mời" và màn hình mở thiệp
 */

// Tên thư mục có thật trên website — không dùng làm link để tránh trùng
export const TEN_DANH_RIENG = ['anh', 'css', 'js', 'fonts', 'nhac', 'tao-link', 'api', 'index', '404'];

export function taoDuongDan(tieuDe) {
  let s = String(tieuDe || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
  if (TEN_DANH_RIENG.includes(s)) s += '-1';
  return s;
}

const escHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Tiêu đề xem trước cho một link: thêm "Mời ..." (không lặp chữ "Mời" nếu bạn đã gõ). */
export function phanMoi(tieuDe) {
  const t = String(tieuDe || '').trim();
  return /^mời(\s|$)/i.test(t) ? t : 'Mời ' + t;
}

/** Chèn tiêu đề và tên khách của link vào HTML thiệp. */
export function chenThongTin(html, duLieu) {
  const them = escHtml(phanMoi(duLieu.tieuDe));
  html = html.replace(/<title>([^<]*)<\/title>/, (_, cu) => `<title>${cu} – ${them}</title>`);
  // Khung xem trước (Zalo/Messenger/Facebook) hiện tiêu đề ở dòng trên, mô tả ở dòng dưới:
  // dòng 1 = tên thiệp, dòng 2 = "Mời ..." (thay cho mô tả mặc định là ngày cưới)
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/, (_, a, b) => `${a}${them}${b}`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => `${a}${them}${b}`);
  if (duLieu.khach) {
    html = html.replace(/(<span data-khach-moi>)[^<]*(<\/span>)/g, (_, a, b) => a + escHtml(duLieu.khach) + b);
  }
  return html;
}

/**
 * Tạo (hoặc dùng lại) link ngắn.
 * kho: { get(khoa) -> Promise<obj|null>, set(khoa, obj) -> Promise }
 * Trả về { trangThai, duLieu } để nơi gọi tự trả JSON.
 */
export async function taoLinkMoi(kho, body, matKhau) {
  if (matKhau && body.matKhau !== matKhau) return { trangThai: 401, duLieu: { loi: 'Sai mật khẩu tạo link.' } };
  // Chỉ cần 1 ô "người nhận": vừa là tiêu đề "Mời ..." khi chia sẻ, vừa là tên ở dòng "Thư Mời" (bỏ chữ "Mời" đứng đầu).
  // Vẫn nhận tieuDe/khach riêng để tương thích với bản cũ.
  const nguoiNhan = String(body.nguoiNhan ?? body.tieuDe ?? '').trim().slice(0, 120);
  const tieuDe = nguoiNhan;
  const khach = String(body.khach ?? (nguoiNhan.replace(/^mời\s+/i, '').trim() || nguoiNhan)).trim().slice(0, 120);
  const goc = taoDuongDan(tieuDe);
  if (!goc) return { trangThai: 400, duLieu: { loi: 'Tiêu đề cần có ít nhất một chữ cái hoặc chữ số.' } };
  let duongDan = goc;
  for (let i = 2; ; i++) {
    const cu = await kho.get(duongDan);
    if (!cu) break;
    if (cu.tieuDe === tieuDe && cu.khach === khach) return { trangThai: 200, duLieu: { duongDan } }; // đã có sẵn
    duongDan = `${goc}-${i}`; // trùng đường dẫn nhưng khác nội dung: thêm số
  }
  await kho.set(duongDan, { tieuDe, khach, tao: new Date().toISOString() });
  return { trangThai: 200, duLieu: { duongDan } };
}

/** Lấy đường dẫn ngắn từ URL, hoặc '' nếu không phải link thiệp. */
export function layDuongDan(pathname) {
  let p = pathname;
  try { p = decodeURIComponent(pathname); } catch (e) { /* giữ nguyên */ }
  p = p.replace(/^\/+|\/+$/g, '');
  return p && !p.includes('/') && !p.includes('.') ? p : '';
}
