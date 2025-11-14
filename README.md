## 🏥 Hospital Meal Ordering System

A modern, full-stack meal ordering application for hospitals built with Next.js, TypeScript, and Tailwind CSS. This system enables seamless meal ordering workflow between patients, doctors, and kitchen staff with a **dynamic weekly meal timetable**.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [User Workflows](#user-workflows)
- [Order Status Flow](#order-status-flow)
- [API & Data Management](#api--data-management)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

The Hospital Meal Ordering System streamlines the meal ordering process in healthcare facilities by providing three distinct role-based dashboards:

- **Patient Portal** - Order meals with dietary preferences
- **Doctor Dashboard** - Review and approve patient meal orders
- **Kitchen Dashboard** - Prepare and track approved meals

## ✨ Features

### 🔐 Role-Based Access
- **Landing Page** with role selection (Patient, Doctor, Kitchen)
- **Change Role** button available on all dashboards for easy switching

### 👤 Patient Features
- ✅ Personal information input (name, room number, bed)
- ✅ Meal time selection (Breakfast, Lunch, Dinner)
- ✅ **Dynamic menu based on day of week and meal time**
- ✅ Automatic day detection (Monday-Sunday)
- ✅ Weekly meal timetable with specific meals per day
- ✅ Multiple menu item selection with checkboxes
- ✅ Special dietary instructions field
- ✅ Form validation with error messages
- ✅ Success notifications with order ID on submission

### 👨‍⚕️ Doctor Features
- ✅ Dashboard with order statistics (Pending, Approved, Rejected, Total)
- ✅ Filter tabs (Pending Review, Reviewed, All Orders)
- ✅ Detailed order cards with patient information
- ✅ Meal details and special instructions
- ✅ One-click approve/reject actions
- ✅ Real-time stat updates

### 👨‍🍳 Kitchen Features
- ✅ Dashboard showing approved orders only
- ✅ Statistics (New Orders, In Progress, Completed, Total)
- ✅ Filter tabs (New Orders, In Progress, Completed, All)
- ✅ Order preparation workflow
- ✅ Status updates (In Progress → Completed)
- ✅ Highlighted special instructions

### 🔔 Notifications
- ✅ Toast notifications for all actions
- ✅ Success, error, and info message types
- ✅ Non-intrusive, auto-dismissing alerts

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

### State Management
- **Client State**: React Hooks (useState, useEffect)
- **Data Persistence**: Browser LocalStorage (demo mode)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Datafluentacademy/datafluent-academy.git
   cd rhv
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📁 Project Structure

```
rhv/
├── app/
│   ├── page.tsx              # Landing page (role selection)
│   ├── layout.tsx            # Root layout with ToastContainer
│   ├── globals.css           # Global styles
│   ├── patient/
│   │   └── page.tsx          # Patient meal ordering page
│   ├── doctor/
│   │   └── page.tsx          # Doctor review dashboard
│   └── kitchen/
│       └── page.tsx          # Kitchen preparation dashboard
├── lib/
│   └── orders.ts             # Order management utilities & types
├── public/                   # Static assets
├── package.json              # Project dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
└── README.md                 # Project documentation
```

## 🔄 User Workflows

### Patient Workflow
1. Navigate to **Patient** page
2. System automatically detects current day of the week
3. Enter patient information (name, room number, bed)
4. Select meal time (Breakfast, Lunch, or Dinner)
5. View menu items specific to current day and selected meal time
6. Select desired food items from today's menu
7. Add special instructions (optional)
8. Click **Place Order**
9. Receive confirmation toast notification with order ID

### Doctor Workflow
1. Navigate to **Doctor Dashboard**
2. View pending orders in the default "Pending Review" tab
3. Review order details:
   - Patient information
   - Meal time and menu items
   - Special dietary instructions
4. Click **Approve Order** or **Reject Order**
5. Order moves to "Reviewed" tab
6. Stats update automatically

### Kitchen Workflow
1. Navigate to **Kitchen Dashboard**
2. View approved orders in "New Orders" tab
3. Review meal details and special instructions
4. Click **Start Preparing** to mark order as in-progress
5. Order moves to "In Progress" tab
6. Click **Mark as Completed** when meal is ready
7. Order moves to "Completed" tab

## 📊 Order Status Flow

```
┌─────────────┐
│   PENDING   │  ← Patient submits order
└──────┬──────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌──────────────┐
│  APPROVED   │    │   REJECTED   │  ← Doctor reviews
└──────┬──────┘    └──────────────┘
       │
       ▼
┌─────────────┐
│ IN-PROGRESS │  ← Kitchen starts preparing
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  COMPLETED  │  ← Kitchen finishes
└─────────────┘
```

## 💾 API & Data Management

### Current Implementation (Demo Mode)
The application uses **Browser LocalStorage** for data persistence:

```typescript
// lib/orders.ts
- getOrders()          // Fetch all orders
- addOrder(data)       // Create new order
- updateOrderStatus()  // Update order status
- clearOrders()        // Clear all orders (utility)
```

### Order Data Structure

```typescript
interface Order {
  id: string;                    // Unique identifier
  patientName: string;           // Patient's name
  roomNumber: string;            // Hospital room
  bed?: string;                  // Bed assignment (optional)
  mealTime: string;              // breakfast | lunch | dinner
  menuItems: string[];           // Selected food items
  specialInstructions?: string;  // Dietary notes
  status: OrderStatus;           // Current order status
  createdAt: number;             // Timestamp
}

type OrderStatus = 
  | "pending"      // Awaiting doctor review
  | "approved"     // Doctor approved
  | "rejected"     // Doctor rejected
  | "in-progress"  // Kitchen preparing
  | "completed";   // Ready for delivery
```

### Meal Menus

The system uses a **weekly timetable** with different meals for each day of the week:

#### Monday
- **Breakfast**: MOI MOI AND PAP
- **Lunch**: FRIED - RICE
- **Dinner**: AMALA, EWEDU AND GBEGIRI

#### Tuesday
- **Breakfast**: TEA BREAD AND SCRAMBLED EGG, IRISH POTATOES AND FISH SAUCE, AMALA AND PAP
- **Lunch**: COCONUT RICE, JOLLOF RICE, VEGETABLE RICE
- **Dinner**: POUNDO AND VEGETABLE SOUP, PLANTAIN FLOUR AND OGBONO, WHEAT AND VEGETABLE OKRO

#### Wednesday
- **Breakfast**: CHICKEN SANDWICH AND COCOYAM
- **Lunch**: GROUND - RICE AND EGUSI
- **Dinner**: WHITE RICE AND STEW

#### Thursday
- **Breakfast**: YAM AND GARDEN EGG SAUCE, SWEET POTATOES AND EGG SAUCE, OAT AND MOI MOI
- **Lunch**: SEMO AND BITTERLEAF SOUP, PINEAPPLE RICE, PLAIN RICE AND STIR-FRIED VEGGIES
- **Dinner**: WHITE RICE AND LEAFY VEG. SAUCE, OAT SWALLOW AND EFORIRO, AMALA AND EWEDU

#### Friday
- **Breakfast**: VEGETABLE EGG SAUCE AND COCOYAM, OAT AND MOI MOI
- **Lunch**: EBA AND EGUSI, SEMO AND EDIKANKONG
- **Dinner**: JOLLOF RICE AND STIR-FRIED VEGGIES, JAMBALAYA RICE

#### Saturday
- **Breakfast**: GREEN TEA, BOILED EGG AND BREAD
- **Lunch**: JOLLOF RICE AND BEANS
- **Dinner**: POUNDO AND VEGETABLE OKRO

#### Sunday
- **Breakfast**: BOILED PLANTAIN AND VEGETABLE EGG SAUCE, PAP AND AKARA
- **Lunch**: PLAIN RICE, STEW AND BEANS, OFADA RICE AND STEW
- **Dinner**: OAT SWALLOW AND BITTERLEAF SOUP, AMALA EWEDU AND GBEGIRI, EBA AND OGBONO

> **Note**: The menu automatically displays items based on the current day of the week and selected meal time. Patients can only see and order from today's menu.

### Future Backend Integration
For production deployment, replace LocalStorage with:
- **REST API** (Express, Fastify)
- **GraphQL** (Apollo Server)
- **Database** (PostgreSQL, MongoDB, Supabase)
- **Real-time updates** (WebSockets, Server-Sent Events)

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Build for Production
```bash
npm run build
npm run start
```

### Environment Variables
Create `.env.local` for environment-specific configuration:
```env
# Example - Add your variables here
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

### Hosting Platforms
- ✅ [Vercel](https://vercel.com) - Optimized for Next.js
- ✅ [Netlify](https://netlify.com)
- ✅ [Railway](https://railway.app)
- ✅ [AWS Amplify](https://aws.amazon.com/amplify/)

## 🎯 Key Features & Decisions

### Why LocalStorage?
- ✅ **Demo-ready** - Works immediately without backend
- ✅ **Client-side only** - Perfect for prototyping
- ✅ **Easy migration** - Swap for real API later
- ⚠️ **Limitation** - Data is browser-specific

### Why Next.js App Router?
- ✅ Modern React patterns
- ✅ File-based routing
- ✅ Built-in TypeScript support
- ✅ Excellent performance

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ Rapid development
- ✅ Consistent design system
- ✅ Responsive by default

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👥 Authors

- **Emmanuel** - [GitHub](https://github.com/Emmanuel-222)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for beautiful icons
- React Toastify for notification system
- Redeemer's Health Village for the meal timetable specifications

## 📞 Support

For support, open an issue in this repository or contact the development team.

---

**Made with ❤️ for Redeemer's Health Village**
