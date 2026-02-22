import Image from "next/image";

export default function ImageCarousel({ images = [] }) {
  return (
    <div
      className="my-12"
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        background: "transparent",
        padding: "40px 0",
        marginBlock: "5rem",
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 500,
          background:
            "linear-gradient(to right, rgb(0 0 0 / 100%), ransparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      {/* Right fade */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 500,
          background: "linear-gradient(to left,rgb(0 0 0 / 100%), transparent)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <style>{`
        @keyframes scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .track {
          display: flex;
          width: max-content;
          animation: scroll 30s linear infinite;
        }
      `}</style>

      <div className="track">
        {/* ✅ Duplicate array for seamless infinite loop */}
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            src={src.imgUrl}
            alt={src.name}
            width={80}
            height={80}
            style={{
              width: 80,
              height: 80,
              objectFit: "scale-down",
              borderRadius: 12,
              marginRight: 60,
              flexShrink: 0,
              filter: "grayscale(100%) opacity(0.9)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
