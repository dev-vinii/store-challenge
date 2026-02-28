import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../base.entity';
import { ProductEntity } from './product.entity';

@Entity('sales')
export class SaleEntity extends BaseEntity {
  @ManyToOne(() => ProductEntity)
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @Column({ name: 'product_id', type: 'uuid', nullable: false })
  productId: string;

  @Column({ name: 'quantity', type: 'integer', nullable: false })
  quantity: number;

  @Column({
    name: 'unit_price',
    type: 'integer',
    nullable: false,
    comment: 'Price in cents at time of sale',
  })
  unitPrice: number;

  @Column({
    name: 'total_price',
    type: 'integer',
    nullable: false,
    comment: 'quantity * unitPrice in cents',
  })
  totalPrice: number;
}
