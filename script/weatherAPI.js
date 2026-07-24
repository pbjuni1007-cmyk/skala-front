export async function getLiveWeather(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new TypeError('유효하지 않은 위도 또는 경도입니다.');
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m',
    timezone: 'auto'
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);

  // fetch는 HTTP 오류에서도 충족될 수 있으므로 상태를 직접 검사합니다.
  if (!response.ok) {
    throw new Error(`날씨 서버 응답 오류: ${response.status}`);
  }

  const data = await response.json();
  const temperature = data.current?.temperature_2m;
  const humidity = data.current?.relative_humidity_2m;
  // 응답 형태가 바뀌거나 값이 비어도 잘못된 수치를 화면에 표시하지 않도록 조치했습니다.
  // undefined℃ 같은 거 뜨면 당황스럽잖아요
  if (!Number.isFinite(temperature) || !Number.isFinite(humidity)) {
    throw new Error('날씨 응답에 필요한 값이 없습니다.');
  }

  return {
    temperature,
    temperatureUnit: data.current_units?.temperature_2m ?? '°C',
    humidity,
    humidityUnit: data.current_units?.relative_humidity_2m ?? '%'
  };
}
