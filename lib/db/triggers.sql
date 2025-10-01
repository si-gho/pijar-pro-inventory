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