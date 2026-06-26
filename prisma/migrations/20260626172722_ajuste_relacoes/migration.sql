-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "fkh4c7lvsc298whoyd4w9ta25cr";

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fkh4c7lvsc298whoyd4w9ta25cr" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
