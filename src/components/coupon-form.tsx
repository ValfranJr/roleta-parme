"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const promoText = process.env.NEXT_PUBLIC_PROMO_TEXT;

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  whatsapp: z
    .string()
    .regex(
      /^\d{10,11}$/,
      "Número de WhatsApp inválido (apenas números, com DDD)."
    ),
});

interface CouponFormProps {
  onFormSubmit: (data: { name: string; whatsapp: string }) => void;
  onDbSubmitSuccess: (whatsapp: string) => void; // New prop for successful DB submission
}

export function CouponForm({
  onFormSubmit,
  onDbSubmitSuccess,
}: CouponFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      whatsapp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/submit-coupon-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok && response.status !== 200) {
        // 200 for already registered
        throw new Error(data.error || "Failed to save data");
      }

      if (
        response.status === 200 &&
        data.message === "WhatsApp number already registered"
      ) {
        toast.warning(
          "Este número de WhatsApp já está registrado. Você pode girar a roleta."
        );
      } else {
        toast.success(
          "Dados enviados e salvos! Agora você pode girar a roleta."
        );
      }
      onFormSubmit(values);
      onDbSubmitSuccess(values.whatsapp); // Notify parent about successful DB submission
    } catch (error) {
      console.error("Error submitting form to DB:", error);
      toast.error("Erro ao salvar seus dados. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seu Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="whatsapp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp (com DDD)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 11987654321" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Liberar Roleta
        </Button>
      </form>
      {promoText && (
        <h1 className="mt-5 text-center text-xs font-medium text-red-600 dark:text-red-400">
          {promoText}
        </h1>
      )}
    </Form>
  );
}
