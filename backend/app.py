# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from ne import QuizAI 

app = Flask(__name__)
CORS(app)

quiz_ai = QuizAI()

@app.route("/generate", methods=["POST"])
def generate_questions():
    data = request.get_json()
    print(data)
    topic = data.get("topic", "General")
    
    try:
        questions = quiz_ai.generate_questions(topic)
        print(questions)
        return jsonify({"questions": questions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/evaluate", methods=["POST"])
def evaluate_answers():
    data = request.get_json()
    topic = data.get("topic", "General")
    questions = data.get("questions", "")
    answers = data.get("answers", "")

    try:
        evaluation = quiz_ai.evaluate_answers(topic, questions, answers)
        return jsonify({"evaluation": evaluation})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
