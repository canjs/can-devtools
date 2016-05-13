import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './collapse.less!';
import template from './collapse.stache!';

export const ViewModel = Map.extend({
  define: {
    hasContent: {
      value: false
    },
    opened: {
      value: false,
			type: 'boolean'
    }
  },
  toggle: function() {
    this.attr('opened', !this.attr('opened'));
  }
});

export default Component.extend({
  tag: 'devtools-collapse',
  viewModel: ViewModel,
  template: template,
  events: {
	inserted: function(){
      this.viewModel.attr('hasContent', this.element.find('.collapse-content').children().length > 0);
      if(!this.viewModel.attr('opened')) {
        this.element.addClass('collapse-closed');
      };
    },
    '{viewModel} opened': function() {
      this.element.toggleClass('collapse-closed');
    }
  }
});
