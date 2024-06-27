from flask import Flask, request, jsonify
from flask_cors import CORS
from agent_1 import start_conversation

app = Flask(__name__)
CORS(app)
chat_history = {}
@app.post('/')
def chat():
    try:
        request_data = request.get_json(force=True)
        user_ip = request.remote_addr
        if user_ip not in chat_history:
            chat_history[user_ip] = []
        chat_history[user_ip].append({"role": "user", "content": request_data["question"]})
        try:
            response = start_conversation(request_data["question"],chat_history[user_ip])
            chat_history[user_ip].append({"role": "assistant", "content": response})
            return jsonify({"response": response}), 200
        except:
            return jsonify({"response": "Cơ sở dữ liệu của chúng tôi không có câu trả lời cho câu hỏi của bạn"}), 200
    except Exception as e:
        print(e)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
