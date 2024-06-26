const apiUrl = 'https://api.sm40.com/api/v1/public-content/salat-time?diff=0&zone=dhaka';

async function fetchSalatTimes() {
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching salat times:', error);
  }
}

function scheduleNotifications(salatTimes) {
  chrome.alarms.clearAll();

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const times = {
    "ফজর": salatTimes.fajrStart,
    "যোহর": salatTimes.dhuhrStart,
    "আছরআছর": salatTimes.asrStart,
    "মাগরিব": salatTimes.maghribStart,
    "ইশা": salatTimes.ishaStart
  };

  for (const [salat, time] of Object.entries(times)) {
    const salatTime = new Date(`${today}T${time}`);
    const reminderTime = new Date(salatTime.getTime() - 5 * 60000);

    if (salatTime > now) {
      chrome.alarms.create(`${salat}-reminder`, { when: reminderTime.getTime() });
      chrome.alarms.create(salat, { when: salatTime.getTime() });
    }
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  const salat = alarm.name.replace('-reminder', '');
  if (alarm.name.includes('-reminder')) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'Salat Reminder',
      message: `${salat} নামাজের জন্য প্রস্তুতি নিন!!`
    });
  } else {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png', 
      title: 'Salat Time',
      message: ` ${salat} নামজের সময় হয়েছে!!.`
    });
  }
});

(async () => {
  const salatTimes = await fetchSalatTimes();
  scheduleNotifications(salatTimes);
})();
