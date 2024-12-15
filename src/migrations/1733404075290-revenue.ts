import { MigrationInterface, QueryRunner } from "typeorm";

export class Revenue1733404075290 implements MigrationInterface {
    name = 'Revenue1733404075290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`transactions\`
            ADD \`settled\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\`
            ADD \`dtNo\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD \`settled\` tinyint NOT NULL DEFAULT 0
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD \`revenueTypeId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_ebd389035f18e6b30b851761da5\` FOREIGN KEY (\`revenueTypeId\`) REFERENCES \`revenue-types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_ebd389035f18e6b30b851761da5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP COLUMN \`revenueTypeId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP COLUMN \`settled\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\` DROP COLUMN \`dtNo\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\` DROP COLUMN \`settled\`
        `);
    }

}
