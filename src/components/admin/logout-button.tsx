"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success("Logout realizado com sucesso!");
        router.push('/admin/login');
        router.refresh(); // Refresh to clear server-side session
      } else {
        toast.error("Erro ao fazer logout.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Erro de rede ao fazer logout.");
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
      <LogOut className="h-4 w-4" /> Sair
    </Button>
  );
}