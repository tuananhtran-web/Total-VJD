-- Script sửa lỗi cột và reload schema cache (FINAL VERSION - SAFE MODE)
-- Chạy toàn bộ script này trong Supabase SQL Editor

-- Bước 1: Reload cache trước (để đảm bảo PostgREST nhận diện đúng trạng thái hiện tại)
NOTIFY pgrst, 'reload schema';

-- Bước 2: Đổi tên cột an toàn (Sử dụng khối DO để bắt lỗi và kiểm tra kỹ)
DO $$
BEGIN
    -- 1. phoneNumber -> phone_number
    -- Kiểm tra: Cột cũ 'phoneNumber' có tồn tại KHÔNG? VÀ Cột mới 'phone_number' CHƯA có?
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'phoneNumber') THEN
        IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'phone_number') THEN
            ALTER TABLE "VJD" RENAME COLUMN "phoneNumber" TO phone_number;
        END IF;
    END IF;

    -- 2. displayName -> display_name
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'displayName') THEN
        IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'display_name') THEN
            ALTER TABLE "VJD" RENAME COLUMN "displayName" TO display_name;
        END IF;
    END IF;

    -- 3. isLocked -> is_locked
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'isLocked') THEN
        IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'is_locked') THEN
            ALTER TABLE "VJD" RENAME COLUMN "isLocked" TO is_locked;
        END IF;
    END IF;

    -- 4. createdAt -> created_at
    IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'createdAt') THEN
        IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'VJD' AND column_name = 'created_at') THEN
            ALTER TABLE "VJD" RENAME COLUMN "createdAt" TO created_at;
        END IF;
    END IF;
END $$;

-- Bước 3: Đảm bảo các cột cần thiết luôn tồn tại (nếu chưa có thì tạo mới)
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS phone_number text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS display_name text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS is_locked boolean DEFAULT false;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS created_at text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS updated_at text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS avatar text;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS package jsonb;
ALTER TABLE "VJD" ADD COLUMN IF NOT EXISTS password text;

-- Bước 4: Reload schema cache LẦN NỮA (Quan trọng nhất)
NOTIFY pgrst, 'reload schema';

-- Bước 5: Kiểm tra kết quả
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'VJD' 
ORDER BY column_name;
