import React, { useState, useRef } from "react";
import styled from "styled-components";

const Switch = ({
  onChange = () => {},
  labels = [],
  theme = {
    hue: 220,
    accentHue: 22,
  },
  accentHue = 22, // default orange
}) => {
  const [state, setState] = useState(0); // 0=All, 1=Personal, 2=Professional
  const [pressed, setPressed] = useState(false);
  const animating = useRef(false);
  const startX = useRef(null);

  const btnPositions = ["5%", "30%", "55%"];
  const leftWidths = ["0px", "36%", "72%"];
  const rightWidths = ["72%", "36%", "0px"];

  const goTo = (next) => {
    if (animating.current || next === state) return;
    animating.current = true;
    setState(next);
    onChange(next);
    setTimeout(() => {
      animating.current = false;
    }, 720);
  };

  const handleSwitchMouseDown = (e) => {
    setPressed(true);
    startX.current = e.clientX;
  };

  const handleSwitchMouseUp = (e) => {
    setPressed(false);
    const dx = startX.current !== null ? e.clientX - startX.current : 0;
    startX.current = null;
    if (Math.abs(dx) > 20) {
      goTo(Math.max(0, Math.min(2, state + (dx > 0 ? 1 : -1))));
    } else {
      goTo((state + 1) % 3);
    }
  };

  const handleTouchStart = (e) => {
    setPressed(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setPressed(false);
    goTo((state + 1) % 3);
  };

  return (
    <StyledWrapper
        style={{
    "--accent-hue": `${accentHue}deg`,
  }}
      className="ml-[18%] md:ml-0 my-10 md:my-0 mr-62"
    >
      {" "}
      <div className="switchContainer">
        <div
          className="switch"
          onMouseDown={handleSwitchMouseDown}
          onMouseUp={handleSwitchMouseUp}
          onMouseLeave={() => setPressed(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left indicator — clip grows from left */}
          <div
            className="clip left"
            style={{ width: leftWidths[state] }}
          >
            <div
              className="indicator right-ind"
              style={{
                boxShadow:
                  state === 0
                    ? "inset 0 0 5px hsl(220deg 20% 15%/100%), inset 20px 20px 10px hsl(220deg 20% 15%/100%), inset 20px 20px 15px hsl(220deg 20% 45%/100%)"
                    : "inset 0 0 2px hsl(220deg 20% 15%/60%), inset 0 0 3px 2px hsl(220deg 20% 15%/60%), inset 0 0 5px 2px hsl(220deg 20% 45%/60%)",
              }}
            />
          </div>

          {/* Right indicator — clip shrinks toward right, pill stays right-anchored */}
          <div
            className="clip right"
            style={{ width: rightWidths[state] }}
          >
            <div
              className="indicator  left-ind"
              style={{
                boxShadow:
                  state === 2
                    ? "inset 0 0 5px hsl(var(--accent-hue) 20% 15%/100%), inset 20px 20px 10px hsl(var(--accent-hue) 20% 15%/100%), inset 20px 20px 15px hsl(var(--accent-hue) 20% 45%/100%)"
                    : "inset 0 0 2px hsl(var(--accent-hue) 20% 15%/60%), inset 0 0 3px 2px hsl(var(--accent-hue) 20% 15%/60%), inset 0 0 5px 2px hsl(var(--accent-hue) 20% 45%/60%)",
              }}
            />
          </div>

          <div
            className={`button ${pressed ? "pressed" : ""}`}
            style={{ left: btnPositions[state] }}
          />
        </div>

        <div className="labels">
          {labels &&
            labels.map((lbl, i) => (
              <span
                key={lbl.id}
                className={`label ${state === i ? "active" : ""}`}
                onClick={() => goTo(i)}
              >
                {lbl.label}
              </span>
            ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .switchContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    // padding: 2rem 0;
    // --hue: var(--hue, 220deg);
    // --accent-hue: var(--accent-hue, var(--accent-hue));
    --hue: 220deg;
    --width: 9rem;
    --duration: 0.7s;
    --easing: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .switch {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    // width: var(--width);
    //   height: calc(var(--width) / 2.5);
    width: 15rem;
    height: 3.6rem;
    border-radius: var(--width);
    box-shadow:
      inset 10px 10px 10px hsl(var(--hue) 20% 80%),
      inset -10px -10px 10px hsl(var(--hue) 20% 93%);
    user-select: none;
  }

  /* Clip wrappers */
  .clip {
    position: absolute;
    height: 60%;
    overflow: hidden;
    border-radius: 100px;
    transition: width var(--duration) var(--easing);
  }
  .clip.left {
    left: 7%;
  }
  .clip.right {
    right: 7%;
    display: flex;
    justify-content: flex-end; /* pin pill to right edge so it reveals cleanly */
  }

  /* Inner pills — always full-size, always rounded */
  .indicator {
    flex-shrink: 0;
    height: 100%;
    width: 10rem;
    border-radius: 100px;
    transition: box-shadow 0.4s ease;
  }
  .left-ind {
    background: linear-gradient(
      180deg,
      hsl(calc(var(--accent-hue) + 20deg) 95% 80%) 10%,
      hsl(calc(var(--accent-hue) + 20deg) 100% 60%) 30%,
      hsl(var(--accent-hue) 90% 50%) 60%,
      hsl(var(--accent-hue) 90% 60%) 75%,
      hsl(var(--accent-hue) 90% 50%)
    );
  }
  .right-ind {
    background: linear-gradient(
      180deg,
      hsl(var(--hue) 20% 95%),
      hsl(var(--hue) 20% 65%) 60%,
      hsl(var(--hue) 20% 70%) 70%,
      hsl(var(--hue) 20% 65%)
    );
  }

  .button {
    position: absolute;
    z-index: 1;
    width: 35%;
    height: 80%;
    border-radius: 100px;
    background-image: linear-gradient(
      160deg,
      hsl(var(--hue) 20% 95%) 40%,
      hsl(var(--hue) 20% 65%) 70%
    );
    transition:
      left var(--duration) var(--easing),
      transform 0.15s ease;
    box-shadow:
      2px 2px 3px hsl(var(--hue) 18% 50% / 80%),
      2px 2px 6px hsl(var(--hue) 18% 50% / 40%),
      10px 20px 10px hsl(var(--hue) 18% 50% / 40%),
      20px 30px 30px hsl(var(--hue) 18% 50% / 60%);
  }
  .button.pressed {
    transform: scale(0.93);
  }
  .button::before,
  .button::after {
    content: "";
    position: absolute;
    top: 10%;
    width: 41%;
    height: 80%;
    border-radius: 100%;
  }
  .button::before {
    left: 5%;
    box-shadow: inset 1px 1px 2px hsl(var(--hue) 20% 85%);
    background-image: linear-gradient(
      -50deg,
      hsl(var(--hue) 20% 95%) 20%,
      hsl(var(--hue) 20% 85%) 80%
    );
  }
  .button::after {
    right: 5%;
    box-shadow: inset 1px 1px 3px hsl(var(--hue) 20% 70%);
    background-image: linear-gradient(
      -50deg,
      hsl(var(--hue) 20% 95%) 20%,
      hsl(var(--hue) 20% 75%) 80%
    );
  }

  .labels {
    display: flex;
    width: 13rem;
    justify-content: space-between;
    padding: 0 2px;
  }
  .label {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.03em;
    color: #d3d3d3;
    opacity: 0.7;
    cursor: pointer;
    transition:
      color 0.35s ease,
      opacity 0.35s ease,
      transform 0.35s ease;
  }
  .label.active {
    color: #fff;
    opacity: 1;
    transform: scale(1.08);
    font-weight: 600;
  }
`;

export default Switch;
