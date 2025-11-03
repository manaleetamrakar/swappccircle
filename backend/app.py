from datetime import timedelta
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Item, SwapRequest, init_db

@app.route('/')
def home():
    return {"message": "Backend is running!"}

@app.route('/api/health')
def health():
    return {"status": "ok"}

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///swapcircle_final.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = "swapcircle_secret_key"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)

jwt = JWTManager(app)
init_db(app)


@app.route("/api/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing username or password"}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 409

    hashed_pw = generate_password_hash(password)
    user = User(username=username, password_hash=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get("username")).first()

    if user and check_password_hash(user.password_hash, data.get("password")):
        token = create_access_token(identity=user.id)
        return jsonify({"access_token": token, "message": "Login successful"}), 200
    return jsonify({"message": "Invalid username or password"}), 401


@app.route("/api/items", methods=["POST"])
@jwt_required()
def add_item():
    data = request.get_json()
    user_id = get_jwt_identity()
    title = data.get("title")
    description = data.get("description")
    category = data.get("category")

    if not title or not category:
        return jsonify({"error": "Missing fields"}), 400

    item = Item(owner_id=user_id, title=title, description=description, category=category)
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added successfully"}), 201


@app.route("/api/items", methods=["GET"])
def get_items():
    items = Item.query.all()
    return jsonify([
        {"id": i.id, "title": i.title, "description": i.description, "category": i.category}
        for i in items
    ])


@app.route("/api/swap_request", methods=["POST"])
@jwt_required()
def create_swap_request():
    data = request.get_json()
    item_id = data.get("item_id")
    sender_id = get_jwt_identity()

    item = Item.query.get(item_id)
    if not item:
        return jsonify({"error": "Item not found"}), 404
    if item.owner_id == sender_id:
        return jsonify({"error": "You cannot request your own item"}), 400

    if SwapRequest.query.filter_by(sender_id=sender_id, item_id=item_id).first():
        return jsonify({"error": "Request already sent"}), 400

    req = SwapRequest(sender_id=sender_id, receiver_id=item.owner_id, item_id=item_id)
    db.session.add(req)
    db.session.commit()
    return jsonify({"message": "Swap request sent"}), 201


@app.route("/api/swap_requests", methods=["GET"])
@jwt_required()
def view_requests():
    user_id = get_jwt_identity()
    incoming = SwapRequest.query.filter_by(receiver_id=user_id).all()
    outgoing = SwapRequest.query.filter_by(sender_id=user_id).all()
    return jsonify({
        "incoming": [{"id": r.id, "item_id": r.item_id, "status": r.status} for r in incoming],
        "outgoing": [{"id": r.id, "item_id": r.item_id, "status": r.status} for r in outgoing],
    })


if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
