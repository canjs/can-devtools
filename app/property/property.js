import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './property.less!';
import template from './property.stache!';

export const ViewModel = Map.extend({
  define: {
    property: {
      value: {}
    },
    showEditor: {
      value: false
    }
  },
  edit: function() {
    this.attr('showEditor', true);
  },
  save: function() {
    this.attr('showEditor', false);
  }
});

export default Component.extend({
  tag: 'devtools-property',
  viewModel: ViewModel,
  template: template,
  events: {
    '{viewModel} showEditor': function(viewModel, ev, newVal, oldVal) {
      var input = this.element.find('input');
      if(newVal) {
        setTimeout(function(){
          input.focus().select();
        }, 0);
      }
    }
  }
});