# Deployment Guide

This guide covers deploying the Waitlist Application to various platforms.

## Quick Deploy Options

### Option 1: Render (Recommended)

Render provides easy deployment for both frontend and backend with built-in PostgreSQL.

1. **Fork this repository** to your GitHub account
2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up and connect your GitHub account
   - Click "New +" and select "Blueprint"

3. **Configure Environment Variables**:
   ```
   RESEND_API_KEY=your_resend_api_key_here
   ADMIN_PASSWORD=admin123
   SECRET_KEY=your-secret-key-here
   ```

4. **Deploy**:
   - The `render.yaml` file will automatically configure all services
   - Render will build and deploy the database, backend, and frontend
   - Your app will be available at the provided Render URLs

### Option 2: Vercel (Frontend) + Railway (Backend + Database)

#### Frontend on Vercel:
1. Push your code to GitHub
2. Connect to [vercel.com](https://vercel.com)
3. Import your repository
4. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`
5. Deploy

#### Backend + Database on Railway:
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database service
4. Add web service for backend
5. Set environment variables:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   SECRET_KEY=your-secret-key
   ADMIN_PASSWORD=admin123
   RESEND_API_KEY=your_resend_api_key
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

### Option 3: DigitalOcean App Platform

1. Create new app on DigitalOcean
2. Connect your GitHub repository
3. Configure services:
   - **Web Service (Frontend)**: Source directory `frontend/`
   - **Web Service (Backend)**: Source directory `backend/`
   - **Database**: PostgreSQL add-on
4. Set environment variables for each service

## Environment Variables

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-secret-key-change-this-in-production
ADMIN_PASSWORD=admin123
RESEND_API_KEY=your_resend_api_key_here
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

## Database Setup

### Using PostgreSQL (Recommended)
1. Create a PostgreSQL database on your hosting platform
2. Update `DATABASE_URL` in your environment variables
3. Run migrations (handled automatically by the application)

### Using SQLite (Development Only)
1. Change `DATABASE_URL` to `sqlite:///./waitlist.db`
2. Install SQLite dependencies: `pip install sqlalchemy-utils`

## Email Configuration

### Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to your environment variables
4. Update the "from" email in `backend/email_service.py` if needed

### Alternative Email Services
- **SendGrid**: Replace email service implementation
- **Mailgun**: Replace email service implementation
- **AWS SES**: Replace email service implementation

## SSL/HTTPS Configuration

Most hosting platforms provide SSL certificates automatically:
- **Render**: Automatic HTTPS
- **Vercel**: Automatic HTTPS
- **Railway**: Automatic HTTPS
- **DigitalOcean**: Automatic HTTPS

## Custom Domain Setup

1. **Get a domain** from a registrar (Namecheap, GoDaddy, etc.)
2. **Configure DNS**:
   - Add CNAME record pointing to your hosting platform
   - Or add A record pointing to the platform's IP
3. **Update environment variables**:
   - Update `FRONTEND_URL` in backend
   - Update `NEXT_PUBLIC_API_URL` in frontend
4. **Configure SSL** (usually automatic)

## Monitoring and Maintenance

### Health Checks
- Backend health endpoint: `GET /health`
- Frontend health: Check if the page loads

### Logs
- **Render**: Available in dashboard
- **Vercel**: Available in dashboard
- **Railway**: Available in dashboard
- **DigitalOcean**: Available in dashboard

### Database Backups
- **Render**: Automatic backups
- **Railway**: Automatic backups
- **DigitalOcean**: Manual or automatic backups

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Ensure database service is running
   - Check firewall/network settings

2. **Email Not Sending**
   - Verify `RESEND_API_KEY` is correct
   - Check Resend dashboard for usage limits
   - Review email service logs

3. **CORS Issues**
   - Update `FRONTEND_URL` in backend environment
   - Check CORS middleware configuration

4. **Build Failures**
   - Check Node.js and Python versions
   - Review build logs for specific errors
   - Ensure all dependencies are in requirements.txt

### Support
For deployment issues:
1. Check the hosting platform's documentation
2. Review application logs
3. Test locally with Docker Compose first

## Security Considerations

1. **Change default passwords**:
   - Update `ADMIN_PASSWORD` from default
   - Generate strong `SECRET_KEY`

2. **Environment variables**:
   - Never commit `.env` files
   - Use platform-specific secret management

3. **Database security**:
   - Use strong database passwords
   - Restrict database access to application only

4. **API security**:
   - Rate limiting (consider adding)
   - Input validation (already implemented)
   - CORS configuration (already implemented)

