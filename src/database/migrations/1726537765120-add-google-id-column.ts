import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleIdColumn1726537765120 implements MigrationInterface {
    name = 'AddGoogleIdColumn1726537765120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "googleId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleId"`);
    }

}
