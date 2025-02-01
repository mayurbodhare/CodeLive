import React from 'react'
import Client from '../componets/Client';
import Editor from '../componets/Editor';


const EditorPage = () => {

  const [clients, setClients] = React.useState([{socketId: 1, userName: 'Mayur B'}, {socketId: 2, userName: 'Jaymesh K'}, {socketId: 3, userName: 'Umesh K'}]);

  return (
    <div className='mainWrap'>
      <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img className='logoImage' src="/code-sync-logo.png" alt="code-sync" />
            </div>

            <h3>Connected</h3>
            <div className="clientsList">
                {
                    clients.map((client) => <Client key={clients.indexOf(client)} userName={client.userName} />)
                }
            </div>
          </div>
          <button className='btn copyBtn' type='button'>Copy ROOM ID</button>
          <button className='btn leaveBtn' type="button">Leave</button>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  )
}

export default EditorPage