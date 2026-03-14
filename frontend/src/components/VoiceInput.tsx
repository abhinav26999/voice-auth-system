"use client";

import { useRef, useState } from "react";

type Props = {
  label: string;
  onChange: (file: File) => void;
};

export default function VoiceInput({ label, onChange }: Props) {

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

      const file = new File([blob], "recording.webm", {
        type: "audio/webm"
      });

      onChange(file);
    };

    mediaRecorder.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (

    <div className="flex flex-col gap-4">

      <h3 className="text-lg font-semibold">{label}</h3>

      {/* Upload */}

<input
  type="file"
  accept="audio/*"
  onChange={(e) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      alert("Audio must be smaller than 5MB");
      return;
    }

    console.log("Audio size:", (file.size / 1024).toFixed(2), "KB");

    onChange(file);

  }}
  className="bg-gray-800 p-2 rounded"
/>

      <div className="text-center text-gray-400 text-sm">
        OR
      </div>

      {/* Recorder */}

      {!recording ? (

        <button
          onClick={startRecording}
          className="bg-green-500 px-4 py-2 rounded-lg"
        >
          🎙 Record Voice
        </button>

      ) : (

        <button
          onClick={stopRecording}
          className="bg-red-500 px-4 py-2 rounded-lg"
        >
          ⏹ Stop Recording
        </button>

      )}

    </div>
  );
}