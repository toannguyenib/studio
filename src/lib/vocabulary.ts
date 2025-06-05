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
    synonyms: ['subside', 'lessen', 'diminish', 'decline'],
    antonyms: ['intensify', 'increase', 'amplify'],
    roots: ['Old French "abattre" - to beat down', 'Latin "ad" - to + "battere" - to beat'],
  },
  {
    id: '2',
    text: 'Benevolent',
    definition: 'Well meaning and kindly.',
    level: 1,
    exampleSentence: 'A benevolent smile.',
    synonyms: ['kind', 'good-hearted', 'charitable', 'generous'],
    antonyms: ['malevolent', 'unkind', 'spiteful', 'miserly'],
    roots: ['Latin "bene" - well', 'Latin "volens" - wishing'],
    confusedWith: ['Beneficent (actively doing good, while benevolent is wishing good)'],
  },
  {
    id: '3',
    text: 'Candid',
    definition: 'Truthful and straightforward; frank.',
    level: 1,
    exampleSentence: 'His responses were remarkably candid.',
    synonyms: ['frank', 'outspoken', 'honest'],
    antonyms: ['guarded', 'secretive', 'evasive'],
  },
  {
    id: '4',
    text: 'Diligent',
    definition: 'Having or showing care and conscientiousness in one\'s work or duties.',
    level: 1,
    exampleSentence: 'Many caves are located only after a diligent search.',
    synonyms: ['hard-working', 'assiduous', 'conscientious'],
    antonyms: ['lazy', 'careless', 'negligent'],
  },
  {
    id: '5',
    text: 'Ephemeral',
    definition: 'Lasting for a very short time.',
    level: 1,
    exampleSentence: 'Fashions are ephemeral.',
    synonyms: ['transitory', 'fleeting', 'short-lived'],
    antonyms: ['permanent', 'lasting', 'eternal'],
    roots: ['Greek "ephemeros" - lasting a day'],
  },

  // Level 2
  {
    id: '6',
    text: 'Deleterious',
    definition: 'Causing harm or damage.',
    level: 2,
    exampleSentence: 'Divorce is assumed to have deleterious effects on children.',
    synonyms: ['harmful', 'damaging', 'detrimental'],
    antonyms: ['beneficial', 'harmless', 'helpful'],
  },
  {
    id: '7',
    text: 'Exacerbate',
    definition: 'Make (a problem, bad situation, or negative feeling) worse.',
    level: 2,
    exampleSentence: 'The forest fire was exacerbated by the strong winds.',
    synonyms: ['aggravate', 'worsen', 'intensify', 'compound'],
    antonyms: ['alleviate', 'improve', 'mitigate', 'reduce'],
    roots: ['Latin "ex-" - out, thoroughly', 'Latin "acerbus" - harsh, bitter'],
  },
  {
    id: '8',
    text: 'Fortuitous',
    definition: 'Happening by accident or chance rather than design.',
    level: 2,
    exampleSentence: 'From a cash standpoint, the company\'s timing is fortuitous.',
    synonyms: ['accidental', 'unexpected', 'unplanned', 'chance'],
    antonyms: ['planned', 'deliberate', 'intentional'],
    confusedWith: ['Fortunate (lucky, auspicious - while fortuitous means by chance, which may or may not be lucky)'],
  },
  {
    id: '9',
    text: 'Gregarious',
    definition: '(Of a person) fond of company; sociable.',
    level: 2,
    exampleSentence: 'He was a popular and gregarious man.',
    synonyms: ['sociable', 'convivial', 'outgoing'],
    antonyms: ['unsociable', 'reclusive', 'introverted'],
    roots: ['Latin "grex" (greg-) - flock, herd'],
  },
  {
    id: '10',
    text: 'Idiosyncratic',
    definition: 'Relating to idiosyncrasy; peculiar or individual.',
    level: 2,
    exampleSentence: 'She emerged as one of the great, idiosyncratic talents of the Nineties.',
    synonyms: ['peculiar', 'distinctive', 'eccentric'],
    antonyms: ['common', 'ordinary', 'conventional'],
  },

  // Level 3
  {
    id: '11',
    text: 'Juxtaposition',
    definition: 'The fact of two things being seen or placed close together with contrasting effect.',
    level: 3,
    exampleSentence: 'The juxtaposition of these two images.',
    synonyms: ['comparison', 'contrast', 'proximity', 'collocation'],
    roots: ['Latin "iuxta" - beside, near', 'French "position" - position'],
  },
  {
    id: '12',
    text: 'Mellifluous',
    definition: '(Of a voice or words) sweet or musical; pleasant to hear.',
    level: 3,
    exampleSentence: 'The voice was mellifluous and smooth.',
    synonyms: ['sweet-sounding', 'euphonious', 'dulcet', 'harmonious'],
    antonyms: ['cacophonous', 'harsh', 'grating'],
    roots: ['Latin "mel" - honey', 'Latin "fluere" - to flow'],
  },
  {
    id: '13',
    text: 'Nefarious',
    definition: '(Typically of an action or activity) wicked or criminal.',
    level: 3,
    exampleSentence: 'The nefarious activities of the organized-crime syndicates.',
    synonyms: ['wicked', 'evil', 'sinful', 'iniquitous', 'villainous'],
    antonyms: ['virtuous', 'good', 'righteous', 'honorable'],
    roots: ['Latin "nefas" - wrong, crime (from "ne-" - not + "fas" - divine law)'],
  },
  {
    id: '14',
    text: 'Obfuscate',
    definition: 'Render obscure, unclear, or unintelligible.',
    level: 3,
    exampleSentence: 'The spelling changes will deform some familiar words and obfuscate their etymological origins.',
    synonyms: ['confuse', 'obscure', 'cloud', 'muddy'],
    antonyms: ['clarify', 'elucidate', 'explain'],
    roots: ['Latin "obfuscare" - to darken (from "ob-" - over + "fuscus" - dark)'],
  },
  {
    id: '15',
    text: 'Pernicious',
    definition: 'Having a harmful effect, especially in a gradual or subtle way.',
    level: 3,
    exampleSentence: 'The pernicious influences of the mass media.',
    synonyms: ['harmful', 'destructive', 'damaging', 'deleterious', 'malignant'],
    antonyms: ['beneficial', 'harmless', 'benign'],
    roots: ['Latin "pernicies" - destruction, ruin (from "per-" - through + "nex" (nec-) - death)'],
  },
];

export const getWordsByLevel = (level: number): Word[] => {
  return vocabulary.filter(word => word.level === level);
}

export const getWordById = (id: string): Word | undefined => {
  return vocabulary.find(word => word.id === id);
}
