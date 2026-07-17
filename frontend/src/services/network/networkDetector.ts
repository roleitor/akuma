import { Network } from '@capacitor/network';

export class NetworkDetector {
  private callback: ((connected: boolean) => void) | null = null;

  async init(): Promise<void> {
    Network.addListener('networkStatusChange', (status) => {
      if (this.callback) {
        this.callback(status.connected);
      }
    });
  }

  onStatusChange(callback: (connected: boolean) => void): void {
    this.callback = callback;
  }

  async isConnected(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  removeAllListeners(): void {
    Network.removeAllListeners();
  }
}

export const networkDetector = new NetworkDetector();
