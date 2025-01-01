import React from 'react';

const SingleProfilePage = async({params}:{params:{profileId:string}}) => {
  console.log()
  return (
    <div>
      <h1>{params.profileId}</h1>
    </div>
  );
};

export default SingleProfilePage;
