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

    // Calculate a random segment to land on
    const randomIndex = Math.floor(Math.random() * segments.length);
    const targetSegment = segments[randomIndex];

    // Calculate the target rotation.
    // We add multiple full rotations to make it spin visibly.
    // Then, we subtract half a segment angle to center the pointer on the segment.
    // We also add a small random offset within the segment for more natural feel.
    const baseRotation = 360 * 5; // 5 full spins
    const targetAngle = 360 - (randomIndex * segmentAngle + segmentAngle / 2);
    const randomOffset =
      Math.random() * (segmentAngle - 10) - (segmentAngle - 10) / 2; // Small random offset within segment

    const newRotation = baseRotation + targetAngle + randomOffset;

    setRotation(newRotation);

    // Listen for the end of the CSS transition
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

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative w-80 h-80 rounded-full shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[30px] border-b-primary z-10" />

        {/* Wheel */}
        <div
          ref={wheelRef}
          className={cn(
            "w-full h-full relative transition-transform duration-[5000ms] ease-out",
            isSpinning && "pointer-events-none"
          )}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {segments.map((segment, index) => (
            <div
              key={index}
              className="absolute inset-0 origin-center"
              style={{
                transform: `rotate(${index * segmentAngle}deg)`,
                clipPath: `polygon(50% 50%, 100% 0px, 200% 99%)`, // This creates a triangle segment
                backgroundColor: `hsl(${
                  (index * (360 / segments.length)) % 360
                }, 70%, 60%)`, // Dynamic colors
              }}
            >
              <div
                className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm p-2"
                style={{
                  transform: `rotate(${segmentAngle / 2}deg) translate(50%, -50%) rotate(-${segmentAngle / 2}deg)`,
                  transformOrigin: "0% 0%",
                  left: "50%",
                  top: "50%",
                  width: "100%",
                  height: "100%",
                }}
              >
                <span className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap">
                  {segment}
                </span>
              </div>
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
