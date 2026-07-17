import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Escanear QR',
      description: 'Verificar un documento escaneando su código QR',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
      path: '/scan',
      color: 'bg-primary-100 text-primary-600',
    },
    {
      title: 'Historial',
      description: 'Ver historial de verificaciones realizadas',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/history',
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Configuración',
      description: 'Ajustes de la aplicación',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Akuma QR Validator" />

      <div className="p-4">
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <h2 className="text-xl font-bold mb-2">Bienvenido</h2>
            <p className="text-primary-100">
              Seleccione una opción para comenzar a verificar documentos.
            </p>
          </Card>
        </div>

        <div className="space-y-4">
          {menuItems.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(item.path)}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${item.color}`}>
                  {item.icon}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
