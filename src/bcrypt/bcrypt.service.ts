import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class BcryptService implements HashingService {
  compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted);
  }

  hash(data: string | Buffer): Promise<string> {
    return hash(data, 10);
  }
}
