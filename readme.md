# CBT Habit Loop Server

A GrahpQL server that will handle routing and database persistence.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You'll need to have Node.js (version 8 or newer) installed on your computer:
https://nodejs.org/en/

Install modules

```
npm install
```

You will also need to install serverless or run serverless in the node_modules bin.
I suggest installing serverless globally with:

```
npm install -g serverless
```

If running with a local dynamodb you can use docker to start up an instance:

```
docker run -p 8000:8000 amazon/dynamodb-local
```

Otherwise running dynamodb will require Java.

### Installing

Once you clone this git repository, navigate to the containing folder and run

```
NODE_ENV=dev serverless offline start
```

You can then visit the graphql playground at localhost:3000/playground

## Testing

To test the server run the following command:

```
npm test
```

The http file in the test folder uses the rest client in vscode available [here](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

## Built With

* [Express](https://expressjs.com/) - The web framework used
* [GraphQL](https://graphql.org/) - Query Engine
* [Apollo](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express) - Integrates Express and GraphQL
* [DynamoDB](https://aws.amazon.com/dynamodb/) - NoSQL Database
* [Serverless](https://serverless.com) - Framework for deploying a serverless service as an AWS Lambda

## Authors

* **DJ Shamblin** - *Team member* 
* **Nathan Hildebrandt** - *Team member*

See also the list of [contributors](https://github.com/osu-cascades/habit-loop/graphs/contributors) who participated in this project.

## Acknowledgments

* CBT Nuggets - Thanks for the great project
* Yong Bakos - Our awesome OSU CS teacher
