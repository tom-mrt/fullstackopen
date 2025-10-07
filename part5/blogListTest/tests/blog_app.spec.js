const { test, expect, beforeEach, describe } = require('@playwright/test');

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset")
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "root",
        username: "root",
        password: "test"
      }
    })
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "root2",
        username: "root2",
        password: "test2"
      }
    })

    await page.goto("http://localhost:5173")
  })

  test("Login form is shown", async ({ page }) => {
    const formTitle = page.getByText("log in to application")

    await expect(formTitle).toBeVisible()
  })

  test("ログイン成功", async ({ page }) => {
    await page.getByLabel("username").fill("root")
    await page.getByLabel("password").fill("test")
    await page.getByRole("button", { name: "login" }).click()

    await expect(page.getByText("root logged in")).toBeVisible()
  })

  test("ログイン失敗", async ({ page }) => {
    await page.getByLabel("username").fill("root")
    await page.getByLabel("password").fill("wrong")
    await page.getByRole("button", { name: "login" }).click()

    await expect(page.getByText('wrong username or password')).toBeVisible()
  })

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await page.getByLabel("username").fill("root")
      await page.getByLabel("password").fill("test")
      await page.getByRole("button", { name: "login" }).click()
    })

    test("新しいブログ作成後、一覧に表示される", async ({ page }) => {
      const title = `playwright tips ${Date.now()}`
      const author = "QA"
      const url = "https://example.com/tips"

      await page.getByRole("button", { name: "create new blog"}).click()

      await page.getByLabel("title:").fill(title)
      await page.getByLabel("author:").fill(author)
      await page.getByLabel("url:").fill(url)

      await page.getByRole("button", { name: "create" }).click()

      const blogItem = page
        .locator("div", { hasText: title })
        .filter({ has: page.getByRole("button", { name: "view" }) })
        .first()

      await expect(blogItem).toBeVisible()
    })

    describe("いいねの検証", () => {
      beforeEach(async ({ page }) => {
        const title = `Like Inc Test`
        const author = "QA"
        const url = "https://example.com/tips"

        await page.getByRole("button", { name: "create new blog"}).click()

        await page.getByLabel("title:").fill(title)
        await page.getByLabel("author:").fill(author)
        await page.getByLabel("url:").fill(url)

        await page.getByRole("button", { name: "create" }).click()
        await page.getByRole("button", { name: "view" }).click()
      })

      test("いいねを押した場合、数値が+1される", async ({ page }) => {
        const blogItem = page
          .locator("div", { hasText: "Like Inc Test"})
          .filter({ has: page.getByRole("button", { name: "hide" }) })
          .first()

        const getLikes = async () => {
          const text = await blogItem.innerText()
          const m = text.match(/likes\s+(\d+)/i)
          console.log(text)
          console.log(m);
          return m ? Number(m[1]) : NaN
        }

        const before = await getLikes()

        await blogItem.getByRole("button", { name: "like" }).click()

        await expect(blogItem).toContainText(new RegExp(`likes\\s+${before + 1}`))

      })

    })
  
    describe("削除機能の検証", () => {
      beforeEach(async ({ page }) => {
        const title = `Delete Test`
        const author = "QA"
        const url = "https://example.com/tips"

        await page.getByRole("button", { name: "create new blog"}).click()

        await page.getByLabel("title:").fill(title)
        await page.getByLabel("author:").fill(author)
        await page.getByLabel("url:").fill(url)

        await page.getByRole("button", { name: "create" }).click()
        await page.getByRole("button", { name: "view" }).click()
      })

      test("ブログを追加したユーザーがブログを削除できるか検証", async ({ page }) => {
        // pageにイベントハンドラを追加。dialogで発火
        page.once("dialog", d => d.accept())
        await page.getByRole("button", { name: "remove" }).click()

        const blogItem = page
          .locator("div", { hasText: "Delete Test"})
          .filter({ has: page.getByRole("button", { name: "hide" }) })
          .first()

        await expect(blogItem).not.toBeVisible()

      })

      test("ブログを追加したユーザーだけに削除ボタンが表示されるか検証", async ({ page }) => {
        await page.getByRole("button", { name: "logout" }).click()
        await page.getByLabel("username").fill("root2")
        await page.getByLabel("password").fill("test2")
        await page.getByRole("button", { name: "login" }).click()
        
        await page.getByRole("button", { name: "view" }).click()

        const removeButton = await page.getByRole("button", { name: "remove" })
        await expect(removeButton).not.toBeVisible()

      })
    })

    describe("並び替え機能の検証", () => {
      beforeEach(async ({ page }) => {
        const blogList = [
          {
            title: "test1",
            author: "author1",
            url: "url1",
          },
          {
            title: "test2",
            author: "author2",
            url: "url2",
          },
          {
            title: "test3",
            author: "author3",
            url: "url3",
          },
        ]

        for (let i = 0; i < blogList.length; i++) {
          await page.getByRole("button", { name: "create new blog"}).click()

          await page.getByLabel("title:").fill(blogList[i].title)
          await page.getByLabel("author:").fill(blogList[i].author)
          await page.getByLabel("url:").fill(blogList[i].url)

          await page.getByRole("button", { name: "create" }).click()
          await page.getByRole("button", { name: "view" }).click()
          
          const blogItem = page
            .locator("div", { hasText: blogList[i].title })
            .filter({ has: page.getByRole("button", { name: "like" }) })
            .first()
            .waitFor()
        }

      })
      test("いいねを数回クリックした後、正しく並べ替えできている", async ({ page }) => {
        const blogList = [
          {
            title: "test1",
            author: "author1",
            url: "url1",
          },
          {
            title: "test2",
            author: "author2",
            url: "url2",
          },
          {
            title: "test3",
            author: "author3",
            url: "url3",
          },
        ]
        
        const list = page.getByRole("heading", { name: "blogs" }).locator("xpath=..")

        const cards = () => {
          return list.locator(":scope > div").filter({ has: page.getByRole("button", { name: /like|hide/}) })
        }

        const blog = cards().filter({ hasText: blogList[0].title }).first()
        const blog2 = cards().filter({ hasText: blogList[1].title }).first()
        const blog3 = cards().filter({ hasText: blogList[2].title }).first()

        const likeOnceAndWait = async (card, expectedLikes) => {
          await card.getByRole("button", { name: "like" }).click()
          await expect(card).toContainText(new RegExp(`likes\\s+${expectedLikes}`))
        }

        await likeOnceAndWait(blog, 1);
        await likeOnceAndWait(blog2, 1); 
        await likeOnceAndWait(blog2, 2);
        await likeOnceAndWait(blog3, 1); 
        await likeOnceAndWait(blog3, 2); 
        await likeOnceAndWait(blog3, 3);

        const top = cards().first()
        const second = cards().nth(1)
        const third = cards().nth(2)

        await expect(top).toContainText(blogList[2].title)
        await expect(top).toContainText(/likes\s+3/)
        await expect(second).toContainText(blogList[1].title)
        await expect(second).toContainText(/likes\s+2/)
        await expect(third).toContainText(blogList[0].title)
        await expect(third).toContainText(/likes\s+1/)

      })
    })
  })
})

