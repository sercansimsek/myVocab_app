import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";

async function main() {
  const passwordHash = await bcrypt.hash("DevPassword123!", 12);

  const user = await prisma.user.upsert({
    where: {
      email: "demo@myvocab.local",
    },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@myvocab.local",
      passwordHash,
      words: {
        create: [
          {
            english: "knowledge",
            turkish: "bilgi",
            slovak: "vedomosť",
          },
          {
            english: "beautiful",
            turkish: "güzel",
            slovak: "krásny",
          },
          {
            english: "family",
            turkish: "aile",
            slovak: "rodina",
          },
        ],
      },
    },
    include: {
      words: true,
    },
  });

  console.log({
    user: user.email,
    wordCount: user.words.length,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
