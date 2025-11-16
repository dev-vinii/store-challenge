import { Column } from 'typeorm'
import { BaseEntity } from '../../base.entity'

export class ProductEntity extends BaseEntity {
  @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name: string

  @Column({ name: 'description', type: 'varchar', length: 255 })
  description: string

  @Column({ name: 'category', type: 'varchar', length: 255 })
  category: string

  @Column({
    name: 'price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  price: number

  @Column({ name: 'stock', type: 'integer', nullable: false })
  stock: number

  @Column({ name: 'tags', type: 'simple-array', nullable: true })
  tags: string[]
}
