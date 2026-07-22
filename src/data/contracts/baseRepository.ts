import { Result } from '@/lib/errors';

/**
 * Generic Base Repository Contract interface.
 * Component layers will interact with repository interfaces rather than direct SDKs or APIs.
 * Concrete implementations (Mock, future Base44, etc.) will adhere to these contracts.
 */
export interface IBaseRepository<T, ID = string> {
  findById(id: ID): Promise<Result<T | null>>;
  findAll(): Promise<Result<T[]>>;
  create(data: Omit<T, 'id'>): Promise<Result<T>>;
  update(id: ID, data: Partial<T>): Promise<Result<T>>;
  delete(id: ID): Promise<Result<boolean>>;
}
