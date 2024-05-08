const users=[];

const userJoins=(id,username,room,host,presenter)=>{
    const user= {id,username,room,host,presenter};
    users.push(user)
    return user;
}

const userLeaves=(id)=>{
    const index=users.findIndex((user)=>user.id===id)

    if(index!=-1){
       return users.splice(index,1)[0];
    }
}

const getUsers=(room)=>{
    const RoomUsers=[];
    users.map((user)=>{
        if(user.room===room) RoomUsers.push(user)
    })

    return RoomUsers;
}

module.exports={
    userJoins,
    userLeaves,
    getUsers
}