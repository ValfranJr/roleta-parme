"use client";

import React, { useState } from "react";
import { CouponForm } from "./coupon-form";
import { SpinWheel } from "./spin-wheel";
import { CouponResultDialog } from "./coupon-result-dialog";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const couponSegments = [
  "5% OFF",
  "10% OFF",
  "FRETE GRÁTIS",
  "20% OFF",
  "NÃO FOI DESSA VEZ",
  "30% OFF",
];

export default function CouponRoulette() {
  const [formData, setFormData] = useState<{ name: string; whatsapp: string } | null>(null);
  const [wonCoupon, setWonCoupon] = useState<string | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const handleFormSubmit = (data: { name: string; whatsapp: string }) => {
    setFormData(data);
  };

  const handleSpinEnd = (result: string) => {
    if (result === "NÃO FOI DESSA VEZ") {
      toast.error("Que pena! Não foi dessa vez. Tente novamente!");
      setWonCoupon(null); // Permite girar novamente
    } else {
      setWonCoupon(result);
      setIsResultDialogOpen(true);
    }
  };

  const handleCloseResultDialog = () => {
    setIsResultDialogOpen(false);
    setWonCoupon(null); // Permite girar novamente após fechar o diálogo
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-4xl mx-auto"> {/* Aumentei a largura máxima do card */}
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Roleta de Cupons!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Preencha seus dados para girar a roleta e ganhar um desconto!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
            {/* Roleta sempre visível */}
            <div className="flex-shrink-0"> {/* Garante que a roleta não encolha */}
              <SpinWheel
                segments={couponSegments}
                onSpinEnd={handleSpinEnd}
                // Desabilita se o formulário não foi enviado OU se um cupom válido foi ganho
                disabled={!formData || (!!wonCoupon && wonCoupon !== "NÃO FOI DESSA VEZ")}
              />
            </div>

            {/* Renderiza o formulário ao lado da roleta se ainda não foi enviado */}
            {!formData && (
              <div className="w-full md:w-1/2 max-w-sm"> {/* Ajusta a largura do formulário */}
                <CouponForm onFormSubmit={handleFormSubmit} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {formData && wonCoupon && wonCoupon !== "NÃO FOI DESSA VEZ" && (
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