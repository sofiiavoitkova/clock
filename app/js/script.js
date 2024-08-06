let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let manualControlMode = null;
let intervalId = null;
let isPaused = false;
let customTime = null;

const timeZones = [
  { name: "Local Time", value: currentTimeZone },
  { name: "UTC", value: "UTC" },
  { name: "New York (EST)", value: "America/New_York" },
  { name: "Los Angeles (PST)", value: "America/Los_Angeles" },
  { name: "London (GMT)", value: "Europe/London" },
  { name: "Tokyo (JST)", value: "Asia/Tokyo" },
];

const manualControls = [
  { name: "Restart a clock" },
  { name: "Stop to set a time" },
];

function setCurrentTime() {
  if (manualControlMode === "Stop to set a time") return;

  let currentTime = customTime ? new Date(customTime) : new Date();
  if (!customTime) {
    currentTime = new Date(
      currentTime.toLocaleString("en-US", { timeZone: currentTimeZone })
    );
  }

  const seconds = currentTime.getSeconds();
  const minutes = currentTime.getMinutes();
  const hours = currentTime.getHours();

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

  if (customTime) {
    customTime.setSeconds(customTime.getSeconds() + 1);
  }
}

function startClock() {
  setCurrentTime();
  intervalId = setInterval(setCurrentTime, 1000);
}

function stopClock() {
  clearInterval(intervalId);
}

const timeZoneSelector = document.createElement("select");
timeZoneSelector.classList.add("timezone-select");
timeZones.forEach((zone) => {
  const option = document.createElement("option");
  option.value = zone.value;
  option.textContent = zone.name;
  timeZoneSelector.appendChild(option);
});

document.querySelector(".main").appendChild(timeZoneSelector);

timeZoneSelector.addEventListener("change", (e) => {
  currentTimeZone = e.target.value;
  setCurrentTime();
});

const manualControlSelector = document.createElement("select");
manualControlSelector.classList.add("manual-control-select");
manualControls.forEach((control) => {
  const option = document.createElement("option");
  option.value = control.name;
  option.textContent = control.name;
  manualControlSelector.appendChild(option);
});

function getHandAngle(hand) {
  const transform = getComputedStyle(hand).transform;
  if (transform === "none") return 0;
  const values = transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];
  const angle = Math.atan2(b, a) * (180 / Math.PI);
  return angle >= 0 ? angle : 360 + angle;
}

function getClockTime() {
  const hourAngle = getHandAngle(document.querySelector("#hour"));
  const minuteAngle = getHandAngle(document.querySelector("#minute"));
  const secondAngle = getHandAngle(document.querySelector("#second"));

  const hours = Math.floor(hourAngle / 30) % 12;
  const minutes = Math.floor(minuteAngle / 6);
  const seconds = Math.floor(secondAngle / 6);

  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
}

document.querySelector(".main").appendChild(manualControlSelector);

manualControlSelector.addEventListener("change", (e) => {
  manualControlMode = e.target.value;

  if (manualControlMode === "Stop to set a time") {
    stopClock();
    isPaused = true;
  } else if (manualControlMode === "Restart a clock") {
    isPaused = false;
    customTime = getClockTime();
    startClock();
  }
});

function getAngle(x, y) {
  const svg = document.querySelector("svg");
  const centerX = svg.getBoundingClientRect().left + svg.clientWidth / 2;
  const centerY = svg.getBoundingClientRect().top + svg.clientHeight / 2;
  let angle = 90 + (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI;
  return angle;
}

const hourHand = document.querySelector("#hour");
const minuteHand = document.querySelector("#minute");
const secondHand = document.querySelector("#second");

addHandListener(hourHand);
addHandListener(minuteHand);
addHandListener(secondHand);

function stopDragging() {
  document.onmousemove = null;
  document.onmouseup = null;
  customTime = getClockTime();
}

function startDraggingHand(hand, event) {
  if (!isPaused) return;

  hand.style.transform = `rotate(${getAngle(event.clientX, event.clientY)}deg)`;

  document.onmousemove = function (event) {
    hand.style.transform = `rotate(${getAngle(
      event.clientX,
      event.clientY
    )}deg)`;
  };

  document.onmouseup = () => {
    stopDragging();
  };
}

function addHandListener(hand) {
  hand.addEventListener("mousedown", (event) => {
    startDraggingHand(hand, event);
  });
}

startClock();
