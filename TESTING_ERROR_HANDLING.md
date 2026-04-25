# Testing Error Handling

## Test Scenarios

### 1. City Not Found Error (404)
**How to trigger**: 
- Select a city that doesn't exist in your backend
- Or manually change the city name in the URL/dropdown

**Expected behavior**:
- Shows a 🔍 icon
- Title: "City Not Found"
- Message: "City not found. Please check the spelling and try again."
- Helpful hint: "💡 Select a different city from the dropdown above"
- Retry button to try again

### 2. Backend Connection Error
**How to trigger**:
- Stop/pause the Flask backend server
- Try to fetch weather data
- Or make request to invalid backend URL

**Expected behavior**:
- Shows a ⚠️ icon
- Title: "Unable to Fetch Weather Data"
- Message: "Connection failed. Please check your internet connection."
- Retry button appears

### 3. Timeout Error
**How to trigger**:
- If backend takes too long (>10 seconds)
- Network is very slow

**Expected behavior**:
- Shows a ⚠️ icon
- Message: "Request timed out. Please try again."

### 4. Server Error (500)
**How to trigger**:
- Backend throws an exception
- Backend returns 500 status code

**Expected behavior**:
- Shows a ⚠️ icon
- Message: "Server error. Please try again later."

### 5. Service Unavailable (503)
**How to trigger**:
- Backend service is down for maintenance
- Returns 503 status code

**Expected behavior**:
- Shows a ⚠️ icon
- Message: "Service unavailable. Please try again later."

## Testing Checklist

- [ ] Error message displays correctly
- [ ] Error icon is appropriate for the error type
- [ ] Alert styling looks good
- [ ] Retry button works and re-fetches data
- [ ] Close button (✕) dismisses the alert
- [ ] Error message is user-friendly (not technical jargon)
- [ ] Helpful hints display for specific errors
- [ ] Loading state clears after error
- [ ] Old weather data is cleared on error
- [ ] Responsive design works on mobile

## Simulating Backend Errors

### In Flask Backend (Python):
```python
# Simulate 404 error
@app.route('/weather')
def get_weather():
    city = request.args.get('city')
    if not city_exists(city):
        return jsonify({
            'error': 'City not found',
            'message': f'Weather data for {city} is not available'
        }), 404
    
    # Return data...
```

### Test with curl:
```bash
# Test 404 error
curl -i http://127.0.0.1:5000/weather?city=NonexistentCity

# Test with custom error message
curl -i -H "Accept: application/json" http://127.0.0.1:5000/weather?city=InvalidCity
```

## Debugging

### In Browser Console:
```javascript
// Test error handler directly
import { getErrorMessage } from './src/utils/errorHandler.js'

// Test with status code
getErrorMessage(404)
// Returns: "City not found. Please check the spelling and try again."

// Test with error object
const err = new Error('City not found')
getErrorMessage(err)

// Test with string
getErrorMessage('CITY_NOT_FOUND')
```

### Verify Components:
- Check if Alert component mounts: Open DevTools, inspect for `<div class="alert">`
- Check error state: In React DevTools, inspect Dashboard component state
- Check error messages: Console should show parsed error data

## Performance Testing

- Error displays should appear within 100-200ms
- Alert animations should be smooth (60fps)
- Retry should work without page refresh
- Multiple rapid clicks should not cause duplicate requests

## Accessibility Testing

- [ ] Error icon is semantic (not just emoji)
- [ ] Error title is readable
- [ ] Error message is descriptive
- [ ] Close button is keyboard accessible
- [ ] Alert has proper ARIA labels
- [ ] Color contrast meets WCAG standards
- [ ] Works without mouse/keyboard

## Browser Compatibility

Test error handling in:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

## Integration Testing

After implementing error handling in other pages:
1. Verify each page has proper error display
2. Test consistency across pages
3. Verify error messages match page context
4. Test error handling with real backend scenarios
