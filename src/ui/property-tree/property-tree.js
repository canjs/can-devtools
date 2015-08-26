import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './property-tree.less!';
import template from './property-tree.stache!';
import children from './children.stache!';
import parent from './parent.stache!';

import {parse, compose} from 'can-devtools/ui/util/object';

import 'can-devtools/ui/property/';

export const ViewModel = Map.extend({
  define: {
    parentTemplate: {
      value: function() {
        return parent;
      }
    },
    childTemplate: {
      value: function() {
        return children;
      }
    },
    object: {
      value: function() {
        return [];
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
    }
  },
  helpers: {
    hasProperties: function(options) {
      var expr = can.isFunction(options.context) ? options.context() : options.context;
      return typeof expr === "object" && Object.keys(expr).length > 0;
    }
  }
});