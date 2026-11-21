export interface PasswordAnalysisResult {
  length: number;
  entropyBits: number;
  effectiveEntropyBits: number;
  charsetSize: number;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  strengthLevel: 'Empty' | 'Critical' | 'Weak' | 'Moderate' | 'Strong' | 'Resilient';
  scorePercent: number;
  crackEstimates: {
    onlineRateLimited: string;
    offlineSlowBcrypt: string;
    offlineFastGpu: string;
  };
  warnings: string[];
  suggestions: string[];
}

const COMMON_WEAK_FRAGMENTS = [
  'password',
  'passw0rd',
  'qwerty',
  'asdf',
  'zxcv',
  'admin',
  'welcome',
  'letmein',
  'dragon',
  'iloveyou',
  'sunshine',
  'football',
  'monkey',
  'master',
  'summer',
  'winter',
  'spring',
  'autumn',
  'company',
  'secret',
  'login',
  '1234',
  '12345',
  '123456',
  '0000',
  '1111',
  'abc123'
];

const KEYBOARD_WALKS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm', '1234567890', '0987654321'];

const PASSPHRASE_WORDS = [
  'anchor', 'aurora', 'beacon', 'breeze', 'canyon', 'cipher', 'compass', 'coral',
  'crystal', 'delta', 'ember', 'falcon', 'fjord', 'forest', 'galaxy', 'glacier',
  'granite', 'harbor', 'horizon', 'indigo', 'island', 'jasmine', 'kestrel', 'lagoon',
  'lantern', 'meadow', 'meteor', 'nebula', 'obsidian', 'orchard', 'osprey', 'pebble',
  'phoenix', 'pioneer', 'quartz', 'raven', 'redwood', 'ripple', 'saffron', 'sequoia',
  'shelter', 'signal', 'silver', 'solstice', 'sparrow', 'summit', 'timber', 'torrent',
  'tundra', 'valley', 'velvet', 'verge', 'vertex', 'voyager', 'willow', 'zephyr'
];

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds > 3.15576e16) {
    return 'Billions of years';
  }
  if (seconds < 1) return 'Under 1 second';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  const years = days / 365.25;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1_000_000) return `${Math.round(years / 1000).toLocaleString()} thousand years`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} million years`;
  return `${(years / 1_000_000_000).toFixed(1)} billion years`;
}

export function analyzePasswordLocally(input: string): PasswordAnalysisResult {
  if (!input) {
    return {
      length: 0,
      entropyBits: 0,
      effectiveEntropyBits: 0,
      charsetSize: 0,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSymbol: false,
      strengthLevel: 'Empty',
      scorePercent: 0,
      crackEstimates: {
        onlineRateLimited: '—',
        offlineSlowBcrypt: '—',
        offlineFastGpu: '—'
      },
      warnings: [],
      suggestions: ['Enter a test password or generate a random passphrase below to evaluate resistance locally.']
    };
  }

  const hasLower = /[a-z]/.test(input);
  const hasUpper = /[A-Z]/.test(input);
  const hasNumber = /[0-9]/.test(input);
  const hasSymbol = /[^a-zA-Z0-9]/.test(input);

  let charsetSize = 0;
  if (hasLower) charsetSize += 26;
  if (hasUpper) charsetSize += 26;
  if (hasNumber) charsetSize += 10;
  if (hasSymbol) charsetSize += 32;
  if (charsetSize === 0) charsetSize = 26;

  const rawEntropy = input.length * Math.log2(charsetSize);
  let penaltyBits = 0;
  const warnings: string[] = [];
  const lower = input.toLowerCase();

  // Check common dictionary words / leetspeak
  const normalized = lower
    .replace(/@/g, 'a')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i');

  const matchedFragment = COMMON_WEAK_FRAGMENTS.find(
    (frag) => lower.includes(frag) || normalized.includes(frag)
  );
  if (matchedFragment) {
    penaltyBits += 28;
    warnings.push(`Contains predictable dictionary or common pattern ("${matchedFragment}") targeted early by cracking rules.`);
  }

  // Check keyboard walks
  const hasKeyboardWalk = KEYBOARD_WALKS.some((walk) => {
    for (let i = 0; i <= walk.length - 4; i++) {
      if (lower.includes(walk.slice(i, i + 4))) return true;
    }
    return false;
  });
  if (hasKeyboardWalk) {
    penaltyBits += 18;
    warnings.push('Contains sequential keyboard characters (e.g., qwerty, 1234), which significantly lowers search space.');
  }

  // Check repeated characters
  if (/(.)\1{2,}/.test(input)) {
    penaltyBits += 12;
    warnings.push('Contains 3 or more repeated consecutive characters.');
  }

  // Check year pattern
  if (/(19\d\d|20[0-3]\d)/.test(input)) {
    penaltyBits += 10;
    warnings.push('Contains a 4-digit calendar year—one of the first suffixes appended in rule-based attacks.');
  }

  // Unique char ratio penalty for low diversity
  const uniqueChars = new Set(input).size;
  if (input.length >= 6 && uniqueChars <= Math.ceil(input.length * 0.45)) {
    penaltyBits += 12;
    warnings.push('Low character variety relative to total length.');
  }

  const effectiveEntropyBits = Math.max(4, Math.round(rawEntropy - penaltyBits));

  // Average guesses = 2^(effectiveEntropyBits - 1)
  const avgGuesses = Math.pow(2, Math.min(effectiveEntropyBits - 1, 120));
  const crackEstimates = {
    onlineRateLimited: formatDuration(avgGuesses / 100), // 100 attempts/sec
    offlineSlowBcrypt: formatDuration(avgGuesses / 10_000), // 10k hashes/sec
    offlineFastGpu: formatDuration(avgGuesses / 10_000_000_000) // 10B hashes/sec
  };

  let strengthLevel: PasswordAnalysisResult['strengthLevel'] = 'Critical';
  if (effectiveEntropyBits >= 80 && input.length >= 14) {
    strengthLevel = 'Resilient';
  } else if (effectiveEntropyBits >= 62 && input.length >= 12) {
    strengthLevel = 'Strong';
  } else if (effectiveEntropyBits >= 44 && input.length >= 9) {
    strengthLevel = 'Moderate';
  } else if (effectiveEntropyBits >= 28) {
    strengthLevel = 'Weak';
  }

  const scorePercent = Math.min(100, Math.max(6, Math.round((effectiveEntropyBits / 92) * 100)));

  const suggestions: string[] = [];
  if (input.length < 14) {
    suggestions.push('Increase length to at least 14–16 characters; length expands search space faster than symbol swaps.');
  }
  if (!hasUpper || !hasLower) {
    suggestions.push('Mix uppercase and lowercase characters, or use multiple unrelated dictionary words.');
  }
  if (!hasNumber || !hasSymbol) {
    suggestions.push('Include digits or non-predictable separators (not just "!" at the end).');
  }
  if (warnings.length > 0) {
    suggestions.push('Replace predictable words, years, or keyboard runs with 4+ randomly chosen words.');
  }
  if (suggestions.length === 0) {
    suggestions.push('Strong local entropy profile. Ensure this credential is never reused on any other website.');
  }

  return {
    length: input.length,
    entropyBits: Math.round(rawEntropy),
    effectiveEntropyBits,
    charsetSize,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    strengthLevel,
    scorePercent,
    crackEstimates,
    warnings,
    suggestions
  };
}

function getCryptoRandomInt(maxExclusive: number): number {
  const array = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / maxExclusive) * maxExclusive;
  let value = 0;
  do {
    window.crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % maxExclusive;
}

export function generatePassphraseLocal(wordCount = 4): string {
  const chosen: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const idx = getCryptoRandomInt(PASSPHRASE_WORDS.length);
    const word = PASSPHRASE_WORDS[idx];
    chosen.push(word.charAt(0).toUpperCase() + word.slice(1));
  }
  const num = getCryptoRandomInt(90) + 10;
  return `${chosen.join('-')}-${num}`;
}

export function generateRandomPasswordLocal(length = 18): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_+=';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[getCryptoRandomInt(chars.length)];
  }
  return result;
}
