# Journal of Inter Discourse Academia (JIDA) Management System

A comprehensive journal management system built with Next.js frontend and Spring Boot backend, designed to facilitate manuscript submission, peer review, and publication processes.

## Features

### Author Features
- User registration and authentication
- Manuscript submission (PDF/DOCX)
- Track manuscript status
- Search previous manuscripts
- View submission deadlines
- Download published articles
- Profile management
- Password reset

### Reviewer Features
- View assigned manuscripts
- Download manuscripts for review
- Submit structured review feedback
- Track review progress
- Set review status (Not Started, Begin Review, In Progress, Finished Review)
- View review history
- Profile management

### Editor Features
- View new manuscript submissions
- Assign reviewers to manuscripts
- Set review deadlines
- View reviewer feedback
- Make editorial decisions (Accept, Reject, Request Revision)
- Publish accepted manuscripts
- Create journals and issues
- Publish to Google Scholar
- Profile management

### Public Features
- Search published articles
- Browse journal archive
- Download published articles
- Filter by keywords

## Technology Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Spring Boot 3.2** - Java framework
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Database access
- **H2 Database** - Development database (can be switched to PostgreSQL)
- **Spring Mail** - Email notifications

## Prerequisites

- Node.js 18+ and npm
- Java 17+
- Maven 3.6+

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Configure the database in `src/main/resources/application.properties`:
   - For development, H2 is already configured
   - For production, update to PostgreSQL:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/jida_db
     spring.datasource.username=your_username
     spring.datasource.password=your_password
     ```

3. Configure email settings (optional, for email notifications):
   ```properties
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   ```

4. Build and run the backend:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the project root:
```bash
cd /path/to/jida-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (optional, defaults are set):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Run the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Project Structure

```
jida-system/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/auca/jida/
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── repository/     # Data access
│   │   │   │   ├── model/          # Entity models
│   │   │   │   ├── security/       # Security configuration
│   │   │   │   └── dto/            # Data transfer objects
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── src/
│   ├── app/                        # Next.js app directory
│   │   ├── (auth)/                 # Authentication pages
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── author/            # Author dashboard
│   │   │   ├── reviewer/          # Reviewer dashboard
│   │   │   └── editor/            # Editor dashboard
│   │   └── public/                # Public archive
│   ├── components/                 # React components
│   │   ├── forms/                  # Form components
│   │   └── ui/                     # UI components
│   └── lib/                        # Utilities and API client
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/reset-password/request` - Request password reset
- `POST /api/auth/reset-password/confirm` - Confirm password reset

### Author APIs
- `POST /api/authors/manuscripts` - Submit manuscript
- `GET /api/authors/manuscripts` - Get my manuscripts
- `GET /api/authors/manuscripts/{id}` - Get manuscript details
- `PUT /api/authors/manuscripts/{id}` - Update manuscript
- `GET /api/authors/manuscripts/search` - Search manuscripts
- `GET /api/authors/deadline` - Get submission deadline
- `GET /api/authors/manuscripts/{id}/download` - Download manuscript
- `PUT /api/authors/profile` - Update profile

### Reviewer APIs
- `GET /api/reviewers/assignments` - Get review assignments
- `GET /api/reviewers/assignments/{id}` - Get review details
- `PUT /api/reviewers/assignments/{id}/status` - Update review status
- `POST /api/reviewers/assignments/{id}/submit` - Submit review
- `GET /api/reviewers/history` - Get review history
- `GET /api/reviewers/assignments/{id}/download` - Download manuscript
- `PUT /api/reviewers/profile` - Update profile

### Editor APIs
- `GET /api/editors/submissions` - Get new submissions
- `GET /api/editors/manuscripts` - Get all manuscripts
- `GET /api/editors/manuscripts/{id}` - Get manuscript details
- `POST /api/editors/manuscripts/{id}/assign-reviewer` - Assign reviewer
- `POST /api/editors/manuscripts/{id}/decision` - Make editorial decision
- `POST /api/editors/journals` - Create journal
- `GET /api/editors/journals` - Get all journals
- `POST /api/editors/issues` - Create issue
- `POST /api/editors/manuscripts/{id}/publish` - Publish manuscript
- `PUT /api/editors/profile` - Update profile

### Public APIs
- `GET /api/public/articles` - Search published articles
- `GET /api/public/articles/{id}` - Get article details
- `GET /api/public/articles/{id}/download` - Download article

## Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control (RBAC)
- Session timeout (15 minutes)
- CORS configuration
- HTTPS support (configure in production)

## Non-Functional Requirements

- **Performance**: API response time < 2 seconds
- **Security**: JWT authentication, encrypted passwords, role-based access
- **Usability**: Responsive UI for desktop and mobile
- **Scalability**: Supports up to 500 concurrent users
- **Reliability**: 99% uptime target

## Development

### Running Tests
```bash
# Backend tests
cd backend
mvn test

# Frontend tests (if configured)
npm test
```

### Building for Production
```bash
# Backend
cd backend
mvn clean package

# Frontend
npm run build
npm start
```

## Configuration

### Environment Variables

**Backend** (`application.properties`):
- `jwt.secret` - JWT secret key (change in production)
- `jwt.expiration` - Token expiration time (default: 900000ms = 15 minutes)
- `spring.mail.*` - Email configuration
- `file.upload-dir` - File upload directory (default: `uploads`)

**Frontend** (`.env.local`):
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is developed for AUCA (Adventist University of Central Africa).

## Support

For issues and questions, please contact the development team.
