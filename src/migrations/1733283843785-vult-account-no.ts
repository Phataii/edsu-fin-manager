import { MigrationInterface, QueryRunner } from "typeorm";

export class VultAccountNo1733283843785 implements MigrationInterface {
    name = 'VultAccountNo1733283843785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`vult-accounts\`
            ADD \`accountNumber\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`vult-accounts\` DROP COLUMN \`accountNumber\`
        `);
    }

}
