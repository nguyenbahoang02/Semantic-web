from flask import Flask, request, jsonify
from chatbot import start_conversation

app = Flask(__name__)


@app.post('/')
def chat():
    request_data = request.get_json(force=True)
    response = start_conversation(request_data["question"])
    return jsonify({"response": response}), 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
