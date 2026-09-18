# 🚗 Instant Mechanic — Operations Dashboard

A full-stack real-time operations dashboard for an on-demand vehicle service platform.

The dashboard provides a centralized view of bookings, mechanics, customers, revenue, service performance, and operational analytics. It uses a REST API backed by MongoDB Atlas and Socket.IO for real-time updates without requiring a full page refresh.

---

## 🌐 Live Demo

### Frontend
https://instant-mechanic-dashboard-psi.vercel.app/

### Backend API
https://instant-mechanic-backend-615s.onrender.com

### API Documentation
https://instant-mechanic-backend-615s.onrender.com/api/docs/

### API Health Check
https://instant-mechanic-backend-615s.onrender.com/api/health

### GitHub Repository
https://github.com/kunalhoonmai/instant-mechanic-dashboard

---

## 📌 Project Overview

Instant Mechanic is an operations management dashboard designed for a vehicle-service business managing bookings, mechanics, customers, and services at scale.

The system allows operations teams to:

- Monitor overall booking activity
- Track today's bookings
- Monitor pending, assigned, completed, and cancelled bookings
- Track total revenue and average booking value
- Monitor mechanic availability and workload
- Manage customer information
- Analyze booking and revenue trends
- Analyze service performance
- View mechanic performance
- Update operational data in real time
- Access backend APIs through Swagger/OpenAPI documentation

The project is built as a separate frontend and backend application with MongoDB Atlas as the database.

---

## ✨ Key Features

### 📊 Dashboard Overview

The overview dashboard provides a high-level operational snapshot including:

- Total bookings
- Today's bookings
- Completed bookings
- Pending bookings
- Assigned bookings
- Cancelled bookings
- Total revenue
- Average booking value
- Completion rate
- Cancellation rate
- Total customers
- Total mechanics
- Active mechanics
- New customers
- Service performance
- Booking trends

---

### 📅 Booking Management

The bookings section provides an operational view of all service bookings.

Each booking contains:

- Booking ID
- Customer
- Phone
- Vehicle
- Service
- Assigned mechanic
- Booking date
- Booking time
- Amount
- Status

Supported booking statuses:

- Pending
- Assigned
- Completed
- Cancelled

The interface includes search, filtering, sorting, pagination, booking details, and booking actions.

---

### 🔧 Mechanic Management

The mechanics dashboard provides visibility into the current operational state of service technicians.

It includes:

- Mechanic name
- Phone number
- Specialization
- Experience
- Rating
- Availability
- Current status
- Jobs completed today
- Current/last booking information

Mechanic status is derived from operational booking activity and availability.

---

### 👥 Customer Management

The customer section provides customer-level operational information including:

- Customer ID
- Customer name
- Phone
- Email
- Address
- Vehicle
- Total bookings
- Completed bookings
- Pending bookings
- Cancelled bookings
- Total spending
- Last booking
- Customer status

Customer statistics are calculated from actual booking data stored in MongoDB.

---

### 📈 Analytics

The analytics dashboard provides deeper operational insights through:

- Booking trends
- Revenue trends
- Booking status distribution
- Service performance
- Mechanic performance
- Completion rate
- Cancellation rate
- Average booking value
- Customer metrics

Analytics can be viewed across different time periods.

---

### ⚡ Real-Time Updates

The dashboard uses **Socket.IO** for real-time communication between the backend and frontend.

Events are emitted for important operational changes such as:

- Booking created
- Booking updated
- Booking deleted
- Mechanic created
- Mechanic updated
- Customer created
- Customer updated

The frontend listens for these events and updates the relevant dashboard state without requiring a complete page reload.

---

### ⚙️ Settings

The Settings page provides:

- Account information
- System status
- Appearance controls
- Notification preferences
- Backend connection status
- Socket.IO connection status

The application also supports light and dark appearance modes.

---

## 🏗️ Architecture

The project follows a separated frontend/backend architecture.

```text
┌──────────────────────────────┐
│          User / Browser      │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       Next.js Frontend       │
│                              │
│  Dashboard                   │
│  Bookings                    │
│  Mechanics                   │
│  Customers                   │
│  Analytics                   │
│  Settings                    │
└──────────────┬───────────────┘
               │
        REST API + Socket.IO
               │
               ▼
┌──────────────────────────────┐
│      Express + Node.js       │
│                              │
│ Controllers                  │
│ Services                     │
│ Routes                       │
│ Socket.IO                    │
│ Swagger / OpenAPI            │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        MongoDB Atlas         │
│                              │
│ Bookings                     │
│ Customers                    │
│ Mechanics                    │
│ Services                     │
└──────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui / Base UI
- Recharts
- Axios
- Socket.IO Client
- TanStack Table
- Lucide Icons
- MUI

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- Socket.IO
- Swagger UI
- OpenAPI

### Database

- MongoDB Atlas

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

### Development Tools

- Git
- GitHub
- npm
- ESLint
- TypeScript

---

## 📂 Project Structure

```text
instant-mechanic-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── docs/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── socket/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

