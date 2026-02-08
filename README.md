# 🛠️ Mac-A-Park - Complete Technology Stack

## Overview

Mac-A-Park leverages modern, scalable technologies across the entire stack to deliver a real-time smart parking detection system.

---

## 🎨 Frontend Stack

### Core Framework & Language
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14+ | React framework with App Router for server-side rendering and optimal performance |
| **React** | 18+ | UI library for building interactive components |
| **TypeScript** | 5+ | Type-safe JavaScript for better development experience |

### Styling & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework for rapid UI development |
| **CSS Modules** | Built-in | Scoped styling for components |
| **Lucide React** | Latest | Icon library for consistent UI elements |

### State Management & Data Fetching
| Technology | Version | Purpose |
|------------|---------|---------|
| **React Hooks** | Built-in | useState, useEffect, useContext for state management |
| **SWR** / **React Query** | Latest | Data fetching, caching, and synchronization |
| **Zustand** (optional) | Latest | Lightweight state management for global state |

### Real-time Communication
| Technology | Version | Purpose |
|------------|---------|---------|
| **WebSocket API** | Native | Real-time bidirectional communication |
| **Socket.io Client** | 4.x | Enhanced WebSocket with fallbacks |

### Maps & Geolocation
| Technology | Version | Purpose |
|------------|---------|---------|
| **Leaflet** | 1.9+ | Interactive parking lot maps |
| **React Leaflet** | 4.x | React wrapper for Leaflet |
| **Geolocation API** | Native | User GPS tracking |
| **Mapbox GL JS** (alternative) | 3.x | Advanced mapping features |

### Build Tools & Development
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 8+ | Code linting and quality checks |
| **Prettier** | 3+ | Code formatting |
| **Turbopack** | Built-in | Fast Next.js bundler |

---

## ⚙️ Backend Stack

### Runtime & Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20 LTS | JavaScript runtime for backend |
| **Python** | 3.10+ | Alternative runtime for ML integration |
| **Express.js** | 4.x | Web framework for Node.js |
| **FastAPI** | 0.104+ | Modern Python web framework (if using Python) |

### API Development
| Technology | Version | Purpose |
|------------|---------|---------|
| **RESTful API** | - | Standard HTTP API endpoints |
| **GraphQL** (optional) | Latest | Flexible query language for APIs |
| **WebSocket** | Native | Real-time data streaming |
| **Socket.io** | 4.x | WebSocket server with rooms and namespaces |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 15+ | Primary relational database for structured data |
| **Firebase Firestore** | Latest | NoSQL database for real-time updates |
| **Redis** | 7+ | Caching layer for frequently accessed data |
| **MongoDB** (alternative) | 6+ | Document database for flexible schemas |

### Cloud Platform (Google Cloud)
| Technology | Purpose |
|------------|---------|
| **Google Cloud Run** | Serverless container deployment |
| **Google Cloud Storage** | Video file storage and static assets |
| **Google Cloud SQL** | Managed PostgreSQL database |
| **Google Cloud Functions** | Serverless functions for event-driven tasks |
| **Google Cloud Pub/Sub** | Message queue for asynchronous processing |
| **Google Cloud Load Balancing** | Traffic distribution |

### Authentication & Security
| Technology | Version | Purpose |
|------------|---------|---------|
| **NextAuth.js** | 5+ | Authentication for Next.js applications |
| **JWT** | Latest | Token-based authentication |
| **bcrypt** | 5+ | Password hashing |
| **Helmet** | 7+ | Security headers for Express |
| **CORS** | Latest | Cross-origin resource sharing |

### API Documentation
| Technology | Version | Purpose |
|------------|---------|---------|
| **Swagger/OpenAPI** | 3.0 | API documentation and testing |
| **Postman** | Latest | API development and testing |

---

## 🧠 Computer Vision & Machine Learning Stack

### Core CV Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **OpenCV** | 4.8+ | Computer vision library for image/video processing |
| **opencv-python** | Latest | Python bindings for OpenCV |
| **NumPy** | 1.24+ | Numerical computing for array operations |

### Deep Learning Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **PyTorch** | 2.1+ | Deep learning framework for model training/inference |
| **TorchVision** | Latest | Computer vision utilities for PyTorch |
| **ONNX Runtime** (optional) | Latest | Optimized model inference |

