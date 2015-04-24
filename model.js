module.exports.contract =   {
  "consumer_name": "chat_ui",
  "consumer_version": "1.x",
  "provider_name": "chat-service",
  "provider_version": "2.x",
  "api_key": "bb43f26d-e6c4-4031-97b8-d8360a727d20",
  "required_tags": [],
  "endpoints": {
    "default": "http://chat.service.com",
    "system:x": "http://test.service.com"
  }
};

module.exports.contracts = [
  module.exports.contract
]

module.exports.registry = [{
    "name": "chat-ui",
    "versions": [
      {
        "version": "1.x",
        "depracted": true
      },
      {
        "version": "2.0.0",
        "beta": true
      }
    ],
    "options": {
      "allow_compatible": true,
      "minor_version_inherit": true
    }
  },
  {
    "name": "epm",
    "versions": [
      {
        "version": "1.x",
        "depracted": true
      },
      {
        "version": "2.0.0",
        "beta": true
      }
    ]
  },
  {
    "name": "chat-service",
    "versions": [
      {
        "version": "1.0.0",
        "endpoints": {
          "default": "http://www.chat-service.com/apis",
          "system:x": "http://beta.chat-service.com/apis"
        },
        "depracted": true
      },
      {
        "version": "1.0.1",
        "endpoints": {
          "default": "http://new.chat-service.com/apis"
        }
      },
      {
        "version": "2.0.0",
        "beta": true
      }
    ],
    "options": {
      "auto_update_compatible": true
    }
  }
];
