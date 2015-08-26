import can from 'can';
import 'can/map/define/';

const AppViewModel = can.Map.extend({
	define: {
		//whether the app is active
		inactive: {
			value: true,
			type: 'boolean'
		}
	}
});

export default AppViewModel;
