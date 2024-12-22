import { MigrationInterface, QueryRunner } from "typeorm";

export class Jtno1734577985170 implements MigrationInterface {
    name = 'Jtno1734577985170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_1a5f8ec161b4539d65b7cb9f60\` ON \`transactions\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD \`jvNo\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP COLUMN \`jvNo\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_1a5f8ec161b4539d65b7cb9f60\` ON \`transactions\` (\`refNo\`)
        `);
    }

}
