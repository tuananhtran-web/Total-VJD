-- Script an toàn: Tự động kiểm tra và sửa tên cột
-- Copy toàn bộ và chạy trong SQL Editor

DO $$
BEGIN
    -- 1. Xử lý phone_number
    -- Nếu có phoneNumber (camelCase) thì đổi tên
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'phoneNumber') THEN
        ALTER TABLE "VJD" RENAME COLUMN "phoneNumber" TO phone_number;
    END IF;
    -- Nếu có phonenumber (lowercase) thì đổi tên
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'phonenumber') THEN
        ALTER TABLE "VJD" RENAME COLUMN "phonenumber" TO phone_number;
    END IF;

    -- 2. Xử lý display_name
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'displayName') THEN
        ALTER TABLE "VJD" RENAME COLUMN "displayName" TO display_name;
    END IF;
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'displayname') THEN
        ALTER TABLE "VJD" RENAME COLUMN "displayname" TO display_name;
    END IF;

    -- 3. Xử lý is_locked
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'isLocked') THEN
        ALTER TABLE "VJD" RENAME COLUMN "isLocked" TO is_locked;
    END IF;
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'islocked') THEN
        ALTER TABLE "VJD" RENAME COLUMN "islocked" TO is_locked;
    END IF;

    -- 4. Xử lý created_at
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'createdAt') THEN
        ALTER TABLE "VJD" RENAME COLUMN "createdAt" TO created_at;
    END IF;
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'createdat') THEN
        ALTER TABLE "VJD" RENAME COLUMN "createdat" TO created_at;
    END IF;

END $$;

-- Đảm bảo các cột chắc chắn tồn tại (nếu lệnh rename ở trên không chạy do không tìm thấy cột cũ)
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS created_at text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS updated_at text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS package jsonb;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS password text;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';

-- Kiểm tra kết quả
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'VJD';
