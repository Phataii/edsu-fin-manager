import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableFields1734579843998 implements MigrationInterface {
    name = 'NullableFields1734579843998'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`transactions\` CHANGE \`jvNo\` \`jvNo\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`jvNo\` \`jvNo\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`dtid\` \`dtid\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`dtid\` \`dtid\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`revenue\` CHANGE \`jvNo\` \`jvNo\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`transactions\` CHANGE \`jvNo\` \`jvNo\` varchar(255) NOT NULL
        `);
    }

}
