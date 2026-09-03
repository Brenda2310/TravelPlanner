export interface FriendRequestDTO{
    id: number;
    senderUsername: string;
    receiverId?: number;
    friendRequestStatus: string;
}

export interface UserResumeDTO{
    id: number;
    username: string;
}