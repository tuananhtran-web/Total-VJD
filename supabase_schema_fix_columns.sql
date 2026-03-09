-- Đổi tên các cột từ camelCase sang snake_case để tránh lỗi 406 và vấn đề quote
-- Chạy script này trong SQL Editor của Supabase

ALTER TABLE "VJD" RENAME COLUMN "phoneNumber" TO phone_number;
ALTER TABLE "VJD" RENAME COLUMN "displayName" TO display_name;
ALTER TABLE "VJD" RENAME COLUMN "isLocked" TO is_locked;
ALTER TABLE "VJD" RENAME COLUMN "createdAt" TO created_at;

-- Thêm cột updated_at nếu chưa có (cho hàm syncUserToFirestore)
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS updated_at text;

-- CỰC KỲ QUAN TRỌNG: Reload schema cache ngay lập tức để API nhận diện cột mới
NOTIFY pgrst, 'reload schema';

-- Kiểm tra lại
SELECT * FROM "VJD" LIMIT 1;
