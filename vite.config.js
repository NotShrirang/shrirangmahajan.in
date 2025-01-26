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
        runtimeCaching: [{
          urlPattern: ({ url }) => {
            return url.pathname.search('api.github.com') !== -1;
          },
          handler: 'CacheFirst',
          options: {
            cacheName: 'api-cache',
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }]
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