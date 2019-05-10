import QUnit from 'steal-qunit';
import { ViewModel } from './property-tree';

// ViewModel unit tests
QUnit.module('property-tree');

QUnit.test('Has message', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.attr('message'), 'This is the devtools-property-tree component');
});
