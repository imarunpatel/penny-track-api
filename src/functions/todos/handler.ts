import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {todoService} from "src/service";
import { v4 } from 'uuid';

export const getAllTodos = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const todos = await todoService.getAllTodos()
    return formatJSONResponse(200, {
        code: 200,
        success: true,
        data: todos
    })
})

export const createTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body = event.body as any;
        const id = v4();
        const todo = await todoService.createTodo({
            todosId: id,
            title: body?.title,
            description: body.description,
            createdAt: new Date().toISOString(),
            status: false
        })
        return formatJSONResponse(200, {
            code: 200,
            success: true,
            data: todo,
        });
    } catch (e) {
        return formatJSONResponse(500, {
            code: 500,
            success: false,
            error: "Something went wrong!"
        });
    }
})
