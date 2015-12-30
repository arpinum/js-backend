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

  FakeApplication: require('./lib/test/FakeApplication'),
  FakeResponse: require('./lib/test/FakeResponse'),
  MemoryDatabase: require('./lib/test/MemoryDatabase'),
  MemoryRepository: require('./lib/test/MemoryRepository'),

  FunctionalError: require('./lib/tools/error/FunctionalError'),
  TechnicalError: require('./lib/tools/error/TechnicalError'),
  LoggerFactory: require('./lib/tools/LoggerFactory'),

  ClientError: require('./lib/web/error/ClientError'),
  ConflictingResourceError: require('./lib/web/error/ConflictingResourceError'),
  ResourceNotFoundError: require('./lib/web/error/ResourceNotFoundError'),
  ServerError: require('./lib/web/error/ServerError'),
  UnauthorizedError: require('./lib/web/error/UnauthorizedError'),
  WebError: require('./lib/web/error/WebError'),

  UnhandledErrorMiddleware: require('./lib/web/middleware/UnhandledErrorMiddleware'),
  ResourceInitializer: require('./lib/web/resource/ResourceInitializer'),
  BodyValidator: require('./lib/web/validation/BodyValidator')
};
