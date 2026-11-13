// New AWS gap questions. Outputs are realistic written examples with fake IDs (account 123456789012);
// nothing here is run against AWS. check_aws.py validates the JSON/YAML pieces locally.
// after = the existing title this one is placed after, in the data file and in its sub-topic.
const r = String.raw
export const ITEMS = [
  {
    q: 'What is S3 Glacier, and how do you restore an archived object?',
    level: 'Intermediate',
    after: 'What are S3 storage classes and lifecycle rules?',
    a: "S3 Glacier is the archive side of S3, with three storage classes: Glacier Instant Retrieval (milliseconds, for data read a few times a year), Glacier Flexible Retrieval (minutes to hours) and Glacier Deep Archive (the cheapest, up to 48 hours). Objects in Flexible Retrieval or Deep Archive can't be downloaded directly: I first call restore-object, which makes a temporary readable copy for the number of days I ask for. There are retrieval fees and minimum storage periods, so it only suits data I rarely need, like old logs or compliance backups. I usually move data there with a lifecycle rule rather than uploading to it directly.",
    code: r`aws s3api restore-object --bucket example-app-logs --key logs/2025/01/app.log.gz \
    --restore-request '{"Days": 7, "GlacierJobParameters": {"Tier": "Standard"}}'

# Check progress: ongoing-request="true" until the copy is ready
aws s3api head-object --bucket example-app-logs --key logs/2025/01/app.log.gz \
    --query '{Class:StorageClass,Restore:Restore}'`,
    output: r`{
    "Class": "GLACIER",
    "Restore": "ongoing-request=\"true\""
}

# a few hours later
{
    "Class": "GLACIER",
    "Restore": "ongoing-request=\"false\", expiry-date=\"Fri, 20 Nov 2026 00:00:00 GMT\""
}`,
  },
  {
    q: 'What is the difference between VPC peering and Transit Gateway?',
    level: 'Intermediate',
    after: 'What are VPC endpoints and when do you need them?',
    a: "VPC peering is a direct private link between two VPCs, even across accounts or Regions, but it isn't transitive: if A peers with B and B with C, A still can't reach C. With many VPCs that turns into a mesh of connections and route entries. Transit Gateway is a central hub that each VPC or VPN attaches to once, with its own route tables, so it scales to hundreds of VPCs, but it costs per attachment and per GB. Neither works with overlapping CIDRs, so I plan IP ranges early, and I use peering for two or three VPCs and Transit Gateway beyond that.",
    code: r`# Peer two VPCs, accept it, then add a route on each side
aws ec2 create-vpc-peering-connection --vpc-id vpc-0a1b2c3d4e5f60001 \
    --peer-vpc-id vpc-0a1b2c3d4e5f60002 --query 'VpcPeeringConnection.VpcPeeringConnectionId'
aws ec2 accept-vpc-peering-connection --vpc-peering-connection-id pcx-0f1e2d3c4b5a69788 \
    --query 'VpcPeeringConnection.Status.Code'
aws ec2 create-route --route-table-id rtb-0aa11bb22cc33dd44 \
    --destination-cidr-block 10.1.0.0/16 --vpc-peering-connection-id pcx-0f1e2d3c4b5a69788`,
    output: r`"pcx-0f1e2d3c4b5a69788"
"provisioning"
{
    "Return": true
}`,
  },
  {
    q: 'What is Amazon Redshift, and how is it different from RDS?',
    level: 'Intermediate',
    after: 'What is ElastiCache and how do you use it?',
    a: "Redshift is AWS's data warehouse: a columnar database that spreads queries across many nodes, built for analytics over huge tables, like orders per region per month. RDS is for the app's day-to-day work (OLTP), reading and writing single rows quickly, and it gets slow on those big scans. I load data into Redshift from S3 with COPY, or query files in S3 directly with Redshift Spectrum, and Redshift Serverless saves me from sizing a cluster. I never point the live app at Redshift; it's for dashboards and reports.",
    code: r`aws redshift-data execute-statement --workgroup-name analytics --database dev \
    --sql "SELECT region, COUNT(*) FROM orders GROUP BY region ORDER BY 2 DESC" \
    --query 'Id'

aws redshift-data get-statement-result --id 5b2c6f1e-8a3d-4e7b-9c0f-1d2e3f4a5b6c \
    --query 'Records[].[[0].stringValue, [1].longValue]' --output text`,
    output: r`"5b2c6f1e-8a3d-4e7b-9c0f-1d2e3f4a5b6c"

us-east	1284530
eu-west	903112
ap-south	611874`,
  },
  {
    q: 'What is AWS Config, and how is it different from CloudTrail?',
    level: 'Intermediate',
    after: 'What is CloudTrail?',
    a: "CloudTrail answers 'who did what': it logs every API call. AWS Config answers 'what does this resource look like now and before, and is it compliant': it records the configuration history of my resources and checks them against rules, like 'S3 buckets must not be public' or 'EBS volumes must be encrypted'. Config can also fix things automatically with a remediation action. I use them together: Config flags a bucket that became public, and CloudTrail tells me who changed it.",
    code: r`aws configservice put-config-rule --config-rule '{
  "ConfigRuleName": "s3-public-read-prohibited",
  "Source": {"Owner": "AWS", "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"}}'

aws configservice get-compliance-details-by-config-rule \
    --config-rule-name s3-public-read-prohibited --compliance-types NON_COMPLIANT \
    --query 'EvaluationResults[].EvaluationResultIdentifier.EvaluationResultQualifier.ResourceId'`,
    output: r`[
    "example-old-website"
]`,
  },
  {
    q: 'What are CodeBuild and CodeDeploy, and what do buildspec.yml and appspec.yml do?',
    level: 'Intermediate',
    after: 'How do you set up CI/CD on AWS? (CodePipeline or GitHub Actions with OIDC)',
    a: "CodeBuild is a managed build service: it runs my install, test and build steps in a fresh container, following buildspec.yml, and I pay per build minute. CodeDeploy rolls a new version out to EC2, Lambda or ECS, and appspec.yml tells it which files go where and which hooks to run, like stopping the old app and starting the new one. CodePipeline chains them together: source, then CodeBuild, then CodeDeploy. I keep both files in the repo next to the code, so the build and deploy steps are reviewed and versioned like everything else.",
    code: r`# buildspec.yml (CodeBuild)
version: 0.2
phases:
  install:
    commands: ["pip install -r requirements.txt"]
  build:
    commands: ["pytest -q", "zip -r app.zip app/"]
artifacts:
  files: [app.zip, appspec.yml]`,
    output: r`[Container] 2026/11/13 09:14:02.511 Running command pip install -r requirements.txt
[Container] 2026/11/13 09:14:19.204 Phase complete: INSTALL State: SUCCEEDED
[Container] 2026/11/13 09:14:19.388 Running command pytest -q
........                                                                 [100%]
8 passed in 1.42s
[Container] 2026/11/13 09:14:21.906 Running command zip -r app.zip app/
[Container] 2026/11/13 09:14:22.117 Phase complete: BUILD State: SUCCEEDED
[Container] 2026/11/13 09:14:22.530 Phase complete: UPLOAD_ARTIFACTS State: SUCCEEDED`,
  },
  {
    q: 'What are AWS Budgets, Cost Explorer and Trusted Advisor?',
    level: 'Basics',
    after: 'What is the AWS Free Tier and how do you avoid surprise bills?',
    a: "Cost Explorer shows where my money went, with charts I can group by service, account or tag, plus a forecast for the month. AWS Budgets alerts me, or can even take an action, when actual or forecast spend crosses a limit I set, so I hear about a problem on day three instead of at the end of the month. Trusted Advisor checks my account against best practices for cost, security, fault tolerance and service limits, like idle load balancers or wide-open security groups. The first thing I do in a new account is create a budget with an email alert.",
    code: r`aws budgets create-budget --account-id 123456789012 \
    --budget '{"BudgetName": "monthly-100", "BudgetLimit": {"Amount": "100", "Unit": "USD"}, "TimeUnit": "MONTHLY", "BudgetType": "COST"}' \
    --notifications-with-subscribers '[{"Notification": {"NotificationType": "FORECASTED", "ComparisonOperator": "GREATER_THAN", "Threshold": 80},
      "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "dev@example.com"}]}]'

# This month's cost per service
aws ce get-cost-and-usage --time-period Start=2026-11-01,End=2026-11-13 \
    --granularity MONTHLY --metrics UnblendedCost --group-by Type=DIMENSION,Key=SERVICE \
    --query 'ResultsByTime[0].Groups[].[Keys[0], Metrics.UnblendedCost.Amount]' --output text`,
    output: r`AWS Lambda	0.42
Amazon Elastic Compute Cloud - Compute	31.87
Amazon Relational Database Service	18.40
Amazon Simple Storage Service	2.16`,
  },
  {
    q: 'What is AWS Backup?',
    level: 'Intermediate',
    after: 'What are the disaster recovery strategies on AWS?',
    a: "AWS Backup is one central place to schedule, keep and restore backups for EBS, RDS, DynamoDB, EFS, S3 and more, instead of setting up snapshots in each service separately. I create a backup plan with rules, like daily at 3 AM kept for 35 days, and assign resources by tag, so anything tagged backup=daily is covered automatically. It can copy backups to another Region or account for disaster recovery, and Vault Lock makes them immutable against ransomware. A backup only counts once I've tested a restore, so I run restore tests regularly.",
    code: r`aws backup create-backup-plan --backup-plan '{"BackupPlanName": "daily-35d",
  "Rules": [{"RuleName": "daily", "TargetBackupVaultName": "Default",
    "ScheduleExpression": "cron(0 3 * * ? *)", "Lifecycle": {"DeleteAfterDays": 35}}]}'

aws backup create-backup-selection --backup-plan-id 8f2c1a3e-5b7d-4c9e-a1f3-2b4d6e8f0a1c \
    --backup-selection '{"SelectionName": "tagged-daily",
  "IamRoleArn": "arn:aws:iam::123456789012:role/service-role/AWSBackupDefaultServiceRole",
  "ListOfTags": [{"ConditionType": "STRINGEQUALS", "ConditionKey": "backup", "ConditionValue": "daily"}]}'`,
    output: r`{
    "BackupPlanId": "8f2c1a3e-5b7d-4c9e-a1f3-2b4d6e8f0a1c",
    "BackupPlanArn": "arn:aws:backup:us-east-1:123456789012:backup-plan:8f2c1a3e-5b7d-4c9e-a1f3-2b4d6e8f0a1c",
    "CreationDate": "2026-11-13T09:20:11.482000+00:00",
    "VersionId": "ZTQ5NzFhNjMtYjA1Yi00MjQ2LWE2NjYtYzE5YjU3OGM0YTk2"
}
{
    "SelectionId": "b3d5f7a9-1c3e-4b5d-8f7a-9c1e3b5d7f9a",
    "BackupPlanId": "8f2c1a3e-5b7d-4c9e-a1f3-2b4d6e8f0a1c",
    "CreationDate": "2026-11-13T09:20:14.903000+00:00"
}`,
  },
  {
    q: 'What is the difference between SQS Standard and FIFO queues, and what is a dead-letter queue?',
    level: 'Intermediate',
    after: 'What is the difference between SQS, SNS and EventBridge?',
    a: "A Standard queue has almost unlimited throughput but only best-effort ordering and at-least-once delivery, so a message can arrive twice and my consumer has to be idempotent. A FIFO queue, whose name ends in .fifo, keeps strict order within a message group and drops duplicates sent within 5 minutes, but it has lower throughput. A dead-letter queue catches messages that failed maxReceiveCount times, so one bad message doesn't retry forever or block the rest. I put a CloudWatch alarm on the DLQ's message count so failures don't go unnoticed.",
    code: r`aws sqs create-queue --queue-name orders-dlq.fifo --attributes FifoQueue=true
aws sqs create-queue --queue-name orders.fifo --attributes '{"FifoQueue": "true",
  "ContentBasedDeduplication": "true",
  "RedrivePolicy": "{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:123456789012:orders-dlq.fifo\",\"maxReceiveCount\":\"3\"}"}'

aws sqs send-message --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/orders.fifo \
    --message-body '{"orderId": 42}' --message-group-id customer-7`,
    output: r`{
    "QueueUrl": "https://sqs.us-east-1.amazonaws.com/123456789012/orders-dlq.fifo"
}
{
    "QueueUrl": "https://sqs.us-east-1.amazonaws.com/123456789012/orders.fifo"
}
{
    "MD5OfMessageBody": "654fc194a6077496f7f45fa26024c821",
    "MessageId": "6e8b0d7d-bb9b-4c9b-9197-4d861a8146e5",
    "SequenceNumber": "18889012345678901234"
}`,
  },
]
