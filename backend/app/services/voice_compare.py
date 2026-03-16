from resemblyzer import VoiceEncoder, preprocess_wav
from scipy.spatial.distance import cosine
import tempfile
import logging

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

encoder = VoiceEncoder()

def save_temp(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
        temp.write(file.read())
        return temp.name

def compare_two_voices(file1, file2):
    logger.info("Starting voice comparison")
    path1 = save_temp(file1)
    path2 = save_temp(file2)
    wav1 = preprocess_wav(path1)
    wav2 = preprocess_wav(path2)
    emb1 = encoder.embed_utterance(wav1)
    emb2 = encoder.embed_utterance(wav2)
    similarity = 1 - cosine(emb1, emb2)
    logger.info(f"Similarity score: {similarity}")
    return float(similarity)