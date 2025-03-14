import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export interface IAPIResponseV1 {
  code: number
  appCode?: number
  success: boolean
  error?: string | Array<string>
  data?: any
}


export const formatJSONResponse = (statusCode: number, response: IAPIResponseV1) => {

  response.appCode = response.success ? 1000 : 4000;


  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Accept": "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  }
}


export const formatHTMLResponse = (htmlString: string) => {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Accept": "*/*",
      'Content-Type': 'text/html',
    },
    body: htmlString,
  }
}