import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.botpanel.app',
  appName: 'BotPanel',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
