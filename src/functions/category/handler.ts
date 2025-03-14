import { formatJSONResponse } from "@libs/api-gateway";
import { projectId } from "@libs/Utilities/constant";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { categoryService } from "src/service";
import { v4 as uuidv4 } from 'uuid';

interface CreateCategoryRequest {
    name: string
}
export const createCategory = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userId = event.requestContext.authorizer.userId
        const body: CreateCategoryRequest  = JSON.parse(event.body)

        const category = await categoryService.create({
            projectId: projectId,
            id: uuidv4(),
            userId,
            name: body.name,
        })

        return formatJSONResponse(200, {code: 200, success: true, data: category })
    } catch (e) {
        return formatJSONResponse(500, {code: 500, success: false, error: 'Internal Server Error'})
    }
}

export const getAllCategory = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.requestContext.authorizer.userId
        const category = await categoryService.fetchAll(id)

        return formatJSONResponse(200, { code: 200, success: true, data: category })
    } catch(e) {
        return formatJSONResponse(500, { code: 500, success: false, error: 'Internal Server Error' })
    }
}

export const deleteCategory = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = event.pathParameters.id;
        const deleted = await categoryService.delete(id)

        return formatJSONResponse(200, { code: 200, success: true, data: deleted })
    } catch (e) {
        return formatJSONResponse(500, { code: 500, success: false, error: 'Internal Server Error' })
    }
}