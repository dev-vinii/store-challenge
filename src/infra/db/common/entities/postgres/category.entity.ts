import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column()
  name: string;
}
