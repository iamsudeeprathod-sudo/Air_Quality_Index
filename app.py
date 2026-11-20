from flask import Flask, render_template, request
import numpy as np
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load("model.pkl")


# AQI Category Function (India CPCB Standard)
def get_aqi_category(aqi):

    if aqi < 0:
        return "Invalid", "gray"

    elif aqi <= 50:
        return "Good", "green"

    elif aqi <= 100:
        return "Satisfactory", "lightgreen"

    elif aqi <= 200:
        return "Moderate", "yellow"

    elif aqi <= 300:
        return "Poor", "orange"

    elif aqi <= 400:
        return "Very Poor", "red"

    elif aqi <= 500:
        return "Severe", "maroon"

    else:
        return "Hazardous", "black"


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():

    # Get form values safely
    pm25 = float(request.form['pm25'])
    pm10 = float(request.form['pm10'])
    no2 = float(request.form['no2'])
    so2 = float(request.form['so2'])
    co = float(request.form['co'])

    # Prepare features
    features = np.array([[pm25, pm10, no2, so2, co]])

    # Predict AQI
    prediction = model.predict(features)[0]
    aqi = float(round(prediction, 2))

    # Get category and color
    category, color = get_aqi_category(aqi)

    return render_template(
        'index.html',
        prediction_text=f"Predicted AQI: {aqi}",
        category=category,
        color=color
    )


if __name__ == "__main__":
    app.run(debug=True)