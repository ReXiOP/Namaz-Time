document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://api.sm40.com/api/v1/public-content/salat-time?diff=0&zone=dhaka';
  
    try {
      let response = await fetch(apiUrl);
      let data = await response.json();
      let salatTimes = data.data;
  
      const now = new Date();
      const today = now.toISOString().split('T')[0];
  
      const times = {
        "ফজর": { start: salatTimes.fajrStart, end: salatTimes.fajrEnd },
        "ইশরাক": { start: salatTimes.ishraqStart, end: salatTimes.ishraqEnd },
        "চাশত্": { start: salatTimes.chastStart, end: salatTimes.chastEnd },
        "জাওয়াল": { start: salatTimes.jaowwalStart, end: "যোহর পড়ার পূর্ব পর্যন্ত" },
        "যোহর": { start: salatTimes.dhuhrStart, end: salatTimes.dhuhrEnd },
        "আছর": { start: salatTimes.asrStart, end: salatTimes.asrEnd },
        "মাগরিব": { start: salatTimes.maghribStart, end: salatTimes.maghribEnd },
        "আওয়াবীন": { start: "বাদ মাগরিব", end: salatTimes.awwabinEnd },
        "ইশা": { start: salatTimes.ishaStart, end: salatTimes.ishaEnd }, 
        "তাহাজ্জুদ": { start: salatTimes.tahajjudStart, end: salatTimes.tahajjudEnd }
      };;
  
      let currentSalat = "No current salat time";
  
      let nextSalatName = "";
      let nextSalatTime = "";
  
      for (const [salat, time] of Object.entries(times)) {
        const salatTime = new Date(`${today}T${time.start}`);
        if (now < salatTime) {
          currentSalat = `Next salat is ${salat} at ${time.start}`;
          nextSalatName = salat;
          nextSalatTime = time.start;
  
          // Schedule notification for this salat time
          scheduleSalatNotification(salat, salatTime);
  
          break;
        }
      }
  
    //   document.getElementById('currentSalatTime').innerText = currentSalat;
  
      const tableBody = document.getElementById('salatTimesTable').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ""; // Clear existing rows
  
      for (const [salat, time] of Object.entries(times)) {
        let row = tableBody.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
  
        cell1.innerText = salat;
        cell2.innerText = time.start;
        cell3.innerText = time.end;
      }
  
      // Update current time and remaining time
      updateCurrentTime();
      setInterval(updateCurrentTime, 1000);
      updateRemainingTime(nextSalatName, nextSalatTime);
      setInterval(() => updateRemainingTime(nextSalatName, nextSalatTime), 1000);
  
    } catch (error) {
      console.error('Error fetching salat times:', error);
    }
  });
  
  document.getElementById('whatNowBtn').addEventListener('click', async () => {
    const apiUrl = 'https://api.sm40.com/api/v1/public-content/salat-time?diff=0&zone=dhaka';
  
    try {
      let response = await fetch(apiUrl);
      let data = await response.json();
      let salatTimes = data.data;
  
      const now = new Date();
      const today = now.toISOString().split('T')[0];
  
      const times = {
        "ফজর": { start: salatTimes.fajrStart, end: salatTimes.fajrEnd },
        "ইশরাক": { start: salatTimes.ishraqStart, end: salatTimes.ishraqEnd },
        "চাশত্": { start: salatTimes.chastStart, end: salatTimes.chastEnd },
        "জাওয়াল": { start: salatTimes.jaowwalStart, end: "যোহর পড়ার পূর্ব পর্যন্ত" },
        "যোহর": { start: salatTimes.dhuhrStart, end: salatTimes.dhuhrEnd },
        "আছর": { start: salatTimes.asrStart, end: salatTimes.asrEnd },
        "মাগরিব": { start: salatTimes.maghribStart, end: salatTimes.maghribEnd },
        "আওয়াবীন": { start: "বাদ মাগরিব", end: salatTimes.awwabinEnd },
        "ইশা": { start: salatTimes.ishaStart, end: salatTimes.ishaEnd }, 
        "তাহাজ্জুদ": { start: salatTimes.tahajjudStart, end: salatTimes.tahajjudEnd }
      };
  
      let currentSalat = "No current salat time";
  
      for (const [salat, time] of Object.entries(times)) {
        const salatTime = new Date(`${today}T${time.start}`);
        if (now < salatTime) {
          currentSalat = `${salat} নামাযের সময় শুরু হবে ${salatTime.toLocaleTimeString()}`;
          break;
        }
      }
  
    //   document.getElementById('currentSalatTime').innerText = currentSalat;
  
      // Show notification
      const notificationTitle = 'Salat Time Notifier';
      const notificationOptions = {
        body: currentSalat,
        icon: 'icons/icon48.png' // Replace with your icon path
      };
  
      // Check if the browser supports notifications
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
      } else if (Notification.permission === 'granted') {
        // If permission is already granted, show notification
        new Notification(notificationTitle, notificationOptions);
      } else if (Notification.permission !== 'denied') {
        // Otherwise, ask for permission
        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            new Notification(notificationTitle, notificationOptions);
          }
        });
      }
  
    } catch (error) {
      console.error('Error fetching salat times:', error);
    }
  });
  
  function updateCurrentTime() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    document.getElementById('currentTime').innerText = `এখন সময়: ${currentTime}`; 
  }
  
  function updateRemainingTime(nextSalatName, nextSalatTime) {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const salatTime = new Date(`${today}T${nextSalatTime}`);
    const remainingMillis = salatTime - now;
  
    if (remainingMillis <= 0) {
      document.getElementById('remainingTime').innerText = `${nextSalatName} নামাজের সময় হয়েছে!`; 
    } else {
      const remainingTime = calculateTimeDifference(remainingMillis);
      document.getElementById('remainingTime').innerText = `Time remaining for ${nextSalatName}: ${remainingTime}`;
    }
  }
  
  function calculateTimeDifference(millis) {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((millis % (1000 * 60)) / 1000);
    return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }
  
  function scheduleSalatNotification(salat, salatTime) {
    const now = new Date();
    const timeDiff = salatTime - now;
  
    if (timeDiff > 0) {
      setTimeout(() => { 
        const notificationTitle = 'Salat Time Notifier';
        const notificationOptions = {
          body: `${salat} নামাযের সময় শুরু হবে ${salatTime.toLocaleTimeString()}`,
          icon: 'icons/icon48.png' // Replace with your icon path
        };
  
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notificationTitle, notificationOptions);
        }
      }, timeDiff);
    }
  }
  