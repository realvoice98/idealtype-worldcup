import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref as dbRef, set, get, push, query, orderByChild, equalTo } from 'firebase/database';
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
  const myWldcupsRef = dbRef(db, `users/${user.uid}/myWldcups`);

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

    // users.uid.myWldcups.wldcupId[]
    await set(myWldcupsRef, {
      // FIXME: 현재는 월드컵을 등록할 때마다 가장 최근에 등록한 월드컵의 UID로 필드가 초기화됨.
      //  초기화가 아닌 배열 push 형식으로 append 되어야 함
      id: newWldcupRef.key // 월드컵 ID
    });

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
export async function fetchAllWldcups(filter) {
  const wldcupsRef = dbRef(db, "wldcups");

  let wldcupsQuery;
  if (filter === "popular") {
    wldcupsQuery = query(wldcupsRef, orderByChild("views")); // 조회수 기준 정렬
  } else if (filter === "latest") {
    wldcupsQuery = query(wldcupsRef, orderByChild("updatedAt")); // 업데이트 기준 정렬
  }

  try {
    const snapshot = await get(wldcupsQuery);

    if (snapshot.exists()) {
      const wldcupsData = snapshot.val();

      // 데이터를 배열로 변환
      const wldcupsArray = Object.keys(wldcupsData).map((key) => ({
        wldcupId: key,
        ...wldcupsData[key], // child node data
        thumbnails: wldcupsData[key].images.slice(0, 2), // TODO: 사용자가 선택한 대표 이미지 1, 2 (현재는 전체 중 0, 1 idx)
        title: restoreToOriginalString(wldcupsData[key].title),
        views: Number(wldcupsData[key].views), // 조회수는 숫자로 변환
        updatedAt: new Date(wldcupsData[key].updatedAt), // Date 객체로 변환
      }));

      if (filter === "popular") {
        wldcupsArray.sort((a, b) => b.views - a.views);
      } else if (filter === "latest") {
        wldcupsArray.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }

      // 포맷 적용 후 반환
      return wldcupsArray.map((wldcup) => ({
        ...wldcup,
        views: numberFormat.format(wldcup.views),
        updatedAt: relativeTimeFormat.format(
          Math.ceil((new Date(wldcup.updatedAt) - new Date()) / (1000 * 60 * 60 * 24)), "day"
        ),
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
 * 현재 진입한 월드컵에 대한 진행 이력이 존재하는지 체크하는 함수
 * @param {Object} user 현재 유저 정보
 * @param {String} wldcupId 현재 진입한 월드컵의 UID
 * @returns {Boolean} 현재 진입한 월드컵에 대한 진행 이력 유무
 */
export async function checkInProgressWldcup(user, wldcupId) {
  const inProgressWldcupRef = dbRef(db, `users/${user.uid}/inProgressWldcups`);
  
  // TODO: query()를 통해 wldcupId와 매칭되는 값만 추출하여 return

  try {
    const snapshot = await get(inProgressWldcupRef);

    if (snapshot.exists()) {
      const inProgressWldcupData = snapshot.val();

      // TODO: 테스트
      return Object.keys(inProgressWldcupData).filter(wldcupId => inProgressWldcupData[wldcupId].id === wldcupId);
    } else {
      return false;
    }
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