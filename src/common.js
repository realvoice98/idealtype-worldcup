// 프로젝트 전역에서 공통으로 사용되는 유틸리티 함수들의 모음

/**
 * 날짜 포맷 함수
 * @param date 형식을 변환할 날짜
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