# 🏗️ BarOrder MVP: Tekninen Komponenttispesifikaatio

Tämä dokumentti erittelee kriittiset komponentit ja logiikan, jotka rakennetaan MVP-vaiheessa (Next.js + Tailwind + Supabase).

---

## 1. Asiakkaan PWA (Customer App)

Tämä on sovelluksen "kasvot". Sen on oltava kevyt, nopea ja toimittava yhdellä kädellä.

### 🧩 Komponentit (Frontend)
* **`[slug]/page.tsx` (Main Menu):** Dynaaminen sivu, joka hakee ravintolan tiedot ja menun URL-parametrin perusteella.
* **`MenuCategory.tsx`:** Horisontaalinen skrollattava lista (Oluet, Siiderit, Ruoka), jolla suodatetaan `MenuItems`.
* **`MenuCard.tsx`:** * Suuri tuotekuva.
    * Nimi ja hinta (sentteinä -> muunnos euroiksi).
    * Iso "+" -nappi, joka lisää tuotteen ostoskoriin.
* **`CartStickyBar.tsx`:** Ruudun alareunassa kelluva palkki, joka näyttää välisumman ja ohjaa tarkistusnäkymään.
* **`CheckoutDrawer.tsx`:** "Peukalolla avattava" näkymä, jossa kerrataan tilaus ja on suuri "Maksa Apple Pay / Kortti" -nappi.
* **`PickupCodeView.tsx`:** * Status-animaatio (Pending -> Ready).
    * Jättimäinen noutonumero (#042).
    * Vilkkuva aikaleima (estää kuvakaappaukset).

### ⚙️ Logiikka
* **`useCart` (Custom Hook):** Hallitsee ostoskorin tilaa (Zustand tai React Context) ja tallentaa sen `localStorageen`.
* **`GeolocationGuard.tsx`:** Tarkistaa `navigator.geolocation` -rajapinnasta, onko käyttäjä baarin koordinaattien sisällä.

---

## 2. Baarimikon Dashboard (Staff UI)

Suunniteltu käytettäväksi tiskillä olevalta tabletilta. Painopiste reaaliaikaisuudessa.

### 🧩 Komponentit (Frontend)
* **`dashboard/page.tsx`:** Päänäkymä, joka on jaettu kahteen sarakkeeseen: "Uudet tilaukset" ja "Valmiit/Noutamatta".
* **`OrderCard.tsx`:** * Näyttää pöytänumeron ja noutokoodin korostettuna.
    * Lista tuotteista.
    * Suuri status-nappi: `[ VALMISTELE ]` -> `[ VALMIS ]` -> `[ TOIMITETTU ]`.
* **`InventoryToggle.tsx`:** Lista tuotteista, joissa on "Toggle"-kytkin. Jos tuote loppuu, baarimikko täppää sen pois -> päivittää Supabasen `is_available` -kentän.
* **`AudioNotifier.tsx`:** Näkymätön komponentti, joka soittaa `ping.mp3` -äänen aina, kun tietokantaan tulee uusi `INSERT` tilauksille.

---

## 3. Backend & Integraatiot (Logic)

### ⚙️ Supabase Realtime
* **Subscription:** Dashboard tilaa muutokset `orders`-tauluun:
    ```javascript
    const orders = supabase.channel('custom-all-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        // Päivitä UI ja soita ääni
      })
      .subscribe()
    ```

### 💳 Stripe Payments
* **`api/checkout/route.ts`:** API-reitti, joka luo Stripe Checkout -session. 
    * Laskee summan palvelimella (ei luoteta frontendiin!).
    * Lisää `application_fee_amount` (sun provisio).
* **`api/webhooks/stripe/route.ts`:** Stripe ilmoittaa, kun maksu on onnistunut. 
    * Päivittää tilauksen tilaksi `paid`.
    * Triggeröi Realtime-viestin baarimikolle.

---

## 4. MVP "Hacker" -simulaatiot

Koska emme käytä fyysisiä laitteita vielä, simulointi hoidetaan seuraavasti:

1.  **QR/NFC-simulointi:** Käytetään URL-muotoa `https://barorder.io/demo-baari?table=12`.
2.  **Sijainti-simulointi:** Backendissa on `is_debug_mode` -lippu, joka ohittaa GPS-tarkistuksen kehityksen aikana.
3.  **Tilitys-simulointi:** Käytetään Stripen `test_mode` -avaimia, jotka simuloivat rahan siirtymistä Connect-tilien välillä.