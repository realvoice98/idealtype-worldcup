import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref, set } from 'firebase/database';
import { formatDate } from "@/common";

export const db = getDatabase(firebaseApp);

export async function saveUserToDatabase(user) {
  try {
    await set(ref(db, 'users/' + user.uid), {
      email: user.email,
      createdAt: formatDate(new Date(user.metadata.creationTime)),
      lastLoginAt: formatDate(new Date(user.metadata.lastSignInTime)),
      emailVerified: user.emailVerified,
    });
    alert("회원가입 완료!");
    console.log('유저 정보를 저장하였습니다.', user);
  } catch(e) {
    alert("회원가입 실패! 잠시 후 다시 시도해주세요.");
    console.error('유저 정보를 저장하지 못했습니다.', e);
  }
}