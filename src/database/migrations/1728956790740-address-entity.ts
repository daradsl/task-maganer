import { MigrationInterface, QueryRunner } from "typeorm";

export class AddressEntity1728956790740 implements MigrationInterface {
    name = 'AddressEntity1728956790740'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" SERIAL NOT NULL, "complement" character varying NOT NULL, "city" character varying, "state" character varying, "zipCode" character varying, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "addressId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271" UNIQUE ("addressId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_217ba147c5de6c107f2fa7fa271"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_217ba147c5de6c107f2fa7fa271"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "addressId"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
