import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
import numpy as np
import shutil
import os

app = FastAPI()

# Load the saved TensorFlow model
model = tf.keras.models.load_model("model/your_model.h5")  # Replace with your actual model path

def predict_accident(image: Image.Image) -> bool:
    # Preprocess the image as your model expects (resize, normalize, etc.)
    image = image.resize((224, 224))  # Example size, replace with your model's input size
    image_array = np.array(image) / 255.0  # Normalize if needed
    image_array = image_array.reshape(1, 224, 224, 3)  # Add batch dimension
    
    # Make prediction
    prediction = model.predict(image_array)
    
    # Assuming binary classification (accident = 1, no accident = 0)
    return prediction[0][0] > 0.5

@app.post("/api/model/predict")
async def predict(file: UploadFile = File(...)):
    temp_file_path = f"temp_{file.filename}"
    
    try:
        # Save uploaded file temporarily
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Open image using PIL
        image = Image.open(temp_file_path)

        # Run prediction
        accident = predict_accident(image)
        return JSONResponse(status_code=200, content={"accident": accident})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    
    finally:
        # Clean up temporary file
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
