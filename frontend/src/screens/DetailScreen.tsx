import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { QRPayload } from '../types';

export const DetailScreen: React.FC = () => {
  const location = useLocation();
  const transaction = location.state?.transaction as QRPayload;

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Detalles" showBack />
        <div className="p-4">
          <Card>
            <p className="text-center text-gray-500">No hay datos disponibles</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Detalles del Documento" showBack />
      <div className="p-4 space-y-4">
        <Card>
          <h3 className="font-bold text-lg mb-4 text-gray-800">Información del Documento</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">ID Transacción</span>
              <span className="font-medium">{transaction.txn}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Cliente</span>
              <span className="font-medium">{transaction.cli}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Fecha</span>
              <span className="font-medium">{transaction.fec}</span>
            </div>
            {transaction.cam && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Campaña</span>
                <span className="font-medium">{transaction.cam}</span>
              </div>
            )}
            {transaction.loc && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Ubicación</span>
                <span className="font-medium">{transaction.loc}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Timestamp</span>
              <span className="font-medium">{new Date(transaction.ts * 1000).toLocaleString()}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4 text-gray-800">Información de Seguridad</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Versión</span>
              <span className="font-medium">{transaction.v}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Firma Digital</span>
              <span className="font-medium text-xs break-all">{transaction.sig.substring(0, 30)}...</span>
            </div>
          </div>
        </Card>

        <Card className="bg-success/10 border-2 border-success">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-success mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="font-semibold text-success">Documento Verificado</p>
              <p className="text-sm text-gray-600">La firma digital es válida</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
