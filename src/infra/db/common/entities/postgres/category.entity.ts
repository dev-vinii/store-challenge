import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;
}
