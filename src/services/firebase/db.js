/*
 * Firebase Realtime Database는 JSON 트리 구조를 사용하므로,
 * 경로 참조 시 아래와 같은 문자의 사용은 경로 탐색 구분자로 오인될 수 있어 허용하지 않는다.
 * '.', '$', '#', '[', ']', '/'
 */

import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref, set, get, push, query, orderByChild, equalTo } from 'firebase/database';
import {  formatDate, convertToValidNodeString, restoreToOriginalString} from "@/common";

const db = getDatabase(firebaseApp);

export async function saveUserToDatabase(user) {
  try {
    await set(ref(db, 'users/' + user.uid), {
      email: convertToValidNodeString(user.email),
      createdAt: formatDate(new Date(user.metadata.creationTime)),
      lastLoginedAt: formatDate(new Date(user.metadata.lastSignInTime)),
      emailVerified: true,
      role: 'user', // 일반 사용자
    });
    alert("회원가입 완료!");
    console.log('유저 정보를 저장하였습니다.', user);
  } catch(e) {
    alert("회원가입 실패! 잠시 후 다시 시도해주세요.");
    console.error('유저 정보를 저장하지 못했습니다.', e);
  }
}

/**
 * 전체 유저 정보를 조회하는 함수
 * @returns {Promise<Array>} 모든 유저 정보 배열
 */
export async function getAllUsers() {
  const usersRef = ref(db, 'users');

  try {
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();
      console.log(usersData);
      return Object.keys(usersData).map(uid => ({
        ...usersData[uid], // 모든 데이터를 object 형식으로 먼저 뿌리고, 포맷이 필요한 값들만 오버라이딩
        email: restoreToOriginalString(usersData[uid].email),
        emailVerified: usersData[uid].emailVerified ? 'Y' : 'N',
      }));
    } else {
      return [];
    }
  } catch(e) {
    console.error('유저 정보를 가져오는 중 오류가 발생하였습니다.', e);
    return [];
  }
}
/**
 * 월드컵 데이터 저장 함수
 *@param{String} userID
 *@param{Object} worldcupData
 */
export async function saveWorldcupToDatabase(userID, worldcupData){
  const worldcupsRef = ref(db, 'worldcups');
  const userRef = ref(db, `users/${userID}/myWorldcups`);

  try {
    const newWorldcupRef = push(worldcupsRef); // push: unique ID 생성
    const worldcupID = newWorldcupRef.key; // 월드컵 ID

    // worldcups.worldcupsID
    await set(newWorldcupRef, {
      title: worldcupData.title,
      details: worldcupData.details,
      hashtags: worldcupData.hashtags,
      images: worldcupData.images,
      views: 0,
      creator: userID, // FIXME: ID -> 닉네임으로 변경
      updatedAt: formatDate(new Date()),
    });

    // users.uid.myWorldcups.worldcupID
    await set(ref(db, `${userRef}/${worldcupID}`), {
      worldcupRef: newWorldcupRef, // title로 넣어야 할 지, id로 넣어야 할 지...
    });

    alert("월드컵 생성 완료!");
    console.log('월드컵 정보를 저장하였습니다.', worldcupData);
  } catch(e) {
    alert("월드컵 생성 실패! 잠시 후 다시 시도해주세요.");
    console.error('월드컵 정보를 저장하지 못했습니다.', e);
  }
}

/**
 * 모든 월드컵 데이터를 가져오는 함수
 * @returns {Promise<Object[]>} 모든 월드컵 객체가 담긴 하나의 배열 데이터
 */
export async function fetchAllWorldcups() {
  // TODO: order by filter param: popular(인기순), latest(최신순), old(오래된순)

  const worldcupsRef = ref(db, 'worldcups');
  const formatter = new Intl.NumberFormat(navigator.language, {
    // navigator.language: 사용자가 브라우저에 설정한 언어 속성 사용
    notation: 'compact' // ex. 9744642 => 9.7M
  });

  try {
    const snapshot = await get(worldcupsRef);

    if (snapshot.exists()) {
      const worldcupsData = snapshot.val();

      console.log(worldcupsData); // fixme: delete

      return Object.keys(worldcupsData).map(key => ({
        ...worldcupsData[key], // child node data
        views: formatter.format(worldcupsData.views),
        worldcupID: key,
      }));
    } else {
      return [];
    }
  } catch(e) {
    console.error('알 수 없는 오류: 월드컵 목록을 불러오지 못했습니다.');
    return {
      result: -1,
      message: '알 수 없는 오류가 발생하여 월드컵 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
    }
  }
}