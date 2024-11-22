import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { useReactToPrint } from "react-to-print";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose, productId }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    pageStyle: `
      @media print {
        @page {
          size: 58mm 100mm; /* Tamaño pequeño tipo ticket para impresión */
          margin: 5mm;
        }
        html, body {
          width: 58mm;
          height: 100mm;
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden;
          -webkit-print-color-adjust: exact;
        }
        .print-container {
          width: 100%;
          height: auto;
          page-break-inside: avoid;
          page-break-after: avoid;
        }
      }
    `,
    onAfterPrint: () => console.log("Printed successfully"),
  });

  if (!isOpen) return null;

  /* const productUrl = `https://tu-sitio.com/product/${productId}`;
   */
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-30"
      onClick={onClose}
    >
      <div
        className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white print-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Código QR</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="mt-4 flex flex-col items-center " ref={contentRef}>
          <QRCode value={productId} size={300} />{" "}
          <p className="mt-2">{productId}</p>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={() => handlePrint()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Imprimir QR
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrModal;
