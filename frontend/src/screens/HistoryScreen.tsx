import React from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { useVerificationStore } from '../stores/useVerificationStore';

export const HistoryScreen: React.FC = () => {
  const { history } = useVerificationStore();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Historial" showBack />
      <div className="p-4">
        {history.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500">No hay verificaciones en el historial</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {history.map((item, index) => (
              <Card key={index}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        item.result === 'VALID'
                          ? 'bg-success/10'
                          : item.result === 'REVOKED'
                          ? 'bg-warning/10'
                          : 'bg-danger/10'
                      }`}
                    >
                      {item.result === 'VALID' ? (
                        <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : item.result === 'REVOKED' ? (
                        <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{item.document_id}</p>
                      <p className="text-sm text-gray-500">{item.technician_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      {new Date(item.verification_date).toLocaleDateString()}
                    </p>
                    <p
                      className={`text-xs font-medium ${
                        item.result === 'VALID'
                          ? 'text-success'
                          : item.result === 'REVOKED'
                          ? 'text-warning'
                          : 'text-danger'
                      }`}
                    >
                      {item.result === 'VALID' ? 'VÁLIDO' : item.result === 'REVOKED' ? 'REVOCADO' : 'INVÁLIDO'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
