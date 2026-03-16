from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from app.services.voice_compare import compare_two_voices
from app.services.speaker_search import detect_speaker
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Voice Auth API running"}

@app.post("/compare-voices")
async def compare_voices(voice1: UploadFile = File(...), voice2: UploadFile = File(...)):
    logger.info(f"Compare voices: {voice1.filename}, {voice2.filename}")
    similarity = compare_two_voices(voice1.file, voice2.file)
    logger.info(f"Result: similarity={similarity}, same_person={similarity > 0.75}")
    return {"similarity": similarity, "same_person": similarity > 0.75}

@app.post("/detect-speaker")
async def detect_speaker_api(voice1: UploadFile = File(...), voice2: UploadFile = File(...)):
    logger.info(f"Detect speaker: {voice1.filename}, {voice2.filename}")
    result = detect_speaker(voice1.file, voice2.file)
    logger.info(f"Detection result: {result}")
    return result