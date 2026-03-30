# 🍻 BarOrder PWA (MVP) - Projektisuunnitelma

Tämä dokumentti määrittelee hyper-lokaalin baaritilausjärjestelmän, joka poistaa tilaamisen kitkan ja tehostaa ravintolan myyntiä PWA-teknologian ja automatisoidun maksunvälityksen avulla.

---

## 1. Visio & Arvolupaus

**"Tilaa tuoppi ennen kuin ehdit tiskille."**

BarOrder on kevyt, selainpohjainen (PWA) alusta, joka tunnistaa asiakkaan sijainnin (NFC/QR/URL) ja mahdollistaa tilauksen tekemisen sekä maksamisen sekunneissa ilman sovelluskauppavierailua.

### Tärkeimmät hyödyt
* **Asiakas:** Ei jonoja, ei lataamista, maksu yhdellä klikkauksella (Apple/Google Pay).
* **Ravintola:** Korkeampi keskiostos, vähemmän jonopainetta, automatisoitu tilitys.
* **Kehittäjä:** Skaalautuva SaaS-malli minimaalisella rautainvestoinnilla.

---

## 2. Tekninen Arkkitehtuuri (The Stack)

Valittu nopeuden, reaaliaikaisuuden ja skaalautuvuuden perusteella:

* **Frontend:** [Next.js](https://nextjs.org/) (React) + [Tailwind CSS](https://tailwindcss.com/)
* **Backend & DB:** [Supabase](https://supabase.com/) (PostgreSQL + Realtime WebSockets)
* **Maksut:** [Stripe Connect](https://stripe.com/en-fi/connect) (Automaattinen rahojen jako ja tilitys)
* **Hosting:** Vercel (Frontend) & Supabase Cloud (Backend)
* **Sijainti (MVP):** URL-parametrit + Geolocation API (selain)

---

## 3. Tietokantaskema (ER-malli)

```sql
-- Ravintolat
CREATE TABLE bars (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug varchar UNIQUE, -- esim. 'bar-loose'
  name varchar NOT NULL,
  location_lat float,
  location_long float,
  stripe_account_id varchar, -- Connect-tilin ID
  is_active boolean DEFAULT true
);

-- Ruokalista
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id uuid REFERENCES bars(id),
  name varchar NOT NULL,
  description text,
  price int NOT NULL, -- sentteinä (Stripe standardi)
  vat_rate int DEFAULT 24, -- 14 tai 24
  category varchar, -- olut, viini, ruoka
  is_available boolean DEFAULT true
);

-- Tilaukset
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  bar_id uuid REFERENCES bars(id),
  table_number varchar,
  items jsonb, -- [{id, name, price, qty}]
  total_amount int NOT NULL,
  status varchar DEFAULT 'pending', -- pending, paid, preparing, ready, delivered
  pickup_code varchar, -- esim. #042
  stripe_payment_intent_id varchar,
  created_at timestamp WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

---


## 4. Käyttäjäpolut (User Flows)

### 4.1 Asiakkaan polku
1. **Sisääntulo:** Asiakas skannaa NFC-tagin tai QR-koodin (`tilaa.fi/bar-loose?poyta=12`).
2. **Menu:** Selain avaa PWA-näkymän. Tuotteet on kategorisoitu selkeästi (Oluet, Viinit, Naposteltavat).
3. **Tilaus:** Asiakas valitsee tuotteet ostoskoriin.
4. **Maksu:** Stripe Checkout aukeaa. Maksu vahvistetaan FaceID:llä tai kortilla.
5. **Seuranta:** Asiakas saa noutonumeron (esim. **#042**) ja reaaliaikaisen tilatiedon.
6. **Nouto:** Puhelin värisee -> Asiakas noutaa juomat tiskiltä näyttämällä noutonumeron.

### 4.2 Henkilökunnan polku (Dashboard)
1. **Näkymä:** Tabletti näyttää reaaliaikaisen virran saapuvista ja maksetuista tilauksista.
2. **Valmistus:** Baarimikko ottaa tilauksen työn alle (Status muuttuu: `preparing`).
3. **Kuittaus:** Baarimikko painaa "Valmis" -> Asiakkaalle lähtee automaattinen ilmoitus (`ready`).
4. **Luovutus:** Kun asiakas hakee juomat, baarimikko täppää tilauksen toimitetuksi (`delivered`).

---

## 5. MVP:n kriittiset ominaisuudet

### 🟢 Customer App (Web PWA)
- [ ] **Dynaaminen menu:** Sisällön haku URL-slugin perusteella.
- [ ] **Ostoskori-logiikka:** Tilauksen koostaminen paikallisessa tilassa.
- [ ] **Stripe-integraatio:** Turvallinen maksutapahtuma ilman manuaalista kortinsyöttöä.
- [ ] **Reaaliaikaisuus:** Automaattinen tilapäivitys ilman sivun virkistystä.
- [ ] **UI/UX:** Dark mode ja suuret interaktiiviset elementit (kännikestävyys).

### 🔵 Staff Dashboard
- [ ] **Tilausvirta:** Listanäkymä, joka järjestää tilaukset ajan mukaan.
- [ ] **Tilanhallinta:** Painikkeet tilauksen statuksen muuttamiseen.
- [ ] **Inventaario-vipu:** Mahdollisuus poistaa tuote valikoimasta lennosta.
- [ ] **Notifikaatiot:** Äänimerkit uuden maksun saapuessa.

### 🟡 Admin & Backend
- [ ] **Stripe Connect:** Alustan ja ravintoloiden tilien linkitys.
- [ ] **Provisiologiikka:** Automaattinen "Application Fee" -veloitus.
- [ ] **Raportointi:** Päivittäinen myyntikooste PDF/CSV-muodossa.

---

## 6. Sijainti & Turvallisuus (Hacker's Strategy)

* **Geofencing:** Hyödynnetään selaimen `Geolocation API`:a varmistamaan, että tilaaja on fyysisesti ravintolan alueella.
* **Petosten esto:** Noutonumero on lyhytikäinen ja Dashboard toimii ainoana virallisena vahvistuksena maksusta.
* **Offline-tuki:** Tärkeimmät tilaustiedot tallennetaan `localStorage`:en, jotta noutonumero säilyy, vaikka verkko pätkisi kellarissa.

---

## 7. Liiketoimintamalli

* **SaaS-lisenssi:** 49€ – 99€ / kk (Kiinteä kulu ravintolalle).
* **Transaktiokomissio:** 1 % per tilaus (Tämä on oma katteesi Stripen kulujen päälle).
* **Tilitysmalli:** Stripe Connect hoitaa automaattiset tilitykset ravintolan tilille (Payouts).

---

## 8. Seuraavat askeleet

1. **Initial Commit:** Perusrakenteen pystytys (Next.js + Tailwind).
2. **Supabase Setup:** Tietokantataulujen ja RLS (Row Level Security) -sääntöjen luonti.
3. **Maksutestit:** Stripe Connect -testitilien luonti ja Checkout-testit.
4. **UI-Proto:** Ensimmäisen tilausnäkymän koodaus ja mobiilitestaus.