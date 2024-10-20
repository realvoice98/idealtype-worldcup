// 프로젝트 전역에서 공통으로 사용되는 유틸리티 함수들의 모음

/**
 * 날짜 포맷 함수
 * @param {Date} date 형식을 변환할 날짜 데이터
 * @returns {string} YYYY-MM-DD TT:MM:SS
 */
export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Firebase Realtime DB의 JSON 트리 경로 참조 시
 * 경로 탐색 구분자로 오인될 수 있는 문자열을 유니크한 문자열로 변환해주는 함수
 *
 * DB에 저장할 문자열 데이터가 금지 문자가 포함될 경우 사용
 *
 * @param {string} value '.', '$', '#', '[', ']', '/'이 포함된 문자열
 * @return {string} 탐색 구분자로 사용되는 문자들을 각자 매핑된 유니크한 문자로 변환한 문자열
 */
export function convertToValidNodeString(value) {
  return value
    .replaceAll('.', '__DOT__')
    .replaceAll('$', '__DOLLAR__')
    .replaceAll('#', '__HASH__')
    .replaceAll('[', '__LBRACKET__')
    .replaceAll(']', '__RBRACKET__')
    .replaceAll('/', '__SLASH__');

  // TODO: Babel을 사용하기 때문에 ES12 문법인 replaceAll을 사용했으나,
  //  실제로 구형 브라우저에서도 변환 적용되는지는 추후 테스트 해봐야 함
  //  호환안 될 시 replace(regex)로 대체
}

/**
 * Firebase Realtime DB의 JSON 트리 경로 참조를 위해
 * 유니크한 문자로 변환된 문자를 원본 문자로 복구시키는 함수
 *
 * @param {string} value 유니크한 문자로 변환된 상태의 문자열
 * @return {string} 원본 문자열
 */
export function restoreToOriginalString(value) {
  return value
    .replaceAll('__DOT__', '.' )
    .replaceAll('__DOLLAR__', '$')
    .replaceAll('__HASH__', '#')
    .replaceAll('__LBRACKET__', '[')
    .replaceAll('__RBRACKET__', ']')
    .replaceAll('__SLASH__', '/');

  // TODO: Babel을 사용하기 때문에 ES12 문법인 replaceAll을 사용했으나,
  //  실제로 구형 브라우저에서도 변환 적용되는지는 추후 테스트 해봐야 함
  //  호환안 될 시 replace(regex)로 대체
}