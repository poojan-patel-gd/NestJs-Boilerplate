import { PrismaClient } from '@prisma/client';
import { USER_ROLES } from "../shared/constants/global.constants";
import { AuthHelpers } from "../shared/helpers/auth.helpers";

const prisma = new PrismaClient();

async function main() {

  try {
    console.log('Seeder process started');

    await seedRoles();
    const userId = await seedUsers(); // Get the created user's ID
    if (userId) {
      await seedUserRoles(userId); // Use the user ID to seed user roles
    }

    console.log('Seeder process completed successfully');
  } catch (error) {
    console.error('Seeder process failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function seedRoles() {
  console.log('Role Seeder process started');

  const data = [
    {
      name: "admin",
      authority: USER_ROLES.ADMIN
    },
    {
      name: "user",
      authority: USER_ROLES.USER
    },
    {
      name: "guest",
      authority: USER_ROLES.GUEST
    }
  ];

  for (const role of data) {
    const existingRole = await prisma.role.findFirst({
      where: { name: role.authority },
    });

    if (!existingRole) {
      await prisma.role.create({
        data: { name: role.name, authority: role.authority },
      });
    }
  }

  console.log('Role Seeder process completed successfully');
}

async function seedUsers() {
  console.log('User Seeder process started');

  const data = [
    {
      firstName: "John",
      lastName: "Doe",
      userName: "john_doe",
      email: "john@gmail.com",
      IsEmailVerify: true,
      password: "Admin@123",
    },
    // Add more user data objects as needed
  ];

  for (const userData of data) {
    const existingUser = await prisma.user.findFirst({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const hashedPassword = await AuthHelpers.hash(userData.password);
      const newUser = await prisma.user.create({
        data: { ...userData, password: hashedPassword },
      });
      // Return the created user's ID
      return newUser.id;
    }
  }

  console.log('User Seeder process completed successfully');
}

async function seedUserRoles(userId) {
  console.log('User Role Seeder process started');

  const adminRole = await prisma.role.findFirst({ where: { name: USER_ROLES.ADMIN } });

  if (!adminRole) {
    console.error('Admin role not found in the database');
    return;
  }

  const data = [
    {
      userId: userId,
      roleId: adminRole.id,
      isRoleActive: true,
      rolePreference: USER_ROLES.ADMIN,
    },
  ];

  for (const userRoleData of data) {
    await prisma.user_has_role.create({ data: userRoleData });
  }

  console.log('User Role Seeder process completed successfully');
}

main();
