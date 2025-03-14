import { projectId } from "@libs/Utilities/constant";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { ICategory } from "src/model/Category";

export default class CategoryService {
    private tableName: string = 'Category'
    private projectId: string = projectId

    constructor(private docClient: DocumentClient) {}

    async fetchAll(userId: string) {
        const category = await this.docClient.scan({
            TableName: this.tableName,
            FilterExpression: 'projectId = :projectId AND userId = :userId',
            ExpressionAttributeValues: {
                ':projectId': this.projectId,
                ':userId': userId
            },
            ProjectionExpression: 'id, #name',
            ExpressionAttributeNames: {
                '#name': 'name'
            }
        }).promise()
        return category.Items as ICategory[]
    }

    async create(category: ICategory) {
        await this.docClient.put({
            TableName: this.tableName,
            Item: category
        }).promise()
        return category
    }

    async update(id: string, name: string) {
        const updated = await this.docClient.update({
            TableName: this.tableName,
            Key: { projectId: this.projectId, id },
            UpdateExpression: 'SET name = :name',
            ExpressionAttributeValues: {
                ':name': name
            },
            ReturnValues: 'ALL_NEW'
        }).promise()
        return updated.Attributes as ICategory
    }

    async delete(id: string) {
         const deleted = await this.docClient.delete({
            TableName: this.tableName,
            Key: { projectId: this.projectId, id }
        }).promise();
        return deleted.Attributes as ICategory;
    }
}