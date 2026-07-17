import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { QRScanner } from '../components/qr/QRScanner';
import { VerificationResult } from '../components/verification/VerificationResult';
import { Card } from '../components/common/Card';
import { QRPayload } from '../types';
import { useVerificationStore } from '../stores/useVerificationStore';

export const ScanScreen: React.FC = () => {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setCurrentResult } = useVerificationStore();

  const handleScan = (data: string) => {
    try {
      const parsed: QRPayload = JSON.parse(data);

      if (!parsed.txn || !parsed.sig) {
        setError('QR inválido: faltan campos requeridos');
        return;
      }

      setScannedData(data);
      setCurrentResult({
        valid: true,
        transaction: parsed,
        reason: 'OK',
      });
    } catch {
      setError('Error al decodificar el QR');
    }
  };

  const handleError = (errorMessage: string) => {
    console.error('QR Error:', errorMessage);
  };

  if (scannedData) {
    const parsed: QRPayload = JSON.parse(scannedData);
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Resultado" showBack />
        <div className="p-4">
          <VerificationResult
            valid={true}
            transaction={parsed}
            reason="OK"
            onVerify={() => {
              setScannedData(null);
              setError(null);
            }}
            onViewDetails={() => navigate('/details', { state: { transaction: parsed } })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Escanear QR" showBack />
      <div className="p-4">
        <Card className="mb-4">
          <p className="text-center text-gray-600 mb-4">
            Apunte la cámara al código QR del documento
          </p>
          <QRScanner onScan={handleScan} onError={handleError} />
        </Card>

        {error && (
          <Card className="border-2 border-danger">
            <div className="text-center">
              <svg className="w-12 h-12 text-danger mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-danger font-semibold">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-4 text-primary-600 hover:text-primary-700"
              >
                Intentar de nuevo
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
