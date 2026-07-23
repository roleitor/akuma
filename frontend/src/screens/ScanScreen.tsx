import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { QRScanner } from '../components/qr/QRScanner';
import { VerificationResult } from '../components/verification/VerificationResult';
import { Card } from '../components/common/Card';
import { QRPayload } from '../types';
import { useVerificationStore } from '../stores/useVerificationStore';
import { syncManager } from '../services/sync/syncManager';

export const ScanScreen: React.FC = () => {
  const navigate = useNavigate();
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { setCurrentResult, addToHistory } = useVerificationStore();

  const decodeBase64 = (str: string): string => {
    try {
      return atob(str);
    } catch {
      return str;
    }
  };

  const handleScan = (data: string) => {
    try {
      const json = decodeBase64(data);
      const parsed: QRPayload = JSON.parse(json);

      if (!parsed.txn || !parsed.sig) {
        setError('QR inválido: faltan campos requeridos');
        return;
      }

      setScannedData(json);
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

  const handleReset = () => {
    setScannedData(null);
    setError(null);
  };

  const handleConfirm = async () => {
    const parsed: QRPayload = JSON.parse(scannedData!);
    setSaving(true);
    try {
      await syncManager.saveVerificationLocally({
        document_id: parsed.txn,
        technician_id: 'offline-user',
        technician_name: 'Usuario offline',
        verification_date: new Date().toISOString(),
        result: 'VALID',
      });

      addToHistory({
        id: 0,
        document_id: parsed.txn,
        technician_id: 'offline-user',
        technician_name: 'Usuario offline',
        verification_date: new Date().toISOString(),
        result: 'VALID',
        synced: false,
      });

      navigate('/');
    } catch (err) {
      console.error('[Scan] Error al guardar verificación:', err);
      setSaving(false);
    }
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
            onVerify={handleReset}
            onViewDetails={() => navigate('/details', { state: { transaction: parsed } })}
          />
          <div className="mt-4">
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="w-full bg-success hover:bg-success/80 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Confirmar verificación'}
            </button>
          </div>
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
            Escanea con la cámara o selecciona una imagen de tu galería
          </p>
          <QRScanner onScan={handleScan} onError={handleError} />
        </Card>

        {error && (
          <Card className="border-2 border-danger">
            <div className="text-center">
              <svg
                className="w-12 h-12 text-danger mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-danger font-semibold">{error}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
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
