# Fullstack Spring Boot Monorepo Starter

A modern fullstack application built with Spring Boot backend and Next.js frontend, featuring authentication, real-time communication, and a comprehensive UI component library.

## 🚀 Features

### Backend (Spring Boot)
- **Spring Boot 3.4.3** with Java 21
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **PostgreSQL** database support
- **WebSocket** support for real-time communication
- **OAuth2 Client** integration
- **Swagger/OpenAPI** documentation
- **Spring Actuator** for monitoring
- **Lombok** for code simplification
- **Password validation** with Passay
- **Comprehensive logging** system

### Frontend (Next.js)
- **Next.js 15.2.4** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** component library
- **React Hook Form** with Zod validation
- **Next Themes** for dark/light mode
- **Lucide React** icons
- **Recharts** for data visualization
- **Sonner** for toast notifications

## 📁 Project Structure

```
├── backend/                 # Spring Boot application
│   ├── src/main/java/com/starter/backend/
│   │   ├── controllers/     # REST API controllers
│   │   ├── services/        # Business logic
│   │   ├── repository/      # Data access layer
│   │   ├── models/          # Entity models
│   │   ├── dtos/            # Data Transfer Objects
│   │   ├── security/        # Security configuration
│   │   ├── config/          # Application configuration
│   │   ├── exceptions/      # Custom exceptions
│   │   ├── enums/           # Enumerations
│   │   ├── util/            # Utility classes
│   │   ├── aspects/         # AOP aspects
│   │   ├── audits/          # Audit functionality
│   │   └── schedules/       # Scheduled tasks
│   ├── src/main/resources/  # Configuration files
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Docker configuration
│
├── frontend/               # Next.js application
│   ├── app/               # App Router pages
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   └── api/           # API routes
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── styles/            # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Node.js dependencies
│   └── tailwind.config.ts # Tailwind configuration
│
└── README.md              # This file
```

## 🛠️ Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **PostgreSQL** database
- **Maven** (included with project)
- **npm** or **pnpm** (recommended)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Fullstack-springboot-monorepo-starter
```

### 2. Backend Setup

```bash
cd backend

# Configure database connection in application.properties
# Update the following properties:
# - spring.datasource.url
# - spring.datasource.username
# - spring.datasource.password

# Run the application
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The frontend will start on `http://localhost:3000`

## 🔧 Configuration

### Backend Configuration

Create or update `backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Security Configuration
jwt.secret=your_jwt_secret_key_here
jwt.expiration=86400000

# Server Configuration
server.port=8080

# Actuator Configuration
management.endpoints.web.exposure.include=health,info,metrics
```

### Frontend Configuration

Update environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_NAME=Your App Name
```

## 📚 API Documentation

Once the backend is running, you can access the Swagger UI at:
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

## 🐳 Docker Support

### Backend Docker

```bash
cd backend
docker build -t backend .
docker run -p 8080:8080 backend
```

### Frontend Docker

```bash
cd frontend
docker build -t frontend .
docker run -p 3000:3000 frontend
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
./mvnw test
```

### Frontend Testing

```bash
cd frontend
npm run test
```

## 📦 Build for Production

### Backend

```bash
cd backend
./mvnw clean package
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

## 🔍 Available Scripts

### Backend (Maven)
- `./mvnw spring-boot:run` - Run the application
- `./mvnw test` - Run tests
- `./mvnw clean package` - Build JAR file
- `./mvnw spring-boot:run -Dspring-boot.run.profiles=dev` - Run with dev profile

### Frontend (npm/pnpm)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

### Backend Architecture
- **Controller Layer**: Handles HTTP requests and responses
- **Service Layer**: Contains business logic
- **Repository Layer**: Data access abstraction
- **Model Layer**: Entity definitions
- **Security Layer**: Authentication and authorization
- **Configuration Layer**: Application configuration

### Frontend Architecture
- **App Router**: Next.js 13+ file-based routing
- **Component Library**: Reusable UI components with Radix UI
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system

## 🔐 Security Features

- JWT-based authentication
- Password validation with Passay
- Spring Security configuration
- CORS configuration
- Input validation
- SQL injection prevention

## 📊 Monitoring

- Spring Boot Actuator endpoints
- Health checks
- Metrics collection
- Application monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers

## 🔄 Version History

- **v0.1.0** - Initial release with basic CRUD operations
- **v0.2.0** - Added authentication and security features
- **v0.3.0** - Implemented WebSocket support
- **v0.4.0** - Enhanced UI with Radix UI components

---

**Happy Coding! 🎉** 