from resemblyzer import VoiceEncoder, preprocess_wav
from scipy.spatial.distance import cosine
import tempfile
import librosa
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

encoder = VoiceEncoder()

def save_temp(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        temp.write(file.read())
        return temp.name

def detect_speaker(reference_file, conversation_file):
    logger.info("Starting speaker detection")
    ref_path = save_temp(reference_file)
    conv_path = save_temp(conversation_file)
    ref_wav = preprocess_wav(ref_path)
    ref_embedding = encoder.embed_utterance(ref_wav)
    audio, sr = librosa.load(conv_path, sr=16000)
    segment_length = sr * 3
    matches = []
    for start in range(0, len(audio), segment_length):
        end = start + segment_length
        segment = audio[start:end].astype("float32")
        if len(segment) < sr:
            continue
        emb = encoder.embed_utterance(segment)
        similarity = 1 - cosine(ref_embedding, emb)
        matches.append({
            "start": round(start / sr, 2),
            "end": round(end / sr, 2),
            "similarity": float(similarity)
        })
        logger.info(f"Segment {start/sr:.1f}s-{end/sr:.1f}s similarity: {similarity:.3f}")
    if not matches:
        logger.warning("No matches found")
        return {"detected": False}
    best_match = max(matches, key=lambda x: x["similarity"])
    logger.info(f"Best match: {best_match}")
    return {
        "detected": best_match["similarity"] > 0.70,
        "best_match": best_match,
        "segments": matches
    }