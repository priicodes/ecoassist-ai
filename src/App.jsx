import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

export default function App() {
  const webcamRef = useRef(null);

  const [model, setModel] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [result, setResult] = useState("Loading AI Model...");

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    const loadedModel = await cocoSsd.load();
    setModel(loadedModel);

    setResult(`
AI Model Ready

Click Start Camera and point an object towards the camera.
`);
  };

  const speak = (text) => {
    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
  };

  const getWasteInfo = (objectName) => {
    objectName = objectName.toLowerCase();

    const livingThings = [
      "person",
      "bird",
      "cat",
      "dog",
      "horse",
      "sheep",
      "cow",
      "elephant",
      "bear",
      "zebra",
      "giraffe",
    ];

    const plasticWaste = [
      "bottle",
      "cup",
    ];

    const paperWaste = [
      "book",
    ];

    const organicWaste = [
      "banana",
      "apple",
      "orange",
      "broccoli",
      "carrot",
      "sandwich",
      "pizza",
      "hot dog",
      "donut",
      "cake",
    ];

    const eWaste = [
      "tv",
      "laptop",
      "mouse",
      "remote",
      "keyboard",
      "cell phone",
    ];

    const metalWaste = [
      "knife",
      "fork",
      "spoon",
    ];

    const glassWaste = [
      "wine glass",
    ];

    const reusableItems = [
      "backpack",
      "handbag",
      "suitcase",
      "umbrella",
    ];

    const householdItems = [
      "chair",
      "couch",
      "bed",
      "dining table",
      "bench",
      "clock",
      "vase",
      "potted plant",
      "toilet",
    ];

    const vehicles = [
      "bicycle",
      "car",
      "motorcycle",
      "bus",
      "truck",
      "train",
      "boat",
      "airplane",
    ];

    const sportsItems = [
      "frisbee",
      "kite",
      "sports ball",
      "baseball bat",
      "baseball glove",
      "skateboard",
      "surfboard",
      "tennis racket",
      "skis",
      "snowboard",
    ];

    if (livingThings.includes(objectName)) {
      return {
        type: "Not Waste",
        bin: "None",
        instruction:
          "This is a living being and not a waste item.",
      };
    }

    if (plasticWaste.includes(objectName)) {
      return {
        type: "Plastic Waste",
        bin: "Blue Recycling Bin",
        instruction:
          "Dispose in the plastic recycling bin.",
      };
    }

    if (paperWaste.includes(objectName)) {
      return {
        type: "Paper Waste",
        bin: "Green Paper Bin",
        instruction:
          "Dispose in the paper recycling bin.",
      };
    }

    if (organicWaste.includes(objectName)) {
      return {
        type: "Organic Waste",
        bin: "Brown Compost Bin",
        instruction:
          "Dispose in the compost bin.",
      };
    }

    if (eWaste.includes(objectName)) {
      return {
        type: "Electronic Waste",
        bin: "E-Waste Collection Bin",
        instruction:
          "Take to an authorized e-waste collection center.",
      };
    }

    if (metalWaste.includes(objectName)) {
      return {
        type: "Metal Waste",
        bin: "Yellow Metal Bin",
        instruction:
          "Dispose in the metal recycling bin.",
      };
    }

    if (glassWaste.includes(objectName)) {
      return {
        type: "Glass Waste",
        bin: "White Glass Bin",
        instruction:
          "Dispose in the glass recycling bin.",
      };
    }

    if (reusableItems.includes(objectName)) {
      return {
        type: "Reusable Item",
        bin: "Reuse / Donation",
        instruction:
          "Consider reusing or donating this item.",
      };
    }

    if (
      householdItems.includes(objectName) ||
      vehicles.includes(objectName) ||
      sportsItems.includes(objectName)
    ) {
      return {
        type: "Not Waste",
        bin: "None",
        instruction:
          "This object is not classified as waste.",
      };
    }

    return {
      type: "Unknown Object",
      bin: "Manual Verification",
      instruction:
        "Object detected but category is uncertain.",
    };
  };

  const scanWaste = async () => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      model
    ) {
      const predictions = await model.detect(
        webcamRef.current.video
      );

      if (predictions.length > 0) {
        const detected = predictions[0].class.toLowerCase();

        const waste = getWasteInfo(detected);

        const message = `
Waste Type: ${waste.type}

Recommended Bin: ${waste.bin}

Detected Object: ${detected}

Instruction: ${waste.instruction}
`;

        setResult(message);

        speak(message);
      } else {
        const message = `
No object detected.

Please place an item in front of the camera.
`;

        setResult(message);

        speak("No object detected.");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a,#134e4a,#22c55e)",
        color: "white",
        padding: "40px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "25px",
          padding: "40px",
          backdropFilter: "blur(15px)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "3rem",
          }}
        >
          🌱 EcoAssist AI
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "1.2rem",
            marginBottom: "30px",
          }}
        >
          Smart Waste Disposal Assistant for Visually Impaired People
        </p>

        {!cameraOn ? (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => setCameraOn(true)}
              style={{
                background: "#22c55e",
                color: "white",
                border: "none",
                padding: "15px 30px",
                borderRadius: "12px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Start Camera
            </button>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={550}
              style={{
                borderRadius: "20px",
              }}
            />

            <br />

            <button
              onClick={scanWaste}
              style={{
                marginTop: "20px",
                background: "#22c55e",
                color: "white",
                border: "none",
                padding: "15px 30px",
                borderRadius: "12px",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              Scan Waste
            </button>
          </div>
        )}

        <div
          style={{
            marginTop: "30px",
            background: "rgba(255,255,255,0.1)",
            padding: "20px",
            borderRadius: "15px",
            whiteSpace: "pre-line",
          }}
        >
          <h2>AI Analysis</h2>
          <p>{result}</p>
        </div>
      </div>
    </div>
  );
}