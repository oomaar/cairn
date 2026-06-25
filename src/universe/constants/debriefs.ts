import type { Debrief } from "../types";

export const DEBRIEFS: readonly Debrief[] = [
  {
    expeditionId: "sky",
    outcome:
      "All 8 participants completed the full Skye Cuillin Ridge traverse in 5 days. The party remained on schedule throughout with no significant incidents. Weather held across the technical sections, allowing the full ridge line without diversion.",
    leaderNotes:
      "Conditions were exceptional — unusually stable for Skye. The team's technical fitness was well-matched to the grade. We moved faster than projected on Days 2 and 3, which gave us buffer on the final day descent.",
    lessonsLearned: [
      "Early start on Day 2 proved critical — beat the afternoon cloud build-up on the main ridge by two hours.",
      "Pack weight management: moving rope and hardware into shared carries freed the technical sections significantly.",
      "Pre-route briefing on abseil points should be mandatory, not optional — two participants were unfamiliar with the anchor setup at the Am Basteir traverse.",
    ],
  },
  {
    expeditionId: "lau",
    outcome:
      "Full party of 12 completed the Laugavegur Trail in 6 days. A minor wind delay on Day 4 was absorbed by the itinerary buffer without impact. All participants reached Þórsmörk on schedule.",
    leaderNotes:
      "Hut pre-booking proved essential — the route was heavily trafficked. The party pace was excellent; we could have trimmed a buffer day in hindsight. Day 4 wind was forecast accurately, but participants underestimated the visceral experience of it.",
    lessonsLearned: [
      "Book Emstrur hut a minimum of two months ahead in peak season — three other groups were turned away.",
      "The wind forecast service was underutilised. Participants struggled unnecessarily on Day 4 because they hadn't checked it. Add daily forecast briefing to the morning routine.",
      "Laugahraun lava field crossing: poles mandatory from this point regardless of participant preference.",
    ],
  },
  {
    expeditionId: "tmb",
    outcome:
      "15 of 16 participants completed the full Tour du Mont Blanc circuit. One participant withdrew on Day 7 due to a knee injury and was safely transferred to Chamonix by taxi from Les Contamines. Route adjustments were made on Days 3 and 8 due to trail conditions. A strong overall result given the scale of the group.",
    leaderNotes:
      "The large group size created friction at refuge check-ins that we hadn't fully accounted for. Staggering arrival times from Day 4 onwards helped, but we should have done it from Day 1. The Day 7 knee withdrawal was handled cleanly — the participant was in good spirits and had pre-arranged transfer insurance.",
    lessonsLearned: [
      "Cap TMB parties at 12. The logistics at 16 are manageable but the experience for participants suffers at the busy refuges.",
      "Carry knee support tape from Day 1 — the cumulative descent profile makes this a high-probability use item by Day 5.",
      "The Fenêtre d'Arpette variant should be planned as the default route, not a weather-dependent option. We missed it due to caution; conditions were suitable.",
    ],
  },
  {
    expeditionId: "gr20",
    outcome:
      "Expedition closed on Day 8 following a Gendarmerie nationale route closure at the Cirque de la Solitude after a cornice collapse at 07:15. All 9 participants and 1 guide were safely extracted by helicopter to Corte. 8 of 10 planned sections were completed before closure. The expedition is formally recorded as closed due to external route conditions.",
    leaderNotes:
      "The helicopter extraction was professional and swift — 40 minutes from call to landing. The closure was entirely unpredictable; the cornice collapse occurred before the party reached the section. The decision to call immediately rather than assess from below was the right one. The team held up well under a stressful circumstance.",
    lessonsLearned: [
      "The Cirque de la Solitude carries objective rockfall and cornice risk in spring. Consider scheduling this section in July or later when snowpack is fully consolidated.",
      "Maintain direct Gendarmerie nationale contact from Day 1 on GR20 North — the checkpoint communication relay was slower than acceptable in an emergency.",
      "Review helicopter extraction protocol with all participants at the Day 1 brief, not just the field leader. Every participant should know the assembly point procedure.",
    ],
  },
  {
    expeditionId: "cwt",
    outcome:
      "6 of 8 participants completed the full Cape Wrath Trail to the lighthouse. 2 participants withdrew on Day 9 by mutual agreement — the sustained physical demands exceeded their preparation level. The remaining 6 reached Cape Wrath on schedule on Day 12. A demanding result that reflects the true character of the route.",
    leaderNotes:
      "The CWT remains the most physically demanding route in the portfolio. Pre-expedition fitness screening should be mandatory, not advisory. Both Day 9 withdrawals were foreseeable in hindsight based on the participants' pace on Days 5–7. I should have had a frank conversation earlier.",
    lessonsLearned: [
      "Mandatory fitness screening: minimum three consecutive multi-day walks in the preceding 6 months, not self-reported general fitness.",
      "River crossing equipment — poles and throw bag — is non-negotiable on the northern section. One crossing on Day 10 required the throw bag.",
      "Day 9 is the psychological crux of the CWT. Plan a shorter distance that day and a morale-building camp that evening. The route demands respect for what's still ahead.",
    ],
  },
];
