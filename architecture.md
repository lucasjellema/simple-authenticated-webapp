# Simple Authenticated Web App Architecture

This document outlines the technical architecture and flow of the Simple Authenticated Web App. The application is built as a modular client-side JavaScript application that authenticates users with Microsoft Entra ID and retrieves data from secure APIs.

## Overall Architecture

The application follows a modular architecture with clear separation of concerns:

- The core application logic coordinates authentication flow and initialization
- Authentication is handled through Microsoft Entra ID (Azure AD) using MSAL.js
- Data services manage API communication with authentication tokens
- UI components handle rendering and user interactions

## Module Structure

The application is structured into several key JavaScript modules:

| Module | Responsibility |
|--------|----------------|
| `app.js` | Main application coordinator that initializes components and manages flow |
| `auth.js` | Handles authentication with Microsoft Entra ID using MSAL.js |
| `authConfig.js` | Configuration parameters for Microsoft authentication |
| `dataService.js` | Manages authenticated API calls and data caching |
| `dataConfig.js` | Configuration for API endpoints |
| `ui.js` | Handles DOM manipulation and user interface interactions |

## Application Flow

1. **Initialization**:
   - The application starts when the DOM is loaded
   - The app checks if MSAL.js is available and loads it if not
   - Auth module is initialized with configuration from authConfig.js

2. **Authentication Flow**:
   - On first load, the app checks for existing authentication or handles redirect from auth provider
   - User can click "Sign In" to begin authentication with Microsoft Entra ID
   - Auth module redirects to Microsoft login page
   - After successful login, Microsoft redirects back to the application
   - MSAL.js handles the token acquisition and storage
   - User information is fetched from Microsoft Graph API

3. **Data Retrieval Flow**:
   - After authentication, data can be fetched from configured API endpoints
   - The ID token from authentication is used as a bearer token
   - API requests are sent with proper authorization headers
   - Responses are cached in memory to minimize redundant API calls
   - UI is updated to display the fetched data

4. **Component Interaction**:
   - App module coordinates between auth, data, and UI modules
   - UI module responds to user interactions and delegates to app module
   - Auth module maintains authentication state and tokens
   - Data service module handles API communication and caching

## Security Considerations

- Tokens are stored in memory only, not persisted to localStorage or cookies
- API calls include proper authorization headers using bearer tokens
- Authentication uses industry-standard OAuth 2.0 and OpenID Connect protocols
- CORS preflight requests are automatically handled by the browser for authenticated API calls

## Technical Details

### Authentication Flow

The authentication uses the OAuth 2.0 authorization code flow with PKCE, implemented through MSAL.js:

1. App initializes MSAL with configuration
2. User triggers sign-in, which redirects to Microsoft Entra ID
3. User authenticates on Microsoft's login page
4. Authorization code is returned to the app
5. MSAL exchanges the code for tokens
6. Tokens are stored in memory
7. ID token is used to display user information
8. Access token is used for API calls

### API Communication

The application communicates with backend APIs using the following pattern:

1. Retrieves the ID token from the auth module
2. Constructs a fetch request with the token in the Authorization header
3. Sends the request to the configured endpoint
4. Handles the response, including error cases
5. Caches the successful response for future use
6. Updates the UI with the retrieved data

## Component Diagram

```mermaid
graph TD
    User([User]) -->|Interacts with| UI[UI Module]
    UI -->|Delegates events to| App[App Module]
    
    App -->|Initializes| Auth[Auth Module]
    App -->|Controls| UI
    App -->|Requests data via| DataService[Data Service]
    
    Auth -->|Uses config from| AuthConfig[Auth Config]
    Auth <-->|Authenticates with| EntraID[Microsoft Entra ID]
    
    DataService -->|Uses endpoints from| DataConfig[Data Config]
    DataService -->|Gets tokens from| Auth
    DataService <-->|Fetches data from| APIGateway[API Gateway]
    
    subgraph "Client Application"
        UI
        App
        Auth
        DataService
        AuthConfig
        DataConfig
    end
    
    subgraph "External Services"
        EntraID
        APIGateway
    end
    
    EntraID -->|Issues tokens for| User
    APIGateway -->|Returns data to| DataService
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Auth
    participant DataService
    participant EntraID as Microsoft Entra ID
    participant API as API Gateway
    
    User->>App: Load application
    App->>Auth: Initialize auth
    
    User->>App: Click Sign In
    App->>Auth: Request sign in
    Auth->>EntraID: Redirect to login
    EntraID->>User: Present login page
    User->>EntraID: Enter credentials
    EntraID->>Auth: Return with auth code
    Auth->>EntraID: Exchange code for tokens
    EntraID->>Auth: Return tokens
    Auth->>App: Authentication complete
    App->>User: Update UI (authenticated)
    
    User->>App: Request data
    App->>DataService: Request data
    DataService->>Auth: Get ID token
    Auth->>DataService: Return token
    
    Note over DataService,API: Authorization: Bearer {token}
    
    DataService->>API: Send authenticated request
    API->>API: CORS preflight (OPTIONS)
    API->>API: Validate token
    API->>DataService: Return data
    DataService->>App: Return formatted data
    App->>User: Display data

    User->>App: Click Sign Out
    App->>Auth: Request sign out
    Auth->>EntraID: End session
    Auth->>App: Session terminated
    App->>User: Update UI (signed out)
```

## Module Dependencies

```mermaid
graph LR
    app.js -->|imports| auth.js
    app.js -->|imports| ui.js
    app.js -->|imports| dataService.js
    
    auth.js -->|imports| authConfig.js
    
    dataService.js -->|imports| dataConfig.js
    dataService.js -->|imports| auth.js
    
    classDef config fill:#f9f,stroke:#333,stroke-width:1px
    class authConfig.js,dataConfig.js config
```

## Environment Requirements

The application is designed to run in any modern web browser with JavaScript enabled. It requires:

1. Network connectivity to Microsoft authentication services
2. Network connectivity to the configured API endpoints
3. Support for modern JavaScript features (ES6+)
4. CORS support for cross-origin API requests

## Development Principles

This project follows these development principles:

1. **Modular Code**: Uses ES Modules to break up functionality into logical units
2. **Size Limitations**: JavaScript files are kept under 200 lines for maintainability
3. **No Magic Values**: Constants are used instead of hardcoded values
4. **Documentation**: Comprehensive comments explain what the code does
