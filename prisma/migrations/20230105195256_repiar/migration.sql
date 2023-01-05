-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Borrow" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "isbn" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bookId" INTEGER NOT NULL,
    "borrow_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_date" DATETIME NOT NULL,
    "is_return" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Borrow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Borrow_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book" ("isbn") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Borrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookLib" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_Borrow" ("bookId", "borrow_date", "id", "is_return", "isbn", "return_date", "user_id") SELECT "bookId", "borrow_date", "id", "is_return", "isbn", "return_date", "user_id" FROM "Borrow";
DROP TABLE "Borrow";
ALTER TABLE "new_Borrow" RENAME TO "Borrow";
CREATE UNIQUE INDEX "Borrow_id_key" ON "Borrow"("id");
CREATE UNIQUE INDEX "Borrow_bookId_key" ON "Borrow"("bookId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
