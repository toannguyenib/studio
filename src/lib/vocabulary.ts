import type { Word, Topic } from '@/types';

// Define your IELTS topics here
export const topics: Topic[] = [
  { id: 'topic1', name: 'Environment', description: 'Vocabulary related to environmental issues and conservation.' },
  { id: 'topic2', name: 'Technology', description: 'Words about technological advancements and their impacts.' },
  { id: 'topic3', name: 'Education', description: 'Terms concerning learning, academic systems, and teaching.' },
  { id: 'topic4', name: 'Health', description: 'Vocabulary about well-being, medical topics, and fitness.' },
  // Add your other 4 topics here, for example:
  // { id: 'topic5', name: 'Culture & Society', description: '...' },
  // { id: 'topic6', name: 'Work & Economy', description: '...' },
  // { id: 'topic7', name: 'Travel & Tourism', description: '...' },
  // { id: 'topic8', name: 'Art & Media', description: '...' },
];

// MAX_LEVEL is no longer used with topics
// export const MAX_LEVEL = 5; 

export const vocabulary: Word[] = [
  // Example words for Topic 1: Environment
  {
    id: 'env1',
    text: 'Biodegradable',
    definition: 'Capable of being decomposed by bacteria or other living organisms and thereby avoiding pollution.',
    topic: 'Environment', // Assign topic name directly, or use topic ID
    exampleSentence: 'Many companies are switching to biodegradable packaging.',
    synonyms: ['decomposable', 'perishable'],
    antonyms: ['non-biodegradable', 'permanent'],
    pronunciation: '/ˌbaɪəʊdɪˈɡreɪdəbl/',
    partOfSpeech: 'adjective',
  },
  {
    id: 'env2',
    text: 'Conservation',
    definition: 'Preservation, protection, or restoration of the natural environment and of wildlife.',
    topic: 'Environment',
    exampleSentence: 'Conservation efforts are crucial for endangered species.',
    synonyms: ['preservation', 'protection', 'safeguarding'],
    antonyms: ['destruction', 'exploitation'],
    pronunciation: '/ˌkɒnsəˈveɪʃn/',
    partOfSpeech: 'noun',
  },
  {
    id: 'env3',
    text: 'Deforestation',
    definition: 'The clearing of trees, transforming a forest into cleared land.',
    topic: 'Environment',
    exampleSentence: 'Deforestation contributes to climate change.',
    synonyms: ['clear-cutting', 'logging'],
    antonyms: ['afforestation', 'reforestation'],
    pronunciation: '/diːˌfɒrɪˈsteɪʃn/',
    partOfSpeech: 'noun',
  },

  // Example words for Topic 2: Technology
  {
    id: 'tech1',
    text: 'Algorithm',
    definition: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.',
    topic: 'Technology',
    exampleSentence: 'Social media platforms use complex algorithms to curate content.',
    synonyms: ['procedure', 'formula', 'method'],
    pronunciation: '/ˈælɡərɪðəm/',
    partOfSpeech: 'noun',
  },
  {
    id: 'tech2',
    text: 'Cybersecurity',
    definition: 'The state of being protected against the criminal or unauthorized use of electronic data, or the measures taken to achieve this.',
    topic: 'Technology',
    exampleSentence: 'Cybersecurity is a growing concern for businesses and individuals.',
    synonyms: ['data security', 'information security'],
    pronunciation: '/ˌsaɪbəsɪˈkjʊərəti/',
    partOfSpeech: 'noun',
  },
  
  // Example words for Topic 3: Education
   {
    id: 'edu1',
    text: 'Pedagogy',
    definition: 'The method and practice of teaching, especially as an academic subject or theoretical concept.',
    topic: 'Education',
    exampleSentence: 'Modern pedagogy emphasizes student-centered learning.',
    synonyms: ['teaching methods', 'instruction', 'education theory'],
    pronunciation: '/ˈpedəɡɒdʒi/',
    partOfSpeech: 'noun',
  },
  {
    id: 'edu2',
    text: 'Curriculum',
    definition: 'The subjects comprising a course of study in a school or college.',
    topic: 'Education',
    exampleSentence: 'The school is developing a new curriculum for mathematics.',
    synonyms: ['syllabus', 'course of study', 'program'],
    pronunciation: '/kəˈrɪkjələm/',
    partOfSpeech: 'noun',
  },

  // Add more words for your topics here...
  // For example, for "Health":
  {
    id: 'health1',
    text: 'Vaccination',
    definition: 'Treatment with a vaccine to produce immunity against a disease; inoculation.',
    topic: 'Health',
    exampleSentence: 'Widespread vaccination has eradicated many diseases.',
    synonyms: ['immunization', 'inoculation'],
    pronunciation: '/ˌvæksɪˈneɪʃn/',
    partOfSpeech: 'noun',
  }
];

// export const getWordsByLevel = (level: number): Word[] => { // Old function
//   return vocabulary.filter(word => word.level === level);
// }

export const getWordsByTopic = (topicName: string): Word[] => {
  return vocabulary.filter(word => word.topic === topicName);
};

export const getAllWords = (): Word[] => {
  return vocabulary;
};

export const getWordById = (id: string): Word | undefined => {
  return vocabulary.find(word => word.id === id);
};
