// Cryptographically secure random number generation utilities
// All generation happens client-side using the Web Crypto API

export const getSecureRandom = (length: number): Uint8Array => {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('Random byte length must be a non-negative safe integer')
  }

  const cryptoApi = globalThis.crypto
  if (!cryptoApi?.getRandomValues) {
    throw new Error('Secure random generation requires the Web Crypto API')
  }

  const array = new Uint8Array(length)
  cryptoApi.getRandomValues(array)
  return array
}

// Return an unbiased integer in [0, maxExclusive) using rejection sampling.
// Values outside the largest evenly divisible uint32 range are discarded so
// every possible result has the same probability.
export const getSecureRandomInt = (maxExclusive: number): number => {
  const uint32Range = 0x1_0000_0000

  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0 || maxExclusive > uint32Range) {
    throw new RangeError('Upper bound must be an integer between 1 and 2^32')
  }

  const limit = Math.floor(uint32Range / maxExclusive) * maxExclusive
  let value: number

  do {
    const bytes = getSecureRandom(4)
    value = bytes[0] * 0x1_000000 + bytes[1] * 0x1_0000 + bytes[2] * 0x100 + bytes[3]
  } while (value >= limit)

  return value % maxExclusive
}

export const randomChar = (charset: string): string => {
  return charset[getSecureRandomInt(charset.length)]
}

export const generateString = (length: number, charset: string): string => {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += randomChar(charset)
  }
  return result
}

