from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.geo_layer import GeoLayer, UserLayer

maps_bp = Blueprint('maps', __name__)

@maps_bp.route('/layers', methods=['GET'])
def get_layers():
    # Get all public geo layers
    layers = GeoLayer.query.filter_by(is_public=True).all()
    
    result = []
    for layer in layers:
        result.append({
            'id': layer.id,
            'name': layer.name,
            'description': layer.description,
            'layer_type': layer.layer_type,
            'url': layer.url,
            'params': layer.params
        })
    
    return jsonify(result), 200

@maps_bp.route('/layers/<int:layer_id>', methods=['GET'])
def get_layer(layer_id):
    layer = GeoLayer.query.get_or_404(layer_id)
    
    if not layer.is_public:
        return jsonify({'message': 'Layer not found'}), 404
    
    return jsonify({
        'id': layer.id,
        'name': layer.name,
        'description': layer.description,
        'layer_type': layer.layer_type,
        'url': layer.url,
        'params': layer.params
    }), 200

@maps_bp.route('/user/layers', methods=['GET'])
@jwt_required()
def get_user_layers():
    current_user_id = get_jwt_identity()
    
    user_layers = UserLayer.query.filter_by(user_id=current_user_id).all()
    
    result = []
    for ul in user_layers:
        layer_data = {
            'id': ul.id,
            'name': ul.name or ul.geo_layer.name,
            'is_favorite': ul.is_favorite,
            'geo_layer': {
                'id': ul.geo_layer.id,
                'name': ul.geo_layer.name,
                'layer_type': ul.geo_layer.layer_type,
                'url': ul.geo_layer.url,
                'params': ul.geo_layer.params
            }
        }
        
        if ul.feature_collection:
            layer_data['feature_collection'] = ul.feature_collection
            
        result.append(layer_data)
    
    return jsonify(result), 200

@maps_bp.route('/user/layers', methods=['POST'])
@jwt_required()
def add_user_layer():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Check if geo layer exists
    geo_layer = GeoLayer.query.get(data.get('geo_layer_id'))
    if not geo_layer:
        return jsonify({'message': 'Geo layer not found'}), 404
    
    # Create user layer
    user_layer = UserLayer(
        user_id=current_user_id,
        geo_layer_id=geo_layer.id,
        name=data.get('name'),
        is_favorite=data.get('is_favorite', False),
        feature_collection=data.get('feature_collection')
    )
    
    db.session.add(user_layer)
    db.session.commit()
    
    return jsonify({'message': 'Layer added successfully', 'id': user_layer.id}), 201

@maps_bp.route('/user/layers/<int:layer_id>', methods=['PUT'])
@jwt_required()
def update_user_layer(layer_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Find user layer
    user_layer = UserLayer.query.filter_by(id=layer_id, user_id=current_user_id).first()
    if not user_layer:
        return jsonify({'message': 'Layer not found'}), 404
    
    # Update fields
    if 'name' in data:
        user_layer.name = data['name']
    if 'is_favorite' in data:
        user_layer.is_favorite = data['is_favorite']
    if 'feature_collection' in data:
        user_layer.feature_collection = data['feature_collection']
    
    db.session.commit()
    
    return jsonify({'message': 'Layer updated successfully'}), 200

@maps_bp.route('/user/layers/<int:layer_id>', methods=['DELETE'])
@jwt_required()
def delete_user_layer(layer_id):
    current_user_id = get_jwt_identity()
    
    # Find and delete user layer
    user_layer = UserLayer.query.filter_by(id=layer_id, user_id=current_user_id).first()
    if not user_layer:
        return jsonify({'message': 'Layer not found'}), 404
    
    db.session.delete(user_layer)
    db.session.commit()
    
    return jsonify({'message': 'Layer deleted successfully'}), 200