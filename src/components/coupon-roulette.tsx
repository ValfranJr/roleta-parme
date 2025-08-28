"use client";

import React, { useState, useEffect } from "react";
import { CouponForm } from "./coupon-form";
import { SpinWheel } from "./spin-wheel";
import { CouponResultDialog } from "./coupon-result-dialog";
import { Toaster } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getUsedWhatsappNumbers, addUsedWhatsappNumber } from "@/lib/utils";
import Image from "next/image"; // Importar o componente Image do Next.js

const couponSegments = [
  "5% OFF",
  "10% OFF",
  "FRETE GRÁTIS",
  "20% OFF",
  "NÃO FOI DESSA VEZ",
  "30% OFF",
];

const STORE_WHATSAPP_NUMBER = "21987581929"; // Número da loja para verificação do cupom

export default function CouponRoulette() {
  const [formData, setFormData] = useState<{ name: string; whatsapp: string } | null>(null);
  const [wonCoupon, setWonCoupon] = useState<string | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);

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
    // The check for used numbers is now handled by onDbSubmitSuccess
  };

  const handleDbSubmitSuccess = (whatsapp: string) => {
    // This function is called after the form data is successfully saved to the DB
    // or if the number is already registered.
    const usedNumbers = getUsedWhatsappNumbers();
    if (usedNumbers.includes(whatsapp)) {
      setHasSpun(true);
    } else {
      setHasSpun(false);
    }
  };

  const handleSpinEnd = async (result: string) => { // Adicionado 'async' aqui
    if (formData?.whatsapp) {
      addUsedWhatsappNumber(formData.whatsapp);
      setHasSpun(true);

      if (result !== "NÃO FOI DESSA VEZ") {
        try {
          // Chamar a nova API para atualizar o cupom ganho no banco de dados
          await fetch('/api/update-coupon-won', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ whatsapp: formData.whatsapp, coupon: result }),
          });
          toast.success("Cupom salvo no seu registro!");
        } catch (error) {
          console.error("Erro ao salvar o cupom no banco de dados:", error);
          toast.error("Erro ao salvar o cupom. Por favor, anote-o!");
        }
      }
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
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/banner.png')" }}
    >
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader className="text-center">
          <Image
            src="/logo.png"
            alt="Parmegiana Crocante Logo"
            width={200}
            height={100}
            className="mx-auto mb-4 h-auto"
            priority
          />
          <CardTitle className="text-3xl font-bold">Roleta de Cupons!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Preencha seus dados para girar a roleta e ganhar um desconto!
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-16">
            <div className="flex-shrink-0">
              <SpinWheel
                segments={couponSegments}
                onSpinEnd={handleSpinEnd}
                disabled={!formData || hasSpun}
              />
            </div>

            <div className="w-full md:w-1/2 max-w-sm">
              <CouponForm onFormSubmit={handleFormSubmit} onDbSubmitSuccess={handleDbSubmitSuccess} />
            </div>
          </div>
        </CardContent>
      </Card>

      {formData && wonCoupon && wonCoupon !== "NÃO FOI DESSA VEZ" && (
        <CouponResultDialog
          isOpen={isResultDialogOpen}
          onClose={handleCloseResultDialog}
          coupon={wonCoupon}
          whatsappNumber={STORE_WHATSAPP_NUMBER}
          userName={formData.name}
        />
      )}
      <Toaster />
    </div>
  );
}