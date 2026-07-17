import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-primary-700 text-white px-4 py-3 shadow-lg">
      <div className="flex items-center">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="mr-3 p-1 hover:bg-primary-600 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
    </header>
  );
};
