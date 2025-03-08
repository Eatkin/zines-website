import api
from api import fetch_zines, fetch_zine_data
from common import ZINES_FOLDER, app
from utils import inject_emojis

# Setup routes
@app.route('/')
@inject_emojis
def index():
    zines = fetch_zines()
    return "index.html", {'zines': zines}

@app.route('/viewer/<zine_id>')
@inject_emojis
def viewer(zine_id):
    zine_info = fetch_zine_data(zine_id)
    return "viewer.html", zine_info
