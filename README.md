# CompetitorIQ Insights AI

A modern web application that helps product managers and businesses track competitor changes using AI-powered intelligence. Get notified about feature updates, pricing shifts, and UI changes from your competitors before they impact your business.

## Features

- **AI-Powered Competitor Tracking**: Automatically scan and monitor competitor websites for changes
- **Smart Field Extraction**: Automatically detect pricing pages, blogs, release notes, and social media links
- **Change Summaries**: Get AI-generated summaries of detected changes with impact assessment
- **Real-time Notifications**: Receive updates via Email when changes are detected
- **User Authentication**: Secure user management with Clerk authentication
- **Filtering & Search**: Filter changes by date, company, and impact level

## Prerequisites

- Node.js 18+ and npm
- Backend API server running [see backend repository](https://github.com/chiraggulati098/competitorIQ-service$0)
- Environment variables configured

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/chiraggulati098/competitorIQ-frontend.git
cd competitorIQ-frontend
```

### 2. Install Dependencies

```bash
npm i
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── HeroSection.tsx # Landing page hero
│   ├── Navigation.tsx  # Main navigation
│   └── ...
├── pages/              # Page components
│   ├── Index.tsx       # Landing page
│   ├── AddCompetitor.tsx # Add new competitor
│   ├── Summaries.tsx   # View change summaries
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Key Pages

- **Landing Page** (`/`): Marketing page with hero section, benefits, and how-it-works
- **Add Competitor** (`/add`): Form to add and configure competitor tracking
- **Track Changes** (`/track-changes`): Dashboard showing detected changes and summaries
- **Manage Tracking** (`/manage-tracking`): Manage existing competitor configurations
- **How It Works** (`/how-it-works`): Detailed explanation of the platform

## API Integration

The frontend communicates with a Python backend API for:
- Competitor scanning and field extraction
- Change detection and summarization
- User data management
- Notification delivery

---

This project was made by Chirag with ❤️