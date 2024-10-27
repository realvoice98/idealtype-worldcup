/*
 * Firebase Realtime Database는 JSON 트리 구조를 사용하므로,
 * 경로 참조 시 아래와 같은 문자의 사용은 경로 탐색 구분자로 오인될 수 있어 허용하지 않는다.
 * '.', '$', '#', '[', ']', '/'
 */

import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from 'firebase/database';
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
  try{
    const worldcupID = formatDate(new Date(Date.now()));
    await set(ref(db, `worldcups/${userID}/${worldcupID}`),{
      title: worldcupData.title,
      details: worldcupData.details,
      hashtags: worldcupData.hashtags,
      images: worldcupData.images,
      createdAt: formatDate(new Date()),
    });
    alert("월드컵 생성 완료!");
    console.log('월드컵 정보를 저장하였습니다.', worldcupData);
  }catch (e){
    alert("월드컵 생성 실패! 잠시 후 다시 시도해주세요.");
    console.error('월드컵 정보를 저장하지 못했습니다.', e);
  }
}

/**
 * 모든 월드컵 데이터를 가져오는 함수
 * @returns {Promise<Object[]>} 모든 월드컵 객체가 담긴 하나의 배열 데이터
 */
export async function fetchAllWorldcups() {
  try {
    // TODO: DB로부터 모든 월드컵 데이터 가져오기 { Array<Object> }
    return [
      {
        title: "[고화질, 움짤] 한국 여자 아이돌 월드컵 256강",
        views: "1.9만회",
        updatedAt: "1개월",
        worldcupLink: "/worldcup?token0",
      },
      {
        title: "내 아내로 삼고 싶은 애니 여캐 월드컵 1024강",
        views: "3만회",
        updatedAt: "2주",
        worldcupLink: "/worldcup?token1",
      },
      {
        title: "가장 역겨운 프로그래밍 언어 월드컵",
        views: "1.2천회",
        updatedAt: "6일",
        worldcupLink: "/worldcup?token2",
      },
    ];
  } catch(e) {
    console.error('알 수 없는 오류: 월드컵 목록을 불러오지 못했습니다.');
    return {
      result: -1,
      message: '알 수 없는 오류가 발생하여 월드컵 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
    }
  }
}