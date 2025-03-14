import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';
dotenv.config();

import hello from '@functions/hello';
import { createTodo, getAllTodos } from '@functions/todos';
import { healthCheck } from '@functions/system';
import { login } from '@functions/auth';
import { verifyAuth } from '@functions/authorizer';
import { createCategory, deleteCategory, getAllCategory } from '@functions/category';
import { createExpense, deleteExpense, getAllExpense, updateExpense } from '@functions/expense';
import { createMonthlyBudget, getMonthlyStats, updateMonthlyBudget } from '@functions/stats';

const serverlessConfiguration: AWS = {
  service: 'penny-track-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs20.x',
    region: 'ap-south-1',
    profile: 'penny-track',
    stage: 'v1',
    deploymentBucket: {
      name: 'penny-track',
      tags: {
        Project: 'penny-track',
        Environment: 'dev'
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: process.env.IAM_ROLE
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      JWT_SECRET: process.env.JWT_SECRET
    },
    timeout: 30
  },
  // import the function via paths
  functions: { 
    verifyAuth, 
    login, hello, 
    healthCheck, 
    getAllTodos, 
    createTodo,
    createCategory,
    getAllCategory,
    deleteCategory,
    createExpense,
    deleteExpense,
    updateExpense,
    getAllExpense,
    getMonthlyStats,
    createMonthlyBudget,
    updateMonthlyBudget
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: [],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
