import { Landmark, Castle, Sparkles, Globe, Banknote, Hourglass } from 'lucide-react';

// The era/theme pages: /eras (hub) + one dedicated static page per entry at
// /eras/[id]. Matched against each catalog item's `tags` array
// (src/data/catalog.json).
export const eras = [
  {
    id: 'ancient',
    name: 'Ancient',
    icon: Landmark,
    description: 'Coins from antiquity — Greek, Roman, and Egyptian mints.',
  },
  {
    id: 'medieval',
    name: 'Medieval',
    icon: Castle,
    description: 'Coinage from the medieval world, from Byzantium to early Islam.',
  },
  {
    id: 'gold-silver',
    name: 'Gold & Silver',
    icon: Sparkles,
    description: 'Precious-metal pieces — gold and silver coins from every era.',
  },
  {
    id: 'world-coins',
    name: 'World Coins',
    icon: Globe,
    description: 'Coins from across the world, spanning centuries of history.',
  },
  {
    id: 'paper-money',
    name: 'Paper Money',
    icon: Banknote,
    description: 'Antique currency and historical banknotes.',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: Hourglass,
    description: '19th and 20th century coins, notes, medals, and tokens.',
  },
];
