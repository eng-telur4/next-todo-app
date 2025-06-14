// prisma/seed.ts (deleteMany + createMany)
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding todo items...");

  const todosToCreate = [
    { title: '掃除' },
    { title: '勉強' },
    { title: '買い物' },
  ];

  // 既存のTodoアイテムをすべて削除
  await prisma.todo.deleteMany();
  console.log('All existing todo items deleted.');

  // 新しいTodoアイテムを一括挿入
  const result = await prisma.todo.createMany({
    data: todosToCreate,
  });

  console.log(`Seeding finished. Created ${result.count} todo items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });