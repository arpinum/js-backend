'use strict';

module.exports = {
  MongoDatabase: require('./lib/database/MongoDatabase'),

  CommandBus: require('./lib/ddd/buses/CommandQueryBus'),
  QueryBus: require('./lib/ddd/buses/CommandQueryBus'),
  EventBus: require('./lib/ddd/buses/EventBus'),
  ConflictingEntityError: require('./lib/ddd/errors/ConflictingEntityError'),
  EntityNotFoundError: require('./lib/ddd/errors/EntityNotFoundError'),
  BaseRepository: require('./lib/ddd/repository/BaseRepository'),
  BaseCommand: require('./lib/ddd/command/BaseCommand'),

  FakeApplication: require('./lib/test/FakeApplication'),
  FakeResponse: require('./lib/test/FakeResponse'),
  MemoryDatabase: require('./lib/test/MemoryDatabase'),
  MemoryRepository: require('./lib/test/MemoryRepository'),

  FunctionalError: require('./lib/tools/errors/FunctionalError'),
  TechnicalError: require('./lib/tools/errors/TechnicalError'),
  LoggerFactory: require('./lib/tools/LoggerFactory'),

  ClientError: require('./lib/web/errors/ClientError'),
  ConflictingResourceError: require('./lib/web/errors/ConflictingResourceError'),
  ResourceNotFoundError: require('./lib/web/errors/ResourceNotFoundError'),
  ServerError: require('./lib/web/errors/ServerError'),
  UnauthorizedError: require('./lib/web/errors/UnauthorizedError'),
  WebError: require('./lib/web/errors/WebError'),

  UnhandledErrorMiddleware: require('./lib/web/middlewares/UnhandledErrorMiddleware'),
  BodyValidator: require('./lib/web/validation/BodyValidator')
};