export const bytesToHex = (bytes: Uint8Array): string => {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const bytesToBase64 = (bytes: Uint8Array): string => {
  if (typeof window !== 'undefined') {
    return btoa(String.fromCharCode(...bytes))
  }
  return Buffer.from(bytes).toString('base64')
}

// Character sets
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
export const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const DIGITS = '0123456789'
export const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'
export const SYMBOLS_SAFE = '!@#$%^&*_+-='
export const HEX = '0123456789abcdef'
export const HEX_UPPER = '0123456789ABCDEF'
export const ALPHANUMERIC = LOWERCASE + UPPERCASE + DIGITS
export const ALL_CHARS = ALPHANUMERIC + SYMBOLS
export const URL_SAFE = ALPHANUMERIC + '-_'
export const BASE32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

// Calculate entropy in bits
export const calculateEntropy = (length: number, charsetSize: number): number => {
  return Math.floor(length * Math.log2(charsetSize))
}

// --- Plain-English crack-time estimation ---------------------------------
// Ported from the reference implementation. Never render bare 2^n to users —
// always use these human-readable strings instead.

const SECONDS_PER_YEAR = 31557600
const AGE_OF_UNIVERSE_SECONDS = 13.8e9 * SECONDS_PER_YEAR

// "3.2 trillion times", "45 quadrillion times", etc.
export const magnitude = (x: number): string => {
  const units: Array<[number, string]> = [
    [1e18, 'quintillion'],
    [1e15, 'quadrillion'],
    [1e12, 'trillion'],
    [1e9, 'billion'],
    [1e6, 'million'],
  ]
  for (const [v, name] of units) {
    if (x >= v) {
      const n = x / v
      return (n >= 100 ? Math.round(n).toLocaleString('en-US') : n >= 10 ? String(Math.round(n)) : n.toFixed(1)) + ' ' + name + ' times'
    }
  }
  return Math.round(x).toLocaleString('en-US') + '×'
}

// Compact crack-time line, e.g. "~34 minutes to crack at 1 trillion guesses/sec"
// or "~23.4 trillion times the age of the universe to crack".
export const crackTime = (bits: number): string => {
  const secs = Math.pow(2, bits - 1) / 1e12
  if (secs < 1) return 'Cracked in under a second at 1 trillion guesses/sec'
  if (secs < 60) return '~' + Math.round(secs) + ' seconds to crack at 1 trillion guesses/sec'
  if (secs < 3600) return '~' + Math.round(secs / 60) + ' minutes to crack at 1 trillion guesses/sec'
  if (secs < 86400) return '~' + Math.round(secs / 3600) + ' hours to crack at 1 trillion guesses/sec'
  if (secs < SECONDS_PER_YEAR) return '~' + Math.round(secs / 86400) + ' days to crack at 1 trillion guesses/sec'
  if (secs < AGE_OF_UNIVERSE_SECONDS) {
    const y = secs / SECONDS_PER_YEAR
    return '~' + (y >= 1e6 ? (y / 1e6).toFixed(1) + ' million' : Math.round(y).toLocaleString('en-US')) + ' years to crack at 1 trillion guesses/sec'
  }
  return '~' + magnitude(secs / AGE_OF_UNIVERSE_SECONDS) + ' the age of the universe to crack'
}

// Three-tier prose explanation of what the entropy means in practice.
export const plainEnglishCrackTime = (bits: number): string => {
  const secs = (rate: number) => Math.pow(2, bits - 1) / rate
  const human = (s: number): string => {
    if (s < 1) return 'under a second'
    if (s < 60) return Math.round(s) + ' seconds'
    if (s < 3600) return Math.round(s / 60) + ' minutes'
    if (s < 86400) return Math.round(s / 3600) + ' hours'
    if (s < SECONDS_PER_YEAR) return Math.round(s / 86400) + ' days'
    if (s < AGE_OF_UNIVERSE_SECONDS) {
      const y = s / SECONDS_PER_YEAR
      return (y >= 1e6 ? (y / 1e6).toFixed(1) + ' million' : Math.round(y).toLocaleString('en-US')) + ' years'
    }
    return magnitude(s / AGE_OF_UNIVERSE_SECONDS) + ' the age of the universe'
  }
  const pc = secs(1e6)
  const cloud = secs(1e12)
  if (bits < 50) return 'In plain terms: a single gaming PC guessing a million passwords per second would crack this in about ' + human(pc) + '. Don’t use it for anything that matters.'
  if (bits < 70) return 'In plain terms: a single gaming PC would need about ' + human(pc) + ' to crack this — but a criminal renting serious cloud hardware (a trillion guesses per second) gets there in about ' + human(cloud) + '. Fine for low-value accounts, not for important ones.'
  return 'In plain terms: a gaming PC guessing a million passwords per second would need ' + human(pc) + '. Even someone renting every cloud server on Earth — a trillion guesses per second — would need ' + human(cloud) + '. Nobody is guessing this password; the only realistic risks are it being reused or phished.'
}

// Detailed entropy analysis for password entropy calculator
export interface EntropyAnalysis {
  entropy: number
  charsetSize: number
  timeToCrackSummary: string
  timeToCrackYears: number
  strengthRating: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong'
  recommendations: string[]
}

export const analyzePasswordEntropy = (password: string): EntropyAnalysis => {
  let charsetSize = 0
  let hasLowercase = false
  let hasUppercase = false
  let hasDigits = false
  let hasSymbols = false
  let hasSpaces = false
  
  // Analyze character set
  for (const char of password) {
    if (/[a-z]/.test(char)) hasLowercase = true
    else if (/[A-Z]/.test(char)) hasUppercase = true
    else if (/[0-9]/.test(char)) hasDigits = true
    else if (/\s/.test(char)) hasSpaces = true
    else hasSymbols = true
  }
  
  // Calculate charset size
  if (hasLowercase) charsetSize += 26
  if (hasUppercase) charsetSize += 26
  if (hasDigits) charsetSize += 10
  if (hasSpaces) charsetSize += 1
  if (hasSymbols) charsetSize += 32 // Estimate common symbols
  
  const entropy = calculateEntropy(password.length, charsetSize)
  
  // Calculate time to crack (assuming 1 billion guesses per second)
  const totalCombinations = Math.pow(charsetSize, password.length)
  const avgAttempts = totalCombinations / 2 // On average, halfway through
  const secondsToCrack = avgAttempts / 1_000_000_000 // 1 billion guesses/sec
  const yearsToCrack = secondsToCrack / (365.25 * 24 * 3600)
  
  // Strength rating
  let strengthRating: EntropyAnalysis['strengthRating']
  if (entropy < 30) strengthRating = 'Very Weak'
  else if (entropy < 50) strengthRating = 'Weak'
  else if (entropy < 70) strengthRating = 'Fair'
  else if (entropy < 90) strengthRating = 'Good'
  else if (entropy < 120) strengthRating = 'Strong'
  else strengthRating = 'Very Strong'
  
  // Time to crack summary — delegate to the shared plain-English formatter
  // (previous implementation used its own vocabulary: 'Universe age+', '23k years').
  const timeToCrackSummary = crackTime(entropy)
  
  // Recommendations
  const recommendations: string[] = []
  if (password.length < 12) {
    recommendations.push(`Increase length to at least 12 characters`)
  }
  if (!hasLowercase) {
    recommendations.push('Add lowercase letters (a-z)')
  }
  if (!hasUppercase) {
    recommendations.push('Add uppercase letters (A-Z)')
  }
  if (!hasDigits) {
    recommendations.push('Add numbers (0-9)')
  }
  if (!hasSymbols && password.length < 20) {
    recommendations.push('Add symbols (!@#$%^&*)')
  }
  if (entropy < 64) {
    recommendations.push('Consider using a passphrase with multiple words')
  }
  
  return {
    entropy,
    charsetSize,
    timeToCrackSummary,
    timeToCrackYears: yearsToCrack,
    strengthRating,
    recommendations
  }
}

// Bundled 768-word vocabulary used by the passphrase generators.
export const EFF_WORDLIST = [
  'abacus', 'abdomen', 'able', 'aboard', 'about', 'above', 'abroad', 'abuse', 'accent', 'accept',
  'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action',
  'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult',
  'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent', 'agree',
  'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert', 'alien',
  'alike', 'alive', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
  'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
  'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
  'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
  'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
  'bacon', 'badge', 'bag', 'balance', 'ball', 'bamboo', 'banana', 'banner', 'bar', 'barely',
  'bargain', 'barrel', 'base', 'basic', 'basket', 'battle', 'beach', 'bean', 'beauty', 'become',
  'beef', 'before', 'begin', 'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit',
  'best', 'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind', 'biology',
  'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast', 'bleak', 'bless',
  'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur', 'blush', 'board', 'boat', 'body',
  'cabin', 'cable', 'cactus', 'cage', 'cake', 'call', 'calm', 'camera', 'camp', 'canal',
  'cancel', 'candle', 'candy', 'cannon', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'carbon',
  'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino', 'castle', 'casual',
  'catalog', 'catch', 'category', 'cattle', 'caught', 'cause', 'caution', 'cave', 'ceiling', 'celery',
  'damage', 'damp', 'dance', 'danger', 'daring', 'dash', 'daughter', 'dawn', 'day', 'deal',
  'debate', 'debris', 'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense',
  'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'denial', 'dentist', 'deny', 'depart',
  'depend', 'deposit', 'depth', 'deputy', 'derive', 'describe', 'desert', 'design', 'desk', 'despair',
  'eagle', 'early', 'earn', 'earth', 'easily', 'east', 'easy', 'echo', 'ecology', 'economy',
  'edge', 'edit', 'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric',
  'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody', 'embrace', 'emerge',
  'emotion', 'employ', 'empower', 'empty', 'enable', 'enact', 'end', 'endless', 'endorse', 'enemy',
  'fabric', 'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame', 'family',
  'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat', 'fatal', 'father', 'fatigue',
  'fault', 'favorite', 'feature', 'february', 'federal', 'fee', 'feed', 'feel', 'female', 'fence',
  'festival', 'fetch', 'fever', 'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film',
  'galaxy', 'gallery', 'game', 'gap', 'garage', 'garbage', 'garden', 'garlic', 'garment', 'gas',
  'gasp', 'gate', 'gather', 'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine',
  'gesture', 'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give', 'glad',
  'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom', 'glory', 'glove', 'glow',
  'habit', 'hair', 'half', 'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh',
  'harvest', 'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy', 'hedgehog',
  'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden', 'high', 'hill', 'hint',
  'hip', 'hire', 'history', 'hobby', 'hockey', 'hold', 'hole', 'holiday', 'hollow', 'home',
  'ice', 'icon', 'idea', 'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image',
  'imitate', 'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include', 'income',
  'jacket', 'jaguar', 'jar', 'jazz', 'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join',
  'joke', 'journey', 'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just',
  'kangaroo', 'keen', 'keep', 'ketchup', 'kick', 'kid', 'kidney', 'kind', 'kingdom', 'kiss',
  'kit', 'kitchen', 'kite', 'kitten', 'kiwi', 'knee', 'knife', 'knock', 'know', 'lab',
  'label', 'labor', 'ladder', 'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later',
  'latin', 'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy', 'leader',
  'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major', 'make', 'mammal',
  'man', 'manage', 'mandate', 'mango', 'mansion', 'manual', 'maple', 'marble', 'march', 'margin',
  'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature', 'near', 'neck', 'need',
  'negative', 'neglect', 'neither', 'nephew', 'nerve', 'nest', 'net', 'network', 'neutral', 'never',
  'oak', 'obey', 'object', 'oblige', 'obscure', 'observe', 'obtain', 'obvious', 'occur', 'ocean',
  'october', 'odor', 'off', 'offer', 'office', 'often', 'oil', 'okay', 'old', 'olive',
  'olympic', 'omit', 'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion',
  'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ', 'orient', 'original',
  'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output', 'outside', 'oval', 'oven', 'over',
  'own', 'owner', 'oxygen', 'oyster', 'ozone', 'pact', 'paddle', 'page', 'pair', 'palace',
  'quantum', 'quarter', 'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race',
  'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp', 'ranch', 'random',
  'range', 'rapid', 'rare', 'rate', 'rather', 'raven', 'raw', 'razor', 'ready', 'real',
  'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon', 'salon', 'salt', 'salute', 'same',
  'sample', 'sand', 'satisfy', 'satoshi', 'sauce', 'sausage', 'save', 'say', 'scale', 'scan',
  'table', 'tackle', 'tag', 'tail', 'talent', 'talk', 'tank', 'tape', 'target', 'task',
  'taste', 'tattoo', 'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent',
  'ugly', 'umbrella', 'unable', 'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold',
  'unhappy', 'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual', 'unveil',
  'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish', 'vapor', 'various', 'vast',
  'vault', 'vehicle', 'velvet', 'vendor', 'venture', 'venue', 'verb', 'verify', 'version', 'very',
  'wage', 'wagon', 'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior',
  'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon', 'wear', 'weasel',
  'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome', 'west', 'wet', 'whale', 'what',
  'wheel', 'when', 'where', 'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will',
  'win', 'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom', 'wise',
  'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool', 'word', 'work', 'world',
  'worry', 'worth', 'wrap', 'wreck', 'wrestle', 'wrist', 'write', 'wrong', 'yard', 'year',
  'yellow', 'you', 'young', 'youth', 'zebra', 'zero', 'zone', 'zoo'
]

export const calculatePassphraseEntropy = (wordCount: number): number => {
  return wordCount * Math.log2(EFF_WORDLIST.length)
}

// Generators
export const generators = {
  // Memorable passphrase using wordlist
  passphrase: (wordCount: number = 4, separator: string = '-'): string => {
    const words: string[] = []
    for (let i = 0; i < wordCount; i++) {
      words.push(EFF_WORDLIST[getSecureRandomInt(EFF_WORDLIST.length)])
    }
    return words.join(separator)
  },

  // Strong password with all character types
  password: (length: number = 16, includeSymbols: boolean = true): string => {
    const charset = includeSymbols ? ALL_CHARS : ALPHANUMERIC
    return generateString(length, charset)
  },

  // Alphanumeric only
  alphanumeric: (length: number = 24): string => {
    return generateString(length, ALPHANUMERIC)
  },

  // Hex string (for encryption keys)
  hex: (bytes: number = 32): string => {
    return bytesToHex(getSecureRandom(bytes))
  },

  // Base64 string
  base64: (bytes: number = 32): string => {
    return bytesToBase64(getSecureRandom(bytes))
  },

  // URL-safe base64
  urlSafeBase64: (bytes: number = 32): string => {
    return bytesToBase64(getSecureRandom(bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  },

  // UUID v4
  uuid: (): string => {
    const bytes = getSecureRandom(16)
    bytes[6] = (bytes[6] & 0x0f) | 0x40 // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80 // Variant 1
    const hex = bytesToHex(bytes)
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  },

  // API-style token with prefix
  apiToken: (prefix: string = 'sk', length: number = 32): string => {
    return `${prefix}_${generateString(length, ALPHANUMERIC)}`
  },

  // Django-style secret (50 chars, specific charset)
  djangoSecret: (): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)'
    return generateString(50, charset)
  },

  // WordPress-style salts (64 chars)
  wordpressSalt: (): string => {
    const charset = ALPHANUMERIC + '!@#$%^&*()-_ []{}<>~`+=,.;:/?|'
    return generateString(64, charset)
  },

  // JWT secret (for HS256, should be at least 256 bits = 32 bytes)
  jwtSecret: (algorithm: 'HS256' | 'HS384' | 'HS512' = 'HS256'): string => {
    const lengths = { HS256: 32, HS384: 48, HS512: 64 }
    return bytesToBase64(getSecureRandom(lengths[algorithm]))
  },

  // AES encryption (128, 192, or 256 bit)
  aesHex: (bits: 128 | 192 | 256 = 256): string => {
    return bytesToHex(getSecureRandom(bits / 8))
  },

  // Initialization vector (16 bytes for AES)
  iv: (): string => {
    return bytesToHex(getSecureRandom(16))
  },

  // Salt for password hashing (16-32 bytes typical)
  salt: (bytes: number = 16): string => {
    return bytesToHex(getSecureRandom(bytes))
  },

  // HMAC secret
  hmacSecret: (bytes: number = 32): string => {
    return bytesToBase64(getSecureRandom(bytes))
  },

  // PIN code
  pin: (length: number = 6): string => {
    return generateString(length, DIGITS)
  },

  // WPA/WiFi password (8-63 chars, printable ASCII)
  wpaPassword: (length: number = 20): string => {
    const charset = ALPHANUMERIC + SYMBOLS_SAFE
    return generateString(Math.min(Math.max(length, 8), 63), charset)
  },

  // MongoDB ObjectId style (24 hex chars)
  objectId: (): string => {
    return bytesToHex(getSecureRandom(12))
  },

  // Random string with configurable charset
  randomString: (length: number = 32, charset: string = ALPHANUMERIC): string => {
    return generateString(length, charset)
  },

  // Laravel APP_KEY (base64:32 bytes)
  laravelKey: (): string => {
    return `base64:${bytesToBase64(getSecureRandom(32))}`
  },

  // Flask secret key (hex, 24 bytes default)
  flaskSecret: (bytes: number = 24): string => {
    return bytesToHex(getSecureRandom(bytes))
  },

  // TOTP/2FA secret (base32 encoded)
  totpSecret: (bytes: number = 20): string => {
    const randomBytes = getSecureRandom(bytes)
    // Base32 encoding
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let result = ''
    let bits = 0
    let value = 0
    for (const byte of randomBytes) {
      value = (value << 8) | byte
      bits += 8
      while (bits >= 5) {
        bits -= 5
        result += alphabet[(value >> bits) & 0x1f]
      }
    }
    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 0x1f]
    }
    return result
  },

  // VAPID keys for Web Push (ECDSA P-256)
  // Note: Actual key generation requires async Web Crypto API
  // This returns a placeholder - real generation in component
  vapidPlaceholder: (): { publicKey: string; privateKey: string } => {
    return {
      publicKey: bytesToBase64(getSecureRandom(65)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''),
      privateKey: bytesToBase64(getSecureRandom(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    }
  },

  // Pronounceable password (consonant-vowel pattern)
  pronounceable: (length: number = 12, includeNumbers: boolean = true, capitalize: boolean = true): string => {
    const consonants = 'bcdfghjklmnprstvwxz' // Removed q, y for better pronunciation
    const vowels = 'aeiou'
    let result = ''
    let useConsonant = true
    
    // Generate base pronounceable string
    for (let i = 0; i < length; i++) {
      const charset = useConsonant ? consonants : vowels
      result += randomChar(charset)
      useConsonant = !useConsonant
    }
    
    // Optionally capitalize some letters
    if (capitalize) {
      const chars = result.split('')
      // Capitalize first letter
      chars[0] = chars[0].toUpperCase()
      // Capitalize 1-2 random positions
      const capsCount = Math.min(2, Math.floor(length / 4))
      for (let i = 0; i < capsCount; i++) {
        const pos = getSecureRandomInt(chars.length)
        chars[pos] = chars[pos].toUpperCase()
      }
      result = chars.join('')
    }
    
    // Optionally add numbers
    if (includeNumbers && length >= 6) {
      const chars = result.split('')
      const numCount = Math.min(2, Math.floor(length / 6))
      for (let i = 0; i < numCount; i++) {
        const pos = getSecureRandomInt(chars.length)
        const digit = getSecureRandomInt(10)
        chars[pos] = digit.toString()
      }
      result = chars.join('')
    }
    
    return result
  },

  // Backup/recovery codes (like Google's 8-char codes)
  backupCodes: (count: number = 10, length: number = 8): string[] => {
    const codes: string[] = []
    for (let i = 0; i < count; i++) {
      // Format: xxxx-xxxx for readability. LOWERCASE + DIGITS (36 chars) — an
      // ALPHANUMERIC.toLowerCase() pool would list every letter twice and bias
      // draws toward letters.
      const part1 = generateString(length / 2, LOWERCASE + DIGITS)
      const part2 = generateString(length / 2, LOWERCASE + DIGITS)
      codes.push(`${part1}-${part2}`)
    }
    return codes
  },

  // Recovery key (Apple/Google style - groups of characters)
  recoveryKey: (groups: number = 6, groupLength: number = 4): string => {
    const parts: string[] = []
    for (let i = 0; i < groups; i++) {
      parts.push(generateString(groupLength, UPPERCASE + DIGITS))
    }
    return parts.join('-')
  },

  // TOTP/Authenticator with additional features
  authenticator: (service: string = 'Service', username: string = 'user', bytes: number = 20): {
    secret: string
    qrData: string
    uri: string
  } => {
    const secret = generators.totpSecret(bytes)
    const uri = `otpauth://totp/${encodeURIComponent(service)}:${encodeURIComponent(username)}?secret=${secret}&issuer=${encodeURIComponent(service)}`
    
    return {
      secret,
      qrData: uri,
      uri
    }
  },

  // Generate TOTP code for current time (for demo purposes)
  generateTOTPCode: async (secret: string, timeStep: number = 30): Promise<string> => {
    // Simplified demo implementation - generates a realistic-looking code
    // In production, use a proper TOTP library
    const timeCounter = Math.floor(Date.now() / 1000 / timeStep)
    const code = (timeCounter % 900000) + 100000 // Ensures 6 digits
    return code.toString().padStart(6, '0')
  },

  // WebAuthn credential generation data
  webauthnCredential: (options: {
    rpId: string
    rpName: string
    userName: string
    userDisplayName: string
    authenticatorType: 'platform' | 'cross-platform'
    residentKey: 'discouraged' | 'preferred' | 'required'
    userVerification: 'discouraged' | 'preferred' | 'required'
    attestation: 'none' | 'indirect' | 'direct' | 'enterprise'
  }) => {
    const challenge = bytesToBase64(getSecureRandom(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const userId = bytesToBase64(getSecureRandom(64)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const credentialId = bytesToBase64(getSecureRandom(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    
    // Generate a mock public key (in real implementation, this would come from the authenticator)
    const publicKeyX = bytesToBase64(getSecureRandom(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    const publicKeyY = bytesToBase64(getSecureRandom(32)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    
    return {
      challenge,
      rp: {
        id: options.rpId,
        name: options.rpName
      },
      user: {
        id: userId,
        name: options.userName,
        displayName: options.userDisplayName
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: options.authenticatorType,
        residentKey: options.residentKey,
        userVerification: options.userVerification,
      },
      attestation: options.attestation,
      timeout: 60000,
      excludeCredentials: [],
      credential: {
        id: credentialId,
        publicKey: {
          kty: 'EC',
          alg: 'ES256',
          crv: 'P-256',
          x: publicKeyX,
          y: publicKeyY
        },
        authenticatorData: bytesToBase64(getSecureRandom(37)),
        clientDataJSON: btoa(JSON.stringify({
          type: 'webauthn.create',
          challenge: challenge,
          origin: `https://${options.rpId}`,
          crossOrigin: false
        }))
      }
    }
  },
}

// Terminal commands for secure generation
export const terminalCommands = {
  openssl: {
    random32: 'openssl rand -hex 32',
    random64: 'openssl rand -base64 32',
    aes256: 'openssl rand -hex 32',
    aes128: 'openssl rand -hex 16',
  },
  python: {
    secrets: "python3 -c \"import secrets; print(secrets.token_hex(32))\"",
    uuid: "python3 -c \"import uuid; print(uuid.uuid4())\"",
    urlsafe: "python3 -c \"import secrets; print(secrets.token_urlsafe(32))\"",
  },
  node: {
    crypto: "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    uuid: "node -e \"console.log(require('crypto').randomUUID())\"",
  },
  linux: {
    urandom: 'head -c 32 /dev/urandom | xxd -p -c 256',
    uuid: 'cat /proc/sys/kernel/random/uuid',
  },
}
