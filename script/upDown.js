function startGame() {
  var computerNum = Math.floor(Math.random() * 50) + 1;
  let attempts = 0;

  while (true) {
    const input = window.prompt('1부터 50 사이의 숫자를 입력하세요. 취소를 누르면 종료합니다.');
    if (input === null) {
      window.alert('게임을 종료했습니다.');
      return;
    }

    const guess = Number(input.trim());
    if (!Number.isInteger(guess) || guess < 1 || guess > 50) {
      window.alert('1부터 50 사이의 정수를 입력해 주세요.');
      continue;
    }

    attempts += 1;
    if (guess === computerNum) {
      window.alert(`축하합니다! ${attempts}번 만에 맞추셨습니다.`);
      return;
    }

    window.alert(guess > computerNum ? 'Down! 더 작은 숫자입니다.' : 'Up! 더 큰 숫자입니다.');
  }
}

document.querySelector('#updown-button')?.addEventListener('click', startGame);
