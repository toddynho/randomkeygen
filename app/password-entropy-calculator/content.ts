export const entropyFaqs = [
  {
    q: 'How is password entropy calculated?',
    a: 'Entropy in bits is length times log base 2 of the pool size: E = L × log₂(N). N is 26 for lowercase, 26 for uppercase, 10 for digits, and 32 for other symbols. The result is rounded down to a whole number of bits. That is the entropy of a string drawn uniformly at random from that pool, not a guessability score for a phrase a person made up.',
  },
  {
    q: 'How accurate are the time-to-crack estimates?',
    a: 'Crack time assumes the attacker already knows the pool and tries half of it (2^(E−1) guesses) at one trillion guesses per second. It is an offline brute-force estimate. Rate limits, account lockouts, and a slow password hash such as bcrypt or Argon2 make an online or database attack much slower. A reused or phished password is not protected by this number.',
  },
  {
    q: 'Is a longer password always better than a complex one?',
    a: 'Length multiplies the exponent, so it usually adds more entropy than swapping in one more symbol class. A 20-character lowercase string is about 94 bits; a 12-character string from a 94-character pool is about 78 bits. Use both when the system allows it. A passphrase drawn from a large word list is a different pool — its entropy is word count times log₂ of the list size, not character length.',
  },
  {
    q: 'What about dictionary words and patterns?',
    a: 'This calculator assumes each character was chosen independently and uniformly from the selected pool. Dictionary words, keyboard walks, and predictable substitutions such as @ for a are not uniform, so the real chance an attacker guesses them is much higher than the bit count. Generate the password at random, or use a long passphrase, for accounts that matter.',
  },
  {
    q: 'How much entropy do I need?',
    a: 'For most online accounts, aim for at least 64 bits and turn on a second factor. High-value accounts are more comfortable at 80 bits or more. A master password or an encryption passphrase should be in the 128-bit range, because it may have to resist offline guessing. These are rules of thumb for random secrets, not for words you chose yourself.',
  },
] as const
