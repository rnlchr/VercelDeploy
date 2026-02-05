import { useMemo, useState } from "react";
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
const TURN_NO_INTO_YES_AT = 40;
const FADE_DURATION = 600; // ms

function App() {
  const [page, setPage] = useState<"question" | "celebration">("question");
  const [fadingOut, setFadingOut] = useState(false);

  const [noClicks, setNoClicks] = useState(0);
  const [totalNoClicks, setTotalNoClicks] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [firstEmojiClick, setFirstEmojiClick] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
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

  const startTransitionToCelebration = () => {
    setFadingOut(true);
    setTimeout(() => {
      setPage("celebration");
      setShowLetter(false);
      setTimeout(() => setShowLetter(true), 800);
    }, FADE_DURATION);
  };

  const handleYes = () => {
    if (fadingOut) return;
    startTransitionToCelebration();
  };

  const handleNo = () => {
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
        id: `${Date.now()}-${Math.random()}`,
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        src: stickerArray[Math.floor(Math.random() * stickerArray.length)],
      },
    ]);
  };

  const yesScale = Math.min(1 + totalNoClicks * 0.15, 3.5);
  const yesFontSize = Math.min(18 * yesScale, 64);
  const noScale = Math.max(1 - noClicks * 0.12, 0.45);

  const nailongBottom =
    noClicks < 2 ? BASE_BOTTOM : BASE_BOTTOM + (noClicks - 1) * STEP;

  /* ===== CELEBRATION PAGE ===== */
  if (page === "celebration") {
    return (
      <div className="container fadeIn">
        <div className="celebrationPage">
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
                value={`To: The Love of my Life,\n\nMy love, it has been 334 days since we last met, and 167 days since we officially became a couple, and in those days I have been nothing but happy. We had our ups and downs but despite all of that we still remained with each other, fighting for each other, and choosing each other every single day. In a world full of chaos you are my peace, my home away from home, my everything. I Love You So Much baby!`}
              />

              <button
                className="proceedBtn"
                onClick={() =>
                  window.open(
                    "https://www.canva.com/design/DAG_tKsH4co/-OmKAjVlyHDFkaheRy47Rg/edit?utm_content=DAG_tKsH4co&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton",
                    "_blank"
                  )
                }
              >
                Proceed to date plan:
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  /* ===== QUESTION PAGE ===== */
  return (
    <div className={`container ${fadingOut ? "fadeOut" : "fadeIn"}`}>
      <h1 className="headline">Will you be my Valentine?</h1>

      <div
        className="buttons"
        style={{
          gap: isFinalStage ? "150px" : `${Math.max(24, yesScale * 60)}px`,
        }}
      >
        <button
          className="yes pulse"
          onClick={handleYes}
          style={{
            transform: `scale(${yesScale})`,
            fontSize: `${yesFontSize}px`,
          }}
        >
          YES
        </button>

        <button
          className="no"
          onClick={handleNo}
          style={{
            transform: `scale(${noScale})`,
            position: "relative",
            left: `${noPosition.x}px`,
            top: `${noPosition.y}px`,
          }}
        >
          {noHasTurnedIntoYes ? "YES" : currentNoText}
        </button>
      </div>

      <img
        src={nailong}
        alt="Crying Nailong"
        className="nailong"
        style={{
          opacity: Math.min(noClicks * 0.15, 1),
          bottom: `${nailongBottom}px`,
        }}
      />

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
    </div>
  );
}

export default App;
