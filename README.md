# RiskLens - Portfolio Intelligence Platform

Intelligent portfolio risk monitoring for Indian investors.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase (see FIREBASE_SETUP.md):
```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

3. Start development server:
```bash
npm run dev
```

## Firebase Setup

This project requires Firebase for authentication and data storage.

**Important:** You must create a `.env` file with your Firebase credentials before running the app.

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed setup instructions.

## Features

- Real-time portfolio tracking with live Indian stock data
- Multi-factor risk analysis engine
- Behavioral pattern intelligence
- Portfolio simulation and rebalancing suggestions
- Firebase authentication (Email/Password + Google)
- Cloud-synced portfolio data with Firestore

## Tech Stack

- React + TypeScript
- Vite
- TailwindCSS
- Zustand (State Management)
- Firebase (Auth + Firestore)
- Framer Motion (Animations)
- Yahoo Finance API (Stock Data)

## Environment Variables

Required environment variables (see `.env.example`):

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Project Structure

```
src/
├── components/       # UI components
├── pages/           # Page components
├── store/           # Zustand stores
├── services/        # API services
├── utils/           # Utility functions
├── firebase/        # Firebase configuration
└── styles/          # Global styles
```

## Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## License

MIT
