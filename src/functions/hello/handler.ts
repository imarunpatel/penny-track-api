import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  return formatJSONResponse(200, {
    code: 200,
    success: true,
    data: "Success from hello"
  });
};

export const main = middyfy(hello);
