export function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

export function formatTimeWithDescription(seconds: number) {
  // Round the input to the nearest second
  const roundedSeconds = Math.round(seconds);

  const hours = Math.floor(roundedSeconds / 3600);
  const minutes = Math.floor((roundedSeconds % 3600) / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Construct the descriptive parts
  const hoursPart = hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""}` : "";
  const minutesPart =
    minutes > 0 ? `${minutes} minute${minutes !== 1 ? "s" : ""}` : "";
  const secondsPart =
    remainingSeconds > 0
      ? `${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`
      : "";

  // Combine the parts with commas
  const parts = [hoursPart, minutesPart, secondsPart]
    .filter(Boolean)
    .join(", ");

  return parts + (parts ? " left" : "0 seconds left");
}
