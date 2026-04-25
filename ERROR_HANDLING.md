# Error Handling Guide

## Overview
A comprehensive error handling system has been implemented to catch backend errors and display friendly, user-facing messages instead of technical error details.

## Key Features

### 1. Error Handler Utility (`src/utils/errorHandler.js`)
The main utility module that handles all error translations:

- **`getErrorMessage(error)`** - Converts various error types to user-friendly messages
- **`parseErrorResponse(response)`** - Extracts error information from backend responses
- **`fetchWithErrorHandling(url, options)`** - Enhanced fetch wrapper with error handling

#### Error Types Supported:
- HTTP Status Codes (400, 404, 500, 503, etc.)
- Network errors
- Timeout errors
- Backend-specific errors (City not found, Invalid input, etc.)
- JSON parsing errors

### 2. Alert Component (`src/components/Alert.jsx`)
A reusable alert component for displaying formatted error/success messages with:
- Different alert types: `success`, `error`, `warning`, `info`, `notfound`
- Custom icons and titles
- Action buttons
- Dismissible alerts
- Smooth animations

### 3. Enhanced Dashboard
The Dashboard component now:
- Catches specific error types (e.g., 404 for "City not found")
- Displays context-aware error messages
- Shows helpful hints based on error type
- Uses the Alert component for consistent UI

## Usage Examples

### In Components
```jsx
import { getErrorMessage, parseErrorResponse } from '../utils/errorHandler'
import Alert from '../components/Alert'

// In your fetch code:
try {
  const response = await fetch(apiUrl)
  
  if (!response.ok) {
    const errorData = await parseErrorResponse(response)
    const friendlyMessage = getErrorMessage(errorData.message || response.status)
    setError(friendlyMessage)
    return
  }
  
  const data = await response.json()
  // Process data...
} catch (err) {
  const friendlyMessage = getErrorMessage(err)
  setError(friendlyMessage)
}

// In your JSX:
{error && (
  <Alert
    type="error"
    title="Something went wrong"
    message={error}
    onClose={() => setError(null)}
    actions={<button onClick={retryFunction}>Try Again</button>}
  />
)}
```

## Error Messages by Type

### Common Errors:
- **400**: "Bad request. Please check your input."
- **404**: "City not found. Please check the spelling and try again."
- **500**: "Server error. Please try again later."
- **503**: "Service unavailable. Please try again later."
- **504**: "Gateway timeout. Please try again later."

### Custom Backend Errors:
- **CITY_NOT_FOUND**: "City not found. Please check the spelling and try again."
- **INVALID_CITY**: "Invalid city name. Please enter a valid city."
- **NO_DATA**: "No weather data available for this city."
- **CONNECTION_ERROR**: "Connection failed. Please check your internet connection."
- **TIMEOUT**: "Request timed out. Please try again."

## Customizing Error Messages

To add or modify error messages, edit the `ERROR_MESSAGES` object in `src/utils/errorHandler.js`:

```javascript
const ERROR_MESSAGES = {
  400: 'Bad request. Please check your input.',
  // Add custom status codes or error types here
  YOUR_ERROR_KEY: 'Your friendly message',
};
```

## Extending Error Handling

### For Other Pages:
1. Import the error handler and Alert component
2. Use them in your fetch/async operations
3. Display errors using the Alert component

Example for History page:
```jsx
import { getErrorMessage } from '../utils/errorHandler'
import Alert from '../components/Alert'

// In your component:
const loadData = async () => {
  try {
    // Your fetch logic
  } catch (err) {
    setError(getErrorMessage(err))
  }
}
```

### Adding Backend Error Mapping:
If your backend returns custom error formats, update `parseErrorResponse()`:

```javascript
export const parseErrorResponse = async (response) => {
  try {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      // Map your backend error format
      return {
        message: data.error_message || data.message,
        code: data.error_code,
      };
    }
    
    return { message: response.statusText };
  } catch (e) {
    return { message: `Error: ${response.status} ${response.statusText}` };
  }
};
```

## Alert Component Props

```jsx
<Alert
  type="error"              // Type: 'success', 'error', 'warning', 'info', 'notfound'
  title="Title"            // Alert title
  message="Message"        // Main message
  icon="🔍"                // Custom icon (optional)
  onClose={fn}             // Callback when closed
  closeable={true}         // Show close button
  actions={<button>...</button>}  // Action elements
/>
```

## Styling

Error alerts use contextual colors:
- **Error**: Red tones (#f56565)
- **Warning**: Orange tones (#f6ad55)
- **Success**: Green tones (#48bb78)
- **Info**: Blue tones (#4299e1)
- **Not Found**: Orange tones (#f6ad55)

## Best Practices

1. **Always provide friendly messages** - Never show raw technical errors to users
2. **Include helpful hints** - Suggest actions users can take to resolve the issue
3. **Use consistent styling** - Utilize the Alert component for uniform appearance
4. **Test error scenarios** - Verify error handling works for common failure cases
5. **Log errors for debugging** - Consider adding logging for development/debugging

## Files Created/Modified

- ✨ **NEW**: `src/utils/errorHandler.js` - Error handling utility
- ✨ **NEW**: `src/components/Alert.jsx` - Alert component
- ✨ **NEW**: `src/components/Alert.css` - Alert styles
- 🔄 **MODIFIED**: `src/pages/Dashboard.jsx` - Integrated error handling
- 🔄 **MODIFIED**: `src/pages/Dashboard.css` - Enhanced error styling
