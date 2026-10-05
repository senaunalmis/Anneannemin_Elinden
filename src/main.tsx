import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.tsx'

// Force PWA to check for updates and refresh immediately when new code is published
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Yeni sürüm bulundu, güncelleniyor...');
    window.location.reload();
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
