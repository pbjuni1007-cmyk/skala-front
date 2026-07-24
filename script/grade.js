function checkGrade() {
  var subjects = ['HTML', 'CSS', 'JavaScript'];
  const scores = [];

  for (const subject of subjects) {
    while (true) {
      const input = window.prompt(`${subject} 점수를 입력하세요. (0~100)`);
      if (input === null) {
        window.alert('성적 계산을 취소했습니다.');
        return;
      }

      const score = Number(input.trim());
      if (Number.isFinite(score) && score >= 0 && score <= 100) {
        scores.push(score);
        break;
      }
      window.alert('0부터 100 사이의 숫자를 입력해 주세요.');
    }
  }

  var total = scores.reduce((sum, score) => sum + score, 0);
  var average = total / subjects.length;
  var result = average >= 60 ? '합격입니다!' : '불합격입니다ㅠ';
  let grade;

  if (average >= 90) {
    grade = 'A';
  } else if (average >= 80) {
    grade = 'B';
  } else if (average >= 70) {
    grade = 'C';
  } else if (average >= 60) {
    grade = 'D';
  } else {
    grade = 'F';
  }

  window.alert([
    '성적 결과표',
    `총점: ${total}점`,
    `평균: ${average.toFixed(1)}점`,
    `등급: ${grade}`,
    `판정: ${result}`
  ].join('\n'));
}

document.querySelector('#grade-button')?.addEventListener('click', checkGrade);
