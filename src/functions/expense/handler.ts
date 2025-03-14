import { formatJSONResponse } from "@libs/api-gateway"
import { projectId } from "@libs/Utilities/constant"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { IExpense } from "src/model/Expense"
import { expenseService } from "src/service"
import { v4 as uuidv4 } from 'uuid';

export const createExpense = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = event.requestContext.authorizer.userId
        const body: Omit<IExpense, 'id'|'projectId'|'userId'>  = JSON.parse(event.body)

        const expense = await expenseService.create({ 
            projectId: projectId,
            userId: userId,
            id: uuidv4(), 
            description: body.description ? body.description : '',
            ...body
        })

        return formatJSONResponse(200, {code: 200, success: true, data: expense })
    } catch (e) {
        return formatJSONResponse(500, {code: 500, success: false, error: 'Internal Server Error'})
    }
}

export const getAllExpense = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.requestContext.authorizer.userId
        const querParams = event.queryStringParameters;

        if(!querParams.startDate || !querParams.endDate) {
            return formatJSONResponse(400, {code: 400, success: false, error: "Please provide start and end date"})
        }

        const expenses = await expenseService.fetchInDateRange(id, querParams.startDate, querParams.endDate)

        return formatJSONResponse(200, { code: 200, success: true, data: expenses })
    } catch(e) {
        return formatJSONResponse(500, { code: 500, success: false, error: 'Internal Server Error' })
    }
}

export const updateExpense = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters.id
        const body: IExpense = JSON.parse(event.body);
        if(!id || !body) {
            return formatJSONResponse(500, { code: 500, success: false, error: "Invalid request body" })
        }
        const existingExpense = expenseService.getOne(id);
        if(!existingExpense) {
            return formatJSONResponse(404, { code: 404, success: false, error: 'Resource not found' })
        }

        const updated = await expenseService.update(id, body);

        return formatJSONResponse(200, { code: 200, success: true, data: updated })
    } catch (e) {
        return formatJSONResponse(500, { code: 500, success: false, error: 'Internal Server Error' })
    }
}

export const deleteExpense = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters.id
        const deleted = await expenseService.delete(id)
        return formatJSONResponse(200, { code: 200, success: true, data: deleted })
    } catch (e) {
        return formatJSONResponse(500, { code: 500, success: false, error: 'Internal Server Error' })
    }
}