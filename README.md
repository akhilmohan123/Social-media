📱 Social Media Application
A full-stack social media platform built to connect people through posts, likes, comments, real-time chat, live streaming, and push notifications.

🚀 Features

🔐 Authentication & Authorization – JWT-based secure login/signup

💬 Real-Time Chat – Powered by Socket.io

❤️ Posts & Interactions – Create, like, and comment on posts

🔔 Push Notifications – Integrated with Firebase Cloud Messaging (FCM)

📡 Live Streaming – Handled via Nginx RTMP module

👥 Follow System – Follow/unfollow users and see personalized feeds

📷 Media Uploads – Upload images and videos

🛠️ Tech Stack
Frontend
->React.js
->Bootstrap 5.3
Backend
->Node.js
->Express.js
->MongoDB (Database)

Real-Time & Notifications
->Socket.io (Chat & Live updates)
->Firebase Cloud Messaging (Push Notifications)
->Nginx + RTMP (Live Streaming only)
Authentication
->JSON Web Token (JWT)

📂 Project Structure
/client         # Frontend (React/AngularJS)  
/server         # Backend API (Node.js, Express.js)  
/socket         # Real-time communication (Socket.io)  

⚙️ Installation
git clone https://github.com/akhilmohan123/Social-media
cd Social-media

2. Backend Setup
cd server
npm install
Add .env file in /server with:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FCM_SERVER_KEY=your_firebase_server_key

Run backend:
npm start

3.Frontend Setup
cd client
npm install
npm run dev

4. Socket.io Setup
cd socket
npm install
npm start

5. Nginx RTMP Setup (Live Streaming)
Install Nginx with RTMP module
Go to that directory through cmd
nginx.exe
