import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref as dbRef, set, get, runTransaction, push, query, orderByChild, equalTo } from 'firebase/database';
import { getStorage, ref as stRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { formatDate, convertToValidNodeString, restoreToOriginalString} from '@/common';

const db = getDatabase(firebaseApp);
const st = getStorage(firebaseApp);

const language = 'ko'; // navigator.language: 사용자가 브라우저에 설정한 언어 속성 사용
const numberFormat = new Intl.NumberFormat(language, {
  notation: 'compact', // ex. 9744642 => 9.7M
});
const relativeTimeFormat = new Intl.RelativeTimeFormat(language, {
  numeric: 'auto',
});



/**
 * Firebase Realtime Database
 *
 * JSON 트리 구조를 사용하므로, 경로 참조 시 아래와 같은 문자의 사용은
 * 경로 탐색 구분자로 오인될 수 있어 허용하지 않는다.
 * '.', '$', '#', '[', ']', '/'
 *
 * 따라서 위 문자가 포함된 값은 반드시 convertToValidNodeString()으로 포맷 후 db에 적재하고,
 * 포맷된 값을 가져온 값은 restoreToOriginalString()으로 다시 원복하여 사용한다.
 */

/**
 * 회원가입 요청 처리 함수
 * @param {Object} user 회원가입 정보
 */
export async function createUser(user) {
  const userRef = dbRef(db, 'users/' + user.uid);

  try {
    await set(userRef, {
      email: convertToValidNodeString(user.email),
      nickname: user.nickname,
      birthday: user.birthday,
      gender: user.gender,
      createdAt: formatDate(new Date(user.metadata.creationTime)),
      lastLoginedAt: formatDate(new Date(user.metadata.lastSignInTime)),
      emailVerified: true,// TODO: 이메일 인증
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
 * 단일 유저 정보를 조회하는 함수
 * @param {Object} user 유저 정보
 */
export async function getUser(user) {
  const userRef = dbRef(db, 'users/' + user.uid);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists) {
      const userData = snapshot.val();
      return {
        ...userData,
        email: restoreToOriginalString(userData.email),
        emailVerified: userData.emailVerified ? 'Y' : 'N',
      };
    } else {
      return null;
    }
  } catch(e) {
    console.error('사용자 정보를 찾을 수 없습니다.');
  }
}

/**
 * 전체 유저 정보를 조회하는 함수
 * @returns {Promise<Array>} 모든 유저 정보 배열
 */
export async function getAllUsers() {
  const usersRef = dbRef(db, 'users');

  try {
    const snapshot = await get(usersRef);

    if (snapshot.exists()) {
      const usersData = snapshot.val();
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
 * 월드컵 생성 요청 처리 함수
 * @param {Object} user
 * @param {Object} wldcup 월드컵 상세 데이터
 * @returns {Promise<void>} DB에 월드컵 데이터 추가
 */
export async function createWldcup(user, wldcup) {
  const wldcupsRef = dbRef(db, 'wldcups');

  try {
    const newWldcupRef = push(wldcupsRef); // push: unique ID 생성

    // wldcups.wldcupID
    await set(newWldcupRef, {
      title: convertToValidNodeString(wldcup.title),
      details: wldcup.details,
      hashtags: wldcup.hashtags.map(item => convertToValidNodeString(item)),
      images: wldcup.images.map(image => ({
        path: image.path, // 업로드된 이미지 경로
        customName: image.customName, // 사용자 입력 이름
      })),
      views: 0,
      creator: user.nickname,
      creatorId: user.uid,
      updatedAt: formatDate(new Date()),
    });

    // users.uid.myWldcups.wldcupId
    const wldcupId = newWldcupRef.key;
    const myWldcupsRef = dbRef(db, `users/${user.uid}/myWldcups/${wldcupId}`);
    await set(myWldcupsRef, true); // Object.key() 통해서 실제 데이터 경로 참조위한 key 값만 사용할 것이므로 value는 flag로 주입

    alert("월드컵 생성 완료!");
    console.log('월드컵 정보를 저장하였습니다.', wldcup);
  } catch(e) {
    alert("월드컵 생성 실패! 잠시 후 다시 시도해주세요.");
    console.error('월드컵 정보를 저장하지 못했습니다.', e, wldcup);
  }
}

/**
 * 모든 월드컵 데이터를 가져오는 함수
 * @returns {Promise<Object[]>} 모든 월드컵 객체가 담긴 하나의 배열 데이터
 */
export async function fetchAllWldcups() {
  const wldcupsRef = dbRef(db, "wldcups");

  const wldcupsQuery = query(wldcupsRef, orderByChild("views")); //초기값은 인기순 정렬

  try {
    const snapshot = await get(wldcupsQuery);

    if (snapshot.exists()) {
      const wldcupsData = snapshot.val();

      // 데이터를 배열로 변환
      return Object.keys(wldcupsData).map((key) => ({
        wldcupId: key,
        ...wldcupsData[key], // child node data
        thumbnails: wldcupsData[key].images.slice(0, 2), // TODO: 사용자가 선택한 대표 이미지 1, 2 (현재는 전체 중 0, 1 idx)
        title: restoreToOriginalString(wldcupsData[key].title),
        views: Number(wldcupsData[key].views), // 조회수는 숫자로 변환
        updatedAt: new Date(wldcupsData[key].updatedAt).getTime()
      }));

    } else {
      return [];
    }
  } catch(e) {
    console.error('알 수 없는 오류: 월드컵 목록을 불러오지 못했습니다.', e);
    return {
      result: -1,
      message: '알 수 없는 오류가 발생하여 월드컵 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
    }
  }
}
/**
 * 특정 사용자가 만든 월드컵 데이터를 가져오는 함수
 * @param {string} uid 사용자 ID
 * @returns {Promise<Object[]>} 사용자가 생성한 월드컵 객체 배열
 */
export async function fetchUserWldcups(uid) {
  const userWldcupsRef = dbRef(db, `users/${uid}/myWldcups`);

  try {
    const userSnapshot = await get(userWldcupsRef);

    if (!userSnapshot.exists()) {
      return [];
    }

    const userWldcupsData = userSnapshot.val();
    const wldcupIds = Object.keys(userWldcupsData);

    const wldcupPromises = wldcupIds.map(async (wldcupId) => {
      const wldcupSnapshot = await get(dbRef(db, `wldcups/${wldcupId}`));
      if (wldcupSnapshot.exists()) {
        const wldcupData = wldcupSnapshot.val();
        return {
          wldcupId,
          ...wldcupData,
          title: restoreToOriginalString(wldcupData.title),
          views: Number(wldcupData.views),
          updatedAt: new Date(wldcupData.updatedAt),
          thumbnails: wldcupData.images.slice(0, 2),
        };
      } else {
        return null;
      }
    });

    const userWldcupsArray = (await Promise.all(wldcupPromises)).filter(Boolean);

    userWldcupsArray.sort((a, b) => b.views - a.views);

    return userWldcupsArray.map((wldcup) => ({
      ...wldcup,
      views: numberFormat.format(wldcup.views),
      updatedAt: relativeTimeFormat.format(
          Math.ceil((new Date(wldcup.updatedAt) - new Date()) / (1000 * 60 * 60 * 24)),
          'day'
      ),
    }));
  } catch (e) {
    console.error('알 수 없는 오류: 사용자 월드컵 목록을 불러오지 못했습니다.', e);
    return {
      result: -1,
      message: '알 수 없는 오류가 발생하여 월드컵 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.',
    };
  }
}
/**
 * 특정 월드컵에 대한 통계 데이터를 받아오는 함수
 * @param {string} wldcupId 월드컵 ID
 * @returns {Promise<Object[]> | null} 모든 후보에 대한 승패 통계 데이터 세트
 */
export async function fetchWldcupStats(wldcupId) {
  const statsRef = dbRef(db, `wldcups/${wldcupId}/stats`);

  try {
    const snapshot = await get(statsRef);
    if (snapshot.exists()) {
      const statsData = snapshot.val();

      // TODO: 테스트
      return Object.keys(statsData).map(key => ({
        ...statsData[key],
      }));
      // 기대 return
      // {
      //   { name: '프로미스나인 이채영', winCnt: 10, loseCnt: 2, champCnt: 3 },
      //   { name: '엔믹스 해원', winCnt: 7, loseCnt: 4, champCnt: 1 },
      // }
    } else {
      return null;
    }
  } catch(e) {
    console.error(e);
  }
}

/**
 * 월드컵 조회수를 1 증가시키는 함수
 */
export async function increaseInViews(user, wldcupId) {
  // TODO: 어뷰징 방지를 위해 기진입 USER 세션의 경우 3분의 대기 시간을 부여

  const wldcupViewsRef = dbRef(db, `wldcups/${wldcupId}/views`);

  try {
    await runTransaction(wldcupViewsRef, (currentViews) => {
      if (currentViews === null) {
        return 1; // assert로 도달할 수 없는 (아마도...)
      }
      return currentViews + 1;
    });
  } catch(e) {
    console.error(e);
  }
}

/**
 * 월드컵의 현재 진행도를 저장하는 함수
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @returns
 */
export async function saveWldcupProgress(user, wldcupId) {
  const inProgressWldcupRef = dbRef(db, `users/${user.uid}/inProgressWldcup/${wldcupId}`);

  try {
    await set(inProgressWldcupRef, {
      // totalTournaments: 256, // 월드컵 시작 전 선택한 n강 토너먼트
      // currentTournaments: 128, // 128을 다 채우면 64, 32... 4(준결승전), 2(결승전)
      // items: [
      //   {
      //     index: 1,
      //     name: '엔믹스 해원',
      //   },
      //   {
      //     index: 2,
      //     name: '프로미스나인 백지헌',
      //   },
      // ]
    });
  } catch(e) {
    console.error(e);
  }
}

/**
 * 현재 진입한 월드컵에 대한 진행 이력이 존재하는지 체크하는 함수
 * @param {Object} user 현재 유저 정보
 * @param {string} wldcupId 현재 진입한 월드컵의 UID
 * @returns {boolean} 현재 진입한 월드컵에 대한 진행 이력 유무
 */
export async function checkInProgressWldcup(user, wldcupId) {
  // NOTE: 진행률 저장 API 생성 후 정상적인 테스트 가능
  const inProgressWldcupRef = dbRef(db, `users/${user.uid}/inProgressWldcups/${wldcupId}`);

  try {
    // TODO: 어쨌든 뭔가 진행도라고 판단가능한 데이터가 있으면 true 처리
    const snapshot = await get(inProgressWldcupRef);
    return snapshot.exists(); // true or false
  } catch (e) {
    console.error('오류: 진행 중인 월드컵 목록을 불러오지 못했습니다.', e);
  }
}

/**
 * Firebase Storage
 *
 * 이미지, 오디오, 동영상의 원본 데이터는 Storage에 보관하고,
 * Realtime DB에서는 Storage 노드의 참조 경로를 작성하여 원본 데이터에 접근한다.
 *
 * 파일 업로드 시, 파일명은 클라이언트에서 전달해준 원본 파일명을 별도 가공 없이 그대로 사용하며,
 * JSON 구조가 아니므로 RTDB와 달리 convertValidNodeString()로 래핑하지 않는다.
 */

/**
 * 이미지 업로드 처리 후 경로 반환 함수
 * @param {File} image 이미지 파일 객체
 * @param {Object} userId 사용자 UID
 * @param {string} wldcupTitle 월드컵 제목
 * @return {Promise<string>} 업로드된 이미지의 참조 경로
 */
export async function uploadImage(image, userId, wldcupTitle) {
  const fileName = image.customName ? `${image.customName}_${image.name}` : image.name;

  const wldcupsRef = stRef(st, `wldcups/${userId}/${wldcupTitle}/${fileName}`);

  try {
    await uploadBytes(wldcupsRef, image);
    return await getDownloadURL(wldcupsRef);
  } catch (e) {
    console.error('이미지 업로드 실패:', e);
    throw new Error('이미지 업로드 중 오류가 발생했습니다.');
  }
}
