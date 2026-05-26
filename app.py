from datetime import date, datetime
import os

from flask import Flask, flash, redirect, render_template, request, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='static', static_url_path='/static')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'change-me')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///restaurant.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

CONTACT_INFO = {
    'email': 'info@avyuktview.com',
    'phone': '+91 12345 67890',
    'address': '123 AVYUKT VIEW Road, City, Country'
}


class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140), nullable=False)
    description = db.Column(db.String(400), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Numeric(8, 2), nullable=False)


class RestaurantTable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.String(20), nullable=False, unique=True)
    zone = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    reservations = db.relationship('Reservation', backref='table', lazy=True)


class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(140), nullable=False)
    email = db.Column(db.String(140), nullable=False)
    phone = db.Column(db.String(40), nullable=False)
    guest_count = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('restaurant_table.id'), nullable=False)


def seed_data():
    if not Menu.query.first():
        default_menu = [
            Menu(name='Spiced Lamb Chops', description='Charred lamb chops with herb jus, seasonal greens and roasted garlic.', category='Food', size='Full Portion', price=28.50),
            Menu(name='Crispy Calamari', description='Lightly battered calamari with lemon aioli and chili salt.', category='Food', size='Starter', price=12.00),
            Menu(name='Smoked Old Fashioned', description='Bourbon, house-smoked bitters, orange zest, served over a large cube.', category='Cocktail', size='Single', price=15.50),
            Menu(name='Rooftop Spritz', description='Prosecco, aperol, soda and roasted grapefruit.', category='Cocktail', size='Single', price=13.00),
            Menu(name='Craft IPA', description='Local craft India Pale Ale with citrus and pine notes.', category='Beer', size='Pint', price=7.25),
        ]
        db.session.add_all(default_menu)

    if not RestaurantTable.query.first():
        default_tables = [
            RestaurantTable(table_number='R1', zone='Rooftop', capacity=4),
            RestaurantTable(table_number='R2', zone='Rooftop', capacity=6),
            RestaurantTable(table_number='B1', zone='Bar Counter', capacity=2),
            RestaurantTable(table_number='B2', zone='Bar Counter', capacity=4),
            RestaurantTable(table_number='C1', zone='Booths', capacity=6),
        ]
        db.session.add_all(default_tables)

    db.session.commit()


def initialize_database():
    db.create_all()
    seed_data()


with app.app_context():
    initialize_database()


@app.route('/')
def index():
    menus = Menu.query.order_by(Menu.category, Menu.name).all()
    tables = RestaurantTable.query.order_by(RestaurantTable.zone, RestaurantTable.table_number).all()

    now = datetime.now()
    today = now.date()
    current_slot = now.time().replace(minute=0, second=0, microsecond=0)
    reserved = {
        reservation.table_id
        for reservation in Reservation.query.filter(Reservation.date == today, Reservation.time == current_slot).all()
    }

    for table in tables:
        table.is_reserved = table.id in reserved

    menu_by_category = {'Food': [], 'Cocktail': [], 'Beer': []}
    for item in menus:
        menu_by_category.setdefault(item.category, []).append(item)

    available_count = sum(1 for table in tables if not table.is_reserved)
    reserved_count = len(tables) - available_count

    return render_template(
        'index.html',
        menu_by_category=menu_by_category,
        tables=tables,
        available_count=available_count,
        reserved_count=reserved_count,
        contact=CONTACT_INFO,
        current_date=today.isoformat(),
    )


@app.route('/book', methods=['POST'])
def book():
    customer_name = request.form.get('customer_name', '').strip()
    email = request.form.get('email', '').strip()
    phone = request.form.get('phone', '').strip()
    guest_count = request.form.get('guest_count', '').strip()
    zone = request.form.get('zone', '').strip()
    date_str = request.form.get('date', '').strip()
    time_str = request.form.get('time', '').strip()

    if not all([customer_name, email, phone, guest_count, zone, date_str, time_str]):
        flash('Please complete every field in the reservation form.', 'danger')
        return redirect(url_for('index'))

    try:
        guest_count = int(guest_count)
        reservation_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        reservation_time = datetime.strptime(time_str, '%H:%M').time()
    except ValueError:
        flash('Please provide valid guest count, date, and time.', 'danger')
        return redirect(url_for('index'))

    if reservation_date < date.today():
        flash('Please choose today or a future date for your reservation.', 'danger')
        return redirect(url_for('index'))

    candidate_tables = (
        RestaurantTable.query
        .filter(RestaurantTable.zone == zone, RestaurantTable.capacity >= guest_count)
        .order_by(RestaurantTable.capacity)
        .all()
    )

    selected_table = None
    for table in candidate_tables:
        occupied = Reservation.query.filter_by(table_id=table.id, date=reservation_date, time=reservation_time).first()
        if not occupied:
            selected_table = table
            break

    if not selected_table:
        flash('No available table matches that party size and zone at the requested time. Please try a different time, zone, or guest count.', 'danger')
        return redirect(url_for('index'))

    new_reservation = Reservation(
        customer_name=customer_name,
        email=email,
        phone=phone,
        guest_count=guest_count,
        date=reservation_date,
        time=reservation_time,
        table_id=selected_table.id,
    )
    db.session.add(new_reservation)
    db.session.commit()

    flash(
        f'Reservation confirmed for {customer_name} on {reservation_date.strftime("%b %d")} at {reservation_time.strftime("%H:%M")}. Table {selected_table.table_number} in {selected_table.zone}.',
        'success',
    )
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
