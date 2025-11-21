import { useState } from "react";
import { useEffect, useRef } from "react";

interface StarsBackgroundProps {
  starCount?: number;
  moveTime?: number;
}

export function StarsBackground(props: StarsBackgroundProps) {
  const { starCount = 100, moveTime = 30 } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationRef, setAnimationRef] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 创建星星
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }));

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // 更新位置和闪烁
        star.y += star.speed;
        star.opacity += star.twinkleSpeed;

        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        if (star.opacity > 0.8 || star.opacity < 0.3) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // 绘制星星
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(19, 136, 150, ${star.opacity})`;
        ctx.fill();
      });

      setAnimationRef(requestAnimationFrame(animate));
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationRef);
    };
  }, [starCount, moveTime]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
}
