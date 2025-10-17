import { useState, useEffect, useRef } from 'react'
import './index.css'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import MessageViewer from './components/MessageViewer'
import Togglable from './components/Toggleable'

import BlogService from './services/blogs'
import LoginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  const onChangeUsername = (event) => setUsername(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);

  useEffect(() => {
    BlogService.getAll().then(blogs => {
      setBlogs(sortBlogs(blogs, 'likes', 'DESC'))
    })  
  }, [newBlog])

  useEffect(() => {
    const loggedUser = JSON.parse(window.localStorage.getItem('blogAppLoggedUser'))
    
    if (loggedUser?.token) {
      setUser(loggedUser)
      BlogService.setToken(loggedUser.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await LoginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'blogAppLoggedUser', JSON.stringify(user)
      ) 
      BlogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification(exception.response.data.error, true)
    }
  }

  const onSubmitBlog = async(newBlog) => {
    try {
      const creatredBlog = await BlogService.create(newBlog)
      setNewBlog(creatredBlog)
      showNotification(`${creatredBlog.title} by ${creatredBlog.author} added`)
    } catch {
      showNotification('Invalid Blog', true)
    }
  }

  const onClickLikeBlog = (likedBlog) => {
    let updatedBlogs = blogs.map(blog => {
      if(blog.id === likedBlog.id) {
        blog.likes += 1
      }
      return blog
    })

    updatedBlogs = sortBlogs(updatedBlogs, 'likes', 'DESC')    
    setBlogs(updatedBlogs)
  }

  const onClickDeleteBlog = (deleteBlog) => {
    const index = blogs.findIndex(blog => blog.id === deleteBlog.id)

    if (index >= 0) {      
      blogs.splice(index, 1)
      setBlogs([...blogs])
    }
  }

  const sortBlogs = (blogs, field, order) => {
    if (!blogs.length) return blogs

    if (order === 'DESC') {
      return blogs.sort((a, b) => b[field] - a[field])
    } else {
      return blogs.sort((a, b) => a[field] - b[field])
    }
  }

  const showNotification = (message, isError = false) => {
    setMessage(message)
    setError(isError)
    setShowMessage(true)
    hideNotification()
  }

  const hideNotification = () => {
    const timer = setTimeout(() => {
      setMessage('')
      setError(false)
      setNewBlog(null)
      setShowMessage(false)
      clearTimeout(timer)
    }, 3000)
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return <div>
      <p>
        {`${user.username} logged in `}
        <button onClick={LoginService.logout}> Logout</button>
      </p>

      <Togglable buttonLabel='new blog' ref={ blogFormRef }>
        <BlogForm onSubmit={onSubmitBlog} />
      </Togglable>
    </div>
  }

  return (
    <div>
      <h2>blogs</h2>
      {
        showMessage
          ? <MessageViewer message={message} error={error}/>
          : ''
      }

      <div>
        { user 
          ? blogForm()
          : <div>
              <h2>Log in to application</h2>
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                password={password}
                setUsername={onChangeUsername} 
                setPassword={onChangePassword}
              />
            </div>
        }
      </div>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeAction={onClickLikeBlog} deleteAction={onClickDeleteBlog}/>
      )}
    </div>
  )
}

export default App