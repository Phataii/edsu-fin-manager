import { MigrationInterface, QueryRunner } from "typeorm";

export class SecondRevamp1733282122517 implements MigrationInterface {
    name = 'SecondRevamp1733282122517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`transactions\` (
                \`id\` varchar(36) NOT NULL,
                \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`jvNo\` varchar(255) NOT NULL,
                \`payerOrPayee\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`refNo\` varchar(255) NOT NULL,
                \`dveaNo\` varchar(255) NULL,
                \`debit\` decimal(15, 2) NOT NULL DEFAULT '0.00',
                \`credit\` decimal(15, 2) NOT NULL DEFAULT '0.00',
                \`image\` varchar(255) NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`userId\` varchar(255) NOT NULL,
                \`accountId\` varchar(36) NULL,
                INDEX \`IDX_26d8aec71ae9efbe468043cd2b\` (\`accountId\`),
                UNIQUE INDEX \`IDX_1a5f8ec161b4539d65b7cb9f60\` (\`refNo\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`email-template\` (
                \`id\` varchar(36) NOT NULL,
                \`type\` varchar(255) NULL,
                \`body\` varchar(255) NULL,
                \`subject\` varchar(255) NULL,
                \`from\` varchar(255) NULL,
                \`createdAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`dvea\` (
                \`id\` varchar(36) NOT NULL,
                \`dveaNumber\` varchar(255) NOT NULL,
                \`dveaType\` varchar(255) NOT NULL,
                \`accountId\` varchar(255) NOT NULL,
                \`createdOn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`vult-accounts\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`openBal\` decimal(15, 2) NOT NULL DEFAULT '0.00',
                \`currentBal\` decimal(15, 2) NOT NULL DEFAULT '0.00',
                \`openBalDate\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\`
            ADD CONSTRAINT \`FK_26d8aec71ae9efbe468043cd2b9\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\`
            ADD CONSTRAINT \`FK_6bb58f2b6e30cb51a6504599f41\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`dvea\`
            ADD CONSTRAINT \`FK_521badb69560ae60e94eb681e28\` FOREIGN KEY (\`accountId\`) REFERENCES \`account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`dvea\` DROP FOREIGN KEY \`FK_521badb69560ae60e94eb681e28\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_6bb58f2b6e30cb51a6504599f41\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\` DROP FOREIGN KEY \`FK_26d8aec71ae9efbe468043cd2b9\`
        `);
        await queryRunner.query(`
            DROP TABLE \`vult-accounts\`
        `);
        await queryRunner.query(`
            DROP TABLE \`dvea\`
        `);
        await queryRunner.query(`
            DROP TABLE \`email-template\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_1a5f8ec161b4539d65b7cb9f60\` ON \`transactions\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_26d8aec71ae9efbe468043cd2b\` ON \`transactions\`
        `);
        await queryRunner.query(`
            DROP TABLE \`transactions\`
        `);
    }

}
