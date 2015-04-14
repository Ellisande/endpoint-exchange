# epm
Endpoint Manager is a simple npm-style tool for managing service endpoints and lookups.

# Installing

(Not in npm yet, placeholder)
```npm install -g epm```

#Usage

## Consume a Service

```epm consume chat-service```

Consuming a new service will automatically update your endpoints.json file with current endpoints for the service.

### Consume a Specific Version of a Service

```epm consume chat-service@1.0.0```

### Consume APIs
* -s [serviceName]
* -v [version]
* -sv [serviceName]@[version]
* -t [tag]

## Refresh Endpoints

```epm refresh```

Refreshing endpoints will grab the new endpoints from your current contract and update the endpoints.json file in your local workspace. 

Note: this is just for local reference. Endpoints are updated instantly on the lookup method when a provider makes changes.

## Provide a New Service

```epm create```

Running create will attempt to create a new registry entry based on your current {configuationJson}.json file.

### Create a Specific Service Version

```epm create -v 1.0.1```

### Create a Specific Service And Version

```bash
epm create chat-service@1.0.1

#or

epm create chat-service -v 1.0.1

#or 

epm create -s chat-service -v 1.0.1
```

### Create APIS
* -s [serviceName]
* -v [version]
* -sv [serviceName]@[version]
* -auto_update [true|false]
* -u [url]

## Update/Add a Service Endpoint

You can update a service endpoint by providing just a version and the new endpoint

```bash
epm update http://www.google.com
```

This will attempt to pull the your service name and version from your {configurationJson}.json file.

### Update/Add a Specific Service Version Default Endpoint

```bash
#Attempt to update your current service version 1.0.0 endpoint
epm update -v 1.0.0 http://www.google.com

#Attempt to update a specific service version 1.0.0 endpoint
epm update -s chat-service -v 1.0.0 http://www.google.com

#Attempt to update a specific service version 1.0.0 endpoint
epm update -sv chat-service@1.0.0 http://www.google.com
```

Depending on your service settings you may not be allowed to update endpoints that have active consumers.

### Update/Add an Endpoint With Tags

```bash
epm update -sv chat-service@1.0.0 -t system-test http://test.google.com

#Multiple tags
epm update -sv chat-service@1.0.0 -t system-test -t high-availability http://ha.google.com
```

### Update APIs
* -s [serviceName]
* -v [version]
* -sv [serviceName]@[version]
* -t [tag]
* -u [url]



