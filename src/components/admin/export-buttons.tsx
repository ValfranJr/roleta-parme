"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import client-side libraries
import { stringify } from "csv-stringify/sync";
import * as XLSX from "xlsx";

// Define types for jsPDF and autoTable to avoid TypeScript errors before dynamic import
type JsPDF = typeof import("jspdf").jsPDF;
interface AutoTable {
  (options: any): void;
}

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
  const [jsPDF, setJsPDF] = useState<JsPDF | null>(null);
  const [autoTableLoaded, setAutoTableLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import jsPDF and jspdf-autotable on the client side
    async function loadPdfLibraries() {
      try {
        const { jsPDF } = await import("jspdf");
        await import("jspdf-autotable"); // This extends jsPDF
        setJsPDF(() => jsPDF); // Store the constructor
        setAutoTableLoaded(true);
      } catch (error) {
        console.error("Failed to load PDF libraries:", error);
        toast.error("Erro ao carregar funcionalidades de PDF.");
      }
    }

    if (typeof window !== "undefined") {
      loadPdfLibraries();
    }
  }, []);

  const formattedData = users.map(user => ({
    ID: user.id,
    Nome: user.name,
    WhatsApp: user.whatsapp,
    "Cupom Ganho": user.coupon_won || 'Não girou',
    "Data de Registro": format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }),
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
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link); // Clean up
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

  const exportToPdf = () => {
    if (!jsPDF || !autoTableLoaded) {
      toast.info("As bibliotecas de PDF ainda estão carregando. Por favor, tente novamente em um momento.");
      return;
    }

    try {
      if (formattedData.length === 0) {
        toast.info("Não há dados para exportar para PDF.");
        return;
      }
      const doc = new jsPDF();
      const headers = Object.keys(formattedData[0]);
      const data = formattedData.map(row => Object.values(row));

      // Cast doc to any to access autoTable, as it's added dynamically
      (doc as any).autoTable({
        head: [headers],
        body: data,
        startY: 20,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
        margin: { top: 10, left: 10, right: 10, bottom: 10 },
      });

      doc.save("coupon_users.pdf");
      toast.success("Dados exportados para PDF!");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast.error("Falha ao exportar para PDF.");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={exportToCsv} variant="outline" className="flex items-center gap-1">
        <Download className="h-4 w-4" /> CSV
      </Button>
      <Button onClick={exportToXlsx} variant="outline" className="flex items-center gap-1">
        <Download className="h-4 w-4" /> XLSX
      </Button>
      <Button onClick={exportToPdf} variant="outline" className="flex items-center gap-1" disabled={!jsPDF || !autoTableLoaded}>
        <Download className="h-4 w-4" /> PDF
      </Button>
    </div>
  );
}