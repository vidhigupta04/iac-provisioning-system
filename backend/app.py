import os
import sys

# 1. Path fix hamesha sabse upar hona chahiye
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 2. Ab baaki modules import karein
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import mysql.connector

# 3. Ab local blueprints (Path fix hone ke baad)
from app.routes.ai_routes import ai_bp
from app.routes.quiz_routes import quiz_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ... baaki code same rahega ...


app.register_blueprint(ai_bp)
app.register_blueprint(quiz_bp)

db_config = {
    'host': os.getenv('DB_HOST' , 'iac-db'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD' , 'vidhi'), 
    'database': 'agriculture_db'
}
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # Standard credentials check
    if data.get('email') == "admin@farm.com" and data.get('password') == "admin123":
        return jsonify({
            "success": True,
            "token": "dummy-token",
            "redirect": "/dashboard" 
        }), 200

    return jsonify({
        "success": False,
        "message": "Invalid credentials"
    }), 401


@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({"farmers": 124, "active_crops": 8})

@app.route('/api/crops', methods=['GET', 'POST'])
def manage_crops():
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        if request.method == 'POST':
            data = request.json
            cursor.execute("INSERT INTO crops (name, fertilizer, quantity, area) VALUES (%s, %s, %s, %s)",
                           (data['name'], data['fertilizer'], data['quantity'], data['area']))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"status": "success"}), 201

        # This part only runs for GET requests
        cursor.execute("SELECT name, fertilizer, quantity, area FROM crops ORDER BY id DESC")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)

    except mysql.connector.Error as err:
        print(f"Error: {err}") # This will show the exact error in your terminal
        return jsonify({"error": str(err)}), 500

@app.route('/api/triage', methods=['POST'])
def triage():
    data = request.json
    query = data.get("message")

    result = process_query(query)

    # ✅ SAVE TO DB
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO chat_history (user_query, ai_response) VALUES (%s, %s)",
            (query, result.get("response"))
        )

        conn.commit()
        cursor.close()
        conn.close()

    except Exception as e:
        print("DB ERROR:", e)

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

print(app.url_map)