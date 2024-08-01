let currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const timeZones = [
  { name: "Local Time", value: currentTimeZone },
  { name: "UTC", value: "UTC" },
  { name: "New York (EST)", value: "America/New_York" },
  { name: "Los Angeles (PST)", value: "America/Los_Angeles" },
  { name: "London (GMT)", value: "Europe/London" },
  { name: "Tokyo (JST)", value: "Asia/Tokyo" },
];

function setCurrentTime() {
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

setInterval(setCurrentTime, 1000);

setCurrentTime();

const timeZoneSelector = document.createElement("select");
timeZoneSelector.classList.add("timezone-select");
timeZones.forEach((zone) => {
  const option = document.createElement("option");
  option.value = zone.value;
  option.textContent = zone.name;
  timeZoneSelector.appendChild(option);
});

document
  .querySelector(".main")
  .insertBefore(timeZoneSelector, document.querySelector(".clockbox"));

timeZoneSelector.addEventListener("change", (e) => {
  currentTimeZone = e.target.value;
  setCurrentTime();
});
