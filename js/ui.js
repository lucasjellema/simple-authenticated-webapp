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
  tokenData: document.getElementById('token-data'),
  dataSection: document.getElementById('data-section'),
  userDataSection: document.getElementById('userdata-section'),
  fetchUserDataButton: document.getElementById('fetch-user-data'),
  fetchDataButton: document.getElementById('fetch-data'),
  dataContent: document.getElementById('data-content'),
  userDataContent: document.getElementById('userdata-content'),
  apiData: document.getElementById('api-data'),
  apiUserData: document.getElementById('api-user-data'),
  dataStatus: document.getElementById('data-status'),
  userDataStatus: document.getElementById('user-data-status')
};

// CSS classes for styling different states
const UI_CLASSES = {
  authenticated: 'authenticated',
  unauthenticated: 'unauthenticated',
  loading: 'loading',
  error: 'error',
  success: 'success'
};

/**
 * Initialize the UI elements
 * @param {Function} signInCallback - Function to call when sign-in button is clicked
 * @param {Function} signOutCallback - Function to call when sign-out button is clicked
 * @param {Function} fetchDataCallback - Function to call when fetch data button is clicked
 * @param {Function} fetchUserDataCallback - Function to call when fetch user data button is clicked
 */
export function initializeUI(signInCallback, signOutCallback, fetchDataCallback, fetchUserDataCallback) {
  // Check if DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupEventListeners(signInCallback, signOutCallback, fetchDataCallback, fetchUserDataCallback));
  } else {
    setupEventListeners(signInCallback, signOutCallback, fetchDataCallback, fetchUserDataCallback);
  }
}

/**
 * Set up event listeners for buttons
 * @param {Function} signInCallback - Function to call when sign-in button is clicked
 * @param {Function} signOutCallback - Function to call when sign-out button is clicked
 * @param {Function} fetchDataCallback - Function to call when fetch data button is clicked
 * @param {Function} fetchUserDataCallback - Function to call when fetch user data button is clicked
 */
function setupEventListeners(signInCallback, signOutCallback, fetchDataCallback, fetchUserDataCallback) {
  // Re-assign DOM elements to ensure they're available
  const elements = {
    welcomeMessage: document.getElementById('welcome-message'),
    signInButton: document.getElementById('signin-button'),
    signOutButton: document.getElementById('signout-button'),
    tokenSection: document.getElementById('token-section'),
    tokenToggle: document.getElementById('toggle-token'),
    tokenContent: document.getElementById('token-content'),
    tokenData: document.getElementById('token-data'),
    dataSection: document.getElementById('data-section'),
    fetchDataButton: document.getElementById('fetch-data'),
    dataContent: document.getElementById('data-content'),
    apiData: document.getElementById('api-data'),
    dataStatus: document.getElementById('data-status'),
    userDataSection: document.getElementById('userdata-section'),
    fetchUserDataButton: document.getElementById('fetch-user-data'),
    userDataContent: document.getElementById('userdata-content'),
    apiUserData: document.getElementById('api-user-data'),
    userDataStatus: document.getElementById('user-data-status')
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
  
  // Set up fetch data button
  if (elements.fetchDataButton && typeof fetchDataCallback === 'function') {
    elements.fetchDataButton.addEventListener('click', () => {
      // Show loading status
      showDataStatus('Loading data...', UI_CLASSES.loading);
      
      // Call the fetch data callback
      fetchDataCallback();
    });
  }
  // Set up fetch user data button
  if (elements.fetchUserDataButton && typeof fetchUserDataCallback === 'function') {
    elements.fetchUserDataButton.addEventListener('click', () => {
      // Show loading status
      showDataStatus('Loading user data...', UI_CLASSES.loading);
      
      // Call the fetch user data callback
      fetchUserDataCallback();
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
    tokenData: document.getElementById('token-data'),
    dataSection: document.getElementById('data-section')
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
  
  // Show data section
  if (elements.dataSection) {
    elements.dataSection.style.display = 'block';
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
  
  // Hide token section and data section
  if (elements.tokenSection) {
    elements.tokenSection.style.display = 'none';
  }
  
  if (elements.dataSection) {
    elements.dataSection.style.display = 'none';
  }
  
  if (elements.userDataSection) {
    elements.userDataSection.style.display = 'none';
  }
  
  // Update body class
  document.body.classList.add(UI_CLASSES.unauthenticated);
  document.body.classList.remove(UI_CLASSES.authenticated);
}

/**
 * Display data in the API data textarea
 * @param {Object} data - The data to display
 */
export function displayData(data) {
  const elements = {
    apiData: document.getElementById('api-data')
  };
  
  if (elements.apiData && data) {
    // Format the data as pretty JSON
    const formattedData = JSON.stringify(data, null, 2);
    elements.apiData.value = formattedData;
    
    // Show success status
    showDataStatus('Data fetched successfully', UI_CLASSES.success);
  }
}
/**
 * Display data in the API data textarea
 * @param {Object} data - The data to display
 */
export function displayUserData(data) {
  const elements = {
    apiUserData: document.getElementById('api-user-data')
  };
  
  if (elements.apiUserData && data) {
    // Format the data as pretty JSON
    const formattedData = JSON.stringify(data, null, 2);
    elements.apiUserData.value = formattedData;
    
    // Show success status
    showDataStatus('User Data fetched successfully', UI_CLASSES.success);
  }
}

/**
 * Show a data status message
 * @param {string} message - The status message to display
 * @param {string} [statusClass] - CSS class for styling the status
 */
export function showDataStatus(message, statusClass) {
  const elements = {
    dataStatus: document.getElementById('data-status')
  };
  
  if (elements.dataStatus) {
    // Remove all status classes
    elements.dataStatus.classList.remove(
      UI_CLASSES.loading, 
      UI_CLASSES.error, 
      UI_CLASSES.success
    );
    
    // Add specific status class if provided
    if (statusClass) {
      elements.dataStatus.classList.add(statusClass);
    }
    
    // Set message text
    elements.dataStatus.textContent = message;
  }
}

/**
 * Display an error message for data fetching
 * @param {string} errorMessage - The error message to display
 */
export function showDataError(errorMessage) {
  showDataStatus(`Error: ${errorMessage}`, UI_CLASSES.error);
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
