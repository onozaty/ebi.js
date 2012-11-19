var Ebi = (function() {

  var _ = {};

  // Element class
  _.Element = function() {
    this.initialize.apply(this, arguments);
  };

  _.Element.prototype = {

    clazz: _.Element,
    parent: null,

    initialize: function(target, properties) {

      if (!target) return;

      if (typeof target == 'string') {
        if (target[0] == '#') {
          this.target = document.getElementById(target.substr(1));
        } else {
          this.target = document.createElement(target);
        }
      } else {
        this.target = target
      }

      if (properties) {
        this.setProperties(properties);
      }
    },

    // append short name
    _: function(value) {
      return this.append(value);
    },

    append: function(value) {

      if (typeof value == 'string') {

        this.target.appendChild(
                      document.createTextNode(value));

      } else if (value instanceof _.Element) {

        this.target.appendChild(value.target);
        value.parent = this;

      } else if (value instanceof Node) {

        this.target.appendChild(value);

      } else if (value instanceof Array) {

        for (var i = 0, length = value.length; i < length; i++) {
          this.append(value[i]);
        }

      } else {

        this.setProperties(value);
      }

      return this;
    },

    clear: function() {

      while(this.target.firstChild){
        this.target.removeChild(this.target.firstChild);
      }

      return this;
    },

    setProperties: function(properties) {

      for (var property in properties) {
        this.target[property] = properties[property];
      }
    },

    start: function(target, properties) {

      var startElement = new this.clazz(target, properties);

      this.append(startElement);

      return startElement;
    },

    end: function() {
      return this.parent;
    }

  };

  // Builder
  _.createBuilder = function(tags) {

    var elementClass = _.Element;

    if (tags) {
      elementClass = function() {
        this.initialize.apply(this, arguments);
      };

      elementClass.prototype = new _.Element;
      elementClass.prototype.clazz = elementClass;

      for (var i = 0, length = tags.length; i < length; i++) {
        elementClass.prototype[tags[i]] = _.createTagFunction(tags[i], elementClass);
      }

      /* Firefox only
      elementClass.__noSuchMethod__ = function(id, args) {
        return start(id, args[0]);
      }
      */
    }

    var builder = function(target, properties) {
      return new elementClass(target, properties);
    }

    return builder;
  };

  // default Builder
  _.defaultBuilder = _.createBuilder();

  _.createElement = function(target, properties) {
    return _.defaultBuilder(target, properties);
  };

  _.createTagFunction = function(tag) {
    return function(properties) {
      return this.start(tag, properties);
    }
  };

  return _;
}());
