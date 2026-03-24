# 🚀 ArticleForge — AI-Powered Article Publishing Platform

> موقع نشر مقالات ذكي مع بوت AI يسحب المقالات من أقوى المواقع، يعيد كتابتها بالكامل، وينشرها تلقائياً بأعلى معايير SEO و GEO.

---

## 📋 Overview

ArticleForge is a **fully automated content publishing system** that:
1. **Scrapes** articles from top-tier websites (with images)
2. **Rewrites** them completely using AI (Gemini/GPT-4) so Google cannot detect duplicate content
3. **Publishes** them automatically with full SEO optimization
4. **Targets** specific geographic regions (GEO) for maximum local traffic

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 15 (App Router, SSR/SSG)
- **Styling**: Vanilla CSS (Premium dark theme)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI Engine**: Google Gemini / OpenAI GPT-4
- **Scraping**: Cheerio + Axios
- **Images**: Cloudinary CDN + WebP optimization
- **Hosting**: Vercel (Free tier)
- **Analytics**: Google Analytics 4 + Search Console

---

## 🤖 AI Bot — How It Works

```
1. SCRAPE  → Bot visits source URLs, extracts articles + images
2. ANALYZE → Identifies article structure, key topics, keywords
3. REWRITE → AI completely rewrites every paragraph in a new unique style:
   ├── New title & meta description
   ├── Restructured paragraphs & flow
   ├── New introduction & conclusion
   ├── Synonym replacement & sentence restructuring
   └── Natural internal links added
4. CHECK   → Uniqueness checker ensures <15% similarity to original
5. OPTIMIZE → SEO-optimized slug, meta tags, JSON-LD, alt text
6. PUBLISH → Auto-publishes with drip scheduling
```

### 🧠 Anti-Detection Features
- **Full paragraph rewrite** — not just spinning, complete restructuring
- **Tone & style transformation** — changes voice, perspective, examples
- **New structure** — reorders sections, adds new headings
- **Unique images** — new alt text, renamed files, compressed format
- **Source rotation** — scrapes from different sites to avoid patterns
- **Drip publishing** — publishes at random intervals, not bulk

---

## 🎯 SEO Strategy (Score Target: 95+)

### Technical SEO
- ✅ Server-Side Rendering (SSR) for instant crawlability
- ✅ Dynamic XML Sitemap (auto-updates)
- ✅ Proper robots.txt
- ✅ Canonical URLs on every page
- ✅ JSON-LD Structured Data (Article, WebSite, BreadcrumbList)
- ✅ Open Graph + Twitter Cards
- ✅ Core Web Vitals optimized (LCP < 2.5s, CLS < 0.1)
- ✅ Semantic HTML5 structure
- ✅ Internal linking automation
- ✅ Breadcrumb navigation
- ✅ Mobile-first responsive design

### On-Page SEO
- ✅ AI-generated meta title (60 chars, keyword-rich)
- ✅ AI-generated meta description (155 chars, call-to-action)
- ✅ Keyword density optimization (1-2%)
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Image optimization (WebP, lazy loading, unique alt text)
- ✅ Reading time indicator
- ✅ Table of contents for long articles

### GEO Optimization
- ✅ `geo.region` meta tags
- ✅ `geo.position` + ICBM coordinates
- ✅ Hreflang tags for language targeting
- ✅ Local business structured data (if applicable)
- ✅ Region-specific content targeting

---

## 📈 1,000 Visits in 30 Days — Growth Plan

### Week 1: Foundation (Days 1-7)
| Day | Action | Expected Impact |
|-----|--------|----------------|
| 1-2 | Launch website, submit to Google Search Console | Indexing starts |
| 1-2 | Publish 10 seed articles manually | Initial content base |
| 3 | Submit sitemap to Google, Bing, Yandex | Faster crawling |
| 3-4 | Set up bot, configure 5 source websites | Automated pipeline |
| 4-7 | Bot publishes 5 articles/day = 20 articles | 30 total articles |
| 5-7 | Share on social media (Twitter, Facebook, Reddit) | ~50-100 visits |

