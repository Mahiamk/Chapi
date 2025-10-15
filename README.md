# Waitlist Application

A full-stack waitlist application built with FastAPI (backend) and Next.js (frontend).

## Live Application

🚀 **Live URL**: [Deploy using the instructions below]

🔐 **Admin Dashboard Password**: `admin123`

📧 **Contact**: [Your Email Address]

## Features

- **Waitlist Signup**: Users can join the waitlist by entering their email
- **Email Confirmation**: Automatic welcome email sent upon signup
- **Admin Dashboard**: Password-protected dashboard to view all signups
- **Real-time Feedback**: Clear success/error messages for user actions

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Email Service**: Resend
- **Database**: PostgreSQL (Neon/Supabase)
- **Deployment**: Docker containers
- **Hosting**: Render/Vercel

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL database

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd waitlist-app
```

2. Create environment files:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/waitlist
RESEND_API_KEY=your_resend_api_key
ADMIN_PASSWORD=admin123
SECRET_KEY=your_secret_key
```

4. Run with Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

- `POST /api/waitlist/signup` - Join the waitlist
- `GET /api/waitlist/list` - Get all signups (admin only)
- `POST /api/auth/login` - Admin login

## Database Schema

```sql
CREATE TABLE waitlist_signups (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment

The application is containerized with Docker and can be deployed to any container hosting service:

- **Render**: Recommended for easy deployment
- **Vercel**: For frontend + separate backend service
- **Railway**: Alternative container hosting

## Quick Deployment

### Option 1: One-Click Deploy with Render
1. Fork this repository
2. Connect to [render.com](https://render.com)
3. Create new Blueprint from this repository
4. Add your `RESEND_API_KEY` environment variable
5. Deploy! 🚀

### Option 2: Manual Setup
```bash
# Clone and setup
git clone <your-repo-url>
cd waitlist-app
cp env.example .env
# Edit .env with your configuration

# Run with Docker
docker-compose up --build
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contact

For questions about this implementation, please contact: [Your Email Address]

---

Built as a take-home assessment for the Full-Stack Developer position at Chapi.
