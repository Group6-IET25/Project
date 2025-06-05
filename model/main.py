from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import shutil, os

from detection.model_loader import AccidentDetectionModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # List of allowed origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)
# Load model (adjust paths if necessary)
model = AccidentDetectionModel("model/model.json", "model/model.keras")

def preprocess_image(image: Image.Image) -> np.ndarray:
    # image = image.resize((250, 250))  # Match training size
    image = image.resize((224, 224))  # Match training size
    image_array = np.array(image) / 255.0
    image_array = image_array.reshape(1, 224, 224, 3)
    return image_array

@app.post("/api/model/predict")
async def predict(file: UploadFile = File(...)):
    temp_file = f"temp_{file.filename}"
    try:
        with open(temp_file, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image = Image.open(temp_file).convert("RGB")
        image_array = preprocess_image(image)
        prob = model.predict(image_array)
        return JSONResponse(status_code=200, content={"accident": prob > 0.50, "confidence": round(prob * 100, 2)})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

