'use strict';

const BbPromise = require('bluebird');
const validate = require('../lib/validate');
const findAndGroupDeployments = require('../utils/findAndGroupDeployments');
const setBucketName = require('../lib/setBucketName');

class AwsDeployList {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('aws');

    Object.assign(
      this,
      validate,
      setBucketName
    );

    this.hooks = {
      'before:deploy:list:log': () => BbPromise.bind(this)
        .then(this.validate),
      'before:deploy:list:functions:log': () => BbPromise.bind(this)
        .then(this.validate),

      'deploy:list:log': () => BbPromise.bind(this)
        .then(this.setBucketName)
        .then(this.listDeployments),
      'deploy:list:functions:log': () => BbPromise.bind(this)
        .then(this.listFunctions),
    };
  }

  listDeployments() {
    const service = this.serverless.service.service;
    const stage = this.options.stage;

    return this.provider.request('S3',
      'listObjectsV2',
      {
        Bucket: this.bucketName,
        Prefix: `serverless/${service}/${stage}`,
      },
      this.options.stage,
      this.options.region)
      .then((response) => {
        const directoryRegex = new RegExp('(.+)-(.+-.+-.+)');
        const deployments = findAndGroupDeployments(response, service, stage);

        if (deployments.length === 0) {
          this.serverless.cli.log('Couldn\'t find any existing deployments.');
          this.serverless.cli.log('Please verify that stage and region are correct.');
          return BbPromise.resolve();
        }
        this.serverless.cli.log('Listing deployments:');
        deployments.forEach((deployment) => {
          this.serverless.cli.log('-------------');
          const match = deployment[0].directory.match(directoryRegex);
          this.serverless.cli.log(`Timestamp: ${match[1]}`);
          this.serverless.cli.log(`Datetime: ${match[2]}`);
          this.serverless.cli.log('Files:');
          deployment.forEach((entry) => {
            this.serverless.cli.log(`- ${entry.file}`);
          });
        });
        return BbPromise.resolve();
      });
  }

  // list all functions and their versions
  listFunctions() {
    return BbPromise.resolve().bind(this)
      .then(this.getFunctions)
      .then(this.getFunctionVersions)
      .then(this.displayFunctions);
  }

  getFunctions() {
    const params = {
      MaxItems: 200,
    };

    return this.provider.request('Lambda',
      'listFunctions',
      params,
      this.options.stage,
      this.options.region)
      .then((result) => {
        const allFuncs = result.Functions;

        const serviceName = `${this.serverless.service.service}-${this.options.stage}`;
        const regex = new RegExp(serviceName);
        const serviceFuncs = allFuncs.filter((func) => func.FunctionName.match(regex));

        return BbPromise.resolve(serviceFuncs);
      });
  }

  getFunctionVersions(funcs) {
    const requestPromises = [];

    funcs.forEach((func) => {
      const params = {
        FunctionName: func.FunctionName,
        MaxItems: 5,
      };

      const request = this.provider.request('Lambda',
        'listVersionsByFunction',
        params,
        this.options.stage,
        this.options.region);

      requestPromises.push(request);
    });

    return BbPromise.all(requestPromises);
  }

  displayFunctions(funcs) {
    this.serverless.cli.log('Listing functions and their last 5 versions:');
    this.serverless.cli.log('-------------');

    funcs.forEach((func) => {
      let message = '';

      let name = func.Versions[0].FunctionName;
      name = name.replace(`${this.serverless.service.service}-`, '');
      name = name.replace(`${this.options.stage}-`, '');

      message += `${name}: `;
      const versions = func.Versions.map((funcEntry) => funcEntry.Version).reverse();

      message += versions.join(', ');
      this.serverless.cli.log(message);
    });

    return BbPromise.resolve();
  }
}

module.exports = AwsDeployList;