---

## 🗄️ Database

The application uses MongoDB Atlas.

The main collections are:

### Bookings

Stores:

- Booking ID
- Customer reference
- Mechanic reference
- Service reference
- Vehicle information
- Date
- Time
- Amount
- Status
- Notes
- Timestamps

### Customers

Stores:

- Customer ID
- Name
- Phone
- Email
- Address
- Vehicles
- Timestamps

### Mechanics

Stores:

- Mechanic ID
- Name
- Phone
- Specialization
- Experience
- Rating
- Availability
- Timestamps

### Services

Stores:

- Service ID
- Name
- Description
- Base price
- Duration
- Active status
- Timestamps

---

## 🌱 Seed Data

The project includes a realistic database seed script for development and demonstration.

The seeded database contains:

| Entity | Records |
|---|---:|
| Services | 8 |
| Mechanics | 24 |
| Customers | 60 |
| Bookings | 600 |

The seed data includes multiple:

- Service categories
- Booking statuses
- Dates
- Amounts
- Customers
- Vehicles
- Mechanics
- Mechanic assignments

This provides enough data to demonstrate dashboard analytics, tables, filtering, pagination, and operational workflows.

---

## 🔌 API

The backend exposes REST APIs for the main dashboard entities.

### Health

```http
GET /api/health
```

### Dashboard

```http
GET /api/dashboard
```

### Bookings

```http
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings
PATCH  /api/bookings/:id
DELETE /api/bookings/:id
```

### Mechanics

```http
GET   /api/mechanics
GET   /api/mechanics/:id
POST  /api/mechanics
PATCH /api/mechanics/:id
```

### Customers

```http
GET   /api/customers
GET   /api/customers/:id
POST  /api/customers
PATCH /api/customers/:id
```

### Services

```http
GET /api/services
GET /api/services/:id
```

### Analytics

```http
GET /api/analytics
```

Analytics supports a period query parameter:

```http
GET /api/analytics?period=today
GET /api/analytics?period=week
GET /api/analytics?period=month
```

---

## 📖 API Documentation

Interactive Swagger/OpenAPI documentation is available in production:

**Swagger UI**

https://instant-mechanic-backend-615s.onrender.com/api/docs/

The documentation includes:

- Available endpoints
- Request parameters
- Request bodies
- Response schemas
- Booking APIs
- Mechanic APIs
- Customer APIs
- Service APIs
- Dashboard API
- Analytics API
- Health endpoint

---

## 💻 Local Development

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

---

## 🚀 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
CLIENT_URL=http://localhost:3000
```

Build the backend:

```bash
npm run build
```

Start the production build:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

Swagger documentation:

```text
http://localhost:5000/api/docs/
```

---

## 🌱 Seed the Database

From the backend directory:

```bash
npm run seed
```

The seed script clears existing application data and creates a fresh demonstration dataset.

Expected seeded data:

```text
Services: 8
Mechanics: 24
Customers: 60
Bookings: 600
```

---

## 🖥️ Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend

```env
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
CLIENT_URL=http://localhost:3000
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

For production, the frontend variables point to the deployed Render backend.

Example:

```env
NEXT_PUBLIC_API_URL=https://instant-mechanic-backend-615s.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://instant-mechanic-backend-615s.onrender.com
```

**Do not commit `.env` or `.env.local` files to GitHub.**

---

## 🌍 Production Deployment

### Frontend

The Next.js frontend is deployed using Vercel.

Production environment variables:

```env
NEXT_PUBLIC_API_URL=https://instant-mechanic-backend-615s.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://instant-mechanic-backend-615s.onrender.com
```

Production frontend:

https://instant-mechanic-dashboard-psi.vercel.app/

### Backend

The Node.js/Express backend is deployed using Render.

Production backend:

https://instant-mechanic-backend-615s.onrender.com

The backend uses:

```text
Build Command:
npm install && npm run build

Start Command:
npm start
```

MongoDB Atlas is used as the production database.

---

## ☁️ Deployment Note

The backend was initially prepared for AWS EC2 deployment as specified in the assignment.

During AWS account activation, the available AWS India registration flow required payment-method verification/UPI AutoPay authorization.

Since this project was required to remain at **zero deployment cost**, the backend was deployed to **Render Free Web Service** instead.

The deployed backend retains the same:

- Express architecture
- REST API
- MongoDB Atlas integration
- Socket.IO real-time architecture
- TypeScript codebase
- Swagger/OpenAPI documentation

Only the hosting provider was changed to maintain the zero-cost deployment constraint.

---

## ⚡ Real-Time Architecture

Socket.IO is initialized on the backend HTTP server.

When an operational mutation occurs, the backend emits an event.

Example:

```text
User Action
    │
    ▼
REST API
    │
    ▼
Controller
    │
    ▼
Service
    │
    ▼
MongoDB
    │
    ▼
Socket.IO Event
    │
    ▼
Connected Frontend Clients
```

Example events:

```text
booking:created
booking:updated
booking:deleted

mechanic:created
mechanic:updated

customer:created
customer:updated
```

