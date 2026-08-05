import type { CapacitorConfig } from '@capacitor/cli';

/**
 * capacitor.config.ts — Capacitor Mobile App Configuration
 *
 * This config wraps the Vite build output (dist/) into a native Android/iOS app.
 *
 * ── GETTING STARTED WITH CAPACITOR ──────────────────────────────────────────
 *
 * Prerequisites:
 *   - Android: Android Studio installed (https://developer.android.com/studio)
 *   - iOS: Xcode on macOS (https://developer.apple.com/xcode/)
 *
 * One-time setup (run these in order):
 *   1. npm run build                 → builds the Vite web app to dist/
 *   2. npx cap add android           → scaffolds the android/ native project
 *   3. npx cap add ios               → (optional, macOS only) scaffolds ios/
 *   4. npx cap sync                  → copies dist/ into the native project
 *   5. npx cap open android          → opens in Android Studio to run/build APK
 *
 * Daily dev workflow (after initial setup):
 *   npm run cap:sync                → builds + syncs in one command
 *   npm run cap:android             → builds + syncs + opens Android Studio
 *
 * Live reload during development (optional):
 *   Uncomment the `server.url` line below and set your machine's local IP.
 *   The native app will load from your Vite dev server instead of dist/.
 * ─────────────────────────────────────────────────────────────────────────────
 */
const config: CapacitorConfig = {
  appId: 'com.biosense.collar',
  appName: 'BioSense',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
    // ── DEV LIVE RELOAD (optional) ──────────────────────────────────────────
    // Uncomment to point the native app at your Vite dev server.
    // Replace with your actual machine IP (run `ipconfig` to find it).
    // url: 'http://192.168.1.100:5173',
    // cleartext: true
  },
  plugins: {
    // ── Firebase Push Notifications (activate when Firebase is set up) ────
    // PushNotifications: {
    //   presentationOptions: ['badge', 'sound', 'alert']
    // },
    // ── Capacitor SplashScreen ────────────────────────────────────────────
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a', // slate-950 — matches app dark bg
      androidSplashResourceName: 'splash',
      showSpinner: false
    },
    // ── Status Bar styling ────────────────────────────────────────────────
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0f172a'
    }
  }
};

export default config;
