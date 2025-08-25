"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface CouponResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: string;
  whatsappNumber: string;
}

export function CouponResultDialog({
  isOpen,
  onClose,
  coupon,
  whatsappNumber,
}: CouponResultDialogProps) {
  const whatsappMessage = `Parabéns! Você ganhou o cupom: *${coupon}* 🎉 Use-o em sua próxima compra!`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold text-green-600 dark:text-green-400">
            🎉 Parabéns! 🎉
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-lg mt-4">
            Você ganhou um cupom de desconto!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-center my-6">
          <p className="text-4xl font-extrabold text-primary dark:text-primary-foreground">
            {coupon}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Aproveite seu desconto!
          </p>
        </div>
        <AlertDialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-3">
          <Button asChild className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Share2 className="mr-2 h-4 w-4" /> Enviar via WhatsApp
            </a>
          </Button>
          <AlertDialogCancel asChild>
            <Button onClick={onClose} className="w-full sm:w-auto" variant="outline">
              Fechar
            </Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}