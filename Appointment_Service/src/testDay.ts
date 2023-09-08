const test = (weekday: number, now: Date) => {
  const today = (now.getDay() + 2) % 7;

  //let appointmentDay: Date = new Date();
  const appointmentDay = new Date(now);

  console.log("weekday : " + weekday + " today : " + today);

  const diff = weekday - today;

  if (diff < 0) {
    //same day next week
    appointmentDay.setDate(appointmentDay.getDate() + 7 + diff);
  } else if (diff > 0) {
    //same day this week
    appointmentDay.setDate(appointmentDay.getDate() + diff);
  }

  console.log("appointment day is " + appointmentDay.toDateString());
};

for (let i = 0; i < 7; i++) {
  const today = new Date();
  today.setDate(today.getDate() + i);

  console.log("today is " + today.toDateString());

  for (let j = 0; j < 7; j++) {
    test(j, today);
  }

  console.log("");
}
