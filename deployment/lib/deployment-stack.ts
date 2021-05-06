import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda-nodejs'

export class DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    /**
     * Define lambda handlers
     * */

    const handlerNBA = new lambda.NodejsFunction(this, 'CalendarNBAHandler', {
      entry: path.join(__dirname, '../../src/lambda/index.ts'),
      handler: 'nba',
      depsLockFilePath: path.join(__dirname, '../../package.json'),
      memorySize: 256,
    })

    const handlerCS = new lambda.NodejsFunction(this, 'CalendarCSHandler', {
      entry: path.join(__dirname, '../../src/lambda/index.ts'),
      handler: 'cs',
      depsLockFilePath: path.join(__dirname, '../../package.json'),
      memorySize: 256,
    })

    const handlerFootball = new lambda.NodejsFunction(this, 'CalendarFootballHandler', {
      entry: path.join(__dirname, '../../src/lambda/index.ts'),
      handler: 'football',
      depsLockFilePath: path.join(__dirname, '../../package.json'),
      memorySize: 256,
    })

    /**
     * Define API Gateway API's
     */

    const api = new apigateway.RestApi(this, 'calendar-api', {
      restApiName: 'Calendar API Service',
      description: 'This service serves Calendars.',
    })

    // resource /nba
    const calendarNBAResource = api.root.addResource('nba')
    calendarNBAResource.addMethod('GET', new apigateway.LambdaIntegration(handlerNBA))

    // resource /cs
    const calendarCSResource = api.root.addResource('cs')
    calendarCSResource.addMethod('GET', new apigateway.LambdaIntegration(handlerCS))

    // resource /football
    const calendarFootballResource = api.root.addResource('football')
    calendarFootballResource.addMethod('GET', new apigateway.LambdaIntegration(handlerFootball))
  }
}
