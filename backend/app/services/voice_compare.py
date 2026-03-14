from resemblyzer import VoiceEncoder, preprocess_wav
from scipy.spatial.distance import cosine
import tempfile

encoder = VoiceEncoder()

def save_temp(file):
    with tempfile.NamedTemporaryFile(delete=False) as temp:
        temp.write(file.read())
        return temp.name


def compare_two_voices(file1, file2):

    path1 = save_temp(file1)
    path2 = save_temp(file2)

    wav1 = preprocess_wav(path1)
    wav2 = preprocess_wav(path2)

    emb1 = encoder.embed_utterance(wav1)
    emb2 = encoder.embed_utterance(wav2)

    similarity = 1 - cosine(emb1, emb2)

    return float(similarity)