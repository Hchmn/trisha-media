import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./AboutYouPage.module.css";
import duduBuBuGif from "../../assets/gif/dudu-bubu/dudu-bubu-1.gif";
import duduBuBuKiss from "../../assets/gif/dudu-bubu/dudu-bubu-kiss.gif";
import duduBuBuAngry from "../../assets/gif/dudu-bubu/dudu-bubu-angry.gif";
import duduBuBuFood from "../../assets/gif/dudu-bubu/dudu-bubu-food.gif";
import { useNavigate } from "react-router-dom";

interface Reason {
  text: string;
  emoji: string;
  gif: string;
}

interface FloatingElement {
  id: number;
  emoji: string;
  left: number;
  top: number;
  fontSize: number;
}

const reasons: Reason[] = [
  {
    text: "A little kiss for the girl who makes my heart smile and fills my life with so much love. 💋💖",
    emoji: "🌟",
    gif: duduBuBuKiss,
  },
  {
    text: "Sometimes you get mad at me, and honestly… I probably deserved it. 😅 But I’ll always try my best to make you smile again. 💕",
    emoji: "💗",
    gif: duduBuBuAngry,
  },
  {
    text: "I hope we get to share countless more meals together because good food is great, but having you beside me makes it even better. 💖🍴",
    emoji: "💕",
    gif: duduBuBuFood,
  },
  {
    text: "Some of my happiest moments are when we forget everything else and just act like two kids having the time of our lives together. 😆💖",
    emoji: "🌟",
    gif: duduBuBuGif,
  },
];

function Cause() {
  const [currentReasonIndex, setCurrentReasonIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isStoryMode, setIsStoryMode] = useState<boolean>(false);

  const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
    [],
  );

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animate newly added reason card
  useEffect(() => {
    if (currentReasonIndex > 0) {
      const card = cardRefs.current[currentReasonIndex - 1];

      if (card) {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.5,
          ease: "back.out",
        });
      }
    }
  }, [currentReasonIndex]);

  // Custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX - 15,
          y: e.clientY - 15,
          duration: 0.2,
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Create floating elements
  const createFloatingElement = (): void => {
    const elements: string[] = ["🌸", "✨", "💖", "🦋", "⭐"];

    const id = Date.now() + Math.floor(Math.random() * 10000);

    const newElement: FloatingElement = {
      id,
      emoji: elements[Math.floor(Math.random() * elements.length)],
      left: Math.random() * window.innerWidth,
      top: Math.random() * window.innerHeight,
      fontSize: Math.random() * 20 + 10,
    };

    setFloatingElements((prev) => [...prev, newElement]);

    setTimeout(() => {
      const element = document.getElementById(`floating-${id}`);

      if (element) {
        gsap.to(element, {
          y: -500,
          duration: Math.random() * 10 + 10,
          opacity: 0,
          onComplete: () => {
            setFloatingElements((prev) =>
              prev.filter((item) => item.id !== id),
            );
          },
        });
      }
    }, 0);
  };

  // Automatically create floating elements
  useEffect(() => {
    const interval = setInterval(createFloatingElement, 2000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  // Handle button click
  const handleButtonClick = (): void => {
    if (isTransitioning) return;

    // Navigate when in story mode
    if (isStoryMode) {
      if (buttonRef.current) {
        gsap.to("body", {
          opacity: 0,
          duration: 1,

          onComplete: () => {
            navigate("/album");

            gsap.to("body", {
              opacity: 1,
              duration: 1,
            });
          },
        });
      }

      return;
    }

    setIsTransitioning(true);

    // Button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }

    if (currentReasonIndex < reasons.length) {
      setCurrentReasonIndex((prev) => prev + 1);

      createFloatingElement();

      // Last reason
      if (currentReasonIndex + 1 === reasons.length) {
        if (buttonRef.current) {
          gsap.to(buttonRef.current, {
            scale: 1.1,
            duration: 0.5,
            ease: "elastic.out",
            onComplete: () => {
              setIsStoryMode(true);
            },
          });
        }
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }
  };

  return (
    <>
      {/* Custom Cursor */}
      <div className={styles["custom-cursor"]} ref={cursorRef}>
        <svg viewBox="0 0 24 24">
          <path
            fill="#ff69b4"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </div>

      <div className={styles.container}>
        <h1>Happy 1st Anniversary Baby Trisha 💖</h1>

        {/* Reasons */}
        <div id={styles["reasons-container"]}>
          {reasons.slice(0, currentReasonIndex).map((reason, index) => (
            <div
              className={styles["reason-card"]}
              key={index}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
            >
              <div className={styles["reason-text"]}>
                {reason.emoji} {reason.text}
              </div>

              <div className="gif-overlay">
                <img src={reason.gif} alt="Friendship Memory" />
              </div>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          ref={buttonRef}
          className={`${styles["shuffle-button"]} ${
            isStoryMode ? styles["story-mode"] : ""
          }`}
          onClick={handleButtonClick}
        >
          {isStoryMode ? "Enter Our Storylane 💫" : "Click Here... 💕"}
        </button>

        {/* Counter */}
        <div className={styles["reason-counter"]}>
          {currentReasonIndex > 0 &&
            `Reason ${currentReasonIndex} of ${reasons.length}`}
        </div>

        {/* Ending Section */}
        <div className={styles["ending-section"]}>
          <div className={styles["teddy-hug"]}>
            <img src="/d1.jpg" alt="Teddy Hug" />
          </div>

          <div className={styles["ending-text"]}>You're the BESTEST! 💖</div>
        </div>
      </div>

      {/* Floating Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          id={`floating-${element.id}`}
          className={styles.floating}
          style={{
            left: `${element.left}px`,
            top: `${element.top}px`,
            fontSize: `${element.fontSize}px`,
          }}
        >
          {element.emoji}
        </div>
      ))}
    </>
  );
}

export default Cause;
