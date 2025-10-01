🚀 Struktur **hybrid** (feature-based + role-based) untuk **Pijar-Pro**.

Tujuannya:

1. **Feature-based** → supaya semua logika/domain (inventory, projects, auth, dll.) tetap **1 sumber kebenaran**.
2. **Role-based** → supaya **tampilan/layout** bisa berbeda sesuai user (operator, manager, stakeholder).

---

## 📂 Struktur Hybrid Pijar-Pro

```
app/
 ├─ layout.tsx              # global providers (theme, auth)
 ├─ page.tsx                # landing/redirect page

 ├─ operation/              # role: operator
 │   ├─ layout.tsx          # bottom menu layout
 │   ├─ dashboard/page.tsx  # pakai features/inventory + stats
 │   ├─ form/page.tsx       # pakai features/inventory form
 │   └─ history/page.tsx    # pakai features/inventory table

 ├─ manager/                # role: manager
 │   ├─ layout.tsx          # sidebar/topbar layout
 │   ├─ dashboard/page.tsx  # pakai features/projects + inventory stats
 │   └─ reports/page.tsx    # pakai features/reports

 └─ stakeholders/           # role: stakeholder
     ├─ layout.tsx
     └─ overview/page.tsx   # pakai features/projects summary
     

components/
 ├─ ui/                     # pure UI (button, card, modal, input, toast)
 ├─ layout/                 # header, footer, bottom-menu, sidebar
 └─ charts/                 # chart reusable (pie, bar, line)

features/
 ├─ inventory/              # domain: inventory
 │   ├─ components/
 │   │   ├─ inventory-form.tsx
 │   │   ├─ inventory-table.tsx
 │   │   └─ stats-cards.tsx
 │   ├─ store.ts            # zustand/valtio store
 │   ├─ validations.ts      # zod schema
 │   ├─ api.ts              # drizzle/db API
 │   └─ hooks.ts            # hooks khusus inventory
 │
 ├─ projects/
 │   ├─ components/
 │   │   └─ project-overview.tsx
 │   ├─ store.ts
 │   └─ api.ts
 │
 ├─ reports/
 │   ├─ components/
 │   │   └─ report-table.tsx
 │   └─ api.ts
 │
 └─ auth/
     ├─ components/
     │   ├─ login-form.tsx
     │   └─ role-guard.tsx
     ├─ store.ts
     └─ api.ts

lib/
 ├─ db/
 │   ├─ schema.ts
 │   └─ index.ts
 ├─ utils.ts
 └─ validations/
     └─ common.ts
```

---

## ⚡ Cara Kerja

1. **Domain logic di `features/`**

   * Semua logika & komponen inventory (form, table, stats) **hanya ada di `features/inventory`**.
   * Manager & operator tinggal **pakai ulang** (import).
   * Jadi nggak ada duplikasi data/logic.

2. **Role UI di `app/role/`**

   * Operator punya **bottom menu layout**.
   * Manager punya **sidebar layout**.
   * Stakeholder punya **overview layout**.

3. **Reusable components**

   * `components/ui/` → tombol, input, card, toast.
   * `components/layout/` → navigasi (bottom menu, header, sidebar).
   * `components/charts/` → chart visualisasi (untuk manager & stakeholder).

---

## 🔍 Contoh Flow

* Operator buka `/operation/form` → render `features/inventory/components/inventory-form.tsx`.
* Manager buka `/manager/dashboard` → render `features/inventory/components/stats-cards.tsx` + `features/projects/components/project-overview.tsx`.
* Stakeholder buka `/stakeholders/overview` → render `features/projects/components/project-overview.tsx` + report summary.

---

## ✨ Kelebihan Hybrid

* **Modular & reusable** → 1 inventory, bisa dipakai operator & manager.
* **Role-based UX** → UI bisa berbeda sesuai role tanpa duplikasi logic.
* **Scalable** → gampang tambah role/fitur baru tanpa ubah struktur besar.

---

👉 **Develop Cepat** (cukup import dari `features/`) tapi juga **siap scale-up** kalau nanti role & fitur makin banyak.

---

Catatan khusus sebagai pengingat untuk developer: (`bagaimana `OperationLayout` pakai bottom menu + import form dari `features/inventory`)?
