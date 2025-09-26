const _ = require('lodash');


const dummy = (blogs) => {
  return 1
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total += blog.likes
  }, 0) 
};

const favoriteBlog = (blogs) => {
  if (blogs.length) {
    const sorted = [...blogs].sort((a, b) => {
    return b.likes - a.likes
  })
  return sorted[0]
  } else {
    return null
  }
  
};

const mostBlogs = (blogs) => {
  const count = _.countBy(blogs, "author")
  const authorList = Object.entries(count).map(([author, blogs]) => {
    return { author, blogs }
  })
  if (authorList.length) {
    authorList.sort((a, b) => {
      return b.blogs - a.blogs
    })
    return authorList[0]
  } else {
    return null
  }
};

const mostLikes = (blogs) => {
  if (blogs.length) {
    const grouped = _.groupBy(blogs, "author")
    const likesArray = Object.entries(grouped).map(([author, items]) => {
      return { author, "likes": _.sumBy(items, it => {
        return it.likes
      })}
    })
    return likesArray.sort((a, b) => {
      return b.likes - a.likes
    })[0]
  } else {
    return null
  }

};

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}