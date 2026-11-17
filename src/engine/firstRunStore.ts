const OFFER_PREFIX = '__tour-offer-seen:';

export function hasSeenOffer(userId: string): boolean {
  try {
    return localStorage.getItem(OFFER_PREFIX + userId) !== null;
  } catch {
    return true;
  }
}

export function markOfferSeen(userId: string): void {
  try {
    localStorage.setItem(OFFER_PREFIX + userId, '1');
  } catch {
    return;
  }
}
