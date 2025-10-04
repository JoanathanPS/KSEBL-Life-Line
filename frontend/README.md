# Kerala LT Line Break Detection System - Frontend

A modern React-based frontend application for monitoring and managing electrical line break detection in Kerala's power distribution system.

## 🚀 Features

- **Real-time Monitoring**: Live updates of electrical events and system status
- **Interactive Maps**: Leaflet-based mapping with real-time event visualization
- **Role-based Access**: Admin, Operator, and Field Crew user roles
- **Analytics Dashboard**: Comprehensive charts and metrics using Recharts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Real-time Notifications**: Toast notifications for system alerts
- **Modern UI Components**: Clean, accessible components following design system

## 🛠️ Tech Stack

- **React 18+** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Axios** for API communication
- **Supabase Realtime** for real-time updates
- **Recharts** for data visualization
- **Leaflet** for interactive maps
- **Framer Motion** for animations
- **Lucide React** for icons

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                 # API clients and endpoints
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── Header.tsx      # Application header
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   ├── Footer.tsx      # Application footer
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── StatsCard.tsx   # Statistics display card
│   │   ├── AlertPanel.tsx  # Event alerts panel
│   │   ├── LiveMap.tsx     # Interactive map component
│   │   ├── EventTimeline.tsx # Event timeline component
│   │   ├── WaveformChart.tsx # Power waveform chart
│   │   ├── LoginForm.tsx   # Authentication form
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route page components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions and constants
│   ├── styles/             # Global styles and CSS
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8000
- Supabase instance (optional for real-time features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration
VITE_APP_NAME=Kerala LT Line Break Detection System
VITE_APP_VERSION=1.0.0
```

### API Integration

The application expects a REST API with the following endpoints:

- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user
- `GET /dashboard/stats` - Dashboard statistics
- `GET /events` - List events with filtering
- `GET /substations` - List substations
- `GET /feeders` - List feeders

## 🎨 UI Components

### Core Components

- **Button**: Customizable button with variants and sizes
- **Card**: Container component with header, content, and footer
- **Input**: Form input with validation and error states
- **Modal**: Overlay modal with backdrop and keyboard navigation
- **Table**: Data table with sorting and filtering

### Specialized Components

- **StatsCard**: Display key metrics with trend indicators
- **AlertPanel**: Show active system alerts
- **LiveMap**: Interactive map with event markers
- **EventTimeline**: Chronological event display
- **WaveformChart**: Power system waveform visualization

## 🔐 Authentication

The application uses JWT-based authentication with:

- Login/logout functionality
- Token refresh mechanism
- Protected routes based on user roles
- Role-based component rendering

### User Roles

- **Admin**: Full system access
- **Operator**: Event management and monitoring
- **Field Crew**: Limited access to assigned events

## 📊 Real-time Features

- Supabase Realtime integration for live updates
- WebSocket connections for event notifications
- Live map updates with new event markers
- Real-time dashboard statistics

## 🎯 Key Pages

1. **Dashboard**: Overview of system status and recent events
2. **Events**: Event management and filtering
3. **Substations**: Substation monitoring and management
4. **Feeders**: Feeder status and maintenance
5. **Analytics**: System performance metrics and charts
6. **Settings**: User preferences and account management

## 🧪 Development

### Code Style

- TypeScript strict mode enabled
- ESLint configuration for code quality
- Prettier for code formatting
- Component-based architecture
- Custom hooks for reusable logic

### Testing

```bash
npm run test        # Run tests
npm run test:watch  # Watch mode
npm run test:coverage # Coverage report
```

### Linting

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Fix auto-fixable issues
```

## 🚀 Deployment

### Build Optimization

- Code splitting with dynamic imports
- Tree shaking for smaller bundles
- Image optimization
- CSS purging for production

### Deployment Options

1. **Static Hosting** (Vercel, Netlify)
2. **Docker Container**
3. **Traditional Web Server**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Kerala LT Line Break Detection System** - Modernizing power distribution monitoring in Kerala.