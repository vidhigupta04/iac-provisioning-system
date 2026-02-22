import os
from dotenv import load_dotenv
from flask import Flask
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector


load_dotenv()

app = Flask(__name__)
CORS(app)

db_config = {
    'host': os.getenv('DB_HOST' , 'iac-db'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD' , 'vidhi'), 
    'database': 'agriculture_db'
}

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if data.get('email') == "admin@farm.com" and data.get('password') == "admin123":
        return jsonify({"success": True}), 200
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)