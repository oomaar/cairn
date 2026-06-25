import type {
  Announcement,
  CommMessage,
  Incident,
  Risk,
  WeatherAlert,
} from "../types";

/**
 * Authored operational records, ported from the wireframe and linked by id to
 * expeditions and people. Weather checkpoint links are resolved against the
 * generated routes during universe assembly.
 */

export const WEATHER_ALERTS: readonly WeatherAlert[] = [
  {
    id: "wx-tdp-wind",
    expeditionId: "tdp",
    checkpointId: null,
    tone: "danger",
    icon: "wind",
    title: "High wind warning",
    place: "Paso John Gardner",
    detail: "Gusts to 85 km/h · 3°C · visibility 400m",
    observedAgo: "12m",
    window: "Closes 11:00",
  },
  {
    id: "wx-anp-snow",
    expeditionId: "anp",
    checkpointId: null,
    tone: "warn",
    icon: "snow",
    title: "Snow above 4,200 m",
    place: "ABC approach",
    detail: "Fresh snow 15–25 cm · −9°C · moderate slab risk",
    observedAgo: "1h",
    window: "Through Thu",
  },
  {
    id: "wx-wrh-clear",
    expeditionId: "wrh",
    checkpointId: null,
    tone: "slate",
    icon: "sun",
    title: "Clear window opening",
    place: "Cirque of the Towers",
    detail: "High pressure · 11°C · light WNW",
    observedAgo: "3h",
    window: "Thu–Sat",
  },
  {
    id: "wx-kun-stable",
    expeditionId: "kun",
    checkpointId: null,
    tone: "slate",
    icon: "cloud",
    title: "Stable, overcast",
    place: "Abisko",
    detail: "2°C · 60% cloud · no precip 48h",
    observedAgo: "5h",
    window: "Stable",
  },
] as const;

export const RISKS: readonly Risk[] = [
  {
    id: "risk-tdp-wind",
    expeditionId: "tdp",
    level: "high",
    tone: "danger",
    category: "Environmental",
    title: "Wind exposure at Paso John Gardner",
    detail:
      "Sustained 65–85 km/h crosswind on the pass. Above safe threshold for laden crossing.",
    action: "Hold at Camp Italiano; re-assess 11:00",
    ownerId: "mara-restrepo",
    updatedAgo: "12m",
  },
  {
    id: "risk-anp-slab",
    expeditionId: "anp",
    level: "moderate",
    tone: "warn",
    category: "Environmental",
    title: "Snowpack instability above 4,200 m",
    detail:
      "Recent loading on N/NE aspects. Moderate slab potential on the MBC approach gully.",
    action: "Early start, rope the traverse, avoid 10:00–14:00 solar window",
    ownerId: "lhakpa-tamang",
    updatedAgo: "1h",
  },
  {
    id: "risk-wrh-river",
    expeditionId: "wrh",
    level: "moderate",
    tone: "warn",
    category: "Route",
    title: "River crossing — elevated flow",
    detail:
      "Snowmelt has raised the East Fork crossing at Mile 14 to thigh-deep.",
    action: "Scout upstream braid; carry crossing line",
    ownerId: "dele-okafor",
    updatedAgo: "4h",
  },
  {
    id: "risk-org-wfr",
    expeditionId: null,
    level: "low",
    tone: "slate",
    category: "Compliance",
    title: "Two WFR certifications expiring",
    detail:
      "Field leaders A. Lindqvist and S. Conti — Wilderness First Responder lapses within 30 days.",
    action: "Schedule recert before Jun 22 departure",
    ownerId: "elena-vasquez",
    updatedAgo: "1d",
  },
] as const;

export const INCIDENTS: readonly Incident[] = [
  {
    id: "inc-tdp-ankle",
    expeditionId: "tdp",
    subjectPersonId: "kenji-yu",
    timeLabel: "Day 3 · 14:22",
    tone: "warn",
    title: "Minor ankle roll — Participant K. Yu",
    status: "Resolved on trail",
    detail:
      "Taped and self-mobile. Pace reduced 15%. Monitoring at each checkpoint through camp.",
  },
  {
    id: "inc-anp-permit",
    expeditionId: "anp",
    subjectPersonId: null,
    timeLabel: "Day 1 · 09:05",
    tone: "slate",
    title: "Delayed permit check at Birethanti",
    status: "Cleared",
    detail:
      "45-min hold at ACAP checkpoint. Party queued behind two guided groups. Itinerary buffer absorbed the delay without impact to overnight schedule.",
  },
  {
    id: "inc-gr20-closure",
    expeditionId: "gr20",
    subjectPersonId: null,
    timeLabel: "Day 8 · 07:15",
    tone: "danger",
    title: "Route closure — Cirque de la Solitude",
    status: "Evacuated",
    detail:
      "Cornice collapse blocked the Cirque de la Solitude approach at first light. Gendarmerie nationale closed the section. Party extracted by helicopter to Corte. All 9 participants and 1 guide accounted for.",
  },
  {
    id: "inc-tdp-allclear",
    expeditionId: "tdp",
    subjectPersonId: null,
    timeLabel: "Day 2 · 18:40",
    tone: "ok",
    title: "All-clear check-in — Camp Italiano",
    status: "Logged",
    detail:
      "14/14 accounted for at Camp Italiano. Camp fully established, evening brief delivered. No injuries or equipment issues to report.",
  },
] as const;

export const COMMS: readonly CommMessage[] = [
  {
    id: "comm-tdp-1",
    expeditionId: "tdp",
    fromPersonId: "mara-restrepo",
    time: "10:24",
    kind: "message",
    text: "Holding the group at Río de los Franceses. Wind picking up on the pass — requesting updated forecast before we commit to Paso JG.",
  },
  {
    id: "comm-tdp-2",
    expeditionId: "tdp",
    fromPersonId: "operations",
    time: "10:26",
    kind: "message",
    text: "Copy. Pushing 11:00 model run to your device now. Gusts forecast to ease after 14:00. Recommend hold.",
  },
  {
    id: "comm-tdp-3",
    expeditionId: "tdp",
    fromPersonId: "cairn-system",
    time: "10:30",
    kind: "alert",
    text: "Weather alert escalated to HIGH — Paso John Gardner. Auto-notified field leader + director.",
  },
  {
    id: "comm-wrh-1",
    expeditionId: "wrh",
    fromPersonId: "dele-okafor",
    time: "09:48",
    kind: "message",
    text: "Pre-departure gear audit complete. 9/10 kits signed off. One PLB swapped (low battery).",
  },
] as const;

export const ANNOUNCEMENTS: readonly Announcement[] = [
  {
    id: "ann-avalanche",
    title: "Updated avalanche protocol — spring season",
    tone: "amber",
    audience: "All field leaders",
    timeAgo: "2d ago",
    body: "Mandatory transceiver check at every camp above 3,000 m. Logged in Live Mode.",
    expeditionId: null,
  },
  {
    id: "ann-kungsleden",
    title: "Kungsleden pre-departure briefing moved",
    tone: "slate",
    audience: "Kungsleden team",
    timeAgo: "3d ago",
    body: "Now 16:45 Jun 21, Abisko base. Attendance required for all 6 participants.",
    expeditionId: "kun",
  },
] as const;
