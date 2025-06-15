/**
 * ui.js
 * UI management module
 * 
 * This module handles all UI updates related to authentication status
 * It provides functions to update the UI based on the authentication state
 */

// Constants for DOM elements
const DOM_ELEMENTS = {
  welcomeMessage: document.getElementById('welcome-message'),
  signInButton: document.getElementById('signin-button'),
  signOutButton: document.getElementById('signout-button'),
  tokenSection: document.getElementById('token-section'),
  tokenToggle: document.getElementById('toggle-token'),
  tokenContent: document.getElementById('token-content'),
  tokenData: document.getElementById('token-data')
};

// CSS classes for styling different states
const UI_CLASSES = {
  authenticated: 'authenticated',
  unauthenticated: 'unauthenticated'
};

/**
 * Initialize the UI elements
 * @param {Function} signInCallback - Function to call when sign-in button is clicked
 * @param {Function} signOutCallback - Function to call when sign-out button is clicked
 */
export function initializeUI(signInCallback, signOutCallback) {
  // Check if DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupEventListeners(signInCallback, signOutCallback));
  } else {
    setupEventListeners(signInCallback, signOutCallback);
  }
}

/**
 * Set up event listeners for buttons
 * @param {Function} signInCallback - Function to call when sign-in button is clicked
 * @param {Function} signOutCallback - Function to call when sign-out button is clicked
 */
function setupEventListeners(signInCallback, signOutCallback) {
  // Re-assign DOM elements to ensure they're available
  const elements = {
    welcomeMessage: document.getElementById('welcome-message'),
    signInButton: document.getElementById('signin-button'),
    signOutButton: document.getElementById('signout-button'),
    tokenSection: document.getElementById('token-section'),
    tokenToggle: document.getElementById('toggle-token'),
    tokenContent: document.getElementById('token-content'),
    tokenData: document.getElementById('token-data')
  };
  
  // Set up sign in button
  if (elements.signInButton) {
    elements.signInButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (typeof signInCallback === 'function') {
        signInCallback();
      }
    });
  }
  
  // Set up sign out button
  if (elements.signOutButton) {
    elements.signOutButton.addEventListener('click', (event) => {
      event.preventDefault();
      if (typeof signOutCallback === 'function') {
        signOutCallback();
      }
    });
  }
  
  // Set up token toggle button
  if (elements.tokenToggle) {
    elements.tokenToggle.addEventListener('click', () => {
      const isExpanded = elements.tokenToggle.getAttribute('aria-expanded') === 'true';
      toggleTokenVisibility(!isExpanded);
    });
  }
}

/**
 * Update UI to show authenticated user with user information
 * @param {Object} user - The user object containing profile information
 * @param {Object|null} tokenClaims - The parsed ID token claims
 */
export function showAuthenticatedUser(user, tokenClaims) {
  const elements = {
    welcomeMessage: document.getElementById('welcome-message'),
    signInButton: document.getElementById('signin-button'),
    signOutButton: document.getElementById('signout-button'),
    tokenSection: document.getElementById('token-section'),
    tokenData: document.getElementById('token-data')
  };
  
  // Update welcome message with user's name
  if (elements.welcomeMessage) {
    const displayName = user.displayName || user.name || 'Authenticated User';
    elements.welcomeMessage.innerHTML = `
      <p>Welcome, <strong>${displayName}</strong>!</p>
      <p class="user-info">You are signed in with Microsoft Entra ID</p>
    `;
  }
  
  // Update button visibility
  if (elements.signInButton) {
    elements.signInButton.style.display = 'none';
  }
  
  if (elements.signOutButton) {
    elements.signOutButton.style.display = 'inline-block';
  }
  
  // Show token section and update token data
  if (elements.tokenSection) {
    elements.tokenSection.style.display = 'block';
    
    // Update token data if available
    if (elements.tokenData && tokenClaims) {
      elements.tokenData.value = JSON.stringify(tokenClaims, null, 2);
    }
  }
  
  // Add authenticated class to body
  document.body.classList.add(UI_CLASSES.authenticated);
  document.body.classList.remove(UI_CLASSES.unauthenticated);
}

/**
 * Update UI to show unauthenticated state
 */
export function showUnauthenticatedState() {
  const elements = {
    welcomeMessage: document.getElementById('welcome-message'),
    signInButton: document.getElementById('signin-button'),
    signOutButton: document.getElementById('signout-button'),
    tokenSection: document.getElementById('token-section')
  };
  
  // Reset welcome message
  if (elements.welcomeMessage) {
    elements.welcomeMessage.innerHTML = `
      <p>Welcome, please sign in</p>
    `;
  }
  
  // Update button visibility
  if (elements.signInButton) {
    elements.signInButton.style.display = 'inline-block';
  }
  
  if (elements.signOutButton) {
    elements.signOutButton.style.display = 'none';
  }
  
  // Hide token section
  if (elements.tokenSection) {
    elements.tokenSection.style.display = 'none';
  }
  
  // Update body class
  document.body.classList.add(UI_CLASSES.unauthenticated);
  document.body.classList.remove(UI_CLASSES.authenticated);
}

/**
 * Show error message in the UI
 * @param {string} message - Error message to display
 */
export function showError(message) {
  const elements = {
    welcomeMessage: document.getElementById('welcome-message')
  };
  
  if (elements.welcomeMessage) {
    elements.welcomeMessage.innerHTML = `
      <p class="error-message">Error: ${message}</p>
      <p>Please try again or contact support if the issue persists.</p>
    `;
  }
}

/**
 * Toggle the visibility of the token content section
 * @param {boolean} show - Whether to show or hide the token content
 */
export function toggleTokenVisibility(show) {
  const elements = {
    tokenToggle: document.getElementById('toggle-token'),
    tokenContent: document.getElementById('token-content')
  };
  
  if (elements.tokenToggle && elements.tokenContent) {
    if (show) {
      elements.tokenContent.style.display = 'block';
      elements.tokenToggle.setAttribute('aria-expanded', 'true');
      elements.tokenToggle.textContent = 'Hide Token';
    } else {
      elements.tokenContent.style.display = 'none';
      elements.tokenToggle.setAttribute('aria-expanded', 'false');
      elements.tokenToggle.textContent = 'Show Token';
    }
  }
}
