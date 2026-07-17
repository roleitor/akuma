import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Verification, QRPayload } from '../types';

interface VerificationState {
  currentResult: {
    valid: boolean;
    transaction: QRPayload | null;
    reason: string;
  } | null;
  history: Verification[];
  isVerifying: boolean;

  setCurrentResult: (result: VerificationState['currentResult']) => void;
  clearCurrentResult: () => void;
  addToHistory: (verification: Verification) => void;
  setIsVerifying: (isVerifying: boolean) => void;
}

export const useVerificationStore = create<VerificationState>()(
  persist(
    (set) => ({
      currentResult: null,
      history: [],
      isVerifying: false,

      setCurrentResult: (result) => set({ currentResult: result }),
      clearCurrentResult: () => set({ currentResult: null }),
      addToHistory: (verification) =>
        set((state) => ({
          history: [verification, ...state.history].slice(0, 100),
        })),
      setIsVerifying: (isVerifying) => set({ isVerifying }),
    }),
    {
      name: 'verification-storage',
    }
  )
);
