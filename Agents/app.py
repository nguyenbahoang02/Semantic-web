from flask import Flask, request, jsonify
from flask_cors import CORS
from agent_1 import start_conversation

app = Flask(__name__)
CORS(app)

@app.post('/')
def chat():
    try:
        request_data = request.get_json(force=True)
        response = start_conversation(request_data["question"])
        return jsonify({"response": response}), 200
    except Exception as e:
        print(e)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
