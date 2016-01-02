'use strict';

module.exports = {
  MongoDatabase: require('./lib/database/MongoDatabase'),

  CommandBus: require('./lib/ddd/bus/CommandQueryBus'),
  QueryBus: require('./lib/ddd/bus/CommandQueryBus'),
  EventBus: require('./lib/ddd/bus/EventBus'),
  ConflictingEntityError: require('./lib/ddd/error/ConflictingEntityError'),
  EntityNotFoundError: require('./lib/ddd/error/EntityNotFoundError'),
  BaseRepository: require('./lib/ddd/repository/BaseRepository'),
  RepositoryInitializer: require('./lib/ddd/repository/RepositoryInitializer'),
  CommandHandlerInitializer: require('./lib/ddd/command/CommandHandlerInitializer'),
  EventHandlerInitializer: require('./lib/ddd/event/EventHandlerInitializer'),
  EventStore: require('./lib/ddd/event/EventStore'),
  QueriedObjectNotFoundError: require('./lib/ddd/query/QueriedObjectNotFoundError'),
  QueryHandlerInitializer: require('./lib/ddd/query/QueryHandlerInitializer'),
  QueryProcessor: require('./lib/ddd/query/QueryProcessor'),

  FakeApplication: require('./lib/test/FakeApplication'),
  FakeResponse: require('./lib/test/FakeResponse'),
  MemoryDatabase: require('./lib/test/MemoryDatabase'),
  MemoryRepository: require('./lib/test/MemoryRepository'),
  MemoryQueryProcessor: require('./lib/test/MemoryQueryProcessor'),

  FunctionalError: require('./lib/tools/error/FunctionalError'),
  TechnicalError: require('./lib/tools/error/TechnicalError'),
  LoggerFactory: require('./lib/tools/LoggerFactory'),
  uuid: require('./lib/tools/uuid'),

  ClientError: require('./lib/web/error/ClientError'),
  ConflictingResourceError: require('./lib/web/error/ConflictingResourceError'),
  ResourceNotFoundError: require('./lib/web/error/ResourceNotFoundError'),
  ServerError: require('./lib/web/error/ServerError'),
  UnauthorizedError: require('./lib/web/error/UnauthorizedError'),
  WebError: require('./lib/web/error/WebError'),
  UnhandledErrorMiddleware: require('./lib/web/middleware/UnhandledErrorMiddleware'),
  ResourceInitializer: require('./lib/web/resource/ResourceInitializer'),
  TokenService: require('./lib/web/security/TokenService'),
  BodyValidator: require('./lib/web/validation/BodyValidator')
};
