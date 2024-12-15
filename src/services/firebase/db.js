import { firebaseApp } from '@/services/firebase/config';
import { getDatabase, ref as dbRef, set, get, update, runTransaction, push, query, orderByChild, remove as rm  } from 'firebase/database';
import { getStorage, ref as stRef, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
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
      level: 1,
      levelReq: 100,
      exp: 0,
      role: 'user', // 일반 사용자
      profileImage:'',
    });
    alert("회원가입 완료!");
    console.log('유저 정보를 저장하였습니다.', user);
  } catch(e) {
    alert("회원가입 실패! 잠시 후 다시 시도해주세요.");
    console.error('유저 정보를 저장하지 못했습니다.', e);
  }
}

/**
 * 로그인 시 lastLoginedAt 업데이트 함수
 * @param {string} uid 사용자 UID
 */
export async function updateLastLogin(uid) {
  const userRef = dbRef(db, 'users/' + uid);

  try {
    await update(userRef, {
      lastLoginedAt: formatDate(new Date()),
    });
  } catch (e) {
    console.error('lastLoginedAt 업데이트 실패:', e);
  }
}

/**
 * 레벨 업 함수
 * @param {String} uid 사용자 아이디
 * @param {Number} exp 경험치
 */
export async function updateLevel(uid, exp) {
  const userRef = dbRef(db, `users/${uid}`);

  try {
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      console.error("사용자를 찾을 수 없습니다.");
      return;
    }

    const user = userSnapshot.val();
    let { level, levelReq, exp: currentExp } = user;

    currentExp += exp;

    const calculateRequiredExp = (level, baseExp = 100, expFactor = 1.2) => {
      return Math.floor(baseExp * Math.pow(expFactor, level - 1));
    };

    while (currentExp >= levelReq) {
      currentExp -= levelReq;
      level++;

      levelReq = calculateRequiredExp(level);
    }

    const updates = {
      'level': level,
      'exp': currentExp,
      'levelReq': levelReq,
    };

    await update(userRef, updates);

  } catch (error) {
    console.error("레벨 업데이트 중 오류 발생:", error);
  }
}

/**
 * 닉네임 가져오기 함수
 * @param {string} uid 사용자 UID
 * @returns {Promise<string>} 닉네임 (존재하지 않을 경우 빈 문자열 반환)
 */
