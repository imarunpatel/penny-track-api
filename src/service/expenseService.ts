import { projectId } from "@libs/Utilities/constant"
import { DocumentClient } from "aws-sdk/clients/dynamodb"
import { IExpense } from "src/model/Expense"

export default class ExpenseService {
    private tableName: string = 'Expense'
    private projectId: string = projectId

    constructor(private docClient: DocumentClient) {}

    async create(expense: IExpense) {
        await this.docClient.put({
            TableName: this.tableName,
            Item: expense
        }).promise()
        return expense
    }

    async update(id: string, expense: IExpense) {
        const updated = await this.docClient.update({
            TableName: this.tableName,
            Key: {
                projectId: this.projectId,
                id: id
            },
            UpdateExpression: 'SET title = :title, categoryId = :categoryId, amount = :amount, description = :description, #d = :date',
            ExpressionAttributeNames: {
                '#d': 'date'
            },
            ExpressionAttributeValues: {
                ':title': expense.title,
                ':categoryId': expense.categoryId,
                ':amount': expense.amount,
                ':description': expense.description || '',
                ':date': expense.date
            },
            ReturnValues: 'ALL_NEW'
        }).promise();
        return updated.Attributes as IExpense;
    }

    async fetchAll(userId: string) {
        const expenses = await this.docClient.scan({
            TableName: this.tableName,
            FilterExpression: 'projectId = :projectId AND userId = :userId',
            ExpressionAttributeValues: {
                ':projectId': this.projectId,
                ':userId': userId
            }
        }).promise()
        return expenses.Items as IExpense[]
    }

    async getOne(id: string) {
        const updated = await this.docClient.get({
            TableName: this.tableName,
            Key: {
                projectId: this.projectId,
                id: id
            }
        }).promise();
        return updated.Item as IExpense;
    }

    async fetchInDateRange(userId: string, startDate: string, endDate: string) {
        const expenses = await this.docClient.scan({
            TableName: this.tableName,
            FilterExpression: 'projectId = :projectId AND userId = :userId AND #date BETWEEN :startDate AND :endDate',
            ExpressionAttributeValues: {
                ':projectId': this.projectId,
                ':userId': userId,
                ':startDate': startDate,
                ':endDate': endDate
            },
            ExpressionAttributeNames: {
                '#date': 'date'
            }
        }).promise()
        return expenses.Items as IExpense[]
    }

    async delete(id: string) {
        const deleted = await this.docClient.delete({
            TableName: this.tableName,
            Key: { projectId: this.projectId, id },
            ReturnValues: 'ALL_OLD'
        }).promise()
        return deleted.Attributes as IExpense;
    }
}