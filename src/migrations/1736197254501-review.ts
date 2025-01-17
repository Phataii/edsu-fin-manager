import { MigrationInterface, QueryRunner } from "typeorm";

export class Review1736197254501 implements MigrationInterface {
    name = 'Review1736197254501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_4aa03eea656596c16e8c6b4beb7\` FOREIGN KEY (\`vultAccountId\`) REFERENCES \`vult-accounts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_4aa03eea656596c16e8c6b4beb7\`
        `);
    }

}
