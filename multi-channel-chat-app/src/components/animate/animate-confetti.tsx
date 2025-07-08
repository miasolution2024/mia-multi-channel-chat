import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export const AnimateConfetti = ({ open = false }: { open?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (open && canvasRef.current) {
      const myConfetti = confetti.create(canvasRef.current, {
        resize: true,
        useWorker: true,
      });

      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      let skew = 1;

      const confettiColors = [
        "#FF5F6D",
        "#FFC371",
        "#FFD700",
        "#8A2BE2",
        "#00BFFF",
        "#FF6347",
        "#98FB98",
        "#FFD700",
        "#00FF7F",
        "#6495ED",
      ];

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      (function frame() {
        const timeLeft = animationEnd - Date.now();
        const ticks = Math.max(200, 500 * (timeLeft / duration));
        skew = Math.max(0.8, skew - 0.001);

        myConfetti({
          particleCount: 100,
          startVelocity: 15,
          spread: 180,
          ticks: ticks,
          origin: {
            x: Math.random(),
            // since particles fall down, skew start toward the top
            y: Math.random() * skew - 0.2,
          },
          shapes: ["circle"], // TODO: research more about shapes to customize the confetti
          colors: [
            confettiColors[Math.floor(Math.random() * confettiColors.length)],
            confettiColors[Math.floor(Math.random() * confettiColors.length)],
          ],
          gravity: randomInRange(0.4, 0.6),
          scalar: randomInRange(0.4, 1),
          drift: randomInRange(-0.4, 0.4),
        });

        if (timeLeft > 0) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [open]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: "var(--zIndex-modal)",
      }}
    />
  );
};
