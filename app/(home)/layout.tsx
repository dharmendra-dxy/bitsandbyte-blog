import Navbar from '@/components/home/header/Navbar';
import { prisma } from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

// to get user from clear and store it in database

const layout = async({children} : {children: React.ReactNode}) => {

    const user = await currentUser();

    if(!user){ 
        return(
            <div>
                <Navbar/>
                {children}
            </div>
        );
    }

    const loggedInUser = await prisma.user.findUnique({
        where: { clerkUserId: user.id },
      });


    if(!loggedInUser){
        await prisma.user.create({
            data: {
                name:user.fullName as string,
                clerkUserId: user.id,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
            },
        });
    }


  return( 
    <div>
        <Navbar/>
        {children}
    </div>
    );
  
}

export default layout
