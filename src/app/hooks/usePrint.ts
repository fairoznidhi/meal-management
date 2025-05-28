import { useCallback } from "react";

export const usePrint = () => {
  const handlePrint = useCallback((element: HTMLElement | null) => {
    if (element) {
      const printContents = element.innerHTML;
      const printWindow = window.open("", "_blank");
      printWindow?.document.write(`
        <html>
          <head><title>Print</title></head>
          <body>${printContents}</body>
        </html>
      `);
      printWindow?.document.close();
      printWindow?.focus();
      printWindow?.print();
      printWindow?.close();
    }
  }, []);

  return { handlePrint };
};



