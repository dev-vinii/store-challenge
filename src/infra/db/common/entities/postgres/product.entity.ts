import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base.entity';

@Entity('products')
export class ProductEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  description: string;

  @Column({ name: 'category', type: 'varchar', length: 255, nullable: false })
  category: string;

  @Column({
    name: 'price',
    type: 'integer',
    nullable: false,
    comment: 'Price in cents',
  })
  price: number;

  @Column({ name: 'stock', type: 'integer', nullable: false })
  stock: number;

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags: string[];
}