### Object Detection Model
| Technology | Version | Purpose |
|------------|---------|---------|
| **YOLOv8** | Latest | State-of-the-art object detection model |
| **Ultralytics** | 8.0+ | YOLOv8 implementation and utilities |
| **YOLOv5** (alternative) | 7.0 | Mature YOLO implementation |

### Video Processing
| Technology | Version | Purpose |
|------------|---------|---------|
| **FFmpeg** | 6+ | Video encoding, decoding, and streaming |
| **imageio** | 2.31+ | Reading and writing image/video data |
| **scikit-image** | 0.21+ | Image processing algorithms |

### ML Pipeline & Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **scikit-learn** | 1.3+ | Machine learning utilities |
| **Pandas** | 2.0+ | Data manipulation and analysis |
| **Matplotlib** | 3.7+ | Data visualization |
| **TensorBoard** | Latest | Model training visualization |

---

## 🐳 DevOps & Infrastructure Stack

### Containerization
| Technology | Version | Purpose |
|------------|---------|---------|
| **Docker** | 24+ | Container platform for application packaging |
| **Docker Compose** | 2.x | Multi-container orchestration |
| **Kubernetes** (optional) | 1.28+ | Container orchestration for scaling |

### CI/CD
| Technology | Purpose |
|------------|---------|
| **GitHub Actions** | Automated testing and deployment |
| **Google Cloud Build** | Cloud-native CI/CD |
| **Docker Hub** | Container image registry |
| **Google Container Registry** | Private container registry |

### Monitoring & Logging
| Technology | Purpose |
|------------|---------|
| **Google Cloud Logging** | Centralized logging |
| **Google Cloud Monitoring** | Application and infrastructure monitoring |
| **Sentry** | Error tracking and monitoring |
| **Prometheus** (optional) | Metrics collection |
| **Grafana** (optional) | Metrics visualization |

### Version Control
| Technology | Purpose |
|------------|---------|
| **Git** | Source code version control |
| **GitHub** | Code hosting and collaboration |

---

## 📱 Additional Tools & Services

### Development Tools
| Technology | Purpose |
|------------|---------|
| **VS Code** | Primary IDE |
| **PyCharm** | Python development IDE |
| **Jupyter Notebook** | Interactive data analysis and model testing |
| **Git Bash / Terminal** | Command-line interface |

### Testing
| Technology | Version | Purpose |
|------------|---------|---------|
| **Jest** | 29+ | JavaScript testing framework |
| **React Testing Library** | 14+ | React component testing |
| **Pytest** | 7+ | Python testing framework |
| **Cypress** (optional) | 13+ | End-to-end testing |
| **Playwright** (optional) | Latest | Modern E2E testing |

### Package Management
| Technology | Purpose |
|------------|---------|
| **npm** / **yarn** / **pnpm** | Node.js package manager |
| **pip** | Python package manager |
| **venv** | Python virtual environments |

### Communication & Collaboration
| Technology | Purpose |
|------------|---------|
| **Slack** / **Discord** | Team communication |
| **Figma** | UI/UX design and prototyping |
| **Notion** / **Confluence** | Documentation and knowledge base |
| **Jira** | Project management |

---

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│  Next.js + React + TypeScript + Tailwind CSS                │
│  - User Interface                                           │
│  - Real-time Dashboard                                      │
│  - WebSocket Client                                         │
│  - GPS Integration                                          │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTPS / WebSocket
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND LAYER                           │
│  Node.js/Python + Express/FastAPI                           │
│  - REST API Endpoints                                       │
│  - WebSocket Server                                         │
│  - Business Logic                                           │
│  - Authentication                                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────────┐
│   DATABASE   │    │  CV PROCESSING   │
│              │    │                  │
│ PostgreSQL   │    │  Python + OpenCV │
│ Firebase     │    │  YOLOv8          │
│ Redis Cache  │    │  PyTorch         │
└──────────────┘    └─────────┬────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  VIDEO SOURCE    │
                    │                  │
                    │  CCTV / MP4      │
                    │  GCS Storage     │
                    └──────────────────┘
