-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BookLib" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "location" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "BookLib_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book" ("isbn") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_BookLib" ("id", "isbn", "location", "status") SELECT "id", "isbn", "location", "status" FROM "BookLib";
DROP TABLE "BookLib";
ALTER TABLE "new_BookLib" RENAME TO "BookLib";
CREATE TABLE "new_Credit" (
    "user_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "credit" INTEGER NOT NULL DEFAULT 100,
    CONSTRAINT "Credit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Credit" ("credit", "user_id") SELECT "credit", "user_id" FROM "Credit";
DROP TABLE "Credit";
ALTER TABLE "new_Credit" RENAME TO "Credit";
CREATE UNIQUE INDEX "Credit_user_id_key" ON "Credit"("user_id");
CREATE TABLE "new_Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "rate" INTEGER NOT NULL,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "isbn" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Post_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book" ("isbn") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Post" ("content", "delete", "id", "isbn", "rate", "user_id") SELECT "content", "delete", "id", "isbn", "rate", "user_id" FROM "Post";
DROP TABLE "Post";
ALTER TABLE "new_Post" RENAME TO "Post";
CREATE UNIQUE INDEX "Post_id_key" ON "Post"("id");
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
    CONSTRAINT "Borrow_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BookLib" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Borrow" ("bookId", "borrow_date", "id", "is_return", "isbn", "return_date", "user_id") SELECT "bookId", "borrow_date", "id", "is_return", "isbn", "return_date", "user_id" FROM "Borrow";
DROP TABLE "Borrow";
ALTER TABLE "new_Borrow" RENAME TO "Borrow";
CREATE UNIQUE INDEX "Borrow_id_key" ON "Borrow"("id");
CREATE UNIQUE INDEX "Borrow_bookId_key" ON "Borrow"("bookId");
CREATE TABLE "new_Inventory" (
    "isbn" TEXT NOT NULL PRIMARY KEY,
    "sums" INTEGER NOT NULL DEFAULT 0,
    "rest" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Inventory_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book" ("isbn") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("isbn", "rest", "sums") SELECT "isbn", "rest", "sums" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
CREATE UNIQUE INDEX "Inventory_isbn_key" ON "Inventory"("isbn");
CREATE TABLE "new_Book" (
    "isbn" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "type" INTEGER NOT NULL,
    CONSTRAINT "Book_type_fkey" FOREIGN KEY ("type") REFERENCES "BookType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Book" ("author", "description", "isbn", "name", "price", "type", "views") SELECT "author", "description", "isbn", "name", "price", "type", "views" FROM "Book";
DROP TABLE "Book";
ALTER TABLE "new_Book" RENAME TO "Book";
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
