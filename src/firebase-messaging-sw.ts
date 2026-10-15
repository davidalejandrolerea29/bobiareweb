import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging/sw';
import { firebaseConfig, firebaseReady } from './services/firebaseConfig';

// Firebase muestra en segundo plano el notification payload enviado por FCM
// y abre webpush.fcm_options.link cuando el usuario pulsa el aviso.
if (firebaseReady) {
  getMessaging(initializeApp(firebaseConfig));
}
