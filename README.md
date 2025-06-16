# Simple Microsoft Entra ID Authentication Web App

A lightweight static web application that demonstrates authentication with Microsoft Entra ID (Azure AD), displays the authenticated user's details, and fetches authenticated data from remote endpoints.

## Features

- Microsoft Entra ID authentication with MSAL.js
- Simple, clean UI with responsive design
- Displays authenticated user's name and profile information
- Collapsible ID token viewer for debugging and educational purposes
- In-memory token storage (not stored in browser storage)
- Authenticated API data fetching with bearer token
- User data editing and saving with authenticated PUT requests
- Admin section for managing delta files on the backend
- Request caching and optimized data handling
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
│   ├── dataConfig.js - Configuration settings for data endpoints
│   ├── dataService.js - Service for fetching and persisting data
│   └── ui.js        - UI module for managing the user interface
└── README.md        - This documentation file
```

## Setup Instructions

### Prerequisites

- A Microsoft Azure account with permissions to register applications
- A registered application in the Microsoft Entra ID portal (Azure AD)
- A valid API endpoint for fetching authenticated data (for example on a API Gateway)
- A valid API endpoint for fetching user-specific data (for example on a API Gateway)

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
4. The application will automatically fetch and display data from the configured endpoints
5. Click "Fetch User Data" to retrieve user-specific data
6. Edit the user data in the text area if needed
7. Click "Save User Data" to persist changes back to the server
8. Click "Show Token" to view the ID token claims in JSON format
9. For administrative users, access the admin section at the bottom of the page
10. Click "Fetch Delta Files" to view available delta files
11. Click on individual files to view their contents
12. Click "Sign Out" to end the session

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
- API requests include bearer tokens in Authorization headers
- Preflight requests are automatically handled by the browser for authenticated API calls with custom headers
- Data modification is secured with authenticated PUT requests
- User data changes are timestamped with lastModified property
- Admin functionality uses role-based access control (configurable)
- Admin API calls require proper authentication and custom headers

## Customization

The application can be extended in various ways:

1. Add additional Microsoft Graph API calls to retrieve more user information
2. Further enhance role-based access control using roles from the ID token
3. Add custom branding and styling to match your organization
4. Implement additional authentication options like multi-factor authentication
5. Extend the admin functionality with create/update/delete operations
6. Add search and filtering capabilities for admin file management

## Admin Features

The application includes an administrative section that provides:

1. **Delta File Management**: View and access delta files stored on the backend
2. **Role-Based Access**: Admin section is only accessible to authenticated users (can be restricted to specific roles)
3. **Secure API Calls**: All admin API calls use proper authentication with bearer tokens
4. **File Browsing Interface**: Lists all available delta files with clickable access
5. **File Content Viewing**: Displays the content of selected files in a text area

To use the admin features:

1. Authenticate as a user with appropriate permissions
2. Scroll to the bottom of the page to find the admin section
3. Click "Fetch Delta Files" to retrieve the list of available files
4. Click on any file name in the list to view its content

## License

This project is available for use under the MIT License.
