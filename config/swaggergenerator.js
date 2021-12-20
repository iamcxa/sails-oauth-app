module.exports['swagger-generator'] = {
  disabled: false,
  swaggerJsonPath: './swagger.json',
  swagger: {
    openapi: '3.0.3',
    info: {
      title: 'Sails Server',
      description: 'This is a generated swagger json for your sails project',
      termsOfService: 'http://example.com/terms',
      contact: {
        name: 'Kent Chen',
        url: 'http://github.com/iamcxa',
        email: 'iamcxa@ymail.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
      },
      version: '1.0.0',
    },
    servers: [
      {url: 'http://localhost:1337/', description: 'Local'},
      {url: 'https://oauth-app.iamcxa.me', description: 'Production'},
    ],
    externalDocs: {url: 'https://documenter.getpostman.com/view/15694191/Tzm3pdkr'},
    components: {
      securitySchemes: {
        bearer: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  },
  defaults: {
    responses: {
      200: {
        description: 'OK',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'success',
                },
                statusCode: {
                  type: 'number',
                  example: '200',
                },
                success: {
                  type: 'boolean',
                  example: true,
                },
              },
            },
          },
        },
      },
    },
  },
  excludeDeprecatedPutBlueprintRoutes: true,
  includeRoute(routeInfo) {
    const {
      // action,
      path,
    } = routeInfo;
    const isV2API = path.includes('api');
    const isOAuthApi = path.includes('auth');
    const isTestAPI = path.includes('test');
    return (isV2API || isTestAPI) && !isOAuthApi && !path.includes('session');
  },
  // updateBlueprintActionTemplates(blueprintActionTemplates) {
  //   // console.log('blueprintActionTemplates=>', blueprintActionTemplates);
  //   return blueprintActionTemplates;
  // },
  postProcess(specifications) {
    // console.log('specifications=>', specifications);
    return specifications;
  },
};
