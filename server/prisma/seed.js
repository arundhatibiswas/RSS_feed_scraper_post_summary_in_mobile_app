const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create default category
    const newsCategory = await prisma.category.upsert({
        where: { name: 'Breaking News' },
        update: {},
        create: { name: 'Breaking News' }
    });

    // Create Admin
    await prisma.user.upsert({
        where: { email: 'admin@news.com' },
        update: { password: hashedPassword },
        create: {
            name: 'Admin User',
            email: 'admin@news.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    // Create Sub-Editor
    await prisma.user.upsert({
        where: { email: 'sub@news.com' },
        update: { password: hashedPassword },
        create: {
            name: 'Sub Editor',
            email: 'sub@news.com',
            password: hashedPassword,
            role: 'SUB_EDITOR'
        }
    });

    // Create Editor
    await prisma.user.upsert({
        where: { email: 'editor@news.com' },
        update: { password: hashedPassword },
        create: {
            name: 'Editor User',
            email: 'editor@news.com',
            password: hashedPassword,
            role: 'EDITOR'
        }
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
