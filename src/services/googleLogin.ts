import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getIdToken, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { firebaseConfig } from './firebaseConfig';

export async function getGoogleIdToken(): Promise<string> {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const credential = await signInWithPopup(auth, provider);
  try {
    return await getIdToken(credential.user, true);
  } finally {
    // BOBIARE conserva únicamente su JWT; no mantiene otra sesión de Firebase Auth.
    await signOut(auth).catch(() => {});
  }
}
