# Pijar Pro - Sistem Kelola Barang

Aplikasi manajemen inventori modern untuk proyek pembangunan dengan teknologi terdepan.

## 🚀 Tech Stack

- **Next.js 15** - React framework dengan App Router
- **React 19** - Library UI terbaru
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Component library
- **Framer Motion** - Animasi dan transisi
- **Zustand** - State management
- **Drizzle ORM** - Type-safe database ORM
- **PostgreSQL (Neon)** - Database
- **Zod** - Schema validation

## ✨ Fitur

- 📱 **Mobile Responsive** - Optimized untuk semua device
- 🎨 **Modern UI/UX** - Interface yang intuitif dan profesional
- ⚡ **Real-time Updates** - State management dengan Zustand
- 🔄 **Smooth Animations** - Transisi halus dengan Framer Motion
- 📊 **Dashboard Analytics** - Statistik real-time
- 📤 **Export Data** - Export ke CSV
- ✅ **Form Validation** - Validasi dengan Zod
- 🎯 **Type Safety** - Full TypeScript support

## 🛠️ Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd pijar-pro-inventory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` dengan database URL Anda:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pijar_pro"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Setup database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── inventory-form.tsx
│   ├── inventory-table.tsx
│   └── stats-cards.tsx
├── lib/                  # Utilities & configurations
│   ├── db/              # Database schema & connection
│   ├── store/           # Zustand stores
│   ├── validations/     # Zod schemas
│   └── utils.ts         # Helper functions
└── public/              # Static assets
```

## 🎯 Key Features Explained

### State Management (Zustand)
- Lightweight dan performant
- DevTools integration
- Type-safe actions dan selectors

### Database (Drizzle + PostgreSQL)
- Type-safe ORM
- Migration system
- Neon serverless PostgreSQL

### UI Components (Shadcn/ui)
- Accessible components
- Customizable dengan Tailwind
- Consistent design system

### Animations (Framer Motion)
- Smooth page transitions
- Interactive micro-animations
- Performance optimized

### Form Handling (Zod)
- Runtime type validation
- Error handling
- Type inference

## 🚀 Deployment

### Vercel (Recommended)
1. Push ke GitHub repository
2. Connect ke Vercel
3. Set environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm start
```

## 📊 Performance Features

- **Code Splitting** - Automatic dengan Next.js
- **Image Optimization** - Built-in Next.js optimization
- **Bundle Analysis** - Optimized imports
- **Caching** - Intelligent caching strategies

## 🔧 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio
```

## 🎨 Customization

### Themes
Edit `app/globals.css` untuk mengubah color scheme:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  /* ... */
}
```

### Components
Semua UI components dapat dikustomisasi di `components/ui/`

## 📱 Mobile Optimization

- Touch-friendly interface
- Responsive breakpoints
- Optimized performance
- PWA ready (dapat ditambahkan)

## 🔒 Security Features

- Input validation dengan Zod
- SQL injection protection (Drizzle ORM)
- Type safety dengan TypeScript
- Environment variables protection

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering & search
- [ ] Bulk operations
- [ ] Role-based access control
- [ ] API endpoints
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Integration dengan sistem lain

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

🔎 Penting: Untuk pemahaman yang lebih lengkap, pastikan Anda membaca seluruh dokumentasi yang tersedia di direktori /docs/, atau setidaknya mulai dari Ringkasan.md.

**Dibuat dengan ❤️ untuk Kabupaten Labuhanbatu Selatan**