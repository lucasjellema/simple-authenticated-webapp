/**
 * dataService.js
 * Data service module for retrieving and caching data from the API
 * 
 * This module handles data retrieval from the configured endpoint using
 * the authenticated user's ID token as authorization. The data is retained
 * in memory throughout the session.
 */

import { dataEndpoint, deltaEndpoint } from './dataConfig.js';
import { getIdToken } from './auth.js';
import * as ui from './ui.js';

// Constants for status and error messages
const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

// In-memory cache for data
const dataCache = {
    // Current data fetch status
    status: STATUS.IDLE,

    // Last error message if any
    error: null,

    // Timestamp of last successful fetch
    lastFetched: null,

    // The cached data
    data: null,

    // Cached user data
    userdata: null
};

/**
 * Get data from the API using the authenticated user's ID token
 * @param {boolean} [forceRefresh=false] - Force a refresh even if data is already cached
 * @returns {Promise<Object>} The fetched data
 */
export async function getData(forceRefresh = false) {
    // If data is already cached and refresh is not forced, return cached data
    if (!forceRefresh && dataCache.data !== null) {
        console.log('Returning cached data from previous fetch');
        return dataCache.data;
    }

    // Get the ID token for authentication
    const idToken = getIdToken();

    // Check if token is available
    if (!idToken) {
        const error = 'No authentication token available. Please sign in.';
        dataCache.status = STATUS.ERROR;
        dataCache.error = error;
        throw new Error(error);
    }

    try {
        // Update status to loading
        dataCache.status = STATUS.LOADING;
        const options = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`
            }
        };

        const endpoint = dataEndpoint + "?ts=" + Date.now();
        console.log('Fetching data from endpoint:', endpoint);
        // Make authenticated request to the data endpoint ; bust caching by adding ts query parameter
        const response = await fetch(endpoint, options);

        // Check if request was successful
        if (!response.ok) {
            const errorText = await response.text();
            const error = `API request failed with status ${response.status}: ${errorText}`;
            dataCache.status = STATUS.ERROR;
            dataCache.error = error;
            throw new Error(error);
        }

        // Parse response as JSON
        const data = await response.json();

        // Update cache with fetched data
        dataCache.status = STATUS.SUCCESS;
        dataCache.data = data;
        dataCache.lastFetched = new Date();
        dataCache.error = null;

        return data;
    } catch (error) {
        // Handle fetch or parsing errors
        dataCache.status = STATUS.ERROR;
        dataCache.error = error.message || 'Unknown error occurred while fetching data';
        throw error;
    }
}

/**
 * Get data from the API using the authenticated user's ID token
 * @param {boolean} [forceRefresh=false] - Force a refresh even if data is already cached
 * @returns {Promise<Object>} The fetched data
 */
export async function getUserData(forceRefresh = false) {
    // If data is already cached and refresh is not forced, return cached data
    if (!forceRefresh && dataCache.userdata !== null) {
        console.log('Returning cached data from previous fetch');
        return dataCache.userdata;
    }

    // Get the ID token for authentication
    const idToken = getIdToken();

    // Check if token is available
    if (!idToken) {
        const error = 'No authentication token available. Please sign in.';
        dataCache.status = STATUS.ERROR;
        dataCache.error = error;
        throw new Error(error);
    }

    try {
        // Update status to loading
        dataCache.status = STATUS.LOADING;
        const userDeltaEndpoint = deltaEndpoint;

        console.log(`Attempting to GET user-specific data from: ${userDeltaEndpoint} for current user`);


        const response = await fetch(userDeltaEndpoint + `?ts=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if request was successful
        if (!response.ok) {
            const errorText = await response.text();
            const error = `API request failed with status ${response.status}: ${errorText}`;
            dataCache.status = STATUS.ERROR;
            dataCache.error = error;
            throw new Error(error);
        }

        // Parse response as JSON
        const userSpecificData = await response.json();

        // Update cache with fetched data
        dataCache.status = STATUS.SUCCESS;
        dataCache.userdata = userSpecificData;
        dataCache.lastFetched = new Date();
        dataCache.error = null;

        return userSpecificData;
    } catch (error) {
        // Handle fetch or parsing errors
        dataCache.status = STATUS.ERROR;
        dataCache.error = error.message || 'Unknown error occurred while fetching data';
        throw error;
    }
}

export async function saveUserData(data) {
    dataCache.userdata = data;

    // Get the ID token for authentication
    const idToken = getIdToken();

    // Check if token is available
    if (!idToken) {
        const error = 'No authentication token available. Please sign in.';
        dataCache.status = STATUS.ERROR;
        dataCache.error = error;
        throw new Error(error);
    }


    // The API Gateway route for /deltas (e.g., /conclusion-proxy/speakerpool-delta or /conclusion-proxy2/deltas)
    // is expected to handle PUT requests and use request.auth[name] to determine the specific file in object storage.
    // The deltaEndpoint variable should point to this base path for the API Gateway route.
    // Based on previous user changes (Step 31), deltaEndpoint was set to:
    // "https://odzno3g32mjesdrjipad23mbxq.apigateway.eu-amsterdam-1.oci.customer-oci.com/conclusion-proxy/speakerpool-delta"
    // (after removing /conclusion-assets/deltas/ from its original value)
    // This is the endpoint the PUT request should target.

    const actualPutEndpoint = deltaEndpoint;

    // Add/update the lastModified timestamp
    data.lastModified = new Date().toISOString();

    // Get user ID from token claims if possible, otherwise use 'unknown'    
    const userId = 'current-user'; // This could be extracted from token claims if needed
    console.log(`Attempting to PUT updated profile to: ${actualPutEndpoint}`);

    try {
        const response = await fetch(actualPutEndpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Error saving data:', response.status, errorBody);
            throw new Error(`Failed to save data: ${response.status} ${response.statusText}. Detail: ${errorBody}`);
        }
        console.log('Data saved successfully .');
        // Try to parse JSON from response, but handle cases where response might be empty (e.g., 204 No Content)
        const responseContentType = response.headers.get('content-type');
        let responseData = { success: true }; // Default success response
        if (responseContentType && responseContentType.includes('application/json')) {
            responseData = await response.json();
        } else if (response.status === 204) {
            console.log('Data saved successfully (204 No Content).');
        } else {
            // If not JSON and not 204, just use default success and log the text if any
            const textResponse = await response.text();
            if (textResponse) console.log('Update response text:', textResponse);
        }

        return { success: true, data: responseData };

    } catch (error) {
        console.error('Error saving data:', error);
        throw new Error(`Failed to save data: ${error.message}`);
    }



}



/**
 * Get the current status of data fetching
 * @returns {Object} Object containing status info, data, and any error message
 */
export function getDataStatus() {
    return {
        status: dataCache.status,
        isLoading: dataCache.status === STATUS.LOADING,
        isError: dataCache.status === STATUS.ERROR,
        hasData: dataCache.data !== null,
        error: dataCache.error,
        lastFetched: dataCache.lastFetched
    };
}

/**
 * Clear the cached data
 */
export function clearDataCache() {
    dataCache.status = STATUS.IDLE;
    dataCache.data = null;
    dataCache.error = null;
    dataCache.lastFetched = null;
}
