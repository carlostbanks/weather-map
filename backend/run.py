from flask import Flask, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Configure app
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-please-change')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/geoexplorer')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')

# Initialize extensions
from app import db, migrate, jwt

db.init_app(app)
migrate.init_app(app, db)
jwt = JWTManager(app)
CORS(app)

# Import models to ensure they're registered with SQLAlchemy
from app.models.user import User
from app.models.geo_layer import GeoLayer, UserLayer

# Register blueprints
from app.routes.auth import auth_bp
from app.routes.maps import maps_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(maps_bp, url_prefix='/api/maps')

# Function to initialize the database
def initialize_database():
    with app.app_context():
        # Create all tables if they don't exist
        db.create_all()
        
        # Add default data if needed
        from app.models.geo_layer import GeoLayer
        
        # Check if we already have layers
        if GeoLayer.query.count() == 0:
            # Add some default layers
            default_layers = [
                {
                    'name': 'OpenStreetMap',
                    'description': 'Standard OpenStreetMap tile layer',
                    'layer_type': 'XYZ',
                    'url': 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'params': {
                        'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    },
                    'is_public': True
                },
                {
                    'name': 'USGS Topo',
                    'description': 'USGS Topographic Map',
                    'layer_type': 'WMS',
                    'url': 'https://basemap.nationalmap.gov/arcgis/services/USGSTopo/MapServer/WMSServer',
                    'params': {
                        'layers': '0',
                        'format': 'image/png',
                        'transparent': True
                    },
                    'is_public': True
                },
                {
                    'name': 'NASA GIBS ModisTerraTrueColor',
                    'description': 'NASA MODIS Terra True Color imagery',
                    'layer_type': 'WMTS',
                    'url': 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/{Time}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
                    'params': {
                        'format': 'image/jpeg',
                        'time': '2023-01-01',
                        'tileMatrixSet': 'GoogleMapsCompatible_Level9'
                    },
                    'is_public': True
                }
            ]
            
            for layer_data in default_layers:
                layer = GeoLayer(**layer_data)
                db.session.add(layer)
                
            db.session.commit()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to GeoExplorer API"})

if __name__ == '__main__':
    # Initialize the database
    initialize_database()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5001, debug=True)