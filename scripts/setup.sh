#!/bin/bash

# Waitlist App Setup Script
echo "🚀 Setting up Waitlist Application..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your configuration."
    echo "🔑 Don't forget to add your RESEND_API_KEY for email functionality."
else
    echo "✅ .env file already exists."
fi

# Build and start services
echo "🏗️  Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Your application is now running:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Admin Dashboard: http://localhost:3000/admin"
echo ""
echo "🔐 Admin password: admin123"
echo ""
echo "📋 To stop the services, run: docker-compose down"
echo "📋 To view logs, run: docker-compose logs -f"
echo ""
echo "⚠️  Remember to configure your RESEND_API_KEY in the .env file for email functionality."

