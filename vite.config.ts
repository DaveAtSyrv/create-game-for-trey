import { defineConfig } from 'vite';

export default defineConfig({
  base: '/create-game-for-trey/',
  build: {
    chunkSizeWarningLimit: 1500, // Phaser is large, suppress warning
  },
});
