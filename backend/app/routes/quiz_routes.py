from flask import Blueprint, jsonify, request
from app.quiz.quiz_agent import generate_questions, evaluate_answer

quiz_bp = Blueprint("quiz", __name__, url_prefix="/api/quiz")


@quiz_bp.route("/question", methods=["GET"])
def get_question():
    return jsonify(generate_questions())


@quiz_bp.route("/answer", methods=["POST"])
def check_answer():
    data = request.json

    result = evaluate_answer(
        data.get("question"),
        data.get("context"),
        data.get("answer")
    )

    return jsonify({"feedback": result})