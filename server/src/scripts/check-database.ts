import { prisma } from "../config/database.js";

async function main() {
  const result = await prisma.$queryRaw<
    Array<{
      currentUser: string;
      currentDatabase: string;
    }>
  >`
    SELECT
      current_user AS "currentUser",
      current_database() AS "currentDatabase"
  `;

  console.log(result[0]);
}

main()
  .catch((error: unknown) => {
    console.error("Database check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
