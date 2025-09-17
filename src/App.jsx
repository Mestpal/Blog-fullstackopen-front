import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const onChangeUsername = (event) => setUsername(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception.response.data.error);
    }
  }

  return (
    <div>
      <div>
        { user 
          ? <p>{`${user.username} logged in`}</p>
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

      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )
}

export default App