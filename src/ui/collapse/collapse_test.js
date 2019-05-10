import QUnit from 'steal-qunit';
import { ViewModel } from './collapse';

// ViewModel unit tests
QUnit.module('collapse');

QUnit.test('Has message', function(assert) {
  var vm = new ViewModel();
  assert.equal(vm.attr('message'), 'This is the devtools-collapse component');
});
