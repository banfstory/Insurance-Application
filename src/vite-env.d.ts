/// <reference types="vite/client" />

export {}

declare global {
  interface Window {
    dataLayer: any[]
  }
}