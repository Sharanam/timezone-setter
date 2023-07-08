const { exec } = require("child_process");

const isWindows = process.platform === "win32";
// const isLinux = process.platform === "linux";
// const isMac = process.platform === "darwin";

const timezones = require("./timezones.json");
let argument = process.argv[2];
if (argument === "list" || argument === "help") {
  console.log("List of timezones: ");
  console.log(Object.keys(timezones).sort().join("\n"));
  return;
}
let timezone = argument || "India";

if (!timezones[timezone]) {
  const regex = new RegExp(timezone, "i");
  const matchedTimezones = Object.keys(timezones).filter((tz) =>
    tz.match(regex)
  );
  if (matchedTimezones.length === 0) {
    console.log("No time zone found");
    return;
  } else if (matchedTimezones.length === 1) {
    timezone = matchedTimezones[0];
  } else {
    console.log("Multiple time zones found");
    console.log(matchedTimezones.join(", "));
    return;
  }
}
if (isWindows)
  exec(
    `powershell.exe -Command "Set-TimeZone -Id '${timezones[timezone]}'"`,
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
        stdout ? `System Output: ${stdout}` : "Time zone set to " + timezone
      );
    }
  );

// not tested
// if (isMac) exec(`sudo systemsetup -settimezone ${timeZones[timeZone]}`);
// if (isLinux) exec(`sudo timedatectl set-timezone ${timeZones[timeZone]}`);
