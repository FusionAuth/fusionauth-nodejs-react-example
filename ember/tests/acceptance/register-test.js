import { test } from 'qunit';
import moduleForAcceptance from 'passport-js-example/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | register');

test('visiting /register', function(assert) {
  visit('/register');

  andThen(function() {
    assert.equal(currentURL(), '/register');
  });
});
