import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import joblib

# Create sample dataset (You can replace with real dataset later)
data = {
    "PM2.5": [50, 80, 120, 200, 300],
    "PM10": [80, 120, 180, 250, 400],
    "NO2": [30, 40, 60, 80, 100],
    "SO2": [10, 20, 30, 40, 50],
    "CO": [0.5, 0.8, 1.2, 1.5, 2.0],
    "AQI": [70, 110, 160, 220, 350]
}

df = pd.DataFrame(data)

X = df[["PM2.5", "PM10", "NO2", "SO2", "CO"]]
y = df["AQI"]

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, "model.pkl")

print("Model trained and saved successfully!")