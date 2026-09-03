import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./LandingPage.module.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const greetingRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cursor following effect
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current;

      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    // Typing effect
    const greetingText =
      "Hey You Know What! You're the most adorable human I ever met! 💖";

    let charIndex = 0;
    let typingTimeout: ReturnType<typeof setTimeout>;

    let isCancelled = false;

    const typeGreeting = () => {
      const greeting = greetingRef.current;

      if (!isCancelled && greeting && charIndex < greetingText.length) {
        greeting.textContent += greetingText.charAt(charIndex);
        charIndex++;

        typingTimeout = setTimeout(typeGreeting, 100);
      }
    };

    // Clear the text before starting
    if (greetingRef.current) {
      greetingRef.current.textContent = "";
    }

    // Floating elements
    const floatingElements = ["💖", "✨", "🌸", "💫", "💕"];

    const createFloating = () => {
      const element = document.createElement("div");

      element.className = styles.floating;

      element.textContent =
        floatingElements[Math.floor(Math.random() * floatingElements.length)];

      element.style.left = `${Math.random() * 100}vw`;
      element.style.top = `${Math.random() * 100}vh`;
      element.style.fontSize = `${Math.random() * 20 + 20}px`;

      document.body.appendChild(element);

      gsap.to(element, {
        y: -500,
        x: Math.random() * 100 - 50,
        rotation: Math.random() * 360,
        duration: Math.random() * 5 + 5,
        opacity: 1,
        ease: "none",
        onComplete: () => element.remove(),
      });
    };

    // Initial animations
    if (containerRef.current) {
      const title = containerRef.current.querySelector("h1");

      if (title) {
        gsap.to(title, {
          opacity: 1,
          duration: 1,
          y: 20,
          ease: "bounce.out",
        });
      }
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: 1,
        duration: 1,
        y: -20,
        ease: "back.out",
      });
    }

    // Start typing
    typeGreeting();

    // Create floating elements every second
    const floatingInterval = setInterval(createFloating, 1000);

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);

      clearTimeout(typingTimeout);
      clearInterval(floatingInterval);
      isCancelled = true;
    };
  }, []);

  // Button hover effects
  const handleMouseEnter = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.3,
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
      });
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    gsap.to("body", {
      opacity: 0,
      duration: 1,

      onComplete: () => {
        navigate("/about-you");

        gsap.to("body", {
          opacity: 1,
          duration: 1,
        });
      },
    });
  };

  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorRef} className={styles.cursor} />

      <div ref={containerRef} className={styles.container}>
        {/* Title */}
        <h1>Happy 1st Anniversary Baby Trisha💗</h1>

        {/* Typing Greeting */}
        <div ref={greetingRef} className={styles.greeting} />

        {/* Button */}
        <button
          ref={buttonRef}
          className={styles["cta-button"]}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          Press to Continue 💕
        </button>
      </div>
    </>
  );
};

export default LandingPage;
