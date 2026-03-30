import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'cct',
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'rsbuild dev',
      build: 'rsbuild build',
    },
  },
  permissions: [],
  outdir: 'dist',
  brand: {
    displayName: 'CCT - Claude Code Team',
    icon: '',
    primaryColor: '#BA7517',
    bridgeColorMode: 'inverted',
  },
  webViewProps: {
    type: 'partner',
  },
});
