import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableValues1733416892834 implements MigrationInterface {
    name = 'NullableValues1733416892834'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_ebd389035f18e6b30b851761da5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_34de35e03813be5fd575b32099a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`source\` \`source\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`amount\` \`amount\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`dateReceived\` \`dateReceived\` datetime NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`transactionDate\` \`transactionDate\` datetime NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`mode\` \`mode\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`ref\` \`ref\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`desc\` \`desc\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`revenueTypeId\` \`revenueTypeId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`userId\` \`userId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_ebd389035f18e6b30b851761da5\` FOREIGN KEY (\`revenueTypeId\`) REFERENCES \`revenue-types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_34de35e03813be5fd575b32099a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_34de35e03813be5fd575b32099a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_ebd389035f18e6b30b851761da5\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`userId\` \`userId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`revenueTypeId\` \`revenueTypeId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`desc\` \`desc\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`ref\` \`ref\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`mode\` \`mode\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`transactionDate\` \`transactionDate\` datetime NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`dateReceived\` \`dateReceived\` datetime NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`amount\` \`amount\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`source\` \`source\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_34de35e03813be5fd575b32099a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_ebd389035f18e6b30b851761da5\` FOREIGN KEY (\`revenueTypeId\`) REFERENCES \`revenue-types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
