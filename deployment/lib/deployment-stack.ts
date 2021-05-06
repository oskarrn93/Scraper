import * as path from 'path'
import * as cdk from '@aws-cdk/core'
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda-nodejs'
import * as s3 from '@aws-cdk/aws-s3'

export class DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const bucket = new s3.Bucket(this, 'CalendarScraper')

    const handlerNBA = new lambda.NodejsFunction(this, 'CalendarNBAHandler', {
      entry: path.join(__dirname, '../../src/lambda/nba.js'),
      handler: 'handler',
      depsLockFilePath: path.join(__dirname, '../../package.json'),
      memorySize: 256,
      environment: {
        BUCKET: bucket.bucketName,
      },
    })

    bucket.grantReadWrite(handlerNBA)

    const calendarNBAAPI = new apigateway.RestApi(this, 'calendar-nba-api', {
      restApiName: 'CalendarNBA Service',
      description: 'This service serves NBA Calendar.',
    })

    const getCalendarNBAIntegration = new apigateway.LambdaIntegration(handlerNBA, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    })

    const calendarNBAAPIResource = calendarNBAAPI.root.addResource('calendar-nba')
    calendarNBAAPIResource.addMethod('GET', getCalendarNBAIntegration)
  }
}
