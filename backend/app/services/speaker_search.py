from resemblyzer import VoiceEncoder, preprocess_wav
from scipy.spatial.distance import cosine
import tempfile
import librosa

encoder = VoiceEncoder()

def save_temp(file):
    with tempfile.NamedTemporaryFile(delete=False) as temp:
        temp.write(file.read())
        return temp.name


def detect_speaker(reference_file, conversation_file):

    ref_path = save_temp(reference_file)
    conv_path = save_temp(conversation_file)

    ref_wav = preprocess_wav(ref_path)
    ref_embedding = encoder.embed_utterance(ref_wav)

    audio, sr = librosa.load(conv_path, sr=16000)

    segment_length = sr * 3   # 3-second windows
    matches = []

    for start in range(0, len(audio), segment_length):

        end = start + segment_length
        segment = audio[start:end]

        if len(segment) < sr:
            continue

        emb = encoder.embed_utterance(segment)

        similarity = 1 - cosine(ref_embedding, emb)

        matches.append({
            "start": start / sr,
            "end": end / sr,
            "similarity": float(similarity)
        })

    if not matches:
        return {"detected": False}

    best_match = max(matches, key=lambda x: x["similarity"])

    return {
        "detected": best_match["similarity"] > 0.70,
        "best_match": best_match,
        "segments": matches
    }