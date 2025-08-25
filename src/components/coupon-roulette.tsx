"use client";

import React, { useState } from "react";
import { CouponForm } from "./coupon-form";
import { SpinWheel } from "./spin-wheel";
import { CouponResultDialog } from "./coupon-result-dialog";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const couponSegments = [
  "10% OFF",
  "FRETE GRÁTIS",
  "20% OFF",
  "BRINDE",
  "15% OFF",
  "5% OFF",
];

export default function CouponRoulette() {
  const [formData, setFormData] = useState<{ name: string; whatsapp: string } | null>(null);
  const [wonCoupon, setWonCoupon] = useState<string | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const handleFormSubmit = (data: { name: string; whatsapp: string }) => {
    setFormData(data);
  };

  const handleSpinEnd = (result: string) => {
    setWonCoupon(result);
    setIsResultDialogOpen(true);
  };

  const handleCloseResultDialog = () => {
    setIsResultDialogOpen(false);
    setWonCoupon(null);
    // Optionally reset the form or allow another spin
    // For now, we'll keep the form submitted state
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Roleta de Cupons!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Preencha seus dados para girar a roleta e ganhar um desconto!
          </p>
        </CardHeader>
        <CardContent>
          {!formData ? (
            <CouponForm onFormSubmit={handleFormSubmit} />
          ) : (
            <SpinWheel
              segments={couponSegments}
              onSpinEnd={handleSpinEnd}
              disabled={!!wonCoupon} // Disable wheel if a coupon has been won
            />
          )}
        </CardContent>
      </Card>

      {formData && wonCoupon && (
        <CouponResultDialog
          isOpen={isResultDialogOpen}
          onClose={handleCloseResultDialog}
          coupon={wonCoupon}
          whatsappNumber={formData.whatsapp}
        />
      )}
      <Toaster />
    </div>
  );
}