```

---

## 🔧 System Requirements

### Development Environment
- **OS:** Windows 10/11, macOS 12+, or Ubuntu 20.04+
- **RAM:** Minimum 8GB (16GB recommended)
- **Storage:** 20GB free space
- **CPU:** Multi-core processor (4+ cores recommended)
- **GPU:** Optional but recommended for ML training (NVIDIA CUDA compatible)

### Production Environment
- **Cloud Platform:** Google Cloud Platform
- **Compute:** Cloud Run (2-4 vCPUs, 4-8GB RAM)
- **Storage:** Cloud Storage (100GB+)
- **Database:** Cloud SQL (db-n1-standard-1 or higher)
- **Network:** Load Balancer with SSL/TLS

---

## 📦 Key Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "socket.io-client": "^4.6.0",
    "swr": "^2.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Backend (requirements.txt - Python)
```txt
fastapi==0.104.0
uvicorn==0.24.0
opencv-python==4.8.1.78
ultralytics==8.0.200
torch==2.1.0
torchvision==0.16.0
numpy==1.24.3
pandas==2.0.3
python-socketio==5.10.0
redis==5.0.1
psycopg2-binary==2.9.9
python-dotenv==1.0.0
pydantic==2.5.0
python-multipart==0.0.6
```

### Computer Vision (requirements.txt)
```txt
opencv-python==4.8.1.78
opencv-contrib-python==4.8.1.78
ultralytics==8.0.200
torch==2.1.0
torchvision==0.16.0
numpy==1.24.3
Pillow==10.1.0
scipy==1.11.4
scikit-image==0.21.0
imageio==2.31.6
```

---

## 🌐 External Services & APIs

| Service | Purpose | Documentation |
|---------|---------|---------------|
| **Google Maps API** | Location services and mapping | [Link](https://developers.google.com/maps) |
| **OpenStreetMap** | Alternative mapping | [Link](https://www.openstreetmap.org/) |
| **Firebase** | Authentication and real-time database | [Link](https://firebase.google.com/) |
| **Twilio** (optional) | SMS notifications | [Link](https://www.twilio.com/) |
| **SendGrid** (optional) | Email notifications | [Link](https://sendgrid.com/) |

---

## 📈 Performance Optimizations

### Frontend
- ✅ Server-side rendering (SSR) with Next.js
- ✅ Image optimization with Next.js Image component
- ✅ Code splitting and lazy loading
- ✅ WebSocket connection pooling
- ✅ Service workers for offline capability

### Backend
- ✅ Redis caching for frequent queries
- ✅ Database indexing on query fields
- ✅ Connection pooling
- ✅ Asynchronous processing with queues
- ✅ CDN for static assets

### Computer Vision
- ✅ GPU acceleration with CUDA
- ✅ Model quantization for faster inference
- ✅ Batch processing of frames
- ✅ Optimized YOLO model size
- ✅ Frame skipping for non-critical updates

---

## 🔒 Security Stack

| Technology | Purpose |
|------------|---------|
| **HTTPS/TLS** | Encrypted data transmission |
| **JWT** | Secure token-based authentication |
| **bcrypt** | Password hashing |
| **CORS** | Cross-origin security |
| **Rate Limiting** | API abuse prevention |
| **Helmet.js** | HTTP header security |
| **SQL Injection Prevention** | Parameterized queries |
| **XSS Protection** | Input sanitization |
| **CSRF Tokens** | Cross-site request forgery protection |
| **Google Cloud IAM** | Access control management |

---

## 🎯 Tech Stack Summary

### **Frontend:** Next.js + React + TypeScript + Tailwind CSS
### **Backend:** Node.js/Python + Express/FastAPI + PostgreSQL + Redis
### **Computer Vision:** Python + OpenCV + YOLOv8 + PyTorch
### **Cloud:** Google Cloud Platform (Cloud Run, Cloud Storage, Cloud SQL)
### **DevOps:** Docker + GitHub Actions + Google Cloud Build
### **Real-time:** WebSocket + Socket.io
### **Monitoring:** Google Cloud Monitoring + Sentry

---

<div align="center">

**Tech Stack Version:** 1.0  
**Last Updated:** February 2026  
**Project:** Mac-A-Park - Smart Parking Detection System

</div>