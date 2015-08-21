import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './property-tree.less!';
import template from './property-tree.stache!';
import children from './children.stache!';
import parent from './parent.stache!';

import 'dev-tools/property/';

var parseObject = function(obj) {
  var parsed = [];
  for(var key in obj) {
    var type = obj[key] === null ? 'null' : can.type(obj[key]);
    var current = {
      key: key,
      type: type,
      editable: type === 'number' || type === 'string' || type === 'boolean',
      hasChildren: typeof obj[key] === "object" && obj[key] !== null && Object.keys(obj[key]).length > 0,
      val: (type === 'object' || type === 'array') ? parseObject(obj[key]) : obj[key]
    }
    if(type === 'array') {
      current.len = obj[key].length;
    }
    parsed.push(current);

  }
  return parsed;
}

var unparseObject = function(obj, type) {
  var unparsed = {};

  if(type === 'array') {
    unparsed = [];
  }

  obj.forEach(function(val, key) {
    if(val.type === 'number' || val.type === 'string' || val.type === 'boolean' || val.type === 'function' || val.type === 'null') {
      unparsed[val.key] = val.val;
    } else {
      unparsed[val.key] = unparseObject(val.val, val.type);
    }
  });
  return unparsed;
}

export const ViewModel = Map.extend({
  define: {
    parent: {
      value: function() {
        return parent;
      }
    },
    children: {
      value: function() {
        return children;
      }
    },
    parsedObject: {
      Type: can.List
    },
    object: {
      value: function() {
        return {};
      },
      set: function(newVal) {
        // alert('{viewModel.object} set');
        this.attr('parsedObject', parseObject(newVal.attr()));
        return newVal;
      }
    }
  }
});

export default Component.extend({
  tag: 'devtools-property-tree',
  viewModel: ViewModel,
  template: template,
  events: {
  	'.parent click': function(el, ev) {
      var els = el.add(el.next('.children'));
      els[ (el.hasClass('expanded') ? 'remove' : 'add') + 'Class']('expanded');
    },
    '{viewModel.parsedObject} change': function(parsedObject, ev, attr, how, newVal, oldVal){
      // alert('{viewModel.parsedObject} change');
      this.viewModel.object.attr(unparseObject(parsedObject.attr()), true);
    },
    '{viewModel.object} change': function(object, ev, attr, how, newVal, oldVal){
      // alert('{viewModel.object} change');
      this.viewModel.parsedObject.attr(parseObject(object.attr()), true);
    }
  },
  helpers: {
    hasProperties: function(options) {
      var expr = can.isFunction(options.context) ? options.context() : options.context;
      return typeof expr === "object" && Object.keys(expr).length > 0;
    }
  }
});