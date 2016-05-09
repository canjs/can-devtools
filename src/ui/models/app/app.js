import can from 'can';
import 'can/map/define/';

const AppViewModel = can.Map.extend({
	define: {
		status: {
			get: function() {
				return this.attr('canFound') ? 'ok': 'noCan';
			}
		},
		canFound: {
			value: false,
			type: 'boolean'
		}
	}
});

export default AppViewModel;
