import React from 'react'

const SingleProfilePage = async({params}: {params: Promise<{ profileId: number }>}) => {
    const ID=(await params).profileId
  return (
    <div>
      <h1 className='text-4xl text-center'>Profile Id: {ID}</h1>
    </div>
  )
}

export default SingleProfilePage
