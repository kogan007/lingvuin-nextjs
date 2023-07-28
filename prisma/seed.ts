import { PrismaClient } from "@prisma/client";
import colors from "../src/items/colors";
import icons from "../src/items/icons";
const prisma = new PrismaClient();

async function main() {
  const items = [
    ...icons.map((icon) => ({
      name: icon.name,
      price: 2000,
      description: icon.name,
      hidden: false,
      locked: false,
      role: icon.role,
      image: icon.image,
      type: "icon",
    })),
    ...colors.map((color) => ({
      name: color.name,
      price: 2000,
      description: color.name,
      hidden: false,
      locked: false,
      role: color.role,
      type: "color",
    })),
  ];

  const result = await prisma.item.createMany({
    data: items,
  });

  console.log(result);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
