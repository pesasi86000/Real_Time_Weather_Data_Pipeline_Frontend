# Real-Time Weather Data Pipeline Frontend

A React-based weather dashboard built by **Sasi Pedavalli** that displays real-time weather data fetched from a backend API.

## Features

- Live weather data for multiple cities
- Displays city, temperature, humidity, and weather condition
- Loading state while fetching data
- Friendly error messages if the backend is not running
- Auto-refreshes every 5 minutes
- 7-day forecast page
- Historical weather data viewer
- Responsive design for all screen sizes

## Tech Stack

- **React** (with Hooks)
- **React Router** for navigation
- **Recharts** for data visualization
- **Vite** as build tool
- **PapaParse** for CSV parsing

## Getting Started

### Prerequisites
- Node.js installed
- Backend server running at `http://127.0.0.1:5000`

### Install Dependencies

```bash
npm install
```

### Run the App

```bash
npm run dev
```

Open your browser at `http://localhost:5173`

## Backend API

The frontend fetches weather data from:

```
GET http://127.0.0.1:5000/weather?city=London
```

Expected response format:
```json
{
  "city": "London",
  "temperature": 18,
  "humidity": 72,
  "condition": "Cloudy"
}
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   └── Navbar.css
├── pages/
│   ├── Home.jsx
│   ├── Dashboard.jsx
│   ├── Forecast.jsx
│   ├── History.jsx
│   └── About.jsx
├── App.jsx
└── main.jsx
```

## Author

**Sasi Pedavalli**  
Real-Time Weather Data Pipeline — Frontend
