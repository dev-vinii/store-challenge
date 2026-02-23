import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1771811890810 implements MigrationInterface {
    name = 'Migration1771811890810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "category" character varying(255) NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, "tags" text, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id")); COMMENT ON COLUMN "products"."price" IS 'Price in cents'`);
        await queryRunner.query(`CREATE TABLE "category_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_1a38b9007ed8afab85026703a53" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "category_entity"`);
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
