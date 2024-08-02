let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let manualControlMode = null;
let intervalId = null; // Store interval ID for starting/stopping clock

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
  if (manualControlMode === "Stop to set a time") {
    return;
  }

  const day = new Date();
  const localTime = new Date(
    day.toLocaleString("en-US", { timeZone: currentTimeZone })
  );

  const seconds = localTime.getSeconds();
  const minutes = localTime.getMinutes();
  const hours = localTime.getHours();

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

function startClock() {
  intervalId = setInterval(setCurrentTime, 1000);
  setCurrentTime(); // Initial call to set time immediately
}

function stopClock() {
  clearInterval(intervalId);
}

startClock();

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

document.querySelector(".main").appendChild(manualControlSelector);

manualControlSelector.addEventListener("change", (e) => {
  manualControlMode = e.target.value;

  if (manualControlMode === "Stop to set a time") {
    stopClock();
  } else if (manualControlMode === "Restart a clock") {
    startClock();
  }
});
