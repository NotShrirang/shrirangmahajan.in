import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 6000,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        // Don't precache onnxruntime-web's WASM artifacts (~20MB each);
        // they're pulled from CDN at runtime via ort.env.wasm.wasmPaths.
        // Also skip index.html — we serve it via NetworkFirst below so
        // a Vercel deploy is visible immediately, not after a hard refresh.
        globPatterns: ['**/*.{js,css,svg,png,ico,woff,woff2,ttf}'],
        globIgnores: ['**/index.html'],
        navigateFallback: null,
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        // New SW takes over immediately, purges stale caches.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // HTML / navigation — always try network first so a fresh deploy
            // shows up on the next page load. Falls back to cached HTML
            // after a 3s timeout (offline mode).
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages',
              networkTimeoutSeconds: 3,
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 8 },
            },
          },
          {
            // Hashed JS/CSS chunks — content-addressed, safe to cache long.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && /\/assets\/.+\.(js|css|woff2?|ttf)$/.test(url.pathname),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.pathname.search('api.github.com') !== -1,
            handler: 'CacheFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache the TinyGPT ONNX so subsequent visits are instant.
            urlPattern: ({ url }) =>
              url.hostname === 'huggingface.co' && url.pathname.endsWith('.onnx'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'tinygpt-onnx',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 4, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
      manifest: {
        name: 'Shrirang Mahajan Portfolio',
        short_name: 'Shrirang Mahajan',
        description: 'Shrirang Mahajan | Full-Stack AI Developer & Machine Learning Engineer from India. Portfolio showcases projects like QuillGPT (LLM fine-tuning), LoomRAG (multimodal RAG), and Sonnet (LangChain chatbots). Expertise in PyTorch, TensorFlow, Python, FastAPI, and React. Building scalable AI solutions for real-world problems. Explore projects with live demos and code samples.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
      },
    })
  ],
})