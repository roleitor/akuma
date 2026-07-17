import React from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';

export const SettingsScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Configuración" showBack />
      <div className="p-4 space-y-4">
        <Card>
          <h3 className="font-bold text-lg mb-4 text-gray-800">Información de la App</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Versión</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Plataforma</span>
              <span className="font-medium">{navigator.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Estado</span>
              <span className="font-medium text-success">Conectado</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4 text-gray-800">Seguridad</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Clave Pública</span>
              <span className="font-medium text-xs">Cargada</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Última Sincronización</span>
              <span className="font-medium">Nunca</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4 text-gray-800">Almacenamiento</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-gray-500">Documentos Locales</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Verificaciones Pendientes</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
