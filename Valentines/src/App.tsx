import { useEffect, useMemo, useState } from "react";
import "./App.css";

import nailong from "./nailong.gif";
import sticker1 from "./sticker1.gif";
import sticker2 from "./sticker2.gif";
import sticker3 from "./sticker3.gif";
import sticker4 from "./sticker4.gif";
import yay from "./yay.gif";
import kiss from "./kiss.gif";

type Sticker = {
  id: string;
  x: number;
  y: number;
  src: string;
};

/* ===== CONFIG ===== */
const BASE_BOTTOM = -150;
const STEP = 40;
const MAX_STICKERS = 20;
const TURN_NO_INTO_YES_AT = 40; // 👈 change this anytime

function App() {
  const [noClicks, setNoClicks] = useState(0);
  const [totalNoClicks, setTotalNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [firstEmojiClick, setFirstEmojiClick] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [yesClicked, setYesClicked] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const noTexts = useMemo(
    () => [
      "NO",
      "Really? 😢",
      "Please? 🥺",
      "Not even for 2 dolla? 😭",
      "Please babyyyy? 🥹",
      "Pretty please babyyy 🥺",
      "🥺",
    ],
    []
  );

  const isFinalStage = noClicks >= noTexts.length - 1;
  const noHasTurnedIntoYes = totalNoClicks >= TURN_NO_INTO_YES_AT;

  let currentNoText = noTexts[Math.min(noClicks, noTexts.length - 1)];
  if (firstEmojiClick && isFinalStage) currentNoText = "NO";

  const handleYes = () => {
    if (yesClicked) return;
    setYesClicked(true);
    setTimeout(() => setShowLetter(true), 1200);
  };

  const handleNo = () => {
    // 🔴 NO button becomes YES after threshold
    if (noHasTurnedIntoYes) {
      handleYes();
      return;
    }

    if (!isFinalStage) {
      setNoClicks((p) => p + 1);
      setTotalNoClicks((p) => p + 1);
      return;
    }

    if (!firstEmojiClick) {
      setFirstEmojiClick(true);
      setTotalNoClicks((p) => p + 1);
      return;
    }

    const maxOffset = 120;
    setNoPosition({
      x: Math.floor(Math.random() * maxOffset * 2 - maxOffset),
      y: Math.floor(Math.random() * maxOffset * 2 - maxOffset),
    });

    setTotalNoClicks((p) => p + 1);

    const stickerArray = [sticker1, sticker2, sticker3, sticker4];
    setStickers((prev) => [
      ...prev.slice(-MAX_STICKERS + 1),
      {
        id: crypto.randomUUID(),
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        src: stickerArray[Math.floor(Math.random() * stickerArray.length)],
      },
    ]);
  };

  // Lock scroll when celebration shows
  useEffect(() => {
    document.body.style.overflow = yesClicked ? "hidden" : "auto";
  }, [yesClicked]);

  const yesScale = Math.min(1 + totalNoClicks * 0.15, 3.5);
  const yesFontSize = Math.min(18 * yesScale, 64);
  const noScale = Math.max(1 - noClicks * 0.12, 0.45);

  const nailongBottom =
    noClicks < 2 ? BASE_BOTTOM : BASE_BOTTOM + (noClicks - 1) * STEP;

  return (
    <div className="container">
      <h1 className="headline">Will you be my Valentine?</h1>

      <div
        className="buttons"
        style={{
          gap: isFinalStage ? "150px" : `${Math.max(24, yesScale * 60)}px`,
        }}
      >
        {/* YES BUTTON */}
        <button
          className="yes pulse"
          disabled={yesClicked}
          onClick={handleYes}
          style={{
            transform: `scale(${yesScale})`,
            fontSize: `${yesFontSize}px`,
            animationDuration: `${Math.max(
              1 - totalNoClicks * 0.05,
              0.3
            )}s`,
          }}
        >
          YES
        </button>

        {/* NO / RED YES BUTTON */}
        <button
          className="no"
          disabled={yesClicked}
          onClick={handleNo}
          style={{
            transform: `scale(${noScale})`,
            position: "relative",
            left: `${noPosition.x}px`,
            top: `${noPosition.y}px`,
            transition:
              "transform 0.3s ease, left 0.3s ease, top 0.3s ease",
          }}
        >
          {noHasTurnedIntoYes ? "YES" : currentNoText}
        </button>
      </div>

      {/* Nailong */}
      <img
        src={nailong}
        alt="Crying Nailong"
        className="nailong"
        style={{
          opacity: Math.min(noClicks * 0.15, 1),
          bottom: `${nailongBottom}px`,
        }}
      />

      {/* Stickers */}
      {stickers.map((s) => (
        <img
          key={s.id}
          src={s.src}
          className="sticker"
          alt="sticker"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animation: "popIn 0.3s ease-out",
          }}
        />
      ))}

      {/* Celebration */}
      {yesClicked && (
        <div className="celebrationOverlay">
          <div className="celebrationStickers">
            <img src={kiss} alt="kiss" />
            <img src={yay} alt="yay" />
          </div>

          <div className="celebrationText">
            YAY!!! I LOVE YOU SO MUCH BABYYYY
          </div>

          {showLetter && (
            <>
              <textarea
                className="loveLetter"
                readOnly
                value={`To: The Love of my Life,\n\nMy love, it has been 167 days since we officially became a couple, and in those 167 days I have been nothing but happy. We had our ups and downs but despite all of that we still remained with each other, fighting for each other, and choosing each other every single day. In a world full of chaos you are my peace, my home away from home, my everything. I Love You So Much baby, I choose you, now and forever.`}
              />

              <button
                className="proceedBtn"
                onClick={() =>
                  window.open(
                    "https://docs.google.com/document/d/1uwBCnMSFAwHKwDIEJlk2LB6W1IAe6YFSg0kCyIYk1h0/view",
                    "_blank"
                  )
                }
              >
                Proceed to date itinerary:
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
