import F from 'funcunit';
import QUnit from 'steal-qunit';

F.attach(QUnit);

QUnit.module('dev-tools functional smoke test', {
  beforeEach() {
    F.open('/');
  }
});

QUnit.test('dev-tools main page shows up', function() {
  F('title').text('dev-tools', 'Title is set');
});
