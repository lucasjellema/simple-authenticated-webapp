/**
 * app.js
 * Main application module
 * 
 * This module initializes the application and connects the authentication
 * and UI modules together. It handles the application lifecycle and
 * authentication flow.
 */

import * as auth from './auth.js';
import * as ui from './ui.js';

// Constants for application state
const APP_STATE = {
  initialized: false,
  authenticated: false
};

// Constants for event timing
const TIMING = {
  retryInterval: 1000, // ms between retries for MSAL loading
  maxRetries: 10       // maximum number of retries
};

/**
 * Initialize the application
 */
async function initializeApp() {
  // Add MSAL script to the page if not present
  await ensureMsalLoaded();
  
  // Initialize the authentication module
  APP_STATE.initialized = auth.initializeAuth();
  
  if (!APP_STATE.initialized) {
    ui.showError("Failed to initialize authentication system");
    return;
  }
  
  // Set up UI with auth callbacks
  ui.initializeUI(handleSignIn, handleSignOut);
  
  // Check for redirect response
  try {
    const response = await auth.handleRedirectResponse();
    if (response) {
      console.log("Successful authentication response received");
      await updateUserState();
    } else {
      // Check if user is already signed in
      await checkExistingAuth();
    }
  } catch (error) {
    console.error("Error handling redirect:", error);
    ui.showError("Authentication error");
  }
}

/**
 * Ensure MSAL script is loaded before proceeding
 */
async function ensureMsalLoaded() {
  // Check if MSAL is already available
  if (window.msal) {
    return;
  }
  
  return new Promise((resolve) => {
    // Create script tag for MSAL
    const msalScript = document.createElement('script');
    msalScript.src = "https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js";
    msalScript.async = true;
    msalScript.defer = true;
    
    // Handle script load event
    msalScript.onload = () => {
      console.log("MSAL.js loaded successfully");
      resolve();
    };
    
    // Handle script error
    msalScript.onerror = () => {
      console.error("Failed to load MSAL.js");
      ui.showError("Failed to load authentication library");
      resolve(); // Resolve anyway to allow error handling
    };
    
    // Add the script to the document head
    document.head.appendChild(msalScript);
  });
}

/**
 * Check if user is already authenticated
 */
async function checkExistingAuth() {
  const account = auth.getAccount();
  if (account) {
    console.log("Found existing account", account.username);
    await updateUserState();
  } else {
    // No account found, show unauthenticated state
    APP_STATE.authenticated = false;
    ui.showUnauthenticatedState();
  }
}

/**
 * Update the user state and UI based on authentication
 */
async function updateUserState() {
  try {
    // Get user details from Microsoft Graph API
    const userDetails = await auth.getUserDetails();
    
    if (userDetails) {
      APP_STATE.authenticated = true;
      
      // Get ID token claims for display
      const idTokenClaims = auth.getIdTokenClaims();
      
      // Update UI with user details and token claims
      ui.showAuthenticatedUser(userDetails, idTokenClaims);
    } else {
      APP_STATE.authenticated = false;
      ui.showUnauthenticatedState();
    }
  } catch (error) {
    console.error("Error updating user state:", error);
    APP_STATE.authenticated = false;
    ui.showUnauthenticatedState();
  }
}

/**
 * Handle sign-in button click
 */
function handleSignIn() {
  if (!APP_STATE.initialized) {
    ui.showError("Authentication system not initialized");
    return;
  }
  
  try {
    auth.signIn();
  } catch (error) {
    console.error("Sign in error:", error);
    ui.showError("Failed to sign in");
  }
}

/**
 * Handle sign-out button click
 */
function handleSignOut() {
  if (!APP_STATE.initialized) {
    return;
  }
  
  try {
    auth.signOut();
    APP_STATE.authenticated = false;
    ui.showUnauthenticatedState();
  } catch (error) {
    console.error("Sign out error:", error);
    ui.showError("Failed to sign out");
  }
}

// Initialize the application when the document is loaded
document.addEventListener('DOMContentLoaded', initializeApp);
