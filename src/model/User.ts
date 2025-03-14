export default interface IUser {
    projectId: string // Partition Key
    userId: string // Sort Key
    loginProvider: string
    name: string
    email: string
    avatar: string
    createdAt: string
    lastLogin: string
}