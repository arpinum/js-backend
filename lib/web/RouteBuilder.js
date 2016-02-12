'use strict';

let _ = require('lodash');

const METHODS = ['get', 'post', 'put', 'delete', 'patch', 'head'];

class RouteBuilding {
  constructor(router, url) {
    this._router = router;
    this._url = url;
  }

  applying() {
    this._middlewares = _.toArray(arguments);
    return this;
  }

  to(resource) {
    _.forEach(METHODS, method => {
      if (resource[method]) {
        let methodFunction = _.bind(resource[method], resource);
        this._router[method](this._url, _.union(this._middlewares, [methodFunction]));
      }
    });
  }
}

class RouteBuilder {
  constructor(router) {
    this._router = router;
  }

  route(url) {
    return new RouteBuilding(this._router, url);
  }
}

module.exports = RouteBuilder;
