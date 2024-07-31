function setCurrentTime() {
  const day = new Date();

  const seconds = day.getSeconds();
  const minutes = day.getMinutes();
  const hours = day.getHours();

  const timeInterval = 6;

  const secondHand = seconds * timeInterval;
  const minuteHand = minutes * timeInterval + seconds / 10;
  const hourHand = hours * 30 + minutes / 2;

  document.querySelector("#hour").style.transform = `rotate(${hourHand}deg)`;

  document.querySelector(
    "#minute"
  ).style.transform = `rotate(${minuteHand}deg)`;

  document.querySelector(
    "#second"
  ).style.transform = `rotate(${secondHand}deg)`;
}

setInterval(setCurrentTime, 1000);

setCurrentTime();
