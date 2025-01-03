"use client"
import React from 'react';
import { useSession } from "next-auth/react"

const ProfilePage = () => {
    const { data: session, status } = useSession()
    return (
        <div>
            <h1>{status}</h1>
        </div>
    );
};

export default ProfilePage;