# Dynamic Interview Portal - MVP Development Plan

## Project Overview
A comprehensive interview preparation platform with React + TailwindCSS + Shadcn-UI components.

## File Structure Plan

### Core Files to Create/Modify:
1. **src/App.tsx** - Update routing for all pages
2. **src/pages/Landing.tsx** - Landing page with CTAs
3. **src/pages/Login.tsx** - Login form
4. **src/pages/Signup.tsx** - Signup form  
5. **src/pages/ForgotPassword.tsx** - Password reset form
6. **src/pages/Dashboard.tsx** - User dashboard with cards
7. **src/pages/Courses.tsx** - Course categories and materials
8. **src/pages/StartInterview.tsx** - Interview type selection and mock UI

### Key Features Implementation:
- **Navigation**: React Router with protected routes
- **Authentication**: Mock auth context with localStorage
- **UI Components**: Leverage shadcn-ui components (Card, Button, Form, Table, etc.)
- **Responsive Design**: Mobile-first Tailwind approach
- **Mock Data**: Static data for interviews, courses, user info
- **API Placeholders**: Fetch calls to /api/* endpoints

### Component Relationships:
- App.tsx → All page components via React Router
- AuthContext → Provides mock authentication state
- Dashboard → Uses Card components for quick access
- Courses → Uses Card/Badge components for categories
- StartInterview → Uses different UI based on interview type
- All forms use shadcn-ui Form components with validation

### Simplified MVP Approach:
- Focus on core user flow: Landing → Auth → Dashboard → Interview
- Use mock data and localStorage for state management
- Placeholder API calls for easy backend integration
- Clean, professional UI with consistent styling