import React from 'react';
import { Card } from '../common/Card';
import { QRPayload } from '../../types';

interface VerificationResultProps {
  valid: boolean;
  transaction: QRPayload | null;
  reason: string;
  onVerify?: () => void;
  onViewDetails?: () => void;
}

export const VerificationResult: React.FC<VerificationResultProps> = ({
  valid,
  transaction,
  reason,
  onVerify,
  onViewDetails,
}) => {
  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'OK':
        return 'Documento verificado correctamente';
      case 'FIRMA_INVÁLIDA':
        return 'Firma digital inválida - Documento posiblemente alterado';
      case 'NO_EN_BASE':
        return 'Documento no encontrado en la base de datos';
      case 'REVOCADO':
        return 'Este documento ha sido revocado';
      default:
        return 'Error desconocido';
    }
  };

  return (
    <Card className={`${valid ? 'border-2 border-success' : 'border-2 border-danger'}`}>
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            valid ? 'bg-success/10' : 'bg-danger/10'
          }`}
        >
          {valid ? (
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h3 className={`text-xl font-bold mb-2 ${valid ? 'text-success' : 'text-danger'}`}>
          {valid ? 'DOCUMENTO VÁLIDO' : 'DOCUMENTO INVÁLIDO'}
        </h3>

        <p className="text-gray-600 mb-4">{getReasonText(reason)}</p>

        {transaction && valid && (
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Transacción:</span>
              <span className="font-medium">{transaction.txn}</span>
              <span className="text-gray-500">Cliente:</span>
              <span className="font-medium">{transaction.cli}</span>
              <span className="text-gray-500">Fecha:</span>
              <span className="font-medium">{transaction.fec}</span>
              {transaction.cam && (
                <>
                  <span className="text-gray-500">Campaña:</span>
                  <span className="font-medium">{transaction.cam}</span>
                </>
              )}
              {transaction.loc && (
                <>
                  <span className="text-gray-500">Ubicación:</span>
                  <span className="font-medium">{transaction.loc}</span>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {onVerify && (
            <button
              onClick={onVerify}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Verificar Otro
            </button>
          )}
          {onViewDetails && valid && (
            <button
              onClick={onViewDetails}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
