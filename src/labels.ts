export interface TourLabels {
  pickerTitle: string;
  pickerIntro: string;
  groupTitle: string;
  close: string;
  guideMe: string;
  showMe: string;
  auto: string;
  stepCount: string;
  captionMeta: string;
  modeGuide: string;
  modeShow: string;
  modeAuto: string;
  back: string;
  next: string;
  skip: string;
  end: string;
  unavailable: string;
  refused: string;
  paused: string;
  autoPlaying: string;
  guideHint: string;
  continueHint: string;
  offerTitle: string;
  offerBody: string;
  offerStart: string;
  offerDismiss: string;
}

export const defaultTourLabels: TourLabels = {
  pickerTitle: 'Guided tours',
  pickerIntro: 'Guide me: you click, the tour highlights. Show me: the tour clicks for you. Auto: plays on its own, Space pauses.',
  groupTitle: '{{p1}} ({{p2}})',
  close: 'Close',
  guideMe: 'Guide me',
  showMe: 'Show me',
  auto: 'Auto',
  stepCount: '{{p1}} steps',
  captionMeta: '{{p1}} · Step {{p2}} of {{p3}} · {{p4}}',
  modeGuide: 'Guide',
  modeShow: 'Show',
  modeAuto: 'Auto',
  back: 'Back',
  next: 'Next',
  skip: 'Skip',
  end: 'End',
  unavailable: "This step isn't available here",
  refused: 'The tour never clicks "{{p1}}". Press Next to continue.',
  paused: 'Paused: Space resumes',
  autoPlaying: 'Auto-play: Space pauses',
  guideHint: 'Click the highlighted item, or press Next',
  continueHint: 'Press Next to continue',
  offerTitle: 'Take a 1-minute tour',
  offerBody: 'See the main screens in a short guided walk-through.',
  offerStart: 'Start the tour',
  offerDismiss: 'No thanks',
};

export function formatLabel(template: string, ...params: Array<string | number>): string {
  return params.reduce<string>((text, value, index) => text.split(`{{p${index + 1}}}`).join(String(value)), template);
}
