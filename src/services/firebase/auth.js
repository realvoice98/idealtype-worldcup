import { firebaseApp } from '@/services/firebase/config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getRedirectResult
} from 'firebase/auth';

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebaseApp);

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getRedirectResult
};