// CSS 변수, DOM event, Web Storage를 하나의 사용자 기능으로 연결했습니다.
const THEME_STORAGE_KEY = 'skala-theme';
const themeRoot = document.documentElement;
const themeToggle = document.querySelector('#theme-toggle');
const themeLabel = themeToggle?.querySelector('.theme-label');

function readSavedTheme() {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === 'night' || savedTheme === 'day' ? savedTheme : 'day';
  } catch (error) {
    // 저장소 접근이 제한된 환경에서도 테마 기능 자체는 계속 동작하게 했습니다.
    console.warn('저장된 테마를 읽지 못했습니다.', error);
    return 'day';
  }
}

function applyTheme(theme, { persist = false } = {}) {
  const isNight = theme === 'night';
  themeRoot.dataset.theme = isNight ? 'night' : 'day';
  themeToggle?.setAttribute('aria-pressed', String(isNight));
  if (themeLabel) themeLabel.textContent = isNight ? '낮 테마' : '밤 테마';

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, themeRoot.dataset.theme);
    } catch (error) {
      console.warn('테마 선택을 저장하지 못했습니다.', error);
    }
  }
}

// inline onclick 대신 addEventListener로 HTML 구조와 동작을 분리했습니다.
// 저의 오랜 친구 이벤트리스너입니다.
applyTheme(readSavedTheme());
themeToggle?.addEventListener('click', () => {
  const nextTheme = themeRoot.dataset.theme === 'night' ? 'day' : 'night';
  applyTheme(nextTheme, { persist: true });
});
