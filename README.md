# Simple Microsoft Entra ID Authentication Web App

A lightweight static web application that demonstrates authentication with Microsoft Entra ID (Azure AD) and displays the currently authenticated user's details.

## Features

- Microsoft Entra ID authentication with MSAL.js
- Simple, clean UI with responsive design
- Displays authenticated user's name and profile information
- Collapsible ID token viewer for debugging and educational purposes
- In-memory token storage (not stored in browser storage)
- Modular code structure using ES Modules

## Project Structure

```
/
├── index.html       - Main HTML file with application structure
├── styles.css       - CSS styling for the application
├── js/
│   ├── app.js       - Main application module that connects components
│   ├── auth.js      - Authentication module for Entra ID integration
│   ├── authConfig.js - Authentication configuration settings
│   └── ui.js        - UI module for managing the user interface
└── README.md        - This documentation file
```

## Setup Instructions

### Prerequisites

- A Microsoft Azure account with permissions to register applications
- A registered application in the Microsoft Entra ID portal (Azure AD)

### Configuration

1. Register an application in the [Azure Portal](https://portal.azure.com):
   - Navigate to Microsoft Entra ID (Azure Active Directory)
   - Go to App Registrations and create a new registration
   - Set the redirect URI to match your deployment URL
   - Note the Application (client) ID and Directory (tenant) ID

2. Update `js/authConfig.js` with your application's details:
   - Replace the `clientId` with your application's client ID
   - If using a specific tenant, update the `authority` value with your tenant ID

3. Serve the application:
   - Use a local development server during development
   - For production, deploy to any static web hosting service

## Usage

1. Open the application in a web browser
2. Click "Sign In" to authenticate with Microsoft Entra ID
3. After successful authentication, the user's name will be displayed
4. Click "Show Token" to view the ID token claims in JSON format
5. Click "Sign Out" to end the session

## Development Principles

This project follows these development principles:

1. **Modular Code**: Uses ES Modules to break up functionality into logical units
2. **Size Limitations**: JavaScript files are kept under 200 lines for maintainability
3. **No Magic Values**: Constants are used instead of hardcoded values
4. **Documentation**: Comprehensive comments explain what the code does

## Security Notes

- ID tokens are stored in memory only, not in browser storage
- The application follows security best practices for authentication
- Authentication state is not persisted between browser sessions

## Customization

The application can be extended in various ways:

1. Add additional Microsoft Graph API calls to retrieve more user information
2. Implement role-based access control using roles from the ID token
3. Add custom branding and styling to match your organization
4. Implement additional authentication options like multi-factor authentication

## License

This project is available for use under the MIT License.
