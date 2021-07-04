import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

import { ManagedEntity } from '../../managed-entities/managed-entities/managed-entity';

@Entity()
export class User extends ManagedEntity {
  @Column({ length: 255, unique: true })
  email: string;

  @Exclude()
  @Column({ length: 255, nullable: true, default: null })
  password: string;

  @Column({ length: 255, nullable: true, default: null, unique: true })
  userName: string;

  @Column({ type: 'text', default: null })
  refreshToken: string;
}
