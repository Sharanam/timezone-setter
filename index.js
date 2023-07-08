const { exec } = require("child_process");

const isWindows = process.platform === "win32";
// const isLinux = process.platform === "linux";
// const isMac = process.platform === "darwin";

const timeZones = require("./timeZones.json");
let argument = process.argv[2];
if (argument === "list" || argument === "help") {
  console.log("List of timezones: ");
  console.log(Object.keys(timeZones).sort().join("\n"));
  return;
}
let timeZone = argument || "India";

if (!timeZones[timeZone]) {
  const regex = new RegExp(timeZone, "i");
  const matchedTimeZones = Object.keys(timeZones).filter((tz) =>
    tz.match(regex)
  );
  if (matchedTimeZones.length === 0) {
    console.log("No time zone found");
    return;
  } else if (matchedTimeZones.length === 1) {
    timeZone = matchedTimeZones[0];
  } else {
    console.log("Multiple time zones found");
    console.log(matchedTimeZones.join(", "));
    return;
  }
}
if (isWindows)
  exec(
    `powershell.exe -Command "Set-TimeZone -Id '${timeZones[timeZone]}'"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log("System Error: " + stderr);
        return;
      }
      console.log(
        stdout ? `System Output: ${stdout}` : "Time zone set to " + timeZone
      );
    }
  );

// not tested
// if (isMac) exec(`sudo systemsetup -settimezone ${timeZones[timeZone]}`);
// if (isLinux) exec(`sudo timedatectl set-timezone ${timeZones[timeZone]}`);
