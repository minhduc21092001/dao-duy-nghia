/*
 * Netlify Edge Function: link ngắn cho từng khách.
 *   POST /api/tao-link  { tieuDe, khach, matKhau? }  -> { duongDan }
 *   GET  /<duong-dan>   -> thiệp, có tiêu đề xem trước + tên khách riêng của link đó
 * Dữ liệu lưu trong Netlify Blobs (kho "lien-ket"). Đặt biến môi trường MAT_KHAU_TAO_LINK trên Netlify
 * nếu muốn chỉ người biết mật khẩu mới tạo được link.
 */
import { getStore } from '@netlify/blobs';
import { taoLinkMoi, chenThongTin, layDuongDan } from '../chung/lien-ket.mjs';

const json = (trangThai, duLieu) => new Response(JSON.stringify(duLieu), {
  status: trangThai,
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

export default async (request, context) => {
  const url = new URL(request.url);
  const store = getStore({ name: 'lien-ket', consistency: 'strong' });
  const kho = {
    get: (khoa) => store.get(khoa, { type: 'json' }),
    set: (khoa, giaTri) => store.setJSON(khoa, giaTri),
  };

  if (url.pathname === '/api/tao-link') {
    if (request.method !== 'POST') return json(405, { loi: 'Chỉ nhận POST.' });
    let body = {};
    try { body = await request.json(); } catch (e) { return json(400, { loi: 'Dữ liệu không hợp lệ.' }); }
    const kq = await taoLinkMoi(kho, body, Netlify.env.get('MAT_KHAU_TAO_LINK'));
    return json(kq.trangThai, kq.duLieu);
  }

  const duongDan = layDuongDan(url.pathname);
  if (!duongDan) return; // trang chủ, file tĩnh...: để Netlify xử lý bình thường
  const duLieu = await kho.get(duongDan);
  if (!duLieu) return; // link tự gõ, chưa tạo ở trang tạo link: vẫn hiện thiệp bình thường

  const res = await context.next();
  if (!(res.headers.get('content-type') || '').includes('text/html')) return res;
  const headers = new Headers(res.headers);
  headers.delete('content-length');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  return new Response(chenThongTin(await res.text(), duLieu), { status: 200, headers });
};

export const config = {
  path: '/*',
  excludedPath: ['/anh/*', '/css/*', '/js/*', '/fonts/*', '/nhac/*', '/tao-link', '/tao-link/*', '/favicon.ico'],
};
