import React, { useEffect, useRef, useState } from "react";
import styles from "./AlbumPage.module.css";
import {
  oceanParkImages,
  randomDateImages,
  sept_img_1,
  sept_img_10,
  sept_img_11,
  sept_img_12,
  sept_img_13,
  sept_img_14,
  sept_img_15,
  sept_img_16,
  sept_img_17,
  sept_img_18,
  sept_img_2,
  sept_img_3,
  sept_img_4,
  sept_img_5,
  sept_img_6,
  sept_img_7,
  sept_img_8,
  sept_img_9,
} from "../../constants/images";

interface CustomImageProps {
  imageUrl: string;
  title: string;
  caption: string;
  images: string[];
}

const CustomImage = ({
  imageUrl,
  title,
  caption,
  images,
}: CustomImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      {/* Memory Card */}
      <div className={styles["memory-card"]} onClick={() => setIsOpen(true)}>
        <img src={imageUrl} alt={title} className={styles["memory-img"]} />

        <div className={styles["memory-date"]}>{title}</div>

        <div className={styles["memory-caption"]}>{caption}</div>
      </div>

      {/* Gallery Modal */}
      {isOpen && (
        <div
          className={styles["modal-overlay"]}
          onClick={() => setIsOpen(false)}
        >
          <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles["close-button"]}
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>

            <h2>{title}</h2>

            <div className={styles["image-gallery"]}>
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className={styles["gallery-image"]}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview */}
      {selectedImage && (
        <div
          className={styles["image-preview-overlay"]}
          onClick={() => setSelectedImage(null)}
        >
          <button
            className={styles["preview-close-button"]}
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>

          <img
            src={selectedImage}
            alt="Preview"
            className={styles["image-preview"]}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

const SeptImages2025 = [
  sept_img_1,
  sept_img_2,
  sept_img_3,
  sept_img_4,
  sept_img_5,
  sept_img_6,
  sept_img_7,
  sept_img_8,
  sept_img_9,
  sept_img_10,
  sept_img_11,
  sept_img_12,
  sept_img_13,
  sept_img_14,
  sept_img_15,
  sept_img_16,
  sept_img_17,
  sept_img_18,
];

const AlbumPage = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div>
      <div ref={cursorRef} className={styles["custom-cursor"]}>
        💖
      </div>
      <div className={styles["magic-sparkles"]}>
        <div className={styles["floating-hearts"]}>
          <div
            className={styles.heart}
            style={
              {
                "--float-duration": "6s",
                "--delay": "0s",
                "--translate-x": "20px",
              } as React.CSSProperties
            }
          >
            💝
          </div>

          <div
            className={styles.heart}
            style={
              {
                "--float-duration": "8s",
                "--delay": "1s",
                "--translate-x": "-30px",
              } as React.CSSProperties
            }
          >
            💖
          </div>

          <div
            className={styles.heart}
            style={
              {
                "--float-duration": "7s",
                "--delay": "2s",
                "--translate-x": "40px",
              } as React.CSSProperties
            }
          >
            💗
          </div>

          <div
            className={styles.heart}
            style={
              {
                "--float-duration": "9s",
                "--delay": "3s",
                "--translate-x": "-20px",
              } as React.CSSProperties
            }
          >
            💓
          </div>

          <div
            className={styles.heart}
            style={
              {
                "--float-duration": "5s",
                "--delay": "4s",
                "--translate-x": "30px",
              } as React.CSSProperties
            }
          >
            💕
          </div>
        </div>
      </div>
      <section className={styles.welcome}>
        <h1>Our Beautiful Moments Together</h1>
        <p>
          Every moment spent with you has been magical. Let's cherish these
          precious memories ...
        </p>
      </section>
      <div className={styles["memory-container"]}>
        <CustomImage
          imageUrl={sept_img_1}
          title="Our Second Date ❤️"
          caption="It was only our second date, but somehow being with you already felt so comfortable. Little did I know, moments like this would become memories I'd cherish forever."
          images={SeptImages2025}
        />
        <CustomImage
          imageUrl={oceanParkImages[0]}
          title="Ocean Park 🐠💕"
          caption="A day full of laughs, fun, and little adventures at Ocean Park with you. I loved every moment we spent together, but my favorite part wasn't the place—it was getting to experience it all with you. ❤️"
          images={oceanParkImages}
        />
        <CustomImage
          imageUrl={randomDateImages[23]}
          title="Our Random Dates 💕"
          caption="Some of my favorite memories with you are the simple, random dates we shared. It never really mattered where we went or what we did—as long as I was spending that time with you. ❤️"
          images={randomDateImages}
        />
      </div>
    </div>
  );
};

export default AlbumPage;
