const {PrismaClient} = require('@prisma/client')
const db = new PrismaClient()

async function seed() {
  const kody = await db.user.create({
    data: {
      username: "kody",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });
  await Promise.all(
    getPosts().map((post) => {
      const data = {posterId: kody.id, ...post};
      return db.post.create({data});
    }),
  );
}

seed()

function getPosts() {
  return [
    {
      title: 'Prisma makes databases easy',
      body: 'Prisma is an open-source database toolkit that makes it easier to work with databases in modern applications. It provides an ORM (Object-Relational Mapping) that allows developers to interact with databases using a type-safe API and a declarative schema.'
    },
    {
      title: 'Prisma is a database toolkit',
      body: 'Prisma is a database toolkit that makes it easier to work with databases in modern applications. It provides an ORM (Object-Relational Mapping) that allows developers to interact with databases using a type-safe API and a declarative schema.'
    }
  ]
}