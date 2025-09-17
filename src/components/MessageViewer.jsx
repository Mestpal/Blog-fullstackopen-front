const MessageViewer = ({message, error}) => {  
  return <div class={error ? 'error' : 'message'}>
    <h2>{message}</h2>
  </div>
}

export default MessageViewer