 Air Quality Prediction System
<p align="center">
  <b>Predict Air Quality Index (AQI) using machine learning</b><br>
  A simple Flask web application that estimates AQI from key air-pollutant values.
</p>📌 About the Project
The Air Quality Prediction System is a machine-learning web application built with Python, Flask, and Scikit-learn. Users enter five pollutant measurements, and the trained Linear Regression model predicts an Air Quality Index (AQI) value.

The application then displays an AQI category based on the thresholds implemented in the project.
✨ Features
- Predicts AQI from five pollutant inputs.
- Uses a trained Linear Regression model.
- Provides an AQI category with a matching display color.
- Simple web interface powered by Flask.
- Loads the saved model from model.pkl.
🧪 Pollutants Used
Input	Description
PM2.5	Fine particulate matter
PM10	Particulate matter
NO2	Nitrogen dioxide
SO2	Sulfur dioxide
CO	Carbon monoxide


🧠 AQI Categories
The application uses the following AQI ranges in its category function:
Predicted AQI	Category
0–50	Good
51–100	Satisfactory
101–200	Moderate
201–300	Poor
301–400	Very Poor
401–500	Severe
Above 500	Hazardous


Negative AQI values are classified as Invalid.
🛠️ Tech Stack
- Python – application and model code
- Flask – web framework
- NumPy – preparing model input
- Pandas – creating the training dataset
- Scikit-learn – Linear Regression model
- Joblib – saving and loading the trained model
- HTML – web page template (templates/index.html)
📁 Project Structure
Air-Quality-Prediction-System/
│
├── app.py                 # Flask application and AQI prediction route
├── train_model.py         # Creates sample data and trains the model
├── model.pkl              # Saved trained Linear Regression model
├── templates/
│   └── index.html         # Web interface
└── README.md              # Project documentation
⚙️ Installation & Setup
1. Clone the repository
https://github.com/iamsudeeprathod-sudo/Air_Quality_Index.git
cd YOUR-REPOSITORY
2. Create and activate a virtual environment (recommended)
Windows:
python -m venv venv
venv\Scripts\activate
macOS / Linux:
python3 -m venv venv
source venv/bin/activate
3. Install the required libraries
pip install flask numpy pandas scikit-learn joblib
4. Train the model (optional)
The repository includes model.pkl. To recreate it using the sample data in train_model.py, run:
python train_model.py
5. Start the Flask application
python app.py
Open the local address shown in your terminal (normally http://127.0.0.1:5000/) in your browser.
🔍 How It Works
1. The user opens the Flask web application.
2. The user enters PM2.5, PM10, NO2, SO2, and CO values.
3. Flask reads the submitted values and prepares them as a NumPy input array.
4. The saved Linear Regression model predicts the AQI.
5. The application rounds the prediction to two decimal places.
6. The AQI category and its associated color are displayed on the web page.
📈 Model Training
The train_model.py script creates a small sample dataset containing five observations, uses the five pollutant columns as input features, and uses AQI as the target. It trains a Scikit-learn LinearRegression model and saves it as model.pkl.
Important: The current training script uses a very small sample dataset for demonstration. Predictions are not validated for real-world accuracy and should not be used for health, safety, or official air-quality decisions. For a reliable model, train and evaluate it with a larger, representative, verified dataset.

🚀 Future Improvements
- Train and evaluate the model using a larger real-world air-quality dataset.
- Add input validation and clearer error messages.
- Display AQI history and visual charts.
- Add location-based air-quality data.
- Compare predictions with verified monitoring-station readings.
👨‍💻 Author
  Sudeep Rathod

If you find this project useful, consider giving the repository a ⭐ on GitHub.
