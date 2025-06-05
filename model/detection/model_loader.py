from keras.models import model_from_json
import numpy as np

class AccidentDetectionModel:
    def __init__(self, json_path: str, weights_path: str):
        with open(json_path, 'r') as f:
            model_json = f.read()
        self.model = model_from_json(model_json)
        self.model.load_weights(weights_path)
        self.model.make_predict_function()

    def predict(self, image_array: np.ndarray) -> float:
        prediction = self.model.predict(image_array)
        return float(prediction[0][0])
