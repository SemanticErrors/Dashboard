#  Dashboard

A retro-themed dashboard application inspired by 70s disco era aesthetics, built with React 19, TypeScript, and Vite.

![70s Groove Theme](https://img.shields.io/badge/Theme-70s%20Groove-ff8c42?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite)

## Features

- **Retro 70s Design** - Warm earth tones, halftone patterns, curved stripes, and chunky borders
- **User Management** - Browse and view detailed user information from JSONPlaceholder API
- **Note Taking** - Create and manage notes with retro-styled interface
- **Analytics Dashboard** - View simple analytics with groovy visualizations
- **Weather Card** - Display weather information with 70s flair
- **Authentication** - Session-based login system with demo credentials
- **Responsive Design** - Mobile-friendly layout that maintains retro aesthetics

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/React-Dashboard.git

# Navigate to the project directory
cd Dashboard

# Install dependencies
npm install
```

### Development

```bash
# Start development server with hot module replacement
npm run dev
```

Visit `http://localhost:5173` to view the application.

### Building for Production

```bash
# Compile TypeScript and build optimized bundle
npm run build
```

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

## Authentication

The application uses demo credentials for authentication:

- **Username**: `youssef`
- **Password**: `marzouk2024`

Authentication state is stored in sessionStorage and persists across page refreshes during the browser session.

## Project Structure

```
Dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── NoteManager.tsx
│   │   ├── SimpleAnalytics.tsx
│   │   ├── UserManager.tsx
│   │   └── WeatherCard.tsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx
│   ├── pages/               # Route page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── UserDetail.tsx
│   ├── styles/              # SCSS stylesheets
│   │   ├── _variables.scss
│   │   ├── dashboard.scss
│   │   ├── login.scss
│   │   ├── notes.scss
│   │   ├── userDetail.scss
│   │   ├── users.scss
│   │   └── weatherCard.scss
│   ├── App.tsx             # Route configuration
│   ├── index.scss          # Global styles
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── CLAUDE.md              # AI assistant instructions
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```
