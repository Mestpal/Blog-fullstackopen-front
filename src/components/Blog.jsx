import { useState } from "react"


const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)

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
      likes {blog.likes} <button> like </button> <br/>
      {blog.user.name}
    </div>
  }

  return view 
    ? <MinBlog> <BlogDetails/> </MinBlog>
    : <MinBlog/>
}

export default Blog