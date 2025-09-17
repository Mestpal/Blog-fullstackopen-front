import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

import BlogService from './services/blogs'
import LoginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [newBlog, setNewBlog] = useState(null)

  const onChangeUsername = (event) => setUsername(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);
  const onChangeTitle = (event) => setTitle(event.target.value);
  const onChangeAuthor = (event) => setAuthor(event.target.value);
  const onChangeUrl = (event) => setUrl(event.target.value);

  useEffect(() => {
    BlogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
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
      console.log(exception);
    }
  }

  const onSubmitBlog = async(event) => {
    event.preventDefault()
    const blogEntry = {
      title, author, url
    }
    await BlogService.create(blogEntry)
    setNewBlog(blogEntry)
  }

  return (
    <div>
      <h2>blogs</h2>

      <div>
        { user 
          ? <div>
            <p>
              {`${user.username} logged in `}
              <button onClick={LoginService.logout}> Logout</button>
            </p>

            <BlogForm 
              author={author} 
              title={title}
              url={url}
              actionAuthor={onChangeAuthor}
              actionTitle={onChangeTitle}
              actionUrl={onChangeUrl}
              onSubmit={onSubmitBlog}
            />
          </div>
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
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App