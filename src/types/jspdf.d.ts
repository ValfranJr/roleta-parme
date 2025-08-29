declare module "jspdf" {
  export class jsPDF {
    constructor(options?: any);
    setFontSize(size: number): void;
    text(text: string, x: number, y: number): void;
    save(filename: string): void;
    autoTable?: (options: any) => void;
  }
}

declare module "jspdf-autotable" {
  // Este módulo adiciona o método autoTable ao jsPDF
  // Não precisa de exportações específicas
}
