function setMada(day) {
	const degree = 360/28*day;
  $("#mada-divider").css("transform", "rotate3d(0, 1, 0, " + degree + "deg)");

  $("#mada-left").removeClass(degree <= 180 && degree != 0 ? "dark" : "light");
  $("#mada-left").addClass(degree <= 180 && degree != 0 ? "light" : "dark");
  $("#mada-right").addClass(degree < 180 ? "dark" : "light");
  $("#mada-right").removeClass(degree < 180 ? "light" : "dark");
}


function increaseDay() {
	let day = game.settings.get("dsa5-calendar", "day");
	const month = game.settings.get("dsa5-calendar", "month");
	if (++day > (month == 13 ? 5 : 30))
	{
		day = 1;
		increaseMonth();
	}
	game.settings.set("dsa5-calendar", "day", day);
}


function decreaseDay() {
	let day = game.settings.get("dsa5-calendar", "day");
	const month = game.settings.get("dsa5-calendar", "month");
	if (--day<1)
	{
		day = (month == 1 ? 5 : 30);
		decreaseMonth();
	}
	game.settings.set("dsa5-calendar", "day", day);
}


function increaseMonth() {
	let month = game.settings.get("dsa5-calendar", "month");
	console.log("increaseMonth: " + month);
	if (++month>13) {
		month=1;
		increaseYear();
	}
	game.settings.set("dsa5-calendar", "month", month);
	if (month==13 && game.settings.get("dsa5-calendar", "day"))
		game.settings.set("dsa5-calendar", "day", 5);
}


function decreaseMonth() {
	let month = game.settings.get("dsa5-calendar", "month");
	if (--month<1) {
		month=13;
		decreaseYear();
	}
	game.settings.set("dsa5-calendar", "month", month);
	if (month==13 && game.settings.get("dsa5-calendar", "day"))
		game.settings.set("dsa5-calendar", "day", 5);
}


function increaseYear() {
	const year = game.settings.get("dsa5-calendar", "year");
	game.settings.set("dsa5-calendar", "year", year+1);
}


function decreaseYear() {
	const year = game.settings.get("dsa5-calendar", "year");
	game.settings.set("dsa5-calendar", "year", year-1);
}


function updateDate() {
    updateDay();
    updateMonth();
    updateYear();
}


function updateDay() {
	const day = game.settings.get("dsa5-calendar", "day")
	const month = game.settings.get("dsa5-calendar", "month");
	const year = game.settings.get("dsa5-calendar", "year");

	// See DSA4.1-Meisterschirm.
	const index = (day + 2 * (month-1) + year - 13 ) % 7;
	const dayOfWeek = ["Erdstag","Markttag","Praiostag","Rohalstag","Feuertag","Wassertag","Windstag"][index];
	$("#dsa-calendar-day").html(dayOfWeek + ", " + day + ".");

	setMada(Math.floor((day + 2 * (month-1) + year - 13 ) % 28));

	// This is the old code to determine the Mada phase.
	// const indexMada = Math.floor((((day + 2 * (month-1) + year - 13 ) % 28)-1) / 7);
	// const mada = ["Kelch", "Rad", "Helm", "Tote Mada"][indexMada<0 ? 3 : indexMada];
	// $("#dsa-calendar-mada").html(mada);
}


function updateMonth(month=false) {
	if (!month)
		month = game.settings.get("dsa5-calendar", "month");
	index = Math.max(0, month-1);
	month = ["Praios", "Rondra", "Efferd", "Travia", "Boron", "Hesinde", "Firun", "Tsa", "Phex", "Peraine", "Ingerimm", "Rahja", "namenloser Tag"][index];
	$("#dsa-calendar-month").html(month);
}


function updateYear(year=false) {
	if (!year)
		year = game.settings.get("dsa5-calendar", "year")
	$("#dsa-calendar-year").html(year + " BF");
}


Hooks.on("ready", () => {

	// Register world settings to store day, month and year.
	game.settings.register("dsa5-calendar", "day", {
		name: "CALENDAR.DAY", scope: "world", config: false, type: Number, default: 1, onChange: (value) => { updateDate()}});
	game.settings.register("dsa5-calendar", "month", {
		name: "CALENDAR.MONTH", scope: "world", config: false, type: Number, default: 1, onChange: (value) => { updateDate()}});
	game.settings.register("dsa5-calendar", "year", {
		name: "CALENDAR.YEAR", scope: "world", config: false, type: Number, default: 1035, onChange: (value) => { updateDate()}});

	// Add Calendar HTML and click handlers to sidebar.
	Hooks.on("renderSidebarTab", (app, html, data) => {

		// Check if HTML has already been added.
		if (!$("#dsa5-calendar").length) {

			// Define HTML and add it after the tabs in the top.
      const div = $("<div id='dsa5-calendar'><span id='dsa-calendar-day'></span><span id='dsa-calendar-month'></span><span id='dsa-calendar-year'></span><span id='dsa-calendar-mada'><span id='mada-left'></span><span id='mada-right'></span><span id='mada-divider'></span></span></div>");
      $("#sidebar-tabs").after(div)
      updateDate();

      // Leave here when role is not high enough.
    	if (game.users.current.role < 3)
    		return;


      // Handle clicks on day.
			$('#dsa-calendar-day').mousedown((event) => {
			    if (event.which == 1) increaseDay();
			    if (event.which == 3) decreaseDay();
			});

      // Handle clicks on month.
			$('#dsa-calendar-month').mousedown((event) => {
				if (event.shiftKey)
				{
				    if (event.which == 1) increaseMonth();
				    if (event.which == 3) decreaseMonth();
				}
				else
				{
				    if (event.which == 1) increaseDay();
				    if (event.which == 3) decreaseDay();
				}
			});

      // Handle clicks on year.
			$('#dsa-calendar-year').mousedown((event) => {
				if (event.shiftKey)
				{
				    if (event.which == 1) increaseYear();
				    if (event.which == 3) decreaseYear();
				}
				else
				{
				    if (event.which == 1) increaseDay();
				    if (event.which == 3) decreaseDay();
				}
			});

		}

	})

});
