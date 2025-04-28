from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message")
    
    # --- Your chatbot logic here ---
    if user_message:
        bot_response = f"You said: {user_message}"  # Dummy response
    else:
        bot_response = "I didn't catch that."

    return jsonify({"response": bot_response})

if __name__ == "__main__":
    app.run(debug=True)
