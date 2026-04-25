/**
 * Error Handler Utility
 * Maps backend errors to user-friendly messages
 */

const ERROR_MESSAGES = {
  // HTTP Status Codes
  400: 'Bad request. Please check your input.',
  401: 'Authentication required. Please log in.',
  403: 'Access forbidden.',
  404: 'City not found. Please try another city.',
  409: 'City already exists.',
  429: 'Too many requests. Please try again later.',
  500: 'Server error. Please try again later.',
  502: 'Bad gateway. Service temporarily unavailable.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',

  // Backend-specific errors
  CITY_NOT_FOUND: 'City not found. Please check the spelling and try again.',
  INVALID_CITY: 'Invalid city name. Please enter a valid city.',
  NO_DATA: 'No weather data available for this city.',
  CONNECTION_ERROR: 'Connection failed. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  PARSE_ERROR: 'Error processing response from server.',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
};

/**
 * Get user-friendly error message from various error sources
 * @param {Error|Response|number|string} error - The error object, response object, status code, or error type
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  try {
    // Handle Response object (failed fetch response)
    if (error instanceof Response) {
      return ERROR_MESSAGES[error.status] || 
             `Error: ${error.statusText || 'Unknown error'}`;
    }

    // Handle numeric status codes
    if (typeof error === 'number') {
      return ERROR_MESSAGES[error] || `Error ${error}: Something went wrong.`;
    }

    // Handle string error messages (error type keys)
    if (typeof error === 'string') {
      return ERROR_MESSAGES[error] || error;
    }

    // Handle Error objects
    if (error instanceof Error) {
      const message = error.message.toLowerCase();

      // Match specific error patterns
      if (message.includes('city') && message.includes('not found')) {
        return ERROR_MESSAGES.CITY_NOT_FOUND;
      }
      if (message.includes('city')) {
        return ERROR_MESSAGES.INVALID_CITY;
      }
      if (message.includes('fetch') || message.includes('network')) {
        return ERROR_MESSAGES.NETWORK_ERROR;
      }
      if (message.includes('timeout')) {
        return ERROR_MESSAGES.TIMEOUT;
      }
      if (message.includes('json')) {
        return ERROR_MESSAGES.PARSE_ERROR;
      }

      // Return original error message if it's meaningful
      return error.message || ERROR_MESSAGES['500'];
    }

    // Handle JSON response from backend
    if (error && typeof error === 'object') {
      if (error.message) return error.message;
      if (error.error) return error.error;
      if (error.detail) return error.detail;
    }

    return 'An unexpected error occurred. Please try again.';
  } catch (e) {
    return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Parse backend response for error information
 * @param {Response} response - Fetch Response object
 * @returns {Promise<Object>} Parsed error data
 */
export const parseErrorResponse = async (response) => {
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return { message: response.statusText };
  } catch (e) {
    return { message: `Error: ${response.status} ${response.statusText}` };
  }
};

/**
 * Enhanced fetch with better error handling
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      timeout: options.timeout || 10000,
    });

    if (!response.ok) {
      const errorData = await parseErrorResponse(response);
      const error = new Error(errorData.message || getErrorMessage(response.status));
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response;
  } catch (error) {
    // Handle network/timeout errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(ERROR_MESSAGES.CONNECTION_ERROR);
    }
    throw error;
  }
};

export default {
  getErrorMessage,
  parseErrorResponse,
  fetchWithErrorHandling,
};
