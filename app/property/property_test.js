import QUnit from 'steal-qunit';
import { ViewModel } from './property';

// ViewModel unit tests
QUnit.module('property');

QUnit.test('Has message', function(){
  var vm = new ViewModel();
  QUnit.equal(vm.attr('message'), 'This is the devtools-property component');
});
