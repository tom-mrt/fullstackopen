import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import { describe, expect } from 'vitest'

describe("<BlogForm />", () => {
  test("新しいブログが作成された時に、フォームがイベントハンドラーを正しい情報で呼び出すか確認", async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText("title:")
    const authorInput = screen.getByLabelText("author:")
    const urlInput = screen.getByLabelText("url:")
    const createButton = screen.getByText("create")

    await user.type(titleInput, "test title")
    await user.type(authorInput, "test author")
    await user.type(urlInput, "test url")
    await user.click(createButton)

    const payload = {
      title: "test title",
      author: "test author",
      url: "test url"
    }

    console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toStrictEqual(payload)


  })
})