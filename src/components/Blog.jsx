import { useState } from "react"

import BlogService from "../services/blogs"

const Blog = ({ blog, likeAction, deleteAction }) => {  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)

  const onClickLike = async() => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    likeAction(updatedBlog)
    BlogService.update(updatedBlog, blog.id)
  }

  const removeBlog = () => {
    const isConfirm = confirm(`Remove Blog: ${blog.title} by ${blog.author}`)
    
    if (isConfirm) {
      BlogService.remove(blog.id)
      deleteAction(blog)
    }
  }

  const showDetails = () => {
    setView(!view)
  }

  const MinBlog = (props) => (
    <div style={blogStyle}>
      {`${blog.title} ${blog.author} `}
      <button onClick={showDetails}> { !view ? 'view' : 'hide' }</button>
      {props.children}
    </div>
  )

  const BlogDetails = () => {
    return <div>
      {blog.url} <br/>
      likes {blog.likes} <button onClick={onClickLike}> like </button> <br/>
      {blog.user.name}<br/>
      <button onClick={removeBlog}> Remove </button>
    </div>
  }

  return view 
    ? <MinBlog> <BlogDetails/> </MinBlog>
    : <MinBlog/>
}

export default Blog