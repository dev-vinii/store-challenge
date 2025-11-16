import {
  Column,
  PrimaryColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export abstract class BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid', generated: 'uuid' })
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date

  @Column({ name: 'created_by', type: 'int' })
  createdBy: string

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    nullable: true,
  })
  updatedAt: Date

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date

  @Column({ name: 'deleted_by', type: 'uuid', nullable: true })
  deletedBy: string
}
