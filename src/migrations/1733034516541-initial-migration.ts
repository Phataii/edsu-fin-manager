import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1733034516541 implements MigrationInterface {
    name = 'InitialMigration1733034516541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`firstName\` varchar(255) NOT NULL,
                \`lastName\` varchar(255) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`emailVerified\` tinyint NOT NULL DEFAULT 0,
                \`password\` varchar(255) NOT NULL,
                \`isNew\` tinyint NOT NULL DEFAULT 1,
                \`privilege\` int NOT NULL,
                \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`revenue\` (
                \`id\` varchar(36) NOT NULL,
                \`dtid\` varchar(255) NOT NULL,
                \`source\` varchar(255) NOT NULL,
                \`amount\` int NOT NULL,
                \`dateReceived\` datetime NOT NULL,
                \`transactionDate\` datetime NOT NULL,
                \`mode\` varchar(255) NOT NULL,
                \`ref\` varchar(255) NOT NULL,
                \`desc\` varchar(255) NOT NULL,
                \`userId\` varchar(255) NOT NULL,
                \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`accountId\` varchar(36) NULL,
                INDEX \`IDX_cd82b0b6d0477d085cf5741db6\` (\`accountId\`),
                UNIQUE INDEX \`IDX_fb08aeb478762f6aba9526cce8\` (\`dtid\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`account\` (
                \`id\` varchar(36) NOT NULL,
                \`accountNumber\` varchar(255) NOT NULL,
                \`accountType\` varchar(255) NOT NULL,
                \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`logs\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`action\` varchar(255) NULL,
                \`userId\` varchar(255) NOT NULL,
                \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`otps\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`code\` varchar(255) NOT NULL,
                \`userId\` int NOT NULL,
                \`expiresAt\` timestamp NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`isUsed\` tinyint NOT NULL DEFAULT 0,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`revenue-types\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_cd82b0b6d0477d085cf5741db6a\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\`
            ADD CONSTRAINT \`FK_34de35e03813be5fd575b32099a\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`logs\`
            ADD CONSTRAINT \`FK_a1196a1956403417fe3a0343390\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`logs\` DROP FOREIGN KEY \`FK_a1196a1956403417fe3a0343390\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_34de35e03813be5fd575b32099a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` DROP FOREIGN KEY \`FK_cd82b0b6d0477d085cf5741db6a\`
        `);
        await queryRunner.query(`
            DROP TABLE \`revenue-types\`
        `);
        await queryRunner.query(`
            DROP TABLE \`otps\`
        `);
        await queryRunner.query(`
            DROP TABLE \`logs\`
        `);
        await queryRunner.query(`
            DROP TABLE \`account\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_fb08aeb478762f6aba9526cce8\` ON \`revenue\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_cd82b0b6d0477d085cf5741db6\` ON \`revenue\`
        `);
        await queryRunner.query(`
            DROP TABLE \`revenue\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
