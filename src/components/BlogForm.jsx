const BlogForm = ({title, author, url, actionTitle, actionAuthor, actionUrl,onSubmit}) => {
  return <div>
    <h2>Create new blog</h2>
    <form onSubmit={ onSubmit }>
      <div>
        title
          <input
          type="text"
          value={ title }
          name="Title"
          onChange={ actionTitle }
        />
      </div>
      <div>
        author
          <input
          type="text"
          value={ author }
          name="Author"
          onChange={ actionAuthor }
        />
      </div>
      <div>
        url
          <input
          type="text"
          value={ url }
          name="Url"
          onChange={ actionUrl }
        />
      </div>
      <button type="submit">Create</button>
    </form>
  </div>
}

export default BlogForm
