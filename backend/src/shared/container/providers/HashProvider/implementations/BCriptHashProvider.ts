import { compare, hash } from 'bcryptjs';
import IHashProvider from '../models/IHashProvider';

class BCriptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    const hashed = hash(payload, 8);
    return hashed;
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    const isTrue = compare(payload, hashed);
    return isTrue;
  }
}

export default BCriptHashProvider;
