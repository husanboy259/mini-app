/// <reference types="vite/client" />

interface TelegramWebApp {
  initData?: string;
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  themeParams?: Record<string, string>;
  setBackgroundColor?: (color: string) => void;
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp;
  };
}
