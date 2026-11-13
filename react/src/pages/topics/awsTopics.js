// Sub-topic order for the aws page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'Cloud & AWS basics',
    questions: [
      'What is cloud computing and what is AWS?',
      'What is the difference between IaaS, PaaS and SaaS?',
      'What are Regions, Availability Zones and edge locations?',
      'What is the AWS shared responsibility model?',
      'How do you set up the AWS CLI with named profiles?',
      'How do you use tags and resource groups?',
    ],
  },
  {
    topic: 'IAM & security',
    questions: [
      'What is IAM? Explain users, groups, roles and policies.',
      'What does an IAM policy look like, and what is least privilege?',
      'What are the best practices for the root account and MFA?',
      'What is the difference between Secrets Manager and Parameter Store?',
      'Why use an IAM role for EC2 or Lambda instead of access keys?',
      'What are your AWS security best practices? (KMS, WAF, Shield, GuardDuty)',
      'How does cross-account access with assume-role work?',
      'What are AWS Organizations and Service Control Policies (SCPs)?',
      'How do you design a multi-account strategy (landing zone, Control Tower)?',
    ],
  },
  {
    topic: 'Compute (EC2)',
    questions: [
      'What is EC2? Explain instance types, AMIs and key pairs.',
      'What is EC2 user data?',
      'Bastion host vs SSM Session Manager: how do you access private instances?',
    ],
  },
  {
    topic: 'Storage (S3, EBS, EFS)',
    questions: [
      'What is S3? Explain buckets and objects.',
      'What are S3 storage classes and lifecycle rules?',
      'What is S3 Glacier, and how do you restore an archived object?',
      'What is S3 versioning?',
      'What is a presigned URL?',
      'What is an S3 bucket policy?',
      'What is the difference between EBS, EFS and S3?',
    ],
  },
  {
    topic: 'Networking (VPC, DNS, CDN)',
    questions: [
      'What is a VPC? What is the difference between public and private subnets?',
      'What are route tables, an Internet Gateway and a NAT Gateway?',
      'What is a security group, and how is it different from a NACL?',
      'What are VPC endpoints and when do you need them?',
      'What is the difference between VPC peering and Transit Gateway?',
      'What is Route 53 and what routing policies does it support?',
      'What is CloudFront?',
    ],
  },
  {
    topic: 'Load balancing & scaling',
    questions: [
      'What is an Elastic Load Balancer? ALB vs NLB?',
      'What is an Auto Scaling group?',
      'What is the difference between vertical and horizontal scaling?',
    ],
  },
  {
    topic: 'Databases & caching',
    questions: [
      'When would you choose RDS, Aurora or DynamoDB?',
      'How do DynamoDB keys work, and what is the difference between Query and Scan?',
      'What is the difference between a DynamoDB GSI and LSI?',
      'What are DynamoDB Streams and how do you use them?',
      'What is the difference between RDS Multi-AZ and read replicas?',
      'What is ElastiCache and how do you use it?',
      'What is Amazon Redshift, and how is it different from RDS?',
    ],
  },
  {
    topic: 'Serverless & APIs',
    questions: [
      'What is AWS Lambda and what can trigger it?',
      'What is a Lambda cold start, and what are the main Lambda limits?',
      'What is API Gateway?',
      'What is a Lambda authorizer in API Gateway?',
      'How do you add sign-up and login with Amazon Cognito user pools?',
      'What is AWS Step Functions?',
      'What are Lambda reserved and provisioned concurrency?',
    ],
  },
  {
    topic: 'Messaging & streaming',
    questions: [
      'What is the difference between SQS, SNS and EventBridge?',
      'What is the difference between SQS Standard and FIFO queues, and what is a dead-letter queue?',
      'When would you use Kinesis Data Streams instead of SQS?',
    ],
  },
  {
    topic: 'Monitoring & logging',
    questions: [
      'What is CloudWatch? Explain metrics, logs and alarms.',
      'What is CloudTrail?',
      'What is AWS Config, and how is it different from CloudTrail?',
      'How do you trace requests across services with AWS X-Ray?',
    ],
  },
  {
    topic: 'Containers & PaaS',
    questions: [
      'What is the difference between ECS, EKS and Fargate?',
      'What is ECR and how do you push an image to it?',
      'What is Elastic Beanstalk?',
    ],
  },
  {
    topic: 'Architecture & design',
    questions: [
      'How would you build an S3 upload -> Lambda -> DynamoDB pipeline?',
      'How do you design for high availability and fault tolerance?',
      'What are the disaster recovery strategies on AWS?',
      'What is AWS Backup?',
      'What are the pillars of the AWS Well-Architected Framework?',
      'Design question: how would you build an image-processing pipeline on AWS?',
      'Design question: how would you build a URL shortener on AWS?',
    ],
  },
  {
    topic: 'Deployment & IaC',
    questions: [
      'What is infrastructure as code? CloudFormation vs Terraform vs CDK?',
      'How do you set up CI/CD on AWS? (CodePipeline or GitHub Actions with OIDC)',
      'What are CodeBuild and CodeDeploy, and what do buildspec.yml and appspec.yml do?',
      'How do you deploy a React (Vite) app on AWS?',
      'How do you deploy a FastAPI app on AWS?',
      'How do you do blue/green and canary deployments on AWS?',
    ],
  },
  {
    topic: 'Cost',
    questions: [
      'What are the EC2 pricing models: On-Demand, Reserved, Spot and Savings Plans?',
      'What is the AWS Free Tier and how do you avoid surprise bills?',
      'What are AWS Budgets, Cost Explorer and Trusted Advisor?',
      'How do you optimize costs on AWS?',
    ],
  },
  {
    topic: 'Troubleshooting',
    questions: [
      'How do you troubleshoot an EC2 instance that is not reachable?',
      'How do you troubleshoot a Lambda timeout?',
      'How do you troubleshoot an S3 403 Access Denied error?',
    ],
  },
]
