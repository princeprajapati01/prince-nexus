# PRINCE NEXUS - AI Engineer Portfolio

A world-class portfolio platform built with Next.js 15, TypeScript, and Tailwind CSS, showcasing AI Engineering and Full Stack Development expertise.

## 🚀 Features

- **Modern Design**: Apple-level simplicity with Stripe-level professionalism
- **Fully Responsive**: Works perfectly on desktop, tablet, and mobile
- **Animated UI**: Smooth Framer Motion animations throughout
- **AI Assistant**: Interactive chatbot for recruiters
- **Project Showcase**: Detailed project pages with comprehensive information
- **Admin Panel**: Secure dashboard for content management
- **SEO Optimized**: Complete metadata, Open Graph, and structured data
- **Performance**: Optimized for Lighthouse 90+ scores

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Server Actions** - Server-side mutations

### Database & ORM
- **PostgreSQL** - Robust relational database (via Neon)
- **Prisma** - Next-generation ORM

### Authentication
- **NextAuth v5** - Secure authentication

### File Upload
- **UploadThing** - Modern file uploads

### Deployment
- **Vercel** - Optimized hosting platform

## 📦 Installation

1. **Clone the repository**
```bash
git clone https://github.com/princeprajapati/prince-nexus.git
cd prince-nexus
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials.

> [!TIP]
> To generate a secure `NEXTAUTH_SECRET`, open your terminal and run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
> ```

```env
# Database (Get from neon.tech)
DATABASE_URL="postgresql://user:password@host/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# UploadThing (Get from uploadthing.com)
UPLOADTHING_TOKEN="your-token-here"

# Admin Credentials
ADMIN_EMAIL="admin@princenexus.com"
ADMIN_PASSWORD="changeme"
```

4. **Set up and Seed the Database**
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

## 🏗️ Project Structure

```
prince-nexus/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel
│   ├── projects/[slug]/     # Dynamic project pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── robots.ts            # Robots.txt
│   └── sitemap.ts           # Sitemap
├── components/              # React components
│   ├── layout/              # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/            # Page sections
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── FeaturedProjects.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── TimelineSection.tsx
│   │   ├── AIAssistant.tsx
│   │   └── ContactSection.tsx
│   └── ui/                  # UI components
│       └── ParticleBackground.tsx
├── lib/                     # Utilities
│   └── utils.ts
├── prisma/                  # Database schema
│   └── schema.prisma
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind configuration
└── tsconfig.json            # TypeScript configuration
```

## 🎨 Design Philosophy

The portfolio follows these design principles:

- **Simplicity**: Clean, uncluttered interface
- **Professionalism**: Enterprise-grade appearance
- **Modern**: Contemporary UI patterns
- **Accessible**: WCAG compliant
- **Performance**: Optimized loading and rendering

## 📄 Key Sections

### 1. Hero Section
- Full-screen introduction
- Animated particle background
- Call-to-action buttons
- Smooth scroll indicator

### 2. About Section
- Professional introduction
- Key statistics
- Technologies overview
- Call-to-action

### 3. Featured Projects
- Project cards with hover effects
- Technology badges
- Links to GitHub and live demos
- View details button

### 4. Project Detail Pages
- Problem statement
- Solution overview
- Architecture explanation
- Key features list
- Technology stack
- Challenges faced
- Learnings gained
- Results achieved

### 5. Skills Section
- Interactive progress bars
- Categorized skills
- Animated on scroll
- Visual feedback

### 6. Timeline
- Professional journey
- Milestone markers
- Status indicators
- Responsive layout

### 7. AI Assistant
- Interactive chatbot
- Suggested questions
- Real-time responses
- Recruiter-focused

### 8. Contact Section
- Contact form
- Social links
- Email integration
- Success feedback

## 🔐 Admin Panel

Access at `/admin` (requires authentication)

Features:
- Dashboard with statistics
- Project management (CRUD)
- Media library
- Video management
- Resume uploads
- Message inbox
- Settings configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm run start
```

## 🔧 Database Setup

1. Create a PostgreSQL database on [Neon](https://neon.tech)
2. Copy the connection string
3. Add to `.env` as `DATABASE_URL`
4. Run migrations:
```bash
npx prisma generate
npx prisma db push
```

## 📱 Responsive Design

The portfolio is fully responsive with breakpoints for:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ⚡ Performance Optimization

- Server-side rendering (SSR)
- Static page generation where possible
- Image optimization
- Code splitting
- Lazy loading
- Minimal JavaScript bundle

## 🔍 SEO

- Metadata in all pages
- Open Graph tags
- Twitter Card tags
- Structured data
- Sitemap.xml
- Robots.txt
- Semantic HTML

## 📈 Analytics (Optional)

Add Google Analytics or Vercel Analytics:
```bash
npm install @vercel/analytics
```

## 🤝 Contributing

This is a personal portfolio, but suggestions are welcome!

## 📝 License

MIT License - feel free to use this as inspiration for your own portfolio.

## 👤 Author

**Prince Prajapati**
- Portfolio: [princenexus.com](https://princenexus.com)
- GitHub: [@princeprajapati](https://github.com/princeprajapati)
- LinkedIn: [Prince Prajapati](https://linkedin.com/in/princeprajapati)
- Email: prince@princenexus.com

## 🙏 Acknowledgments

Built with modern web technologies and best practices to showcase professional AI Engineering and Full Stack Development skills.

---

**Note**: Remember to customize all content, links, and credentials before deploying to production!
