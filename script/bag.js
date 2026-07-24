/* (여자)아이들의 MY BAG 이란 노래가 떠올라버렸습니다. */

function showMyBag() {
  const myBag = [
    { name: '맥북', count: 1 },
    { name: '모니터', count: 1 },
    { name: 'SKALA 학생증', count: 1 },
    { name: '이어폰', count: 2 }
  ];

  const itemLines = [];
  for (const item of myBag) {
    itemLines.push(`- ${item.name}: ${item.count}개`);
  }

  window.alert([
    '내 가방 속 물품',
    '----------------',
    ...itemLines,
    '----------------',
    `총 ${myBag.length}종류`
  ].join('\n'));
}

document.querySelector('#bag-button')?.addEventListener('click', showMyBag);
