import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1772317354805 implements MigrationInterface {
    name = 'Migration1772317354805'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price" integer NOT NULL, "total_price" integer NOT NULL, CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id")); COMMENT ON COLUMN "sales"."unit_price" IS 'Price in cents at time of sale'; COMMENT ON COLUMN "sales"."total_price" IS 'quantity * unitPrice in cents'`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_5015e2759303d7baaf47fc53cc8" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_5015e2759303d7baaf47fc53cc8"`);
        await queryRunner.query(`DROP TABLE "sales"`);
    }

}
