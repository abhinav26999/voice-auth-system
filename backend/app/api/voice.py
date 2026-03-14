from fastapi import APIRouter, UploadFile, File
from app.services.voice_compare import compare_two_voices

router = APIRouter()


@router.post("/compare-voices")
async def compare_voices(
    voice1: UploadFile = File(...),
    voice2: UploadFile = File(...)
):

    similarity = compare_two_voices(voice1.file, voice2.file)

    return {
        "similarity": similarity,
        "same_person": similarity > 0.75
    }