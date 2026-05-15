export interface Story {
  title: string;
  content: string;
}

export const STORIES: Story[] = [
  { title: "The Boy Who Bought Time", content: "Once upon a time, a young boy realized that a dollar saved today was a dollar working for him tomorrow. Instead of buying candy every day, he put his coins in a jar. By the time he was a teenager, his jar had enough to buy a bicycle! The magic wasn't the jar, but his patience." },
  { title: "The Magic Coin", content: "There was a magical coin that doubled every time it was planted in the 'Index Forest'. A villager planted his coin and waited 10 years. What started as one coin became a chest full of wealth, teaching the village about the magic of compounding." },
  { title: "The Tax Dragon", content: "A fierce dragon took 30% of everyone's gold every year. But the wise wizard knew that by planting gold in the 'ELSS' and 'PPF' fields before the dragon arrived, the beast could not touch it. The villagers learned to shield their wealth." },
  { title: "The Inflation Monster", content: "An invisible monster named Inflation slowly ate the value of the village's savings under their mattresses. Only by trading their savings for growing assets could they outpace the monster's appetite." },
  { title: "The Golden Goose of FIRE", content: "A farmer raised a goose and invested all his seeds into it. After 25 years, the goose started laying enough golden eggs to feed the farmer for the rest of his life. He retired early, watching sunsets while the goose provided." },
];

export function getUnlockedStories(streak: number): Story[] {
  const count = Math.min(Math.floor(streak / 5), STORIES.length);
  return STORIES.slice(0, count);
}
