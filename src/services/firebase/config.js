import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyDyuiSMwFBIyzXEp3zh59vBl4cjQEesu3E',
  authDomain: 'undefined-idealtype-worldcup.firebaseapp.com',
  databaseURL: 'https://undefined-idealtype-worldcup-default-rtdb.firebaseio.com',
  projectId: 'undefined-idealtype-worldcup',
  storageBucket: 'undefined-idealtype-worldcup.firebasestorage.app',
  messagingSenderId: '227787774992',
  appId: '1:227787774992:web:01510bab980d89ecd93e95'
};

const firebaseApp = initializeApp(firebaseConfig);

export {
  firebaseApp
}