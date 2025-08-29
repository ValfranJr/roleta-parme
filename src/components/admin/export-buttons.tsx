"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import client-side libraries
import { stringify } from "csv-stringify/sync";
import * as XLSX from "xlsx";

interface CouponUser {
  id: number;
  name: string;
  whatsapp: string;
  coupon_won: string | null;
  created_at: string;
}

interface ExportButtonsProps {
  users: CouponUser[];
}

export function ExportButtons({ users }: ExportButtonsProps) {
  const [isPdfLoading, setIsPdfLoading] = useState(false); // Novo estado para o carregamento do PDF

  const formattedData = users.map((user) => ({
    ID: user.id,
    Nome: user.name,
    WhatsApp: user.whatsapp,
    "Cupom Ganho": user.coupon_won || "Não girou",
    "Data de Registro": format(new Date(user.created_at), "dd/MM/yyyy HH:mm", {
      locale: ptBR,
    }),
  }));

  const exportToCsv = () => {
    try {
      if (formattedData.length === 0) {
        toast.info("Não há dados para exportar para CSV.");
        return;
      }
      const csv = stringify(formattedData, { header: true });
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "coupon_users.csv");
      document.body.appendChild(link); // Necessário para Firefox
      link.click();
      document.body.removeChild(link); // Limpar
      toast.success("Dados exportados para CSV!");
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Falha ao exportar para CSV.");
    }
  };

  const exportToXlsx = () => {
    try {
      if (formattedData.length === 0) {
        toast.info("Não há dados para exportar para XLSX.");
        return;
      }
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Usuários");
      XLSX.writeFile(wb, "coupon_users.xlsx");
      toast.success("Dados exportados para XLSX!");
    } catch (error) {
      console.error("Error exporting to XLSX:", error);
      toast.error("Falha ao exportar para XLSX.");
    }
  };

  const exportToPdf = async () => {
    if (formattedData.length === 0) {
      toast.info("Não há dados para exportar para PDF.");
      return;
    }

    setIsPdfLoading(true);
    try {
      // Verificar se estamos no navegador
      if (typeof window === "undefined") {
        toast.error("Exportação PDF só está disponível no navegador.");
        return;
      }

      // Importar jsPDF de forma dinâmica
      const jsPDFModule = await import("jspdf");
      const jsPDF = jsPDFModule.jsPDF;

      // Importar jspdf-autotable
      await import("jspdf-autotable");

      // Criar documento PDF
      const doc = new jsPDF();

      // Preparar dados
      const headers = Object.keys(formattedData[0]);
      const data = formattedData.map((row) => Object.values(row));

      // Adicionar título
      doc.setFontSize(16);
      doc.text("Relatório de Usuários da Roleta", 14, 15);

      // Verificar se autoTable está disponível
      if (typeof (doc as any).autoTable !== "function") {
        // Fallback: criar PDF simples sem tabela
        doc.setFontSize(12);
        let yPosition = 30;

        // Adicionar cabeçalhos
        doc.setFontSize(10);
        doc.text("ID", 14, yPosition);
        doc.text("Nome", 30, yPosition);
        doc.text("WhatsApp", 80, yPosition);
        doc.text("Cupom", 130, yPosition);
        doc.text("Data", 170, yPosition);

        yPosition += 10;

        // Adicionar dados
        formattedData.forEach((row, index) => {
          if (yPosition > 280) {
            (doc as any).addPage();
            yPosition = 20;
          }

          doc.setFontSize(8);
          doc.text(String(row.ID), 14, yPosition);
          doc.text(String(row.Nome), 30, yPosition);
          doc.text(String(row.WhatsApp), 80, yPosition);
          doc.text(String(row["Cupom Ganho"]), 130, yPosition);
          doc.text(String(row["Data de Registro"]), 170, yPosition);

          yPosition += 8;
        });

        doc.save("coupon_users.pdf");
        toast.success("Dados exportados para PDF (formato simples)!");
        return;
      }

      // Adicionar tabela usando autoTable
      (doc as any).autoTable({
        head: [headers],
        body: data,
        startY: 25,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      });

      // Salvar arquivo
      doc.save("coupon_users.pdf");
      toast.success("Dados exportados para PDF!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error(
        "Falha ao exportar para PDF. Verifique o console para mais detalhes."
      );
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToCsv}
        variant="outline"
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" /> CSV
      </Button>
      <Button
        onClick={exportToXlsx}
        variant="outline"
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" /> XLSX
      </Button>
      <Button
        onClick={exportToPdf}
        variant="outline"
        className="flex items-center gap-1"
        disabled={isPdfLoading}
      >
        {isPdfLoading ? (
          "Carregando..."
        ) : (
          <>
            <Download className="h-4 w-4" /> PDF
          </>
        )}
      </Button>
    </div>
  );
}
