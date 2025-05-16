## 🔧 Követelmények

- **Docker Desktop** vagy bármilyen Docker engine legyen telepítve és futtatva.

## 🚀 Alkalmazás indítása

1. **Nyisd meg a projekt gyökerét terminálban.**
2. **Futtasd az alábbi parancsot:**

   ```bash
   docker compose up --build
   ```

3. **Amint az alkalmazás elindult:**
   - A **frontend** elérhető a böngészőben: [http://localhost:4200](http://localhost:4200)

## 🧪 Tesztfelhasználók

A rendszer inicializálásakor egy **seed script** automatikusan létrehoz példafiókokat:

| Szerepkör  | E-mail               | Jelszó            |
|------------|----------------------|--------------------|
| Admin      | `admin@example.com`  | `adminPassword`    |
| Customer   | `customer@example.com` | `customerPassword` |

Ezekkel a felhasználókkal bejelentkezhetsz és kipróbálhatod a funkciókat (pl. vásárlás, admin felület).