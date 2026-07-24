import { getLiveWeather } from './weatherAPI.js';

const citySelect = document.querySelector('#city-select');
const weatherBox = document.querySelector('#weather-box');

function setMessage(message, state = 'idle') {
  weatherBox.replaceChildren();
  weatherBox.dataset.state = state;
  const paragraph = document.createElement('p');
  // 외부 문자열은 HTML로 해석하지 않고 textContent로 안전하게 표시했습니다.
  paragraph.textContent = message;
  weatherBox.append(paragraph);
}

function showWeather(cityName, latitude, longitude, weather) {
  // 로딩·성공·실패 상태를 data-state로 구분해 UI 피드백을 제공합니다.
  weatherBox.replaceChildren();
  weatherBox.dataset.state = 'success';

  const heading = document.createElement('h3');
  heading.textContent = cityName;

  // 선택한 도시명과 좌표를 날씨 결과와 함께 DOM에 표시합니다.
  const coordinates = document.createElement('p');
  coordinates.className = 'weather-coordinates';
  coordinates.textContent = `위도 ${latitude} · 경도 ${longitude}`;

  // 요즘 날씨 인간적으로 너무 더운 것 같습니다. 숨이 턱턱 막혀요.
  const values = document.createElement('div');
  values.className = 'weather-value';
  const temperature = document.createElement('p');
  temperature.textContent = `기온 ${weather.temperature}${weather.temperatureUnit}`;
  const humidity = document.createElement('p');
  humidity.textContent = `습도 ${weather.humidity}${weather.humidityUnit}`;
  values.append(temperature, humidity);
  weatherBox.append(heading, coordinates, values);
}

citySelect?.addEventListener('change', async (event) => {
  const selectedValue = event.target.value;
  if (selectedValue === 'none') {
    setMessage('도시를 선택하면 현재 기온과 습도를 표시합니다.');
    return;
  }

  const [latitude, longitude] = selectedValue.split(',');
  const cityName = citySelect.options[citySelect.selectedIndex].text;
  setMessage(`${cityName} (위도 ${latitude}, 경도 ${longitude}) 날씨를 불러오는 중입니다.`, 'loading');

  try {
    const weather = await getLiveWeather(latitude, longitude);
    showWeather(cityName, latitude, longitude, weather);
  } catch (error) {
    console.error(error);
    setMessage('날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', 'error');
  }
});
