import type { Word } from '@/types';

export const MAX_LEVEL = 3;

export const vocabulary: Word[] = [
  // Level 1
  {
    id: '1',
    text: 'Abate',
    definition: 'To become less intense or widespread.',
    level: 1,
    exampleSentence: 'The storm suddenly abated.',
  },
  {
    id: '2',
    text: 'Benevolent',
    definition: 'Well meaning and kindly.',
    level: 1,
    exampleSentence: 'A benevolent smile.',
  },
  {
    id: '3',
    text: 'Candid',
    definition: 'Truthful and straightforward; frank.',
    level: 1,
    exampleSentence: 'His responses were remarkably candid.',
  },
  {
    id: '4',
    text: 'Diligent',
    definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
    level: 1,
    exampleSentence: 'Many caves are located only after a diligent search.',
  },
  {
    id: '5',
    text: 'Ephemeral',
    definition: 'Lasting for a very short time.',
    level: 1,
    exampleSentence: 'Fashions are ephemeral.',
  },

  // Level 2
  {
    id: '6',
    text: 'Deleterious',
    definition: 'Causing harm or damage.',
    level: 2,
    exampleSentence: 'Divorce is assumed to have deleterious effects on children.',
  },
  {
    id: '7',
    text: 'Exacerbate',
    definition: 'Make (a problem, bad situation, or negative feeling) worse.',
    level: 2,
    exampleSentence: 'The forest fire was exacerbated by the strong winds.',
  },
  {
    id: '8',
    text: 'Fortuitous',
    definition: 'Happening by accident or chance rather than design.',
    level: 2,
    exampleSentence: 'From a cash standpoint, the company\'s timing is fortuitous.',
  },
  {
    id: '9',
    text: 'Gregarious',
    definition: '(Of a person) fond of company; sociable.',
    level: 2,
    exampleSentence: 'He was a popular and gregarious man.',
  },
  {
    id: '10',
    text: 'Idiosyncratic',
    definition: 'Relating to idiosyncrasy; peculiar or individual.',
    level: 2,
    exampleSentence: 'She emerged as one of the great, idiosyncratic talents of the Nineties.',
  },

  // Level 3
  {
    id: '11',
    text: 'Juxtaposition',
    definition: 'The fact of two things being seen or placed close together with contrasting effect.',
    level: 3,
    exampleSentence: 'The juxtaposition of these two images.',
  },
  {
    id: '12',
    text: 'Mellifluous',
    definition: '(Of a voice or words) sweet or musical; pleasant to hear.',
    level: 3,
    exampleSentence: 'The voice was mellifluous and smooth.',
  },
  {
    id: '13',
    text: 'Nefarious',
    definition: '(Typically of an action or activity) wicked or criminal.',
    level: 3,
    exampleSentence: 'The nefarious activities of the organized-crime syndicates.',
  },
  {
    id: '14',
    text: 'Obfuscate',
    definition: 'Render obscure, unclear, or unintelligible.',
    level: 3,
    exampleSentence: 'The spelling changes will deform some familiar words and obfuscate their etymological origins.',
  },
  {
    id: '15',
    text: 'Pernicious',
    definition: 'Having a harmful effect, especially in a gradual or subtle way.',
    level: 3,
    exampleSentence: 'The pernicious influences of the mass media.',
  },
];

export const getWordsByLevel = (level: number): Word[] => {
  return vocabulary.filter(word => word.level === level);
}

export const getWordById = (id: string): Word | undefined => {
  return vocabulary.find(word => word.id === id);
}
