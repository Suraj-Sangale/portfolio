import Image from "next/image";

export default function ImageCarousel({ images = [] }) {
  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        padding: "clamp(20px, 4vw, 40px) 0",
        marginBlock: "clamp(2rem, 6vw, 5rem)",
      }}
    >
      {/* Left fade */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "clamp(60px, 15vw, 300px)",
          background: "linear-gradient(to right, #000000 0%, transparent 100%)",
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
          width: "clamp(60px, 15vw, 300px)",
          background: "linear-gradient(to left, #000000 0%, transparent 100%)",
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
          align-items: center;
          width: max-content;
          animation: scroll 30s linear infinite;
          margin-top:3rem;
          margin-bottom:3rem;
        }
        .carousel-img {
          width: clamp(48px, 8vw, 80px);
          height: clamp(48px, 8vw, 80px);
          object-fit: scale-down;
          border-radius: 12px;
          margin-right: clamp(24px, 5vw, 60px);
          flex-shrink: 0;
          filter: grayscale(100%) opacity(0.9);
        }
      `}</style>

      <div className="track">
        {[...images, ...images].map((src, i) => (
          <Image
            key={i}
            src={src.imgUrl}
            alt={src.name}
            width={80}
            height={80}
            className="carousel-img"
          />
        ))}
      </div>
    </div>
  );
}
