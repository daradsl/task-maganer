import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, Index, OneToOne, JoinColumn } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Address } from './address.entity';

@Entity()
@Index(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ nullable: true })
  password?: string;

  @OneToOne(() => Address, (address) => address.user, { nullable: true })
  @JoinColumn()
  address?: Address;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
