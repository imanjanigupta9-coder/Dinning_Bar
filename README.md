# Bar Dining Website

A simple Flask-based website for a hotel dining and bar experience.

## Project Structure

- `app.py` - Flask application entry point
- `templates/` - Jinja2 templates for page layout and content
- `static/css/styles.css` - custom styling
- `static/js/app.js` - mobile menu and scroll reveal interactions
- `static/images/` - image assets used by the site
- `requirements.txt` - Python dependencies

## Setup

1. Install Python 3.10+.
2. Create and activate a virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```

## Run

Start the Flask app:
```powershell
python app.py
```

Open a browser and visit `http://127.0.0.1:5000`.

## Configuration

- `BOOKING_LINK` is configured in `app.py` and can be provided through the environment with `BOOKING_LINK`.
- Contact details are stored in `CONTACT_INFO` inside `app.py`.

## Notes

- The site is designed to be mobile friendly and uses custom CSS for visual polish.
- The header `Book Now!` button is wired for future backend booking links.
