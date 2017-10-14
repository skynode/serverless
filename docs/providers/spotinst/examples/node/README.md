<!--
title: Hello World Javascript Example
menuText: Hello World JavaScript Example
description: Create a JavaScript Hello World function
layout: Doc
-->

<!-- DOCS-SITE-LINK:START automatically generated  -->
### [Read this on the main serverless docs site](https://www.serverless.com/framework/docs/providers/spotinst/)
<!-- DOCS-SITE-LINK:END -->

# Hello World JavaScript Example

Make sure `serverless` is installed. 

## 1. Create a service
`serverless create --template spotinst-nodejs --path serviceName`  `serviceName` is going to be a new directory there the python template will be loaded. Once the download is complete change into that directory

## 2. Deploy
`serverless deploy`  

## 3. Invoke deployed function
`serverless invoke --function hello` 

In your terminal window you should see the response

```bash
{
Deploy functions:
	hello: created
Service Information
	service: spotinst-python
	functions:
  		hello
}
```

Congrats you have just deployed and ran your Hello World function!

## Short Hand Guide

`sls` is short hand for serverless cli commands 

`-f` is short hand for `--function`

`-t` is short hand for `--template`

`-p` is short hang for `--path`