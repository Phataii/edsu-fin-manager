import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1734088435653 implements MigrationInterface {
    name = 'Test1734088435653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\`
            ADD \`amount\` decimal(15, 2) NOT NULL DEFAULT '0.00'
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\`
            ADD \`vultAccountId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\`
            ADD UNIQUE INDEX \`IDX_7b9ead86053fd8b58e62843721\` (\`name\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\`
            ADD CONSTRAINT \`FK_1dfb3d1296519572f11fceccf57\` FOREIGN KEY (\`vultAccountId\`) REFERENCES \`vult-accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\` DROP FOREIGN KEY \`FK_1dfb3d1296519572f11fceccf57\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\` DROP INDEX \`IDX_7b9ead86053fd8b58e62843721\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\` DROP COLUMN \`vultAccountId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue-types\` DROP COLUMN \`amount\`
        `);
    }

}
