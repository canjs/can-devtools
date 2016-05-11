import can from 'can';
import 'can/map/define/';

const AppViewModel = can.Map.extend({
	define: {
		canFound: {
			value: false,
			type: 'boolean'
		},

		detecting: {
			value: true,
			type: 'boolean'
		}
	}
});

export default AppViewModel;
