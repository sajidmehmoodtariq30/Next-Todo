# Next.js Todo Application

A modern, full-stack todo application built with Next.js 15, MongoDB, and Cloudinary. Features include user authentication, profile image uploads, todo management with filtering and pagination, and dark mode support.

## Features

- 🔐 **User Authentication** - Register/login with JWT tokens and secure cookies
- 👤 **User Profiles** - Upload profile images via Cloudinary integration
- ✅ **Todo Management** - Create, edit, delete, and mark todos as complete
- 🏷️ **Categories & Priorities** - Organize todos with categories and priority levels
- 📅 **Due Dates** - Set and track due dates for todos
- 🔍 **Search & Filters** - Search todos and filter by status, priority, and category
- 📱 **Responsive Design** - Works perfectly on desktop and mobile devices
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📄 **Pagination** - Efficient pagination for large todo lists

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with server components
- **Tailwind CSS 4** - Modern CSS framework
- **Context API** - State management for auth and todos

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### File Upload
- **Cloudinary** - Cloud-based image and video management

## Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/sajidmehmoodtariq30/Next-Todo.git
cd Next-Todo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/nextjs-todo
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/nextjs-todo

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-a-strong-one

# JWT
JWT_SECRET=your-jwt-secret-here
```

### 4. Database Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/nextjs-todo`

#### Option 2: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get the connection string and replace `<username>`, `<password>`, and `<cluster>` in:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/nextjs-todo
   ```

### 5. Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env.local` file

### 6. Generate Secrets
Generate strong secrets for JWT and NextAuth:
```bash
# For JWT_SECRET and NEXTAUTH_SECRET
openssl rand -base64 32
```

### 7. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── todos/           # Todo CRUD endpoints
│   │   └── user/            # User profile endpoints
│   ├── auth/                # Authentication page
│   ├── profile/             # User profile page
│   ├── todos/               # Todos listing page
│   ├── globals.css          # Global styles
│   ├── layout.jsx           # Root layout component
│   └── page.jsx             # Home page
├── components/              # Reusable components
│   ├── auth/               # Authentication components
│   ├── todos/              # Todo-related components
│   └── ui/                 # Generic UI components
├── contexts/               # React contexts for state management
├── hooks/                  # Custom React hooks
├── lib/                    # Configuration and utilities
├── middleware/             # API middleware
├── models/                 # MongoDB/Mongoose models
└── utils/                  # Helper functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Todos
- `GET /api/todos` - Get user's todos (with pagination and filters)
- `POST /api/todos` - Create new todo
- `GET /api/todos/[id]` - Get specific todo
- `PUT /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo

### User Profile
- `PUT /api/user/profile` - Update user profile (including image upload)

## Usage

### Getting Started
1. Visit `http://localhost:3000`
2. Click "Sign In" to register a new account or log in
3. Navigate to "Todos" to start managing your tasks
4. Visit "Profile" to update your information and upload a profile picture

### Managing Todos
- **Create**: Click "New Todo" button
- **Edit**: Click the edit icon on any todo
- **Complete**: Click the checkbox to mark as complete
- **Delete**: Click the trash icon (with confirmation)
- **Filter**: Use the filter controls to find specific todos
- **Search**: Use the search bar to find todos by title or description

## Development

### Adding New Features
1. **Database Models**: Add new schemas in `src/models/`
2. **API Routes**: Create new endpoints in `src/app/api/`
3. **Components**: Build reusable components in `src/components/`
4. **Pages**: Add new pages in `src/app/`

### Environment Variables
All environment variables should be added to `.env.local` and never committed to version control.

### Deployment
The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Heroku

Make sure to:
1. Set all environment variables in your deployment platform
2. Use MongoDB Atlas for the database in production
3. Configure Cloudinary for image uploads

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if applicable)
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB for the flexible database solution
- Cloudinary for image management services
