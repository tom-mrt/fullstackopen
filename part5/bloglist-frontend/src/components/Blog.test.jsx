import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com/component-testing',
    likes: 0,
    user: {
      username: "test",
    }
  }

  render(<Blog blog={blog} />)

  const summary = screen.getByRole('button', { name: /view/i }).closest('div')
  
  expect(within(summary).getByText(blog.title, { exact: false})).toBeInTheDocument()
  expect(within(summary).getByText(blog.user.username, { exact: false})).toBeInTheDocument()
  expect(within(summary).queryByText(blog.url)).not.toBeInTheDocument()
  expect(within(summary).queryByText("likes")).not.toBeInTheDocument()
})

test("viewボタンがクリックされたときにurlといいねの数が表示される", async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com/component-testing',
    likes: 0,
    user: {
      username: "test",
    }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText("view")
  await user.click(button)

  const urlElement = screen.getByText(blog.url, { exact: false })
  const likesElement = screen.getByText("likes", { exact: false })
  screen.debug(urlElement)
  expect(urlElement).toBeVisible()
  expect(likesElement).toBeVisible()
})

test("likeボタンが2回クリックされる", async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'John Doe',
    url: 'https://example.com/component-testing',
    likes: 0,
    user: {
      username: "test",
    }
  }

  const mockHandler = vi.fn()
  
  render(<Blog blog={blog} onLike={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText("view")
  const likeButton = screen.getByText("like")
  await user.click(viewButton)
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
  
})
