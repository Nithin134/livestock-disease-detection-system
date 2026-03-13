# Animal Disease Prediction (Dogs + Poultry)

Unified Flask app that hosts two predictors:
- Dog skin disease prediction
- Poultry diseases identifier

## Setup

Create and activate a virtual environment (optional), then install dependencies:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

Open `http://localhost:5000` and pick Dogs or Poultry.

## Structure

- `dogs/` — dog model and uploads
- `poultry/` — poultry model and uploads
- `templates/` — unified templates (`/` home, `dogs/`, `poultry/`)
- `static/dogs/` — styles and scripts for dog UI
