"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import client-side libraries
import { stringify } from "csv-stringify/sync";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // This extends jsPDF

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
    try {
      if (formattedData.length === 0) {
        toast.info("Não há dados para exportar para PDF.");
        return;
      }
      const doc = new jsPDF();
      const headers = Object.keys(formattedData[0]);
      const data = formattedData.map(row => Object.values(row));

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
      <Button onClick={exportToPdf} variant="outline" className="flex items-center gap-1">
        <Download className="h-4 w-4" /> PDF
      </Button>
    </div>
  );
}