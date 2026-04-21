from flask import Blueprint, request, jsonify
from app.ai.triage import process_query

ai_bp = Blueprint("ai", __name__, url_prefix="/api")

@ai_bp.route("/triage", methods=["POST"])
def triage():
    data = request.json
    query = data.get("message")

    result = process_query(query)

    return jsonify(result)