'use strict';

module.exports = {
  CommandBus: require('./lib/ddd/bus/CommandQueryBus'),
  QueryBus: require('./lib/ddd/bus/CommandQueryBus'),
  EventBus: require('./lib/ddd/bus/EventBus'),
  EntityNotFoundError: require('./lib/ddd/error/EntityNotFoundError'),
  AggregateRoot: require('./lib/ddd/object/AggregateRoot'),
  BaseRepository: require('./lib/ddd/repository/BaseRepository'),
  RepositoryInitializer: require('./lib/ddd/repository/RepositoryInitializer'),
  CommandHandlerInitializer: require('./lib/ddd/command/CommandHandlerInitializer'),
  EventHandlerInitializer: require('./lib/ddd/event/EventHandlerInitializer'),
  EventStore: require('./lib/ddd/event/EventStore'),
  Event: require('./lib/ddd/event/Event'),
  ProjectionInitializer: require('./lib/ddd/projection/ProjectionInitializer'),
  Projection: require('./lib/ddd/projection/Projection'),
  QueriedObjectNotFoundError: require('./lib/ddd/query/QueriedObjectNotFoundError'),
  QueryHandlerInitializer: require('./lib/ddd/query/QueryHandlerInitializer'),

  PasswordService: require('./lib/security/PasswordService'),

  FakeApplication: require('./lib/test/FakeApplication'),
  FakeResponse: require('./lib/test/FakeResponse'),
  MemoryDatabase: require('./lib/test/MemoryDatabase'),
  repositoryInMemory: require('./lib/test/repositoryInMemory'),

  FunctionalError: require('./lib/tools/error/FunctionalError'),
  TechnicalError: require('./lib/tools/error/TechnicalError'),
  LoggerFactory: require('./lib/tools/LoggerFactory'),
  uuid: require('./lib/tools/uuid'),

  ClientError: require('./lib/web/error/ClientError'),
  ResourceNotFoundError: require('./lib/web/error/ResourceNotFoundError'),
  ServerError: require('./lib/web/error/ServerError'),
  UnauthorizedError: require('./lib/web/error/UnauthorizedError'),
  WebError: require('./lib/web/error/WebError'),
  UnhandledErrorMiddleware: require('./lib/web/middleware/UnhandledErrorMiddleware'),
  HeadersParser: require('./lib/web/HeadersParser'),
  TokenService: require('./lib/web/security/TokenService')
};
