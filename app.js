'use strict';

// Subject overviews condensed from the five IQ Lab profile READMEs.
// These describe the learning scope, not a fixed syllabus or completion status.
const fields = {
  green: {
    name: 'Green Track', title: '세상을 읽는 판단력',
    description: ['돈과 사람, 세상의 흐름을 읽고', '더 나은 판단을 배웁니다'],
    tags: ['의사결정', '경제·금융', '설득·협상', '게임이론', '전략', '역사·지정학'],
    topics: [
      ['확률적 사고와 의사결정', '베이즈 추론 · 통계 해석 · 인지 편향'],
      ['경제·금융과 시장', '금리 · 재무제표 · 가치평가 · 투자'],
      ['설득·협상과 전략', '브랜드 · 가격 · 게임이론 · 인센티브'],
      ['제도·역사와 사회', '법과 계약 · 경제사 · 기업 흥망 · 지정학']
    ]
  },
  blue: {
    name: 'Blue Track', title: '생각을 실제로 만드는 힘',
    description: ['서비스를 직접 만들며', '개발의 전체 흐름을 익힙니다'],
    tags: ['컴퓨터 구조', '언어·런타임', '백엔드', '웹·모바일', '데이터베이스', '인프라'],
    topics: [
      ['컴퓨터 구조와 실행 원리', 'CPU · 운영체제 · 컴파일러 · 메모리'],
      ['백엔드와 데이터', 'Java · Spring · 데이터베이스 · 메시징'],
      ['웹·모바일과 UI', '브라우저 · React · Android · iOS'],
      ['시스템 설계와 운영', '분산 시스템 · 네트워크 · 보안 · 배포']
    ]
  },
  black: {
    name: 'Black Track', title: '우주를 바닥부터',
    description: ['고전역학부터 양자와 우주론까지,', '자연의 법칙을 이해합니다'],
    tags: ['고전물리', '열·통계물리', '양자물리', '상대성이론', '우주론', '양자중력'],
    topics: [
      ['역학·전자기학·파동', '최소작용 · 대칭과 보존 · 카오스'],
      ['열역학과 통계물리', '엔트로피 · 시간의 화살 · 상전이'],
      ['양자역학과 양자장론', '중첩과 얽힘 · 표준모형 · 양자정보'],
      ['시공간과 우주', '상대성이론 · 블랙홀 · 우주론 · 양자중력']
    ]
  },
  white: {
    name: 'White Track', title: '마음의 안쪽',
    description: ['뇌와 인지를 따라 생각과 의식이', '생기는 과정을 이해합니다'],
    tags: ['신경과학', '인지', '계산과 마음', '의식', '자아', '자유의지'],
    topics: [
      ['뇌와 신경의 작동', '신경 부호 · 뇌 구조 · 가소성'],
      ['지각·기억·학습', '주의 · 의사결정 · 언어와 감정'],
      ['마음의 계산과 의식', '인공 신경망 비교 · 의식 이론 · 설명적 간극'],
      ['자아와 자유의지', '자기모델 · 행위주체감 · 타인의 마음']
    ]
  }
};
function setLines(element, lines) {
  element.replaceChildren();
  lines.forEach((line, index) => {
    if (index) element.append(document.createElement('br'));
    element.append(document.createTextNode(line));
  });
}

const basePanel = document.getElementById('panel-red');
Object.entries(fields).forEach(([color, field]) => {
  const panel = basePanel.cloneNode(true);
  panel.id = 'panel-' + color;
  panel.className = 'course-panel theme-' + color;
  panel.setAttribute('aria-labelledby', 'tab-' + color);
  panel.hidden = true;
  const label = panel.querySelector('.course-label');
  label.replaceChildren(label.querySelector('.color-dot'), document.createTextNode(field.name));
  panel.querySelector('h3').textContent = field.title;
  setLines(panel.querySelector('.course-description'), field.description);
  panel.querySelector('.tags').replaceChildren(...field.tags.map(tag => {
    const li = document.createElement('li'); li.textContent = tag; return li;
  }));
  const projectURL = 'https://github.com/iq-spiral-galaxy/spiral-buddy-' + color;
  const download = panel.querySelector('.course-download');
  download.href = projectURL + '/releases';
  download.replaceChildren(document.createTextNode(field.name + ' 다운로드'), download.querySelector('svg'));
  const topicList = panel.querySelector('.topic-map ol');
  const topicTemplate = topicList.querySelector('li');
  topicList.replaceChildren(...field.topics.map(([title, detail], index) => {
    const li = topicTemplate.cloneNode(true);
    li.querySelector('span').textContent = String(index + 1).padStart(2, '0');
    li.querySelector('strong').textContent = title;
    li.querySelector('p').textContent = detail;
    return li;
  }));
  document.querySelector('.course-panels').append(panel);
});

