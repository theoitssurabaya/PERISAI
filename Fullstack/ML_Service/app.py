import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler

# Prevent TF from using GPU if not needed
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

app = Flask(__name__)
CORS(app)

# Re-define Custom Layer and Loss so Keras can load the model
class AdvancedDenseLayer(tf.keras.layers.Layer):
    def __init__(self, units, activation=None, **kwargs):
        super(AdvancedDenseLayer, self).__init__(**kwargs)
        self.units = units
        self.activation = tf.keras.activations.get(activation)

    def build(self, input_shape):
        self.w = self.add_weight(
            shape=(input_shape[-1], self.units),
            initializer="he_normal",
            trainable=True,
            name="kernel"
        )
        self.b = self.add_weight(
            shape=(self.units,), 
            initializer="zeros", 
            trainable=True,
            name="bias"
        )

    def call(self, inputs):
        z = tf.matmul(inputs, self.w) + self.b
        if self.activation is not None:
            return self.activation(z)
        return z

class CustomBCEMAELoss(tf.keras.losses.Loss):
    def __init__(self, name="custom_bce_mae", **kwargs):
        super().__init__(name=name, **kwargs)
        self.bce = tf.keras.losses.BinaryCrossentropy()
        self.mae = tf.keras.losses.MeanAbsoluteError()
        
    def call(self, y_true, y_pred):
        return self.bce(y_true, y_pred) + (10.0 * self.mae(y_true, y_pred))

# Load Model
MODEL_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../perisai_model_production.keras'))

try:
    model = tf.keras.models.load_model(
        MODEL_PATH, 
        custom_objects={
            'AdvancedDenseLayer': AdvancedDenseLayer,
            'CustomBCEMAELoss': CustomBCEMAELoss
        }
    )
    print("Model loaded successfully from:", MODEL_PATH)
except Exception as e:
    print("Error loading model:", e)
    model = None

# Features configuration
FEATURES = ['Age', 'Sex', 'BMI', 'Smoker', 'PhysActivity', 'Fruits', 
            'Veggies', 'HvyAlcoholConsump', 'DiffWalk', 'Stroke', 
            'HeartDiseaseorAttack', 'CholCheck', 'GenHlth', 'SleepHours']

TARGETS = ['Diabetes', 'HighBP', 'HighChol']

try:
    DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../data/ml_dataset_final_clean.csv'))
    df = pd.read_csv(DATA_PATH)
    X_train = df[FEATURES].values.astype('float32')
    scaler = StandardScaler()
    scaler.fit(X_train)
    print("Scaler fitted successfully.")
except Exception as e:
    print("Error loading dataset to fit scaler:", e)
    scaler = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({"error": "Model or Scaler not loaded properly on the server."}), 500
        
    data = request.json
    
    # Extract features in exact order
    try:
        input_data = [float(data.get(f, 0)) for f in FEATURES]
    except Exception as e:
        return jsonify({"error": f"Invalid input format: {str(e)}"}), 400
        
    raw_input_array = np.array([input_data], dtype='float32')
    
    # Scale input
    scaled_input = scaler.transform(raw_input_array)
    
    # Predict
    predictions = model.predict(scaled_input, verbose=0)[0]
    
    # Format output
    result = {}
    for name, prob in zip(TARGETS, predictions):
        result[name] = float(prob)
        
    return jsonify({
        "success": True,
        "predictions": result
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
