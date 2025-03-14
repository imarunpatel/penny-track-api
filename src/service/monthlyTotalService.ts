

import { projectId } from "@libs/Utilities/constant"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { IBudget } from "src/model/Budget"

export default class MonthlyTotalService {
    private tableName: string = 'MonthlyTotal'
    private projectId: string = projectId

    constructor(private docClient: DocumentClient) {}

    async monthlyBudget(userId: string, yearMonth: string) {
        const budget = await this.docClient.scan({
            TableName: this.tableName,
            FilterExpression: 'projectId = :projectId AND userId = :userId AND yearMonth = :yearMonth',
            ExpressionAttributeValues: {
                ':projectId': this.projectId,
                ':userId': userId,
                ':yearMonth': yearMonth
            }
        }).promise()
        return budget.Items as IBudget[]
    }

    async getMonthlyBudgetById(id: string) {
        const updated = await this.docClient.get({
            TableName: this.tableName,
            Key: {
                projectId: this.projectId,
                id: id
            }
        }).promise();
        return updated.Item as IBudget;
    }

    async createMonthlyBudget(budget: IBudget) {
        await this.docClient.put({
            TableName: this.tableName,
            Item: budget
        }).promise();
        return budget;
    }

    async updateMonthlyBudget(id: string, budget: number) {
        const updated = await this.docClient.update({
            TableName: this.tableName,
            Key: {
                projectId: this.projectId,
                id: id
            },
            UpdateExpression: 'SET budget = :b',
            ExpressionAttributeValues: {
                ':b': budget
            },
            ReturnValues: 'ALL_NEW'
        }).promise();
        return updated.Attributes as IBudget;
    }

    
}