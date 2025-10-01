-- Pijar Pro Database Schema
-- Jalankan script ini di Neon Database Console

-- Hapus tabel jika sudah ada (hati-hati dengan data!)
DROP TABLE IF EXISTS transaction_media CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS trx_type_enum CASCADE;

-- ENUM untuk jenis transaksi
CREATE TYPE trx_type_enum AS ENUM ('masuk', 'keluar');

-- Tabel users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) DEFAULT 'operator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel inventory
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(150) NOT NULL,
    description TEXT,
    stock_qty INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    inventory_id INT NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
    trx_type trx_type_enum NOT NULL,
    qty INT NOT NULL CHECK (qty > 0),
    trx_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel media untuk transaksi
CREATE TABLE transaction_media (
    id SERIAL PRIMARY KEY,
    transaction_id INT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type VARCHAR(20), -- contoh: 'image/jpeg', 'video/mp4'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger function untuk update stok inventory
CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika transaksi baru (INSERT)
    IF TG_OP = 'INSERT' THEN
        IF NEW.trx_type = 'masuk' THEN
            -- Tambah stok
            UPDATE inventory 
            SET stock_qty = stock_qty + NEW.qty 
            WHERE id = NEW.inventory_id;
        ELSIF NEW.trx_type = 'keluar' THEN
            -- Kurangi stok
            UPDATE inventory 
            SET stock_qty = stock_qty - NEW.qty 
            WHERE id = NEW.inventory_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Jika transaksi diupdate (UPDATE)
    IF TG_OP = 'UPDATE' THEN
        -- Kembalikan stok dari transaksi lama
        IF OLD.trx_type = 'masuk' THEN
            UPDATE inventory 
            SET stock_qty = stock_qty - OLD.qty 
            WHERE id = OLD.inventory_id;
        ELSIF OLD.trx_type = 'keluar' THEN
            UPDATE inventory 
            SET stock_qty = stock_qty + OLD.qty 
            WHERE id = OLD.inventory_id;
        END IF;
        
        -- Terapkan stok dari transaksi baru
        IF NEW.trx_type = 'masuk' THEN
            UPDATE inventory 
            SET stock_qty = stock_qty + NEW.qty 
            WHERE id = NEW.inventory_id;
        ELSIF NEW.trx_type = 'keluar' THEN
            UPDATE inventory 
            SET stock_qty = stock_qty - NEW.qty 
            WHERE id = NEW.inventory_id;
        END IF;
        RETURN NEW;
    END IF;
    
    -- Jika transaksi dihapus (DELETE)
    IF TG_OP = 'DELETE' THEN
        -- Kembalikan stok
        IF OLD.trx_type = 'masuk' THEN
            UPDATE inventory 
            SET stock_qty = stock_qty - OLD.qty 
            WHERE id = OLD.inventory_id;
        ELSIF OLD.trx_type = 'keluar' THEN
            UPDATE inventory 
            SET stock_qty = stock_qty + OLD.qty 
            WHERE id = OLD.inventory_id;
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Buat trigger
DROP TRIGGER IF EXISTS trg_update_inventory_stock ON transactions;
CREATE TRIGGER trg_update_inventory_stock
    AFTER INSERT OR UPDATE OR DELETE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_inventory_stock();

-- Insert sample data
INSERT INTO users (username, full_name, role) VALUES
('ahmad_fauzi', 'Ir. Ahmad Fauzi', 'supervisor'),
('budi_santoso', 'Drs. Budi Santoso', 'supervisor'),
('operator1', 'Operator Gudang 1', 'operator');

INSERT INTO inventory (item_name, description, stock_qty) VALUES
('Semen Tonasa 40kg', 'Semen berkualitas tinggi untuk konstruksi', 0),
('Besi Beton 10mm', 'Besi beton diameter 10mm untuk struktur', 0),
('Pasir Cor', 'Pasir halus untuk campuran beton', 0),
('Cat Tembok Nippon', 'Cat tembok interior berkualitas', 0),
('Keramik 40x40', 'Keramik lantai Roman Granit warna abu-abu', 0);

-- Insert sample transactions (trigger akan otomatis update stok)
INSERT INTO transactions (user_id, inventory_id, trx_type, qty, trx_date) VALUES
(1, 1, 'masuk', 500, '2025-09-28 08:30:00'),
(1, 2, 'keluar', 200, '2025-09-28 10:15:00'),
(2, 3, 'masuk', 15, '2025-09-29 09:00:00'),
(1, 4, 'keluar', 30, '2025-09-29 14:30:00'),
(2, 5, 'masuk', 800, '2025-09-30 07:45:00');

-- Verifikasi data
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Inventory' as table_name, COUNT(*) as count FROM inventory
UNION ALL
SELECT 'Transactions' as table_name, COUNT(*) as count FROM transactions;

-- Cek stok inventory (harus terupdate otomatis)
SELECT item_name, stock_qty FROM inventory ORDER BY id;