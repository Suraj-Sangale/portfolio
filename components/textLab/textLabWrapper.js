import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";

const marathiFonts = [
  { label: "Baloo 2", value: "Baloo 2, cursive" },
  { label: "Modak", value: "Modak, cursive" },
  { label: "Akaya Telivigala", value: "Akaya Telivigala, cursive" },
];

export default function TextLabWrapper() {
  const [quote, setQuote] = useState("डोळ्यात तुझ्या शब्द शोधत राहिलो...");
  const [font, setFont] = useState(marathiFonts[0].value);
  const imageRef = useRef();

  const downloadImage = async () => {
    const canvas = await html2canvas(imageRef.current);
    const link = document.createElement("a");
    link.download = "marathi-quote.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold">Marathi Quote Generator</h2>

      <textarea
        className="w-full h-24 border p-3 rounded resize-none"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        placeholder="Type your Marathi quote here..."
      />

      <select
        className="p-2 border rounded"
        value={font}
        onChange={(e) => setFont(e.target.value)}
      >
        {marathiFonts.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <div
        ref={imageRef}
        className="w-full h-64 bg-gray-900 text-white flex items-center justify-center rounded shadow-lg"
        style={{ fontFamily: font }}
      >
        <p className="text-2xl text-center px-4">{quote}</p>
      </div>

      <button
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        onClick={downloadImage}
      >
        Download Image
      </button>
    </div>
  );
}
