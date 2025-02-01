

import Avatar from 'react-avatar'

const Client = ({userName}: {userName: string}) => {
  return (
    <div className="client">
        <Avatar name={userName} size='50px' round='14px' />
        <span className='userName'>{userName}</span>
    </div>
  )
}

export default Client