This allows connected dashboard clients to receive updates without requiring a complete browser refresh.

---

## 🎨 UI / UX

The dashboard was designed with an operations-focused interface emphasizing:

- Clear information hierarchy
- Responsive layouts
- Consistent spacing
- Reusable UI components
- Status indicators
- Data tables
- Charts
- Loading states
- Error states
- Empty states
- Skeleton loading
- Responsive mobile navigation
- Dark mode
- Interactive controls
- Toast/alert feedback
- Real-time connection status

The interface is designed to remain usable across desktop, tablet, and mobile screen sizes.

---

## 🧪 Validation

The application was tested across the main functional areas:

- Frontend production build
- Backend TypeScript build
- Backend production startup
- MongoDB connection
- API health endpoint
- REST API endpoints
- Swagger/OpenAPI documentation
- Dashboard data loading
- Bookings
- Mechanics
- Customers
- Analytics
- Settings
- Socket.IO initialization
- Real-time updates
- Production frontend/backend connectivity

The backend production build starts successfully with MongoDB and Socket.IO enabled.

---

## 🔒 Security Considerations

The project follows basic security practices for a demonstration application:

- Environment variables are used for database credentials.
- `.env` files are excluded from Git.
- Database credentials are not included in the repository.
- MongoDB Atlas is used instead of exposing a local database.
- API responses use structured JSON.
- Mongoose validation is used for database models.
- CORS is configured for the frontend origin.
- Object IDs are validated before database operations.

For a production-scale system, additional measures such as authentication, authorization, rate limiting, request validation middleware, audit logging, and more advanced monitoring could be added.

---

## 🤖 AI Usage

AI tools were used as development assistants during the project.

They were primarily used for:

- Debugging
- Code review
- Architecture discussions
- TypeScript assistance
- UI implementation ideas
- API documentation assistance
- Error analysis
- Improving documentation
- Development workflow guidance

The final implementation was reviewed, tested, integrated, and understood as part of the project development process.

AI was used as an engineering aid rather than as a replacement for understanding the submitted application.

---

## 🔮 Future Improvements

Potential improvements for a production version include:

- Authentication
- Role-based access control
- Admin/user permissions
- Advanced booking filters
- CSV export
- Mechanic location tracking
- Map integration
- Push notifications
- Advanced audit logs
- API rate limiting
- Automated tests
- Docker deployment
- CI/CD pipelines
- GitHub Actions
- Monitoring and observability
- Redis caching
- Background jobs
- Advanced database indexing
- Performance optimization
- Automated database backups

These features were intentionally kept outside the core implementation to prioritize a functional and polished dashboard.

---

## 📊 Project Highlights

| Area | Implementation |
|---|---|
| Frontend | Next.js + React + TypeScript |
| Styling | Tailwind CSS + shadcn/Base UI |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Real-time | Socket.IO |
| Charts | Recharts |
| Tables | TanStack Table |
| API Documentation | Swagger/OpenAPI |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Database Hosting | MongoDB Atlas |
| Seed Bookings | 600 |
| Seed Customers | 60 |
| Seed Mechanics | 24 |
| Seed Services | 8 |

---

## 👨‍💻 Author

**Kunal Sahu**

Computer Science graduate and software developer focused on web development, full-stack applications, and practical software engineering.

---

## 🔗 Project Links

**Live Frontend**

https://instant-mechanic-dashboard-psi.vercel.app/

**Backend**

https://instant-mechanic-backend-615s.onrender.com

**API Documentation**

https://instant-mechanic-backend-615s.onrender.com/api/docs/

**Health Check**

https://instant-mechanic-backend-615s.onrender.com/api/health

**GitHub**

https://github.com/kunalhoonmai/instant-mechanic-dashboard

---

## 🏁 Assignment Submission

### Name

Kunal Sahu

### GitHub Repository

https://github.com/kunalhoonmai/instant-mechanic-dashboard

### Frontend

https://instant-mechanic-dashboard-psi.vercel.app/

### Backend

https://instant-mechanic-backend-615s.onrender.com

### API Documentation

https://instant-mechanic-backend-615s.onrender.com/api/docs/

### Database

MongoDB Atlas

### Real-Time Technology

Socket.IO

### AI Tools

AI-assisted development, debugging, code review, documentation, and architecture guidance.

### Proudest Feature

The real-time operations workflow using REST APIs + Socket.IO, where booking, mechanic, and customer changes can be reflected across connected dashboard clients without requiring a full page reload.

### Deployment Note

The backend was initially prepared for AWS EC2 deployment as specified in the assignment. During AWS account activation, the available AWS India registration flow required payment-method verification/UPI AutoPay authorization. Since the project was required to remain at zero deployment cost, the backend was deployed to Render Free Web Service instead. The deployed backend retains the same Express, MongoDB Atlas, REST API, Socket.IO, TypeScript, and Swagger/OpenAPI architecture.

---

## 📄 License

This project was created as a technical assignment and demonstration project.
