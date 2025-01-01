'use client'

import { useSingleEmployee } from "@/services/queries";

const SingleProfilePage = ({params}:{params:{profileId:number}}) => {
  const {profileId} =  params;
  const profile=useSingleEmployee(profileId)
  console.log('Hello')
  return (
    <div>
      <h1>{profileId}</h1>
      <h1>Fetch status: {profile.fetchStatus}</h1>
      <p></p>
    </div>
  );
};

export default SingleProfilePage;
