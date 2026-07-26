import type { User as Base44User } from '@base44/sdk';

import type { AuthenticatedUser } from './authTypes';

export function projectBase44User(user: Base44User): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.full_name,
    emailVerified: user.is_verified,
  };
}
