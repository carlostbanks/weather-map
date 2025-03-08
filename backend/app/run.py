from app import create_app, db
from flask_migrate import upgrade

app = create_app()

@app.before_first_request
def initialize_database():
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
                }
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
                }
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
                }
            }
        ]
        
        for layer_data in default_layers:
            layer = GeoLayer(**layer_data)
            db.session.add(layer)
            
        db.session.commit()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)