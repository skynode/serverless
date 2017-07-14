<!--
title: Serverless Framework - AWS Lambda Events - Alexa Skill
menuText: Alexa Skill
menuOrder: 6
description:  Setting up AWS Alexa Skill Events with AWS Lambda via the Serverless Framework
layout: Doc
-->

<!-- DOCS-SITE-LINK:START automatically generated  -->
### [Read this on the main serverless docs site](https://www.serverless.com/framework/docs/providers/aws/events/alexa-skill)
<!-- DOCS-SITE-LINK:END -->

# Alexa Skill

## Event definition

This will enable your Lambda function to be called by an Alexa skill kit.

```yml
functions:
  mySkill:
    handler: mySkill.handler
    events:
      - alexaSkill
```

You can find detailed guides on how to create an Alexa Skill with Serverless using NodeJS [here](https://github.com/serverless/examples/tree/master/aws-node-alexa-skill) as well as in combination with Python [here](https://github.com/serverless/examples/tree/master/aws-python-alexa-skill).
