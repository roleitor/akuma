import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.akuma.qrvalidator',
  appName: 'Akuma QR Validator',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Camera: {
      permissions: ['camera'],
    },
    Geolocation: {
      permissions: ['location'],
    },
  },
};

export default config;
