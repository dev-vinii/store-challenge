import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1763331313726 implements MigrationInterface {
  name = 'Migration1763331313726'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "category" character varying(255) NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "tags" text, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")); COMMENT ON COLUMN "products"."price" IS 'Price in cents'`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "products"`)
  }
}
