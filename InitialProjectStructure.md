/barorder-pwa
├── /app
│   ├── /(customer)
│   │   └── /[slug]/page.tsx      <-- Menunäkymä
│   │   └── /success/page.tsx     <-- Kiitos/Noutonumero
│   ├── /(staff)
│   │   └── /dashboard/page.tsx   <-- Baarimikon näkymä
│   ├── /api
│   │   └── /checkout/route.ts    <-- Stripe Session luonti
│   │   └── /webhook/stripe/route.ts <-- Maksun vahvistus
├── /components
│   ├── /ui                       <-- Buttonit, Cardit jne.
│   ├── /cart                     <-- Ostoskori-logiikka
│   └── /dashboard                <-- Tilauskortit
├── /lib
│   ├── supabase.ts               <-- Supabase-client
│   └── stripe.ts                 <-- Stripe-config
├── /hooks
│   └── useRealtimeOrders.ts      <-- Supabase subscription
└── .env.local                    <-- API-avaimet