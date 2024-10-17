import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref, set } from 'firebase/database';

const db = getDatabase(firebaseApp);

export const saveUserToDatabase = async (user) => {
  try {
    await set(retf(db, 'users/' + user.uid), {
      email: user.email,
      createdAt: user.metadata.creationTime,
      lastSignedAt: user.metadata.lastSignInTime,
    });
    console.log('유저 정보를 저장하였습니다.');
  } catch(e) {
    console.error('유저 정보를 저장하지 못했습니다.', e);
  }
}

export {
  db,
}