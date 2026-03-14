"use client";

import { useState, useRef } from "react";

type Props = {
  label: string;
  onRecordingComplete: (blob: Blob) => void;
};

export default function VoiceRecorder({ label, onRecordingComplete }: Props) {

  const [recording, setRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      onRecordingComplete(blob);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (

    <div className="flex flex-col items-center gap-3">

      <h3 className="text-lg">{label}</h3>

      <div className="text-5xl animate-pulse">🎙</div>

      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-green-500 px-5 py-2 rounded-lg"
        >
          Start
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-red-500 px-5 py-2 rounded-lg"
        >
          Stop
        </button>
      )}

    </div>
  );
}