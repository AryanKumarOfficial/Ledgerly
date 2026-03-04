export const getTimezones = () => {
  const zones = Intl.supportedValuesOf("timeZone");

  return zones.map((tz) => {
    const city = tz.split("/")[1]?.replace(/_/g, " ") ?? tz;
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "longOffset",
    }).formatToParts(new Date());

    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";

    return {
      value: tz,
      label: city,
      offset,
    };
  });
};

export const formatTimezone = (tz: string) => {
  const city = tz.split("/").pop()?.replace(/_/g, " ") ?? tz;

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "longOffset",
  }).formatToParts(new Date());

  const rawOffset =
    parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT";

  const offset = rawOffset === "GMT" ? "GMT+00:00" : rawOffset;

  return {
    value: tz,
    label: city,
    offset,
  };
};