export async function fetchNickname(uid) {
  const userRef = dbRef(db, `users/${uid}/nickname`);

  try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.warn(`닉네임 정보가 없습니다: UID ${uid}`);
      return '';
    }
  } catch (error) {
    console.error('닉네임을 가져오는 중 오류가 발생했습니다:', error);
    throw error; // 필요 시 호출한 곳에서 처리할 수 있도록 오류 재발생
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

      return Object.keys(usersData)
          .filter(uid => uid !== 'anonymous-uid')
          .map(uid => ({
            uid,
            ...usersData[uid],
            email: restoreToOriginalString(usersData[uid].email),
          }));
    } else {
      return [];
    }
  } catch (e) {
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

    const exp = 50
    await updateLevel(user.uid, exp);

    // alert("월드컵 생성 완료!");
    console.log('월드컵 정보를 저장하였습니다.', wldcup);
    return true;
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

      // 데이터를 배열로 변환하며 creator의 프로필 이미지를 가져옴
      const promises = Object.keys(wldcupsData).map(async (key) => {
        const wldcup = wldcupsData[key];

        let profileImage = null;
        if (wldcup.creator) {
          try {
            const userSnapshot = await get(dbRef(db, `users/${wldcup.creatorId}/profileImage`));
            profileImage = userSnapshot.exists() ? userSnapshot.val() : null;
          } catch (e) {
            console.error(`사용자 프로필 이미지를 불러오는 중 오류 발생: ${wldcup.creator}`, e);
          }
        }
        return {
          wldcupId: key,
          ...wldcup, // child node data
          thumbnails: wldcup.images.slice(0, 2), // TODO: 사용자가 선택한 대표 이미지 1, 2 (현재는 전체 중 0, 1 idx)
          title: restoreToOriginalString(wldcup.title),
          updatedAt: new Date(wldcup.updatedAt).getTime(),
          profileImage,
        };
      });

      return Promise.all(promises);
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
 * 특정 월드컵 데이터를 가져오는 함수
 * @param {string} wldcupId 월드컵 ID
 * @returns {Promise<void>} 특정 월드컵의 전체 데이터
 */
export async function fetchWldcup(wldcupId) {
  const wldcupRef = dbRef(db, `wldcups/${wldcupId}`);

  try {
    const snapshot = await get(wldcupRef);
    if (snapshot.exists()) {
      const wldcupData = snapshot.val();

      return {
        ...wldcupData,
        title: restoreToOriginalString(wldcupData.title),
        details: restoreToOriginalString(wldcupData.details),
        hashtags: wldcupData.hashtags.map(item => restoreToOriginalString(item)),
      }
    } else {
      return {};
    }
  } catch(e) {
    console.error(e);
  }
}

/**
 * 특정 사용자가 좋아요한 월드컵 데이터를 가져오는 함수
 * @param {string} uid 사용자 UID
 * @returns {Promise<Array>} 좋아요한 월드컵 리스트
 */
export async function fetchLikedWldcups(uid) {
  try {
    // 유저 좋아요 데이터 경로 참조
    const userLikesRef = dbRef(db, `users/${uid}/myLikesWldcups`);

    // 유저 좋아요 데이터 조회
    const userSnapshot = await get(userLikesRef);

    if (!userSnapshot.exists()) {
      console.warn("좋아요한 월드컵이 없습니다.");
      return [];
    }

    const userLikes = userSnapshot.val();
    const likedWorldcupIds = Object.keys(userLikes);

    if (likedWorldcupIds.length === 0) {
      console.warn("좋아요한 월드컵이 없습니다.");
      return [];
    }

    const wldcupPromises = likedWorldcupIds.map(async (wldcupId) => {
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

    const likedWldcupsArray = (await Promise.all(wldcupPromises)).filter(Boolean);

    likedWldcupsArray.sort((a, b) => b.views - a.views);

    return likedWldcupsArray.map((wldcup) => ({
      ...wldcup,
      views: numberFormat.format(wldcup.views),
      updatedAt: relativeTimeFormat.format(
          Math.ceil((new Date(wldcup.updatedAt) - new Date()) / (1000 * 60 * 60 * 24)),
          'day'
      ),
    }));
  } catch (error) {
    console.error("좋아요한 월드컵 데이터를 가져오는 중 오류가 발생했습니다:", error);
    return {
      result: -1,
      message: '좋아요한 월드컵 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
    };
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
 * 승리한 아이템의 승률 데이터를 업데이트하는 함수<p>
 * 승리자 선택 시 호출
 * @param {string} wldcupId 월드컵 ID
 * @param {string} itemName 아이템명
 * @param {boolean} win 매치 승리 유무
 * @param {boolean} champ
 * @returns {Promise<void>}
 */
export async function updateItemStats(wldcupId, itemName, win = false, champ = false) {
  const imagesRef = dbRef(db, `wldcups/${wldcupId}/images`);
  // NOTE: wldcups 경로 내 아이템 내장 데이터(이미지 경로, 이름)가 0부터 시작하는 index 안에 담겨 있어,
  //       이 함수를 호출하는 단에서 실제 index가 몇 번인지 직접적으로 매핑시킬 수 없는 기술적 한계가 있음.
  //       따라서, 현재 월드컵 내에 방금 선택한 아이템과 일치하는 이름을 가진 아이템이 있는지 뒤져서 실제 index를 추출함
  //       이 경우, 아이템 명이 중복된 값이 있으면 오류 반환될 수 있음.
  // TODO: 이미지 생성 모달 내 함수에서 중복이름 할당 못하도록 validation을 하던가 해야할 듯

  try {
    // 현재 월드컵 내 모든 이미지 아이템 추출 (매핑되는 index 찾기 위해)
    const snapshot = await get(imagesRef);
    if (!snapshot.exists()) {
      return;
    }

    const images = snapshot.val();

    // 현재 월드컵 내 모든 아이템 중, 현재 선택한 아이템의 이름과 매핑되는 아이템의 index 찾기
    let selectedIndex = -1;
    for (let index in images) {
      if (images[index].customName === itemName) {
        selectedIndex = index;
        break;
      }
    }

    // 매핑되는 아이템이 없는 경우, 그냥 예외 처리
    if (selectedIndex === -1) {
      console.error('아이템 정보를 찾을 수 없습니다.');
      return;
    }

    // 기존 통계 데이터 불러오기
    const statsRef = dbRef(db, `wldcups/${wldcupId}/images/${selectedIndex}/stats`);
    const statsSnapshot = await get(statsRef);
    let stats = statsSnapshot.val();

    // 기존 데이터가 없는 경우, 기본 값으로 초기화
    if (!stats) stats = {
      enterCnt: 0,
      matchCnt: 0,
      winCnt: 0,
      champCnt: 0,
    };

    stats.enterCnt += 1; // TODO: 중도 하차 했다가 나중에 불러오기로 오면 또 카운트 시키는거라.. 이 부분 트리거를 어떻게 판단해야 할 지... 애매해서 나중에 하는 걸로
    stats.matchCnt += 1;

    if (win) stats.winCnt += 1;
    if (champ) stats.champCnt += 1;

    await update(statsRef, stats);
  } catch(e) {
    console.error(e);
  }
}

/**
 * 승리한 아이템의 승률 데이터를 가져오는 함수
 * 승리자 선택 시 호출
 * @param {string} wldcupId 월드컵 ID
 * @param {string} itemName 아이템명
 * @returns {Promise<void>}
 */

export async function fetchItemStats(wldcupId) {
  const imagesRef = dbRef(db, `wldcups/${wldcupId}/images`);

  try {
    const snapshot = await get(imagesRef);

    if (snapshot.exists()) {
      const allData = snapshot.val(); // 전체 데이터 가져오기
      console.log("snapshot.val()", allData);

      // stats가 있는 항목만 필터링
      const filteredData = allData.filter(item => item.stats !== undefined);

      // stats가 있는 항목이 하나도 없으면 false 반환
      if (filteredData.length === 0) {
        return false;
      }

      // stats가 있는 데이터 반환
      return filteredData;
    } else {
      return false; // 데이터가 존재하지 않으면 false 반환
    }
  } catch (e) {
    console.error("데이터 가져오는 중 오류 발생:", e);
    return false; // 에러 발생 시 false 반환
  }
}

/**
 * 특정 월드컵에 대한 댓글 데이터를 받아오는 함수
 * @param {string} wldcupId 월드컵 ID
 */
export async function fetchWldcupComments(wldcupId) {
  const commentsRef = dbRef(db, `comments/${wldcupId}`);

  try {
    const snapshot = await get(commentsRef);
    if (snapshot.exists()) {
      const commentsData = snapshot.val();

      return Object.keys(commentsData)
          .map(key => ({
            id: key,
            ...commentsData[key],
          }))
          .sort((a, b) => new Date(b.timestamp) -new Date( a.timestamp));
    } else {
      return [];
    }
  } catch (e) {
    console.error("댓글을 가져오는 데 오류가 발생했습니다:", e);
    return null;
  }
}

/**
 * 월드컵에 댓글을 작성하는 함수
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @param {string} commentText 댓글 내용
 * @returns {Promise<void>} 댓글 데이터를 DB에 저장
 */
export async function createComment(user, wldcupId, commentText) {
  const commentsRef = dbRef(db, `comments/${wldcupId}`);

  try {
    const newCommentRef = push(commentsRef);

    // 댓글 정보 저장
    await set(newCommentRef, {
      uid: user.uid,                        // 유저 고유 id
      nickName: user.nickname,              // 닉네임
      text: commentText,                    // 댓글 내용
      timestamp: formatDate(new Date()),    // 댓글 작성 시간
    });

    await set(dbRef(db, `users/${user.uid}/myCommentList/${wldcupId}/${newCommentRef.key}`), true);

    if (user.uid !== 'anonymous-uid') {
      const exp = 5;
      await updateLevel(user.uid, exp);
    }

  } catch (e) {
    alert("댓글 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    console.error('댓글 작성 실패:', e);
  }
}

/**
 * 월드컵에 작성된 댓글을 삭제하는 함수
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @param {string} commentId 삭제할 댓글의 ID
 * @returns {Promise<void>} 댓글 데이터와 관련 유저 데이터를 삭제
 */
export async function deleteComment(user, wldcupId, commentId) {
  const commentRef = dbRef(db, `comments/${wldcupId}/${commentId}`);
  const userCommentRef = dbRef(db, `users/${user.uid}/myCommentList/${wldcupId}/${commentId}`);

  try {
    await rm(commentRef);
    await rm(userCommentRef);
  } catch (e) {
    alert("댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    console.error('댓글 삭제 실패:', e);
  }
}

/**
 * 내가 단 모든 댓글들을 가져오는 함수
 * @param {Object} user 유저 정보
 * @returns {Promise<Array>} 댓글 목록
 */
export async function fetchMyComments(uid) {
  const userCommentsRef = dbRef(db, `users/${uid}/myCommentList/`);

  try {
    const snapshot = await get(userCommentsRef);
    const myComments = [];
    const wldcupIds = snapshot.val();

    if (!wldcupIds) {
      return [];
    }

    for (const wldcupId in wldcupIds) {
      const commentIds = wldcupIds[wldcupId];

      for (const commentId in commentIds) {
        const commentRef = dbRef(db, `comments/${wldcupId}/${commentId}`);
        const commentSnapshot = await get(commentRef);

        const wldcupRef = dbRef(db, `wldcups/${wldcupId}`);
        const wldcupSnapshot = await get(wldcupRef);


        if (commentSnapshot.exists()) {
          const commentData = commentSnapshot.val();
          myComments.push({
            wldcupId,                                 // 월드컵 ID
            title: wldcupSnapshot.val().title,        // 월드컵 제목
            commentId,                                // 댓글 ID
            nickName: commentData.nickName,           // 닉네임
            text: commentData.text,                   // 댓글 내용
            timestamp: commentData.timestamp,         // 댓글 작성 시간
          });
        }
      }
    }

    return myComments;
  } catch (e) {
    console.error("댓글 가져오기 실패:", e);
    return [];
  }
}

/**
 * 월드컵 좋아요 상태를 토글하는 함수
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @param {boolean} isLiked 현재 좋아요 상태
 * @returns {Promise<void>} 좋아요 데이터를 DB에 저장/삭제
 */
export async function toggleLike(user, wldcupId) {
  const likeRef = dbRef(db, `users/${user.uid}/myLikesWldcups/${wldcupId}`);
  const likeCountRef = dbRef(db, `wldcups/${wldcupId}/likeCount`);

  try {
    const snapshot = await get(likeRef);
    if (snapshot.val() === null) {
      await set(likeRef, true);
      const likeCountSnapshot = await get(likeCountRef);
      const newLikeCount = (likeCountSnapshot.val() || 0) + 1;
      await set(likeCountRef, newLikeCount);
    } else {
      await rm(likeRef);
      const likeCountSnapshot = await get(likeCountRef);
      const newLikeCount = Math.max(0, (likeCountSnapshot.val() || 0) - 1);  // 0 미만으로 내려가지 않도록 처리
      await set(likeCountRef, newLikeCount);
    }

  } catch (e) {
    alert("좋아요 설정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    console.error("좋아요 토글 실패:", e);
  }
}

/**
 * 특정 유저의 월드컵 좋아요 데이터를 불러오는 함수
 * @param {Object} user 유저 정보
 * @returns {Promise<Object>} 좋아요한 월드컵 ID 리스트 (key-value 형태로 반환)
 */
export async function getLikedWorldcups(user) {
  const likesRef = dbRef(db, `users/${user.uid}/myLikesWldcups`);

  try {
    const snapshot = await get(likesRef);

    if (snapshot.val() !== null) {
      return snapshot.val();
    } else {
      return {};
    }
  } catch (e) {
    alert("좋아요 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    console.error("좋아요 데이터 불러오기 실패:", e);
    return {};
  }
}

/**
 * 월드컵 조회수를 1 증가시키는 함수
 * @param {string} wldcupId 월드컵 ID
 * @returns {Promise<void>} 현재 월드컵의 조회수 1 증가
 */
export async function increaseInViews(wldcupId) {
  // TODO: 어뷰징 방지를 위해 기진입 IP에 대해 3분의 대기 시간 부여

  const wldcupViewsRef = dbRef(db, `wldcups/${wldcupId}/views`);

  try {
    // 조회수는 동시성 문제 발생 가능성이 있어 update 사용하지 않고 transaction 사용
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

export async function createReport(uid, wldcupId, reportComment) {
  const reportsRef = dbRef(db, `wldcups/${wldcupId}/reports`);

  try {
    const newReportRef = push(reportsRef);

    await set(newReportRef, {
      uid: uid,
      reportComment: reportComment,
      timestamp: formatDate(new Date()),
    });
  } catch (e) {
    alert("신고 작성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    console.error('신고 작성 실패:', e);
  }
}

/**
 * 월드컵 새로시작 시, 최대 라운드 설정 및 초기 데이터를 삽입하는 함수
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @param {number} round n강
 * @param {Object} matches 모든 1:1 매치
 * @returns {Promise<void>}
 */
export async function initWldcupProgress(user, wldcupId, round, matches) {
  const inPrgrsWldcupRef = dbRef(db, `inPrgrsWldcups/${wldcupId}/${user.uid}`);

  try {
    await set(inPrgrsWldcupRef, {
      round,
      matches: { [round]: matches },
    });
  } catch(e) {
    console.error(e);
  }
}

/**
 * 월드컵 진행 상태를 업데이트하는 함수<p>
 * 특정 유저가 각 매치 별로 승자를 결정할 때 호출
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @param {any} currentRound 현재 라운드
 * @param {any} currentMatch 현재 매치
 * @param {any} selectedWinner 현재 매치의 승자
 * @returns {Promise<void>} 월드컵 진행 상태 업데이트 (현재 매치의 승자 데이터 적재)
 */
export async function updateWldcupProgress(user, wldcupId, currentRound, currentMatch, selectedWinner) {
  const matchKey = `match${currentMatch - 1}`;
  const winnerData = {
    winner: {
      title: selectedWinner.title,
      path: selectedWinner.path,
    },
  };

  try {
    const matchRef = dbRef(db, `inPrgrsWldcups/${wldcupId}/${user.uid}/matches/${currentRound}/${matchKey}`);

    await update(matchRef, winnerData);
  } catch(e) {
    console.error(e);
  }
}

/**
 * 현재 월드컵에 대한 진행 이력을 제거하는 함수<p>
 * 특정 유저가 월드컵 우승자를 결정했을 때 호출
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @returns {Promise<void>} 기진행 이력 제거
 */
export async function removeWldcupProgress(user, wldcupId) {
  const userProgressRef = dbRef(db, `inPrgrsWldcups/${wldcupId}/${user.uid}`);

  try {
    await rm(userProgressRef);
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
  const inProgressWldcupRef = dbRef(db, `inPrgrsWldcups/${wldcupId}/${user.uid}`);

  try {
    const snapshot = await get(inProgressWldcupRef);
    return snapshot.exists(); // true or false
  } catch (e) {
    console.error('오류: 진행 중인 월드컵 목록을 불러오지 못했습니다.', e);
  }
}

/**
 * 특정 월드컵에 대한 진행 이력 데이터를 불러오는 함수
 * @param {Object} user 유저 정보
 * @param {string} wldcupId 월드컵 ID
 * @returns {Promise<void>}
 */
export async function fetchInProgressWldcup(user, wldcupId) {
  const inProgressWldcupRef = dbRef(db, `inPrgrsWldcups/${wldcupId}/${user.uid}`);

  try {
    const snapshot = await get(inProgressWldcupRef);

    if (snapshot.exists()) {
      return snapshot.val(); // 진행 데이터를 객체 형태로 반환
    } else {
      return null; // 진행 데이터가 없으면 null 반환
    }
  } catch(e) {
    console.error(e);
    throw e; // 오류를 상위 호출자에게 전달
  }
}

/**
 * 월드컵 삭제 함수
 * @param {string} wldcupId 현재 진입한 월드컵의 UID
 */
export async function deleteWldcup(uid,wldcupId) {
  const wldcupRef = dbRef(db, `wldcups/${wldcupId}`);
  const commentsRef = dbRef(db, `comments/${wldcupId}`);
  const myWldcupsRef = dbRef(db, `users/${uid}/myWldcups/${wldcupId}`);

  try {
    await rm(wldcupRef);
    await rm(commentsRef); //TODO: 댓글 삭제되는지 테스트 필요
    await rm(myWldcupsRef);
  }catch (e){
    console.error('오류: 월드컵을 삭제하지 못했습니다.', e)
  }
}

/**
 * 월드컵 수정 및 업데이트 함수
 * @param {number} index 인덱스 번호
 * @param {string} wldcupId 월드컵 ID
 * @param {Array<{ path: string, customName: string }>} images 업데이트할 이미지 배열
 * @returns {Promise<void>}
 */
export async function updateWldcupImages(index, wldcupId, images) {
  const wldcupImageRef = dbRef(db, `wldcups/${wldcupId}/images/${index}`);

  try {
    const extractFileName = (url) => {
      try {
        const urlObject = new URL(url);
        const pathname = urlObject.pathname;
        return decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1));
      } catch (error) {
        console.error('URL 파싱 중 오류:', error);
        return '';
      }
    };

    const snapshot = await get(wldcupImageRef);

    //이미 존재하면
    if (snapshot.exists()) {
      const existingData = snapshot.val();
      const { path: existingPath, customName: existingCustomName } = existingData;

      const existingFileName = extractFileName(existingPath);
      const newFileName = extractFileName(images[index].path);

      const newPath = images[index].path;
      const newCustomName = images[index].customName;

      //파일명이 같고
      //NOTE: 파일명으로 구분하는게 맞나 싶은데 마땅한게 안떠오름
      if (newFileName === existingFileName) {
        if (newCustomName !== existingCustomName) { //커스텀네임은 다르다면
          await update(wldcupImageRef, { customName: newCustomName });
          console.log(`인덱스 ${index}: 커스텀 네임 업데이트`);
        } else {
          console.log(`인덱스 ${index}: 변경 사항 없음.`);
        }
      } else {
        // 둘 다 다르면 모두 업데이트
        await update(wldcupImageRef, { path: newPath, customName: newCustomName });
        console.log(`인덱스 ${index}: 경로 및 커스텀 네임 업데이트`);
      }
    } else {
      // 인덱스 번호가 없으면 새로 추가
      const newPath = images[index].path;
      const newCustomName = images[index].customName;
      await set(wldcupImageRef, { path: newPath, customName: newCustomName });
      console.log(`인덱스 ${index}:이미지 추가`);
    }
  } catch (error) {
    console.error(`인덱스 ${index} 업데이트 중 오류 발생:`, error);
    throw new Error(`이미지 업데이트 중 오류가 발생했습니다.`);
  }
}

/**
 * 유저 프로필 수정 함수
 * @param {string} uid 사용자 ID
 * @param {String} updateType 업데이트할 프로필
 * @param {String} updateContent 업데이트할 내용
 * @returns {Promise<void>}
 */
export async function updateProfile(uid, updateType,updateContent){
  const usersRef = dbRef(db, `users/${uid}`);

  try {
    await update(usersRef, {
      [updateType]: updateContent,
    });
  }catch (e){
    console.error(e);
  }
}

/**
 * 유저 프로필 이미지 수정 함수
 * @param {string} uid 사용자 ID
 * @param {string} path 이미지 경로
 * @returns {Promise<void>}
 */
export async function updateProfileImage(uid, path){
  const usersRef = dbRef(db, `users/${uid}`);

  try {
    await update(usersRef, {profileImage: path});
  }catch (e){
    console.error(e);
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

/**
 * 프로필 이미지 업로드 처리 후 경로 반환 함수
 * @param {File} image 이미지 파일 객체
 * @param {String} userId 사용자 UID
 * @return {Promise<string>} 업로드된 이미지의 참조 경로
 */
export async function uploadProfile(image, userId) {
  const userRef = stRef(st, `users/${userId}/profileImage`);

  try {
    try {
      await deleteObject(userRef);
      console.log('기존 이미지 삭제 완료');
    } catch (deleteError) {
      if (deleteError.code === 'storage/object-not-found') {
        console.log('삭제 대상 파일이 없습니다. 스킵합니다.');
      } else {
        throw deleteError;
      }
    }
    await uploadBytes(userRef, image);
    return await getDownloadURL(userRef);
  } catch (e) {
    console.error('이미지 업로드 실패:', e);
    throw new Error('이미지 업로드 중 오류가 발생했습니다.');
  }
}

/**
 * 이미지 삭제 함수
 * @param {Object} userId 사용자 UID
 * @param {string} wldcupTitle 월드컵 제목
 */
export async function deleteImages(userId, wldcupTitle) {
  const wldcupsRef = stRef(st, `wldcups/${userId}/${wldcupTitle}`)

  try {
    const res = await listAll(wldcupsRef);
    const deletePromises = res.items.map(item => deleteObject(item));

    await Promise.all(deletePromises);
  }catch (e){
    console.error("파일 삭제 중 오류 발생:", e);
  }
}

/**
 * 이미지 업데이트 처리 후 경로 반환 함수
 * @param {File} image 이미지 파일 객체
 * @param {string} userId 사용자 UID
 * @param {string} wldcupTitle 월드컵 제목
 * @return {Promise<string>} 업로드된 이미지의 참조 경로
 */
export async function updateImage(image, userId, wldcupTitle) {
  const basePath = `wldcups/${userId}/${wldcupTitle}`;
  const fileName = image.customName ? `${image.customName}` : image.name;
  const filePath = `${basePath}/${fileName}`;

  try {
    const wldcupsRef = stRef(st, filePath);

    // 기존 파일 삭제 (존재하는 경우에만)
    try {
      await deleteObject(wldcupsRef);
      console.log('기존 이미지 삭제 완료');
    } catch (deleteError) {
      if (deleteError.code === 'storage/object-not-found') {
        console.log('삭제 대상 파일이 없습니다. 스킵합니다.');
      } else {
        throw deleteError;
      }
    }

    // 새 파일 업로드
    await uploadBytes(wldcupsRef, image);
    console.log('새로운 이미지 업로드 완료:', fileName);

    // 다운로드 URL 반환
    return await getDownloadURL(wldcupsRef);
  } catch (e) {
    console.error('이미지 업데이트 실패:', e);
    throw new Error('이미지 업데이트 중 오류가 발생했습니다.');
  }
}