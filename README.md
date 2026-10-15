# Gada Marketplace - Web Application

A modern on-demand multi-vendor commerce and rapid delivery web platform built for high speed, interactive customer ordering, live GPS dispatch tracking, and in-app communications.

---

## 🚀 Key Features

- **Multi-Vendor Storefront**: Browse restaurants, supermarkets, pharmacies, and specialty stores with instant category filtering and real-time search.
- **Interactive Cart & Checkout**:
  - Live order calculation, discount promo codes (`GADAFREE`), and delivery fee calculation.
  - Multiple payment methods: **Flutterwave Gateway** (Card, Bank Transfer, USSD) and **Gada In-App Wallet**.
  - Flexible delivery options: Immediate dispatch or scheduled time slots.
- **Live Rider GPS Tracking**:
  - Continuous real-time courier movement with smooth coordinates interpolation.
  - Live radar pulse, telemetry speedometer (km/h), dynamic ETA countdown, and turn-by-turn road alerts.
  - Dual map views: Vector radar schematic view & Google Maps satellite view.
- **In-App Customer-Courier Chat**:
  - Built-in instant messaging with simulated courier replies, quick action tags, and Web Audio API chime notifications.
- **Package Delivered Pop-Up**:
  - Celebratory delivery confirmation screen with verified courier badge, 5-star rating, and compliment chips.
- **Full Legal & Governance Compliance**:
  - Terms of Service, Privacy Policy, Cookies Policy (with granular preference manager), NDPR compliance, and Digital Services Act (DSA) disclosures for Gadatech Integrated Synergy Ltd (RC: 7357388).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: Flutterwave React SDK (`flutterwave-react-v3`)
- **State Management**: Zustand & React Hooks
- **Styling**: Vanilla CSS + Tailwind utility classes
- **Audio Notifications**: Web Audio API (zero external asset dependencies)

---

## 📦 Getting Started (Local Development)

### 1. Prerequisites
- Node.js version 18 or higher (Node 20+ recommended)
- npm or yarn or pnpm

### 2. Installation
```bash
# Clone or extract the project directory, then navigate into it:
cd gada-marketplace

# Install all project dependencies:
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your Flutterwave public key:
```env
VITE_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key_here
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=your_flutterwave_public_key_here
```

### 4. Run Development Server
```bash
npm run dev
```
The application will start on `http://localhost:5173`.

---

## 🏗️ Production Build

To build the static application bundle for production:
```bash
npm run build
```
This produces an optimized, minified bundle in the `dist/` directory ready to be served by any static host or web server.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended - Fastest)
1. Push the code to a GitHub/GitLab repository.
2. Go to [vercel.com](https://vercel.com) and import the repository.
3. Vercel automatically detects **Vite**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add your environment variables (`VITE_FLUTTERWAVE_PUBLIC_KEY`) in the Vercel project settings.
5. Click **Deploy**.

> **Note for SPA Routing on Vercel**: Create a `vercel.json` in the root folder if needed:
> ```json
> {
>   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
> }
> ```

---

### Option 2: Netlify
1. Log into [netlify.com](https://www.netlify.com/) and click **Add new site** > **Import an existing project**.
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add a `public/_redirects` file with:
   ```
   /*    /index.html   200
   ```
4. Add environment variables and deploy.

---

### Option 3: Cloudflare Pages
1. In the Cloudflare dashboard, go to **Workers & Pages** > **Create application** > **Pages**.
2. Connect your Git repository.
3. Build configuration:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Set environment variables and click **Save and Deploy**.

---

### Option 4: Linux VPS / Nginx / Apache
1. Build the production files:
   ```bash
   npm run build
   ```
2. Upload the contents of the `dist/` folder to your server (e.g. `/var/www/gada-marketplace`).
3. Sample Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       root /var/www/gada-marketplace;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
           expires 1y;
           add_header Cache-Control "public, no-transform";
       }
   }
   ```
4. Set up an SSL certificate with Certbot:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

## 📁 Key Directory Structure

```
gada-marketplace/
├── public/                 # Static assets & icons
├── src/
│   ├── components/         # Core UI & Views (Header, Footer, CheckoutModal, etc.)
│   │   ├── chat/           # In-app Customer-Rider Chat Modal
│   │   ├── tracking/       # Live GPS Map Tracking & Delivered Screen Pop-Up
│   │   └── vendor/         # Merchant storefront components
│   ├── context/            # Global React Contexts (AuthContext, etc.)
│   ├── lib/                # Audio chimes & sound notification helpers
│   ├── services/           # Data services (orders, auth, location)
│   ├── types/              # TypeScript interface definitions
│   ├── App.jsx             # Main Application routing & state orchestrator
│   ├── index.css           # Global typography, colors & CSS design tokens
│   └── main.jsx            # React root DOM mount
├── .env.example            # Environment variables template
├── package.json            # Project dependencies & build scripts
└── vite.config.js          # Vite bundler & path aliases configuration
```

---

## 📞 Support & Contacts

- **Company**: Gadatech Integrated Synergy Ltd
- **RC Number**: 7357388
- **Address**: 202 Festac Town, Lagos State, Nigeria
- **Customer Care**: +234 907 268 8238
