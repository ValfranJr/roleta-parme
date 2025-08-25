"use client";

import React, { useState, useEffect } from "react";
import { CouponForm } from "./coupon-form";
import { SpinWheel } from "./spin-wheel";
import { CouponResultDialog } from "./coupon-result-dialog";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getUsedWhatsappNumbers, addUsedWhatsappNumber } from "@/lib/utils"; // Importar as novas funções

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
  const [hasSpun, setHasSpun] = useState(false); // Novo estado para controlar se o número atual já girou

  useEffect(() => {
    if (formData?.whatsapp) {
      const usedNumbers = getUsedWhatsappNumbers();
      if (usedNumbers.includes(formData.whatsapp)) {
        setHasSpun(true);
        toast.warning("Este número de WhatsApp já girou a roleta. Apenas um giro por número é permitido.");
      } else {
        setHasSpun(false);
      }
    }
  }, [formData]);

  const handleFormSubmit = (data: { name: string; whatsapp: string }) => {
    setFormData(data);
    const usedNumbers = getUsedWhatsappNumbers();
    if (usedNumbers.includes(data.whatsapp)) {
      setHasSpun(true);
      toast.warning("Este número de WhatsApp já girou a roleta. Apenas um giro por número é permitido.");
    } else {
      setHasSpun(false);
      toast.success("Dados enviados! Agora você pode girar a roleta.");
    }
  };

  const handleSpinEnd = (result: string) => {
    if (formData?.whatsapp) {
      addUsedWhatsappNumber(formData.whatsapp); // Adiciona o número à lista de usados após o giro
      setHasSpun(true); // Marca que o número atual já girou
    }

    if (result === "NÃO FOI DESSA VEZ") {
      toast.error("Que pena! Não foi dessa vez. Tente novamente!");
      setWonCoupon(null);
    } else {
      setWonCoupon(result);
      setIsResultDialogOpen(true);
    }
  };

  const handleCloseResultDialog = () => {
    setIsResultDialogOpen(false);
    setWonCoupon(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Roleta de Cupons!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Preencha seus dados para girar a roleta e ganhar um desconto!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
            <div className="flex-shrink-0">
              <SpinWheel
                segments={couponSegments}
                onSpinEnd={handleSpinEnd}
                // Desabilita se o formulário não foi enviado OU se o número já girou
                disabled={!formData || hasSpun}
              />
            </div>

            <div className="w-full md:w-1/2 max-w-sm">
              <CouponForm onFormSubmit={handleFormSubmit} />
            </div>
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