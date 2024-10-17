import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref, set } from 'firebase/database';

const db = getDatabase(firebaseApp);

export const saveUserToDatabase = async (user) => {
  try {
    // FIXME: createdAt, lastLoginAt: 한국 표준 시간으로 변환 후 저장 (UTC +9:00)
    const kstOffset = 9 * 60 * 60 * 1000;

    await set(ref(db, 'users/' + user.uid), {
      email: user.email,
      emailVerified: user.emailVerified,
      createdAt: user.metadata.creationTime,
      lastLoginAt: user.metadata.lastSignInTime,
    });
    alert("회원가입 완료!");
    console.log('유저 정보를 저장하였습니다.', user);
  } catch(e) {
    alert("회원가입 실패! 잠시 후 다시 시도해주세요.");
    console.error('유저 정보를 저장하지 못했습니다.', e);
  }
}

export {
  db,
}