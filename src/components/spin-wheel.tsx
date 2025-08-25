"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";



interface SpinWheelProps {
  segments: string[];
  onSpinEnd: (result: string) => void;
  disabled?: boolean;
}

export function SpinWheel({
  segments,
  onSpinEnd,
  disabled = false,
}: SpinWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / segments.length;

  const handleSpin = () => {
    if (isSpinning || disabled) return;

    setIsSpinning(true);
    toast.info("Girando a roleta...");

    const randomIndex = Math.floor(Math.random() * segments.length);
    const targetSegment = segments[randomIndex];

    const baseRotation = 360 * 5; // 5 voltas completas para um giro visível
    // Calcula o ângulo alvo para centralizar o ponteiro no segmento
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    // Adiciona um pequeno offset aleatório dentro do segmento para um giro mais natural
    const randomOffset =
      Math.random() * (segmentAngle - 10) - (segmentAngle - 10) / 2;

    const newRotation = baseRotation + targetAngle + randomOffset;

    setRotation(newRotation);

    const wheelElement = wheelRef.current;
    if (wheelElement) {
      const onTransitionEnd = () => {
        setIsSpinning(false);
        onSpinEnd(targetSegment);
        wheelElement.removeEventListener("transitionend", onTransitionEnd);
      };
      wheelElement.addEventListener("transitionend", onTransitionEnd);
    }
  };

  // Cores para o conic-gradient, usando as variáveis de chart do tailwind.config.ts
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(250 70% 60%)", // Cor adicional se houver mais segmentos que as cores padrão
    "hsl(300 60% 50%)",
    "hsl(100 50% 40%)",
  ];

  const conicGradient = segments
    .map((_, index) => {
      const start = (index / segments.length) * 100;
      const end = ((index + 1) / segments.length) * 100;
      const color = colors[index % colors.length];
      return `${color} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-80 h-80 rounded-full shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Ponteiro */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-primary z-10" />

        {/* Roleta */}
        <div
          ref={wheelRef}
          className={cn(
            "w-full h-full relative transition-transform duration-[5000ms] ease-out",
            isSpinning && "pointer-events-none"
          )}
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `conic-gradient(${conicGradient})`, // Aplica o conic-gradient para as fatias
          }}
        >
          {/* Rótulos dos Segmentos */}
          {segments.map((segment, index) => (
            <div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                // Rotaciona o container do texto para o centro do segmento
                transform: `rotate(${index * segmentAngle + segmentAngle / 2}deg)`,
                transformOrigin: "center center", // Rotaciona em torno do centro da roleta
              }}
            >
              <span
                className="absolute text-white font-bold text-sm whitespace-nowrap text-center"
                style={{
                  // Posiciona o texto para fora do centro e o rotaciona de volta para ficar horizontal
                  // Ajustei o translateY para uma posição mais adequada
                  transform: `translateY(-120px) translateX(-50%) rotate(-${index * segmentAngle + segmentAngle / 2}deg)`,
                  top: "50%",
                  left: "50%",
                }}
              >
                {segment}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={handleSpin}
        disabled={isSpinning || disabled}
        className="w-48"
      >
        {isSpinning ? "Girando..." : "Girar Roleta!"}
      </Button>
    </div>
  );
}