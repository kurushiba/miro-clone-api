import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyBoardObject1768429186078 implements MigrationInterface {
    name = 'ModifyBoardObject1768429186078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_board_object" ("id" varchar PRIMARY KEY NOT NULL, "boardId" varchar NOT NULL, "type" varchar CHECK( "type" IN ('sticky','text','image') ) NOT NULL DEFAULT ('sticky'), "x" float NOT NULL, "y" float NOT NULL, "width" float, "height" float, "content" text NOT NULL, "color" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_631ec6458b7f34c2c472d495bed" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_board_object"("id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt") SELECT "id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt" FROM "board_object"`);
        await queryRunner.query(`DROP TABLE "board_object"`);
        await queryRunner.query(`ALTER TABLE "temporary_board_object" RENAME TO "board_object"`);
        await queryRunner.query(`CREATE TABLE "temporary_board_object" ("id" varchar PRIMARY KEY NOT NULL, "boardId" varchar NOT NULL, "type" varchar CHECK( "type" IN ('sticky','text','image') ) NOT NULL DEFAULT ('sticky'), "x" float NOT NULL, "y" float NOT NULL, "width" float, "height" float, "content" text, "color" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_631ec6458b7f34c2c472d495bed" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_board_object"("id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt") SELECT "id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt" FROM "board_object"`);
        await queryRunner.query(`DROP TABLE "board_object"`);
        await queryRunner.query(`ALTER TABLE "temporary_board_object" RENAME TO "board_object"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board_object" RENAME TO "temporary_board_object"`);
        await queryRunner.query(`CREATE TABLE "board_object" ("id" varchar PRIMARY KEY NOT NULL, "boardId" varchar NOT NULL, "type" varchar CHECK( "type" IN ('sticky','text','image') ) NOT NULL DEFAULT ('sticky'), "x" float NOT NULL, "y" float NOT NULL, "width" float, "height" float, "content" text NOT NULL, "color" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_631ec6458b7f34c2c472d495bed" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "board_object"("id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt") SELECT "id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt" FROM "temporary_board_object"`);
        await queryRunner.query(`DROP TABLE "temporary_board_object"`);
        await queryRunner.query(`ALTER TABLE "board_object" RENAME TO "temporary_board_object"`);
        await queryRunner.query(`CREATE TABLE "board_object" ("id" varchar PRIMARY KEY NOT NULL, "boardId" varchar NOT NULL, "type" varchar CHECK( "type" IN ('sticky','text','image') ) NOT NULL DEFAULT ('sticky'), "x" float NOT NULL, "y" float NOT NULL, "width" float, "height" float, "content" text NOT NULL, "color" varchar, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_631ec6458b7f34c2c472d495bed" FOREIGN KEY ("boardId") REFERENCES "board" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "board_object"("id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt") SELECT "id", "boardId", "type", "x", "y", "width", "height", "content", "color", "createdAt", "updatedAt" FROM "temporary_board_object"`);
        await queryRunner.query(`DROP TABLE "temporary_board_object"`);
    }

}
