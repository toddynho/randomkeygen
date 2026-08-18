export type TokenType = 'access_token' | 'refresh_token' | 'client_secret' | 'authorization_code'

export const tokenTypes: Record<
  TokenType,
  {
    length: number
    prefix: string
    description: string
    expiryRecommendation: string
  }
> = {
  access_token: {
    length: 32,
    prefix: 'ya29',
    description: 'Short-lived token for API access',
    expiryRecommendation: '1-2 hours',
  },
  refresh_token: {
    length: 64,
    prefix: '1//04',
    description: 'Long-lived token for refreshing access tokens',
    expiryRecommendation: '90 days - 1 year',
  },
  client_secret: {
    length: 48,
    prefix: 'cs_',
    description: 'Secret for OAuth client authentication',
    expiryRecommendation: 'No expiry (rotate yearly)',
  },
  authorization_code: {
    length: 24,
    prefix: 'ac_',
    description: 'Temporary code for authorization flow',
    expiryRecommendation: '10 minutes',
  },
}