### Week 2: Content Velocity (Days 8-14)
| Day | Action | Expected Impact |
|-----|--------|----------------|
| 8-14 | Bot publishes 8 articles/day = 56 articles | 86 total articles |
| 8 | Submit to Google News (if eligible) | News traffic |
| 9 | Start Pinterest board with article images | Pinterest SEO |
| 10 | Post in relevant Facebook groups | ~100-200 visits |
| 11-14 | Share on Quora, answer related questions with links | ~50-100 visits |

### Week 3: Authority Building (Days 15-21)
| Day | Action | Expected Impact |
|-----|--------|----------------|
| 15-21 | Bot publishes 10 articles/day = 70 articles | 156 total articles |
| 15 | Submit to Flipboard, Mix, Pocket | Referral traffic |
| 16-18 | Guest post on 2-3 related blogs (with backlinks) | Domain authority |
| 19-21 | Start email newsletter, capture emails | Return visitors |

### Week 4: Scale & Optimize (Days 22-30)
| Day | Action | Expected Impact |
|-----|--------|----------------|
| 22-30 | Bot publishes 10 articles/day = 90 articles | 246 total articles |
| 22 | Analyze Search Console data, optimize top pages | Improved rankings |
| 23-25 | Create "pillar content" — 3 comprehensive guides | Long-tail keywords |
| 26-28 | Interlink all articles strategically | Link juice distribution |
| 29-30 | Review analytics, double down on what works | Momentum |

### Traffic Breakdown Target (30 days):
| Source | Estimated Visits |
|--------|-----------------|
| Google Organic Search | 400-500 |
| Social Media (FB, Twitter, Reddit) | 200-250 |
| Referral (Quora, Pinterest, Forums) | 150-200 |
| Direct / Newsletter | 50-100 |
| **Total** | **800-1,050+** |

---

## 📁 Project Structure

```
d:\myweb/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + SEO
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Design system
│   │   ├── sitemap.ts          # Dynamic sitemap
│   │   ├── robots.ts           # Robots.txt
│   │   ├── articles/
│   │   │   ├── page.tsx        # Article listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Single article (SSG)
│   │   ├── category/
│   │   │   └── [name]/
│   │   │       └── page.tsx    # Category page
│   │   ├── admin/
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── articles/
│   │   │   │   └── page.tsx    # Article manager
│   │   │   └── bot/
│   │   │       └── page.tsx    # Bot control panel
│   │   └── api/
│   │       ├── bot/
│   │       │   ├── scrape/     # Scraping endpoint
│   │       │   ├── rewrite/    # AI rewrite endpoint
│   │       │   └── publish/    # Publish endpoint
│   │       └── articles/       # Articles CRUD API
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleGrid.tsx
│   │   ├── Hero.tsx
│   │   ├── Newsletter.tsx
│   │   └── TableOfContents.tsx
│   └── lib/
│       ├── firebase.ts         # Firebase config
│       ├── bot/
│       │   ├── scraper.ts      # Web scraper
│       │   ├── rewriter.ts     # AI rewriter
│       │   ├── image-handler.ts # Image processing
│       │   ├── uniqueness.ts   # Plagiarism checker
│       │   ├── publisher.ts    # Auto publisher
│       │   └── scheduler.ts    # Cron scheduler
│       └── seo/
│           ├── structured-data.ts
│           ├── meta-tags.ts
│           └── geo-tags.ts
├── public/
│   ├── images/
│   └── fonts/
├── .env.local                  # API keys (secret)
├── next.config.js
├── package.json
└── README.md                   # This file
```

---

## 🔐 Environment Variables

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=

# AI Provider (choose one)
OPENAI_API_KEY=
GOOGLE_GEMINI_API_KEY=

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Analytics
NEXT_PUBLIC_GA_ID=

# Bot Config
BOT_ARTICLES_PER_DAY=5
BOT_MIN_UNIQUENESS_SCORE=85
BOT_REWRITE_AGGRESSIVENESS=high
```

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel deploy
```

---

## ⚠️ Important Notes

1. **Content Quality**: The AI rewrites are designed to be high-quality, not just "spun" content
2. **Rate Limiting**: The scraper respects `robots.txt` and includes delays between requests
3. **Ethical Use**: Use this tool responsibly. Always aim for adding value to the reader
4. **API Costs**: AI rewriting costs vary. Gemini Flash is cheapest, GPT-4 most capable
5. **Monitoring**: Regularly check Google Search Console for any issues
