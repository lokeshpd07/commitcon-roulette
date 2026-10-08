export type Hindrance = { name: string; description: string; duration: number };

// Suggested event durations; kept together so organizers can adjust the round rules.
export const teamHindrances: Hindrance[] = [
  { name: 'Mute One Member', duration: 5, description: 'Choose one teammate who cannot speak. They can still code, gesture, and contribute.' },
  { name: 'One-Handed Developer', duration: 5, description: 'One developer must work using only one hand. The other hand takes a well-earned break.' },
  { name: 'No Internet', duration: 5, description: 'Disconnect your team from the internet. Work with the tools and knowledge already on your laptops.' },
  { name: 'No Communication', duration: 3, description: 'No talking, messaging, or gesturing between teammates. Keep building independently until time is up.' },
  { name: 'One Laptop Down', duration: 5, description: 'Close one team laptop. Redistribute the work and keep your momentum with the remaining devices.' },
  { name: 'Developer AFK', duration: 5, description: 'One developer steps away from the project. The rest of the team takes over until they return.' },
  { name: 'Trade-Off', duration: 5, description: 'Two teammates swap their current tasks. Pick up where the other person left off.' },
  { name: 'No Mouse', duration: 5, description: 'Put away mice and trackpads. Everyone navigates and develops using keyboard controls only.' },
];

export const challengeHindrances: Hindrance[] = [
  { name: 'Keyboard Ban', duration: 3, description: 'No typing on laptop keyboards. Use your mouse, discuss your next move, or find a creative workaround.' },
  { name: 'Phone Jail', duration: 5, description: 'Put every team phone aside. No phone searches, messages, or mobile shortcuts until time is up.' },
  { name: 'Paper Planning', duration: 5, description: 'Step away from the code and sketch your next feature on paper. Plan first; implement after the challenge.' },
  { name: 'No AI', duration: 10, description: 'Pause all AI assistants and code-generation tools. Your team’s own ideas and skills take the lead.' },
  { name: 'Pass the Laptop', duration: 5, description: 'Rotate laptops between teammates. Continue the work on the device you receive without swapping back.' },
  { name: 'Silent Debugging', duration: 5, description: 'Find and fix bugs without speaking or messaging. Let your code do the talking.' },
  { name: 'Slow Mode', duration: 5, description: 'Only one teammate may type at a time. Everyone else can think, review, and discuss the next step.' },
  { name: 'UI Redesign', duration: 10, description: 'Give one screen a fresh visual direction. Change its layout or styling while keeping its functionality intact.' },
];

export function landingRotation(current: number, selectedIndex: number) {
  return Math.ceil(current / 360) * 360 + 1800 + ((360 - selectedIndex * 45) % 360);
}

export function indexAtPointer(rotation: number) {
  return ((Math.round(-rotation / 45) % 8) + 8) % 8;
}