from datetime import datetime
from geoalchemy2 import Geometry
from app import db

class GeoLayer(db.Model):
    __tablename__ = 'geo_layers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    description = db.Column(db.Text)
    layer_type = db.Column(db.String(16), nullable=False)  # WMS, WMTS, XYZ
    url = db.Column(db.String(256), nullable=False)
    params = db.Column(db.JSON)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user_layers = db.relationship('UserLayer', back_populates='geo_layer', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<GeoLayer {self.name}>'

class UserLayer(db.Model):
    __tablename__ = 'user_layers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    geo_layer_id = db.Column(db.Integer, db.ForeignKey('geo_layers.id'), nullable=False)
    name = db.Column(db.String(64))
    is_favorite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # For user-created features
    feature_collection = db.Column(db.JSON)
    
    # Relationships
    user = db.relationship('User', back_populates='layers')
    geo_layer = db.relationship('GeoLayer', back_populates='user_layers')
    
    def __repr__(self):
        return f'<UserLayer {self.name}>'