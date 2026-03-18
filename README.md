# Hardware Havildar — Indian Hardware Store Tycoon 🔩

> हार्डवेयर हवलदार — Run your own Indian hardware store, inspired by Gada Electronics (TMKOC)!

## 🎮 About the Game

**Hardware Havildar** is a mobile tycoon/time-management game where you manage a chaotic Indian hardware store. Customers walk in needing nuts, bolts, wires, pipes, and paint. Serve them before their patience runs out, collect coins, unlock new shelves, and hire helpers!

---

## 🚀 How to Run (Expo Go)

```bash
cd hardware-havildar
npm install
npx expo start
```

Scan the QR code with **Expo Go** app on iOS or Android.

---

## 🎮 Game Mechanics

### Game Loop
1. Customer walks in through the entrance
2. Customer walks to the shelf of the item they need
3. Customer picks up item (shelf stock decreases)
4. Customer walks to billing counter
5. **You must be at the billing counter** to collect payment
6. When shelf stock runs low → Place a restock order
7. Items arrive in the Godown at the back of the store
8. Walk to Godown to collect items → Walk to shelf to restock
9. Don't miss billing customers — they leave angrily if patience runs out!

### Controls
- **Virtual Joystick** (bottom-left): Move your character around the store
- **Tap shelf**: Restock shelf when carrying items from godown
- **Auto-bill**: Automatically bills customers when you're standing at billing counter

---

## 🪙 Upgrade Tree

| Cost | Unlock |
|---|---|
| **FREE** | Nails shelf + Wire shelf (4 stock each) |
| 🪙 150 | Unlock PVC Pipes shelf |
| 🪙 300 | Unlock Paint shelf |
| 🪙 500 | Hire Ramu Kaka — auto-bills customers |
| 🪙 750 | Unlock Nuts & Bolts shelf |
| 🪙 1000 | Unlock Cement Bags section |
| 🪙 1500 | Hire Chotu — auto-restocks godown |
| 🪙 2500 | Expand store |
| 💎 5 gems | 2x faster restock delivery |

---

## 👥 Customer Types

| Customer | Needs | Patience | Reward |
|---|---|---|---|
| 🏠 Homeowner Uncle | Nails | 30s | 10 coins |
| 🔧 Plumber Bhaiya | PVC Pipes | 20s | 25 coins |
| ⚡ Electrician | Wire | 15s | 30 coins |
| 🏗️ Contractor Sahib | Cement | 10s | 80 coins |
| 🎨 Painting Aunty | Paint | 20s | 20 coins |

---

## 📁 Folder Structure

```
hardware-havildar/
├── app/
│   ├── _layout.tsx          ← Root layout
│   ├── index.tsx            ← Home/Title screen
│   ├── game.tsx             ← Main game screen
│   └── upgrade.tsx          ← Upgrades screen
├── src/
│   ├── components/          ← UI components
│   ├── game/                ← Game logic
│   ├── store/               ← Zustand state
│   ├── constants/           ← Game data
│   ├── hooks/               ← Custom hooks
│   └── utils/               ← Helper functions
├── assets/                  ← Images/sounds
├── app.json
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tech Stack

- **React Native** + **Expo SDK 51**
- **TypeScript** throughout
- **Zustand** for game state management
- **React Native Reanimated 3** for smooth animations
- **Expo Router** for navigation
- **AsyncStorage** for save/load persistence
- **React Native Gesture Handler** for joystick

---

## 🗺️ Roadmap

- [ ] Android optimization
- [ ] Real sprite art for player and customers
- [ ] Sound effects (coin collect, angry customer, restock)
- [ ] Multiplayer co-op (two haviladars!)
- [ ] More items: Screws, Brackets, Light bulbs, Paint rollers
- [ ] Festival events: Diwali, Holi, Monsoon Rush
- [ ] Loan system from "Sheth Ji"
- [ ] Customer reviews and reputation meter
- [ ] Delivery boy NPC for home delivery orders
