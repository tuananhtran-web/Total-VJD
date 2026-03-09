-- Chạy đoạn script này trong SQL Editor của Supabase để tạo các cột còn thiếu
-- Lưu ý: Các tên cột được để trong dấu ngoặc kép "" để giữ đúng chữ hoa/thường (camelCase) khớp với code

ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "phoneNumber" text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "password" text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "displayName" text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "avatar" text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "isLocked" boolean DEFAULT false;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "package" jsonb;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS "createdAt" text;

-- Kiểm tra lại bảng sau khi thêm
SELECT * FROM "VJD";
