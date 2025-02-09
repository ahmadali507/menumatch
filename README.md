A modern web application for restaurant menu management and ordering system built with Next.js and Firebase.
 🚀 Quick Start
Prerequisites
- Node.js 18 or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/devvMuhammad/menumatch.git

# Navigate to project directory
cd menumatch

# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
### Production
```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Styling**: Material-UI (MUI)
- **State Management**: React Context
- Temporary deployed on vercel (https://menumanage.vercel.app)
## 🔐 Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECTID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id


FIREBASE_PRIVATE_KEY="your admin sdk private key"
FIREBASE_CLIENT_EMAIL="your admin sdk client email"
FIREBASE_STORAGE_BUCKET="your storage bucket"
FIREBASE_PROJECT_ID="your project id" 
```

## 🎨 Features

- Dynamic Theme Switching (Light/Dark mode)
- User Authentication
- Role-based Access Control
- Responsive Design
- Restaurant Menu Management
- Order Processing System

## 📱 User Roles

- **Super Admin**: Complete system access
- **Restaurant Admin**: Restaurant-specific management
- **Customer**: Menu browsing and ordering



## 📄 License
This project is licensed under no license.
