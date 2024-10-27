// components/QrScannerModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (productId: string) => void;
}

const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && scannerRef.current) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        scannerRef.current.id,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        /* verbose= */ false
      );

      html5QrcodeScanner.render(
        (decodedText: string) => {
          // Manejar el resultado escaneado
          html5QrcodeScanner.clear().then(() => {
            onScanSuccess(decodedText);
          });
        },
        (errorMessage) => {
          // Ignorar errores de escaneo
          console.error(errorMessage);
        }
      );

      setScanner(html5QrcodeScanner);
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Escanear Código QR</h2>
          <button
            onClick={() => {
              if (scanner) {
                scanner.clear();
              }
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <div className="mt-4" id="qr-scanner" ref={scannerRef}></div>
      </div>
    </div>
  );
};

export default QrScannerModal;
