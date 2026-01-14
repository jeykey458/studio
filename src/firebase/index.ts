import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  const apps = getApps();
  if (apps.length) {
    app = apps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }
  auth = getAuth(app);
  firestore = getFirestore(app);
  return { app, auth, firestore };
}
