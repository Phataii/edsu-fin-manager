import { MigrationInterface, QueryRunner } from "typeorm";

export class Review21736202287972 implements MigrationInterface {
    name = 'Review21736202287972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD \`AccountId\` varchar(255) NULL
        `);
        
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_cd82b0b6d0477d085cf5741db6a\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_cd82b0b6d0477d085cf5741db6a\`
        `);
        
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP COLUMN \`AccountId\`
        `);
    }

}
