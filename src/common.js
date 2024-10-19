/**
 * IME 입력을 사용하는 언어(KR, JP, CH)의 경우, v-model 사용 시 입력값이 한 글자씩 지연되는 현상 존재<p>
 * 따라서 IME 입력 언어는 v-model 대신 @input 사용하여 view to data로의 양방향 바인딩을 직접 구현
 */
export function onInput(event) {
  this.hashtagValue = event.target.value;
}

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