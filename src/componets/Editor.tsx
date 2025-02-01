import { Editor, useMonaco } from '@monaco-editor/react'
import React, { useEffect } from 'react'

const EditorComponent = () => {
    const monaco = useMonaco();
    useEffect(() => {
        monaco?.languages.register({
            id: 'javascript',
            aliases: ['javascript', 'js'],
            extensions: ['.js'],
            mimetypes: ['text/javascript']
        })
    },[monaco])
    return (
    <div>
        <Editor
          height="100vh"
          width="100vw"
          defaultLanguage='javascript'
          defaultValue='console.log("Hello World");'
          theme='vs-dark'
          options={
            {
                fontSize: 20,
                wordWrap: 'on',
                automaticLayout: true,
                padding : {
                    top : 20
                }
            }
          }
        />
    </div>
  )
}

export default EditorComponent