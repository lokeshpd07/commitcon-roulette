import { describe, expect, it } from 'vitest';
import { landingRotation, indexAtPointer, teamHindrances, challengeHindrances } from '@/lib/roulette';

describe('roulette selection', () => {
  it('lands all eight segments under the pointer on consecutive spins', () => {
    let rotation = 0;
    for (let index = 0; index < 8; index++) {
      const next = landingRotation(rotation, index);
      expect(next - rotation).toBeGreaterThanOrEqual(1800);
      expect(indexAtPointer(next)).toBe(index);
      rotation = next;
    }
  });
  it('includes the requested team hindrances', () => {
    expect(teamHindrances.map(item => item.name)).toEqual(['Mute One Member', 'One-Handed Developer', 'No Internet', 'No Communication', 'One Laptop Down', 'Developer AFK', 'Trade-Off', 'No Mouse']);
  });
  it('includes the requested challenge hindrances', () => {
    expect(challengeHindrances.map(item => item.name)).toEqual(['Keyboard Ban', 'Phone Jail', 'Paper Planning', 'No AI', 'Pass the Laptop', 'Silent Debugging', 'Slow Mode', 'UI Redesign']);
  });
});
