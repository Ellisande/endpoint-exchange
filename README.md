# endpoint exchange

endpoint exchange is a hostable application that provides endpoint registry services. The goal is to provide easy and intuitive apis in support of endpoint lookup services.

## apis

Endpoint exchange apis are all REST based APIs. They expect JSON in and return JSON out of each operation. Each operation's documentation assumes you have it deployed to a context root of some kind.

### Add a contract
Adds a contract between the consumer and the provider.

Post: /contract/add

Input:
```js
{
    "consumer":{
        "version": "1.0.0",
        "name": "epm"
    },
    "provider":{
        "version": "1.x",
        "name": "chat-service"
    }
}
```

* consumer.name: name of the consuming application
* consumer.version: version of the consuming application. Accepts semver version wildcards.
* provider.name: name of the providing application
* provider.version: version of the providing application. Accepts semver version wildcards.

Response:
```js
{
  "chat-service-1.5.0":
  {
    "api_key": "78bc16d3-ddff-4e17-9c36-73da207e5a85",
    "provider_name": "chat-service",
    "provider_version": "1.5.0",
    "consumer_name": "epm",
    "consumer_version": "1.0.0"
  }
}
```
The response will contain an object with <provider.name>-<provider.version> as keys, each one containing the contract api keys.

### Remove a contract
Removes a contract between the consumer and the provider.

Post: /contract/remove

Input:
```js
{
    "consumer":{
        "version": "1.0.0",
        "name": "epm"
    },
    "provider":{
        "version": "1.x",
        "name": "chat-service"
    }
}
```

* consumer.name: name of the consuming application
* consumer.version: version of the consuming application. Accepts semver version wildcards.
* provider.name: name of the providing application
* provider.version: version of the providing application. Accepts semver version wildcards.

Response:
```js
[
  {
    "_id": "553d0ab90beb3c45e67dc177",
    "api_key": "881abe58-4c4f-4112-bf26-feba63b4fcf3",
    "provider_name": "chat-service",
    "provider_version": "1.5.0",
    "consumer_name": "epm",
    "consumer_version": "1.0.0",
    "endpoints": null
  }
]
```

The response is a list of the contracts that were removed by the call.

### Get contracts for an application
This operation finds all contracts for the consumer.

Post: /endpoints/cache

Input:
```js
{
    "name":"epm",
    "version": "1.0.0"
}
```

* name: name of the consumer to get the contracts for.
* version: version of the consumer to find contracts. Accepts semver version wildcards.

Response:
```js
[
  {
    "api_key": "c44965f1-fcf4-49f2-9526-47f541185de8",
    "provider_name": "chat-service",
    "provider_version": "2.0.0",
    "consumer_name": "epm",
    "consumer_version": "1.0.0",
    "endpoints": {
      "default": "http://default.chat.com",
      "system:x": "http://system.chat.com"
    }
  }
]
```
The response returns a list of all contracts for the provided name and version.
