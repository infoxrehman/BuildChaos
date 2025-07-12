import {User, Post} from './types';

export const dummyUsers: User[] = [
    {
    id: '1',
    username: 'john_doe',
    name: 'John Doe',
    image: 'https://i.pravatar.cc/150?img=2',
    bio: "TEST",
    },
    {
    id: '2',
    username: 'jane_doe',  
    name: 'Jane Doe',
    image: 'https://example.com/jane.jpg',
    bio: "TEST",
    }
    
]

export const dummyPosts: Post[] = [

    {
        id: '1',
        user_id: '1',
        user: dummyUsers[0],
        parent_id: null,
        parent: null,
        replies: [],
        content: 'This is a post by John Doe',
        createdAt: "32",
    },
]