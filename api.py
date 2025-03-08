import os
from firebase_admin import firestore, initialize_app
from google.cloud import storage
from flask import jsonify
from common import app

STORAGE_CLIENT = storage.Client()
BUCKET = 'zines-bucket'

FIRESTORE_CLIENT = firestore.Client()

def fetch_zines():
    zines = []
    try:
        doc_stream = FIRESTORE_CLIENT.collection('zines').stream()
        for zine in doc_stream:
            zine_data = zine.to_dict()
            zines.append(zine_data)
        return zines
    except Exception as e:
        raise Exception(f"Error fetching zines: {str(e)}")

@app.route('/api/zines')
def list_zines():
    """Return a list of zines from Firestore including metadata etc"""
    try:
        zines = fetch_zines()
        return jsonify({'zines': zines}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def fetch_zine_data(zine_id):
    try:
        doc_ref = FIRESTORE_CLIENT.collection('zines').document(zine_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            raise Exception("Zine not found")
    except Exception as e:
        raise Exception(f"Error retrieving zine: {str(e)}")

@app.route('/api/zines/<zine_id>')
def zine_pages(zine_id):
    """Return a list of pages for a zine from Cloud Storage and the zine title"""
    try:
        zine_data = fetch_zine_data(zine_id)
        return jsonify(zine_data), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Setup image retrieval
@app.route('/api/image/<path:image_path>')
def image(image_path):
    """Return an image from Cloud Storage"""
    bucket = STORAGE_CLIENT.get_bucket(BUCKET)
    blob = bucket.blob(image_path)
    if not blob.exists():
        return jsonify({'error': 'Image not found'}), 404
    # Infer content type from the file extension
    ext = os.path.splitext
    content_type = {'jpg': 'image/jpeg', 'png': 'image/png', 'webp': 'image/webp'}.get(ext, 'image/jpeg')
    return blob.download_as_string(), 200, {'Content-Type': content_type}
