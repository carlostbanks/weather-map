# GeoExplorer - Interactive Mapping Application

GeoExplorer is an interactive map-based full-stack application that allows users to explore various map layers including standard base maps, topographic data, and real-time weather information. The application demonstrates integration with multiple geospatial data services including OpenStreetMap, USGS, NASA GIBS, and OpenWeatherMap.

![GeoExplorer Screenshot]([screenshot.png](https://ibb.co/tMC96gCX))

## Features

- Interactive map with multiple base layers
- Real-time weather data overlays (precipitation, temperature, clouds)
- Support for multiple tile service types (XYZ, WMS, WMTS)
- User authentication system
- Ability to save favorite map layers
- Responsive design for desktop and mobile use

## Tech Stack

### Frontend
- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Leaflet** - Interactive mapping library
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **Python** - Server-side language
- **Flask** - Web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL/PostGIS** - Spatial database
- **JWT** - Authentication mechanism

## Getting Started

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- PostgreSQL with PostGIS extension (optional for full functionality)

### Installation

#### Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Initialize the database (if using PostgreSQL)
flask db init
flask db migrate -m "Initial migration"
flask db upgrade

# Start the Flask server
python run.py
```

#### Frontend Setup
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### Using the Application

1. Open your browser and navigate to `http://localhost:3000`
2. Register a new account or login
3. Explore different map layers by clicking the layer buttons
4. Toggle weather overlays using the layers control in the top-right corner
5. Add layers to your favorites for quick access

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile

### Map Layers
- `GET /api/maps/layers` - Get all available map layers
- `GET /api/maps/user/layers` - Get user's saved layers
- `POST /api/maps/user/layers` - Add a layer to user's collection
- `PUT /api/maps/user/layers/:id` - Update a user's layer
- `DELETE /api/maps/user/layers/:id` - Remove a layer from user's collection

## Development Notes

The application uses a fallback mechanism for when the backend API is unavailable, storing data in local state to ensure the UI remains functional. This demonstrates resilient frontend architecture that can handle API failures gracefully.

## Future Enhancements
- Add drawing tools for creating custom shapes on the map
- Implement geocoding for location search
- Add data visualization capabilities for GeoJSON data
- Support for more types of geospatial services
- Implement user-defined custom layers

## License
MIT

## Credits
- OpenStreetMap for base map tiles
- OpenWeatherMap for weather data
- USGS for topographic data
- NASA GIBS for satellite imagery
