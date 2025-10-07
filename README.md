# ⚡ KSEBL Life Line - AI-Powered Grid Monitoring System

> **Real-time LT line break detection and visualization system for Kerala's power grid.**  
> Built with **Node.js + Express + React + TypeScript**, the platform enables **live monitoring, predictive alerts**, and **data-driven analytics** for substations and feeders.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/JoanathanPS/KSEBL-Life-Line)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🚀 **Live Demo**

**🌐 Application URL:** `http://localhost:5000`  
**📊 API Documentation:** `http://localhost:5000/api/v1/health`

---

## ✨ **Features**

### 🧠 **Core Functionality**
- **🎯 AI-powered Detection:** Identifies low-tension line break events in real-time
- **📡 Real-time Monitoring:** Live updates and instant notifications
- **🗺️ Interactive Maps:** Kerala grid visualization with Leaflet maps
- **📊 Analytics Dashboard:** Performance metrics and trend analysis
- **👥 Role-based Access:** Admin, Operator, and Field Crew interfaces
- **📱 Responsive Design:** Works on desktop, tablet, and mobile

### 📊 **Visual Analytics**
- **📈 Performance Metrics:** Model accuracy, detection times, response rates
- **📊 Interactive Charts:** Daily trends, monthly accuracy, response times
- **🗺️ Live Map Integration:** Real-time substation and event plotting
- **📋 Event Management:** Complete lifecycle tracking (detected → acknowledged → resolved)
- **⚙️ Settings Panel:** Customizable notifications and system preferences

---

## 🏗️ **Architecture Overview**

```
📦 KSEBL-Life-Line/
├── 📁 client/                 # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   └── api/              # API client
│   └── vite.config.ts
├── 📁 server/                # Express.js Backend
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   └── config/           # Configuration
│   └── index.ts
├── 📁 shared/                # Shared types and utilities
├── 📄 index.html             # Main application entry point
├── 📄 server-simple.js       # Simple Express server
└── 📄 package.json
```

---

## 🚀 **Quick Start Guide**

### **Prerequisites**
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### **1️⃣ Clone the Repository**
   ```bash
git clone https://github.com/JoanathanPS/KSEBL-Life-Line.git
cd KSEBL-Life-Line
   ```

### **2️⃣ Install Dependencies**
   ```bash
   npm install
   ```

### **3️⃣ Start the Application**

#### **Option A: Simple Server (Recommended)**
```bash
npm run server:simple
```
**🌐 Open:** `http://localhost:5000`

#### **Option B: Full Development Mode**
```bash
# Terminal 1 - Start Backend
npm run server:dev

# Terminal 2 - Start Frontend
npm run client:dev
```
**🌐 Frontend:** `http://localhost:5173`  
**🌐 Backend:** `http://localhost:5000`

### **4️⃣ Verify Installation**
```bash
# Test API health
curl http://localhost:5000/api/v1/health

# Test dashboard data
curl http://localhost:5000/api/v1/dashboard/summary
```

---

## 📡 **API Endpoints**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/health` | GET | System health check |
| `/api/v1/dashboard/summary` | GET | Dashboard overview data |
| `/api/v1/events` | GET | Fetch all line break events |
| `/api/v1/substations` | GET | Get all substations |
| `/api/v1/feeders` | GET | Get all feeders |
| `/api/v1/analytics/performance` | GET | AI model performance metrics |

---

## 🎯 **Application Pages**

### **📊 Dashboard**
- Real-time grid overview
- Interactive Kerala map
- Live event monitoring
- Performance metrics

### **🚨 Events Management**
- Event filtering and search
- Status management (detected → acknowledged → resolved)
- Severity classification
- Assignment tracking

### **🏭 Substations**
- Grid view of all substations
- Status monitoring (operational/maintenance/offline)
- Capacity and feeder information
- Location mapping

### **🔌 Feeders**
- Comprehensive feeder management
- Load and consumer statistics
- Area type classification
- Inspection tracking

### **📈 Analytics**
- AI model performance metrics
- Detection statistics
- Trend analysis charts
- Confusion matrix data

### **⚙️ Settings**
- Notification preferences
- Alert severity settings
- System configuration
- User preferences

---

## 🛠️ **Development Commands**

```bash
# Install dependencies
npm install

# Start simple server (recommended)
npm run server:simple

# Start full development mode
npm run dev

# Build frontend
npm run build:client

# Start production server
npm run server:prod

# Run tests
npm test

# Lint code
npm run lint
```

---

## 🎨 **Technology Stack**

### **Frontend**
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **Leaflet** - Maps
- **Axios** - HTTP client
- **Font Awesome** - Icons

### **Backend**
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
- **Dotenv** - Environment variables

### **Development Tools**
- **Vite** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 📊 **Mock Data**

The application includes comprehensive mock data for:
- **45 Substations** across Kerala
- **342 Active Feeders** with load data
- **Real-time Events** with different severities
- **Performance Metrics** and analytics
- **User Management** and authentication

---

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### **API Configuration**
- **Base URL:** `http://localhost:5000/api/v1`
- **CORS:** Enabled for all origins
- **Rate Limiting:** Configured for production

---

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build:client`
3. Set output directory: `dist`
4. Deploy!

### **Manual Deployment**
```bash
# Build the application
npm run build:client

# Start production server
npm run server:prod
```

---

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Contributors**

- **Aftan Faiz** - Project Leader
- **Joanathan Packia Singh** - Developer

---

## 🗺️ **Roadmap**

- [ ] **ML Integration** - TensorFlow.js model deployment
- [ ] **Mobile App** - React Native application
- [ ] **Real-time Updates** - WebSocket integration
- [ ] **Advanced Analytics** - Predictive maintenance
- [ ] **GIS Integration** - Advanced mapping features
- [ ] **Offline Support** - Service Worker implementation

---

## 🆘 **Troubleshooting**

### **Common Issues**

**❌ Blank Page on Load**
```bash
# Clear browser cache and restart server
npm run server:simple
```

**❌ API Connection Issues**
```bash
# Check if server is running
curl http://localhost:5000/api/v1/health
```

**❌ Port Already in Use**
```bash
# Kill existing processes
taskkill /F /IM node.exe
npm run server:simple
```

---

## 📞 **Support**

- **GitHub Issues:** [Create an issue](https://github.com/JoanathanPS/KSEBL-Life-Line/issues)
- **Email:** [Contact us](mailto:support@ksebl-life-line.com)
- **Documentation:** [Read the docs](https://github.com/JoanathanPS/KSEBL-Life-Line/wiki)

---

**Built with ❤️ in Kerala — powering safer grids with data and intelligence.**

[![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/JoanathanPS/KSEBL-Life-Line)
[![Kerala](https://img.shields.io/badge/Kerala-🌴-green?style=for-the-badge)](https://kerala.gov.in/)