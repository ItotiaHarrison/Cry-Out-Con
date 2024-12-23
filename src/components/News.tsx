import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import image1 from "../assets/sectionimages/IMG_6984.jpg";
import image2 from "../assets/sectionimages/6N7A9961.jpg";
import image3 from "../assets/sectionimages/IMG_6543.jpg";
import image4 from "../assets/sectionimages/IMG_1392.jpg";
import image5 from "../assets/sectionimages/IMG_8152.jpg";
import { image } from "framer-motion/client";

export const News = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const news = [
    {
      title: "Captivating Conversations",
      image: image1,
    },
    {
      title: "Dynamic Keynotes",
      image: image2,
    },
    {
      title: "Powerful Praise",
      image: image3,
    },
    {
      title: "Transformative Breakouts",
      image: image4,
    },
    {
      title: "Release & Revelation",
      image: image5,
    },
  ];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 1,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 1,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;

      if (nextIndex >= news.length) {
        return 0;
      }
      if (nextIndex < 0) {
        return news.length - 1;
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="relative h-[500px] w-screen overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          backgroundImage: `url(${news[currentIndex === 0 ? news.length - 1 : currentIndex - 1].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(0.5)",
        }}
      />

      {/* Next Image (Blurred) */}
      <div
        className="absolute w-full h-full"
        style={{
          backgroundImage: `url(${news[currentIndex === news.length - 1 ? 0 : currentIndex + 1].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(0.5)",
        }}
      />

      <div className="relative h-full w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full flex justify-center"
          >
            <div
              className="w-full h-full relative"
              style={{
                backgroundImage: `url(${news[currentIndex].image})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                <div className="container mx-auto">
                  <h3 className="text-4xl font-bold mb-4 text-white max-w-3xl">
                    {news[currentIndex].title}
                  </h3>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {news.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
