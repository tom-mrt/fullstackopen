const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('../tests/test_helper');
const { log } = require('node:console');


const api = supertest(app)

let token, ownedBlogId

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash("secret", 10)
  const user = new User({ username: "root", password: passwordHash })

  await user.save()

  const response = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" })
    .expect(200)

  token = response.body.token

  const created = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "owned", author: "me", url: "u"})
    .expect(201)

  ownedBlogId = created.body.id
})

test("getによりレコードがjson形式で返されているか検証", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)

  const response = await api.get("/api/blogs")

  const blogsList = await Blog.find({})

  assert.strictEqual(response.body.length, blogsList.length)
})

test("ブログの一意の識別子プロパティがidであることを検証", async () => {
  const response = await api.get("/api/blogs")
  console.log(response.body)

  assert.ok("id" in response.body[0])
})

test("POSTでブログ総数が1つ増加するか検証", async () => {
  const usersList = await helper.usersInDb()
  const firstUser = usersList[0]
  
  const blogsAtStart = await helper.blogsInDb()
  
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
    likes: 4,
    userId: firstUser.id
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes("test"))
})

test("リクエストにlikesがないとき、デフォルトで0に設定される", async () => {
  const usersList = await helper.usersInDb()
  const firstUser = usersList[0]
  
  const newBlog = {
    title: "test",
    author: "test",
    url: "test",
    userId: firstUser.id
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const lastOne = blogsAtEnd.at(-1)

  assert.strictEqual(lastOne.likes, 0)
})

test("リクエストデータにタイトルまたはURLがない場合、バックエンドが400で応答することを確認", async () => {
  const usersList = await helper.usersInDb()
  const firstUser = usersList[0]
  
  const newBlog = {
    author: "test",
    url: "test",
    likes: 4,
    user: firstUser._id
  }

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test("指定したidのレコードを削除し、204で応答することを確認する", async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = await Blog.findById(ownedBlogId)

  await api
    .delete(`/api/blogs/${ownedBlogId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test("トークンが提供されていない場合、401エラー", async () => {
  res = await api
    .delete(`/api/blogs/${ownedBlogId}`)
    .expect(401)

  assert(res.body.error.includes("token missing"))
  
})

describe("ブログの更新", () => {
  test("指定したidのレコードを更新する", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 100 })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd[0].likes, 100)
  })

  test("指定したidがなかった場合、404を返す", async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString()
    

    await api
      .put(`/api/blogs/${nonExistingId}`)
      .send({ likes: 40 })
      .expect(404)
  })

describe("ユーザー登録", () => {
  test("全権取得で件数が一致するか検証", async () => {
    const res = await api.get("/api/users").expect(200)
    const count = res.body.length
    
    const initialUsers = await helper.usersInDb()
    
    assert.strictEqual(count, initialUsers.length)
  })

  test("新規ユーザーを登録", async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: "test2",
      password: "hello"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })

  test("ユーザー名、パスワードがないとき400エラーを返す", async () => {
     const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: "testtest"
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
    
    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("ユーザー名の長さが不十分", async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: "aa",
      password: "testtest"
    }

    const res = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert(res.body.error.includes("ユーザー名、パスワードの長さは3文字以上にしてください"))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})
})


after(async () => {
  await mongoose.connection.close()
})


