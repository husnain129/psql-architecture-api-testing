require("dotenv").config();

const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repos");
const Context = require("./context");

let context;

beforeAll(async () => {
  context = await Context.build();
});

afterAll(() => {
  return context.close();
});

it("create a user", async () => {
  const startingCount = await UserRepo.countUser();
  expect(startingCount).toEqual(0);
  await request(buildApp())
    .post("/user")
    .send({ username: "test user", bio: "test bio" })
    .expect(200);
  const finishCount = await UserRepo.countUser();
  expect(finishCount).toEqual(1);
});
