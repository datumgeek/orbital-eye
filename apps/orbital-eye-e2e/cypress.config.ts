import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: { default: 'nx run orbital-eye:start' },
      ciWebServerCommand: 'nx run orbital-eye:serve-static',
    }),
    baseUrl: 'http://localhost:3000',
  },
});
