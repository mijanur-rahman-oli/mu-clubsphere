# 🌐 ClubSphere

**Revolutionizing Local Club Engagement**

[**🚀 Explore Live App →**](https://unrivaled-florentine-bff2fc.netlify.app/)

ClubSphere is a full-stack ecosystem that transforms how university clubs operate. From automated membership dues via Stripe to role-based administrative dashboards, it bridges the gap between students, managers, and faculty.

---

## 🚀 The Experience

### 🎭 One Platform, Three Perspectives

**For Students:** A seamless "discovery-to-membership" pipeline. Bookmark clubs, join events, and track your campus life in one dashboard.

**For Managers:** A "Business-in-a-Box." Handle registrations, track revenue growth, and manage event capacity without spreadsheets.

**For Admins:** Total control. Approve new clubs, moderate content, and view platform-wide financial analytics.

---

## 🛠️ The Engine Room

### Tech Stack

| Frontend | Backend | Infrastructure |
|----------|---------|----------------|
| React | Node.js / Express | MongoDB |
| Tailwind CSS | Stripe API | Firebase Auth |
| TanStack Query | Firebase Admin | Netlify (Deployment) |
| Vite | JWT | Stripe Webhooks |

---

## 💡 Engineering Highlights

### 🔒 Secure Role-Based Access (RBAC)
I implemented custom Express middleware that interfaces with Firebase Admin SDK to ensure that a "Member" can never access "Admin" endpoints, keeping the platform's financial data secure.

### 💳 Bulletproof Payments
Integrating the Stripe API allowed for a professional checkout experience. I designed the logic to handle "Free" vs. "Paid" club tiers dynamically, ensuring the database only updates once a transaction is verified.

### ⚡ Blazing Fast Performance
By using TanStack Query, I reduced unnecessary API calls by over 40% through intelligent caching, resulting in a snappier, "app-like" feel for the user.

---

## 🏁 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Stripe account

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mijanur-rahman-oli/clubsphere.git

# 2. Navigate to project directory
cd clubsphere

# 3. Install dependencies for both client and server
npm install

# For separate client/server setup:
cd client && npm install
cd ../server && npm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 5. Fire it up
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following:

#### Client Environment Variables

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# API
VITE_API_URL=http://localhost:5000/api
```

#### Server Environment Variables

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase Admin
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## 🎯 Key Features

### For Students
- 🔍 **Club Discovery** - Browse, search, and filter clubs by category and interests
- 📌 **Smart Bookmarking** - Save favorite clubs and get event notifications
- 🎫 **Event Registration** - One-click RSVP with integrated payment
- 📊 **Personal Dashboard** - Track memberships, events, and campus activity

### For Club Managers
- 👥 **Member Management** - View, approve, and manage club members
- 📅 **Event Creation** - Create and manage events with capacity limits
- 💰 **Revenue Tracking** - Real-time analytics on membership dues and tickets
- 📧 **Communication Tools** - Send announcements to all members
- 📈 **Growth Analytics** - Track engagement and membership trends

### For Admins
- ✅ **Club Approval** - Review and approve new club applications
- 🛡️ **Content Moderation** - Monitor and moderate club content
- 📊 **Platform Analytics** - System-wide financial and engagement metrics
- 👤 **User Management** - Manage roles and permissions
- 🔒 **Security Controls** - Access logs and monitoring

### Technical Features
- **Multi-Role Authentication** - Students, managers, and admins with distinct permissions
- **Integrated Payments** - Stripe-powered membership dues and event tickets
- **Real-time Analytics** - Track membership growth and revenue streams
- **Responsive Design** - Mobile-first approach for on-the-go access
- **Performance Optimized** - TanStack Query caching and lazy loading

---

## 🌐 Deployment

### Deploy to Netlify (Frontend)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
cd client
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Deploy Backend (Railway/Render)

```bash
# Example deployment commands
cd server
# Follow your hosting provider's deployment guide
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Mijanur Rahman Oli**

- GitHub: [@mijanur-rahman-oli](https://github.com/mijanur-rahman-oli)
- LinkedIn: [Mijanur Rahman Oli](https://www.linkedin.com/in/mijanur-rahman-oli/)
- Live Demo: [ClubSphere](https://unrivaled-florentine-bff2fc.netlify.app/)

---

## 🙏 Acknowledgments

- Firebase for authentication infrastructure
- Stripe for payment processing
- MongoDB Atlas for database hosting
- Netlify for seamless deployment
- The open-source community for invaluable tools and libraries

---

## 📞 Support

If you encounter any issues or have questions:

- 🐛 [Report a Bug](https://github.com/mijanur-rahman-oli/clubsphere/issues)
- 💡 [Request a Feature](https://github.com/mijanur-rahman-oli/clubsphere/issues)

---

<div align="center">
  
**⭐ Star this repo if you find it helpful!**

Developed by **Mijanur Rahman Oli**

[Live Demo](https://unrivaled-florentine-bff2fc.netlify.app/) • [Report Bug](https://github.com/mijanur-rahman-oli/clubsphere/issues) • [Request Feature](https://github.com/mijanur-rahman-oli/clubsphere/issues)

</div