const tabs = [...document.querySelectorAll('.course-tab')];
const panels = [...document.querySelectorAll('.course-panel')];
function selectField(color, focusTab = false) {
  const selected = tabs.find(tab => tab.dataset.color === color);
  if (!selected) return;
  tabs.forEach(tab => {
    const active = tab === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== selected.getAttribute('aria-controls'); });
  if (focusTab) selected.focus({ preventScroll: true });
  // Move only the mobile strip, never the document viewport.
  const strip = selected.parentElement;
  if (strip.scrollWidth > strip.clientWidth) {
    strip.scrollLeft = selected.offsetLeft - (strip.clientWidth - selected.offsetWidth) / 2;
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectField(tab.dataset.color));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectField(tabs[next].dataset.color, true);
  });
});
document.querySelectorAll('[data-select]').forEach(link => {
  link.addEventListener('click', () => selectField(link.dataset.select));
});

const perspectives = {
  red: { name: '수학 · AI', title: ['복잡한 문제에서', '변하지 않는 구조를 찾습니다'], copy: ['수학은 문제의 본질을 드러냅니다', '현상 속에 숨은 구조를 찾아내면,', '처음 보는 문제도 근본 원리부터 풀 수 있습니다'] },
  green: { name: '판단 · 실천지', title: ['많은 문제 사이에서', '지금 중요한 것을 고릅니다'], copy: ['판단은 풀어야 할 문제를 고릅니다', '모든 문제를 다 풀 수는 없습니다', '상황과 결과를 읽어 지금 가장 중요한 것부터 선택합니다'] },
  blue: { name: '개발 · 시스템', title: ['생각을 직접 만들어', '현실에서 검증합니다'], copy: ['구현은 생각과 현실을 이어줍니다', '실제로 움직이게 만들면 숨은 가정과 한계가 드러나고,', '고칠 방향도 선명해집니다'] },
  black: { name: '물리 · 우주', title: ['현상을 만든 원인과', '가능성의 한계를 묻습니다'], copy: ['물리는 원인과 한계를 끝까지 묻습니다', '현상을 만든 힘과 조건을 끝까지 추적하면,', '무엇이 가능하고 불가능한지 분명해집니다'] },
  white: { name: '뇌 · 마음', title: ['문제를 바라보는', '나의 관점도 살펴봅니다'], copy: ['마음은 문제를 보는 관점을 비춥니다', '판단하는 나 자신도 문제의 일부임을 알면,', '숨은 편견을 걷어 내고 더 정확히 이해할 수 있습니다'] }
};
function selectConnection(color) {
  const data = perspectives[color];
  if (!data) return;
  document.querySelector('.connection-map').dataset.active = color;
  document.querySelectorAll('[data-connection]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.connection === color));
  });
  const detail = document.getElementById('connection-detail');
  detail.className = 'connection-detail theme-' + color;
  document.getElementById('connection-name').textContent = data.name;
  setLines(document.getElementById('connection-title'), data.title);
  setLines(document.getElementById('connection-copy'), data.copy);
  document.getElementById('connection-link').dataset.select = color;
}
document.querySelectorAll('[data-connection]').forEach(button => {
  button.addEventListener('click', () => selectConnection(button.dataset.connection));
  button.addEventListener('focus', () => selectConnection(button.dataset.connection));
  button.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') selectConnection(button.dataset.connection);
  });
});
