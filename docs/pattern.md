> Proyek ini menggunakan **Domain-Driven Folder Structure dengan Feature Encapsulation**.

> Setiap fitur utama (misalnya `operations`) memiliki folder sendiri yang berisi halaman (`page.tsx`), komponen, hooks, store, dan validasi.
>
> Pattern ini dipilih untuk menjaga **modularitas, keterbacaan, dan skalabilitas** aplikasi. Komponen UI yang bersifat umum ditempatkan di `components/ui`, sedangkan logika domain tetap dekat dengan halaman yang menggunakannya.
>
> Dengan struktur ini, pengembangan fitur baru menjadi lebih cepat dan minim konflik antar domain.

---

🧩 Nama Pattern

👉 **Domain-Driven Folder Structure with Feature Encapsulation**
(alias: **Modular Feature-Based Architecture**)

---

Struktur

```
app
 ┣ api
 ┃ ┣ inventory
 ┃ ┃ ┣ route.ts            # CRUD inventory (masuk/keluar)
 ┃ ┃ ┣ items.ts            # endpoint daftar barang
 ┃ ┃ ┗ seed.ts             # seeding db
 ┃ ┗ users
 ┃    ┗ route.ts           # user management
 ┣ operations
 ┃ ┣ page.tsx              # halaman utama operasi
 ┃ ┣ components
 ┃ ┃ ┣ InventoryForm.tsx   # form tambah/edit barang
 ┃ ┃ ┣ InventoryTable.tsx  # tabel riwayat transaksi
 ┃ ┃ ┣ NewItemModal.tsx    # modal tambah barang baru
 ┃ ┃ ┣ OperationsHeader.tsx
 ┃ ┃ ┗ StatsCards.tsx
 ┃ ┣ hooks
 ┃ ┃ ┣ useInventory.ts     # fetch + mutate data barang
 ┃ ┃ ┣ useInventoryItems.ts
 ┃ ┃ ┗ useFormState.ts
 ┃ ┣ store
 ┃ ┃ ┗ operationsStore.ts  # zustand / jotai / redux slice
 ┃ ┗ validations
 ┃    ┣ inventoryForm.ts
 ┃    ┗ stockValidation.ts
 ┣ reports
 ┣ settings
 ┣ globals.css
 ┣ layout.tsx
 ┗ page.tsx

components
 ┗ ui                      # komponen UI reusable (Button, Modal, Input, dll)

lib
 ┣ db
 ┃ ┣ index.ts              # koneksi ke database
 ┃ ┣ schema.ts             # definisi schema Drizzle/Prisma
 ┃ ┣ seed.ts
 ┃ ┗ triggers.sql
 ┗ utils.ts


```

```
👉 Intinya: setiap domain punya folder sendiri (operations, reports, settings) dan semua hook/validation/store untuk domain itu disimpan di dalamnya, bukan di lib global. components/ui hanya untuk UI reusable.

```

🔹 Penjelasan Singkat

* **Domain-driven** → setiap fitur utama aplikasi (misalnya `operations`, `reports`, `settings`) memiliki folder sendiri yang berisi komponen, hooks, store, dan validasi khusus domain itu.
* **Encapsulation** → semua yang berhubungan dengan suatu fitur terkumpul di satu tempat, jadi tidak perlu “loncat-loncat” folder (`lib/hooks`, `lib/validations`, `components/operations`, dll).
* **Separation of Concerns** → komponen umum tetap dipisahkan (`components/ui`), tetapi logika bisnis domain tetap dekat dengan halaman yang memakainya.

---

🔹 Pola Umum

1. **Global Layer (Reusable)**

   * `components/ui/` → komponen UI generik (button, modal, input, card).
   * `lib/db/` → koneksi & schema database.
   * `lib/utils.ts` → helper umum.

2. **Domain Layer (Feature-specific)**

   * Setiap fitur punya folder di `app/{feature}` → misalnya `app/operations`.
   * Isinya lengkap:

     * `page.tsx` → entry page.
     * `components/` → komponen domain.
     * `hooks/` → state & data fetching khusus domain.
     * `store/` → state management domain.
     * `validations/` → schema & rules domain.

3. **API Layer**

   * API routes mengikuti struktur domain (`app/api/inventory/route.ts`, `app/api/users/route.ts`).
   * Jadi konsisten: `app/{feature}` untuk UI, `app/api/{feature}` untuk API.

---

🔹 Manfaat Pattern Ini

1. **Scalability** – mudah menambah fitur baru tanpa bikin project makin berantakan.
2. **Maintainability** – developer baru bisa langsung paham karena 1 domain = 1 folder.
3. **Reusability** – komponen & hooks bisa dipakai lintas domain kalau memang generik.
4. **Consistency** – API dan UI punya pola folder yang paralel.

---


