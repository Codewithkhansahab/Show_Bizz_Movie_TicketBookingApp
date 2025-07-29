import React from 'react'
import ReactPlayer from 'react-player'

const TestPlayer = () => {
  return (
    <div className="w-full h-auto">
      <ReactPlayer
        url="https://www.w3schools.com/html/mov_bbb.mp4"
        controls={true}
        width="100%"
        height="540px"
      />
    </div>
  )
}

export default TestPlayer
