from flask import Flask, request, jsonify, render_template, redirect, url_for
import os, json

app = Flask(__name__, static_folder='static', static_url_path='/static')

BOOKING_LINK = os.getenv('BOOKING_LINK', '')
CONTACT_INFO = {
    'email': 'info@avyuktview.com',
    'phone': '+91 12345 67890',
    'address': '123 AVYUKT VIEW Road, City, Country'
}

@app.route('/')
def index():
    return render_template(
        'index.html',
        booking_link=BOOKING_LINK,
        contact=CONTACT_INFO,
        subscribe_success=request.args.get('subscribe_success', '')
    )

@app.route('/contact', methods=['POST'])
def contact():
    # Accept form-data or JSON
    data = {}
    if request.form:
        data = request.form.to_dict()
    else:
        try:
            data = request.get_json() or {}
        except Exception:
            data = {}

    # sanitize minimal
    entry = {
        'name': data.get('name'),
        'email': data.get('email'),
        'phone': data.get('phone'),
        'message': data.get('message'),
        'ip': request.remote_addr
    }

    messages_file = 'messages.json'
    msgs = []
    if os.path.exists(messages_file):
        try:
            with open(messages_file, 'r', encoding='utf-8') as f:
                msgs = json.load(f)
        except Exception:
            msgs = []

    msgs.append(entry)
    with open(messages_file, 'w', encoding='utf-8') as f:
        json.dump(msgs, f, indent=2)

    return jsonify({'status':'ok','message':'received'})


@app.route('/newsletter', methods=['POST'])
def newsletter():
    data = {}
    if request.form:
        data = request.form.to_dict()
    else:
        try:
            data = request.get_json() or {}
        except Exception:
            data = {}

    entry = { 'email': data.get('email'), 'ip': request.remote_addr }
    news_file = 'newsletters.json'
    news = []
    if os.path.exists(news_file):
        try:
            with open(news_file, 'r', encoding='utf-8') as f:
                news = json.load(f)
        except Exception:
            news = []
    news.append(entry)
    with open(news_file, 'w', encoding='utf-8') as f:
        json.dump(news, f, indent=2)
    return jsonify({'status':'ok'})

@app.route('/subscribe', methods=['POST'])
def subscribe():
    data = request.form.to_dict()
    email = data.get('email', '').strip()
    news_file = 'newsletters.json'
    news = []
    if email and '@' in email:
        if os.path.exists(news_file):
            try:
                with open(news_file, 'r', encoding='utf-8') as f:
                    news = json.load(f)
            except Exception:
                news = []
        news.append({ 'email': email, 'name': data.get('name'), 'ip': request.remote_addr })
        with open(news_file, 'w', encoding='utf-8') as f:
            json.dump(news, f, indent=2)
        return redirect(url_for('index', subscribe_success='1'))
    return redirect(url_for('index', subscribe_success='0'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
