# Kho thiết bị CLB

Ứng dụng tiếng Việt để đăng ký và quản lý mượn thiết bị. Frontend React/Vite được deploy trên Vercel; dữ liệu và luật nghiệp vụ chạy bằng Supabase PostgreSQL RPC.

## Chạy local

1. Cài Node 20.11+ và chạy `npm install`.
2. Tạo `.env.local` từ `.env.example` rồi điền URL/key Supabase.
3. Chạy `npm run dev`, mở `http://localhost:5173`.

## Thiết lập Supabase một lần

1. Tạo một Supabase project.
2. Trong **SQL Editor**, mở file `supabase/migrations/0001_club_equipment.sql`, dán toàn bộ nội dung và bấm **Run**.
3. Vào **Project Settings → API**, sao chép **Project URL** và **anon / publishable key**.
4. Điền hai giá trị đó vào `.env.local` khi chạy local, hoặc Vercel Environment Variables khi deploy.

Không dùng database password, connection string hay `service_role` key trong frontend.

## Deploy Vercel

1. Push source lên GitHub và import repository tại Vercel.
2. Giữ Root Directory là repository root.
3. Thêm Environment Variables cho Production và Preview:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
VITE_SUBMIT_CONFLICT_POLICY=warn
```

4. Vercel tự dùng `npm run build`, output `apps/web/dist` qua `vercel.json`.
5. Deploy và mở URL `*.vercel.app` được cấp.

Sau mỗi lần đổi biến môi trường Vercel, redeploy project.

## Kiểm tra

`npm run verify` chạy typecheck, unit test và production build.
