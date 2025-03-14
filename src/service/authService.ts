import { projectId } from "@libs/Utilities/constant";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import IUser from "src/model/User";


export default class AuthService {
    private  tableName: string = 'Users'
    private projectId: string = projectId

    constructor(private docClient: DocumentClient) {}

    async getUser(userId: string): Promise<IUser | null> {

        const user = await this.docClient.get({ 
            TableName: this.tableName, 
            Key: { projectId: this.projectId, userId: userId }
        }).promise();

        if (!user) {
            return null
        } else {
            return user.Item as IUser;
        }
    }

    async createUser(user: IUser) {
        await this.docClient.put({
            TableName: this.tableName,
            Item: user
        }).promise();
        return user as IUser;
    }

    async updateUser(userId: string) {
        const updated = await this.docClient.update({
            TableName: this.tableName,
            Key: { projectId: this.projectId, userId },
            UpdateExpression: 'SET lastLogin = :lastLogin',
            ExpressionAttributeValues: {
                ':lastLogin': new Date().toISOString()
            },
            ReturnValues: 'ALL_NEW'
        }).promise();
        return updated.Attributes as IUser;
    }

}