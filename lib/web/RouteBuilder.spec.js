'use strict';

let sinon = require('sinon');
let RouteBuilder = require('./RouteBuilder');

describe('The route builder', () => {

  let router;
  let routeBuilder;

  beforeEach(() => {
    router = {
      get: sinon.stub(),
      post: sinon.stub(),
      put: sinon.stub(),
      delete: sinon.stub(),
      patch: sinon.stub(),
      head: sinon.stub()
    };
    routeBuilder = new RouteBuilder(router);
  });

  it('should route url to all resource methods', () => {
    let resource = {
      get: sinon.stub(),
      post: sinon.stub(),
      put: sinon.stub(),
      delete: sinon.stub(),
      patch: sinon.stub(),
      head: sinon.stub()
    };

    routeBuilder.route('the url').to(resource);

    router.get.should.have.been.calledWith('the url');
    router.post.should.have.been.calledWith('the url');
    router.put.should.have.been.calledWith('the url');
    router.delete.should.have.been.calledWith('the url');
    router.patch.should.have.been.calledWith('the url');
    router.head.should.have.been.calledWith('the url');
  });

  it('should route url to the right resource method', () => {
    let resource = {
      get: sinon.stub()
    };

    routeBuilder.route('the url').to(resource);

    let resourceMethod = router.get.lastCall.args[1][0];
    resourceMethod();
    resource.get.should.have.been.called;
  });

  it('should route url and apply middlewares before resource methods', () => {
    let order = [];
    let resource = {
      get: () => order.push('resource')
    };
    let firstMiddleware = () => order.push('first mw');
    let secondMiddleware = () => order.push('second mw');

    routeBuilder
      .route('the url')
      .applying(firstMiddleware, secondMiddleware)
      .to(resource);

    var middlewaresAndResource = router.get.lastCall.args[1];
    middlewaresAndResource.should.have.lengthOf(3);
    middlewaresAndResource[0]();
    middlewaresAndResource[1]();
    middlewaresAndResource[2]();
    order.should.deep.equal(['first mw', 'second mw', 'resource']);
  });
});
