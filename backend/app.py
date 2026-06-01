from flask import Flask, jsonify
from flask_cors import CORS
import flask
app = Flask(__name__)
CORS(app)  # Allow all origins

@app.route('/loginme', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], provide_automatic_options=False)
def loginme():
    if flask.request.method == 'OPTIONS':
        return jsonify({"status": 200}), 200
    if flask.request.method == 'POST':
        data = flask.request.get_json()
        username = data.get('username')
        password = data.get('password')
        # Check if username and password are the same
        if username == password:
            print("abc")
            return jsonify({"status": 200, "message": "Login successful"}), 200
        else:
            print("abc")
            return jsonify({"status": 401, "message": "Login failed"}), 401
    print("abc")
    return jsonify({"status": 200}), 200

@app.route('/get_tel_data', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], provide_automatic_options=False)
def get_tel_data():
    if flask.request.method == 'OPTIONS':
        return jsonify({"status": 200}), 200
    print("abc")
    return jsonify({"status": 200}), 200

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=4000)
