# HTML Pages

This directory contains standalone HTML pages for the Uber Clone application.

## Available Pages

### 1. `index.html`
- Landing page with hero section, features, and call-to-action
- Responsive design with Tailwind CSS
- Links to login and signup pages

### 2. `login.html`
- Login and registration form
- Toggle between login and signup modes
- Connects to backend API at `http://localhost:5000/api`
- Stores authentication token in cookies
- Redirects based on user role (passenger/driver)

### 3. `about.html`
- About page with mission and technology stack information
- Features overview
- Company information

### 4. `features.html`
- Detailed features page
- Separate sections for passengers and drivers
- Visual feature cards with icons

## Usage

### Standalone Access
These HTML files can be accessed directly:
- `http://localhost:3000/index.html`
- `http://localhost:3000/login.html`
- `http://localhost:3000/about.html`
- `http://localhost:3000/features.html`

### Integration with Next.js
Next.js automatically serves files from the `public` directory at the root path:
- `/index.html` → `http://localhost:3000/index.html`
- `/login.html` → `http://localhost:3000/login.html`

## API Configuration

Make sure to update the API URL in `login.html` if your backend runs on a different port:

```javascript
const API_URL = 'http://localhost:5000/api'; // Change if needed
```

## Styling

All pages use:
- **Tailwind CSS** (via CDN)
- **Font Awesome** icons (via CDN)
- Custom CSS for animations and hover effects

## Features

- ✅ Fully responsive design
- ✅ Modern UI with animations
- ✅ API integration for authentication
- ✅ Cookie-based session management
- ✅ Role-based redirects (passenger/driver)
- ✅ Error and success message handling

## Notes

- These HTML files are standalone and don't require the Next.js app to be running
- However, for full functionality (authentication, rides, etc.), the backend API must be running
- The login page will automatically redirect to the Next.js app after successful authentication
