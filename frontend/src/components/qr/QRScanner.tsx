import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type ScanMode = 'camera' | 'gallery';

interface QRScannerProps {
  onScan: (data: string) => void;
  onError?: (error: string) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onError }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<ScanMode>('camera');
  const [isProcessing, setIsProcessing] = useState(false);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!containerRef.current) return;

    await stopScanner();

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          if (errorMessage.includes('NotFoundException')) return;
          onError?.(errorMessage);
        }
      );
    } catch (err) {
      onError?.(err instanceof Error ? err.message : String(err));
    }
  }, [onScan, onError, stopScanner]);

  const scanFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setGalleryPreview(URL.createObjectURL(file));

      try {
        const tempScanner = new Html5Qrcode('qr-reader-hidden');
        const result = await tempScanner.scanFile(file, true);
        await tempScanner.clear();
        onScan(result);
      } catch {
        onError?.('No se pudo detectar un código QR en la imagen');
      } finally {
        setIsProcessing(false);
      }
    },
    [onScan, onError]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) scanFile(file);
    },
    [scanFile]
  );

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const switchMode = async (newMode: ScanMode) => {
    if (newMode === mode) return;
    setGalleryPreview(null);
    setMode(newMode);

    if (newMode === 'camera') {
      setTimeout(() => startCamera(), 100);
    } else {
      await stopScanner();
    }
  };

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    return () => {
      stopScanner();
    };
  }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => switchMode('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
            mode === 'camera'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Cámara
        </button>
        <button
          onClick={() => switchMode('gallery')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
            mode === 'gallery'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Galería
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Hidden element for gallery QR scanning */}
      <div id="qr-reader-hidden" className="hidden" />

      {/* Camera Mode */}
      {mode === 'camera' && (
        <div className="relative">
          <div
            id="qr-reader"
            ref={containerRef}
            className="w-full rounded-xl overflow-hidden"
          />
          {/* Scanner Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 border-2 border-primary-500 rounded-xl" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Gallery Mode */}
      {mode === 'gallery' && (
        <div className="space-y-4">
          {galleryPreview ? (
            <div className="relative">
              <img
                src={galleryPreview}
                alt="QR seleccionado"
                className="w-full rounded-xl object-contain max-h-64"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="bg-white rounded-lg px-6 py-3 flex items-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-gray-700 font-medium">Escaneando...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleGalleryClick}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary-400 hover:bg-primary-50 transition-all"
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-gray-500 font-medium">Toca para seleccionar imagen</span>
              <span className="text-gray-400 text-sm">Busca el código QR en tu galería</span>
            </button>
          )}

          {galleryPreview && !isProcessing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setGalleryPreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="flex-1 py-3 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-all"
              >
                Otra imagen
              </button>
              <button
                onClick={handleGalleryClick}
                className="flex-1 py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all"
              >
                Seleccionar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
