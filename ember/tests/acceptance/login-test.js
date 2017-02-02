import { test } from 'qunit';
import moduleForAcceptance from 'passport-bluemix-example/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | login');

test('visiting /login', function(assert) {
  visit('/login');

  andThen(function() {
    assert.equal(currentURL(), '/login');
    click('#register');
    andThen(() => assert.equal(currentURL(), '/register'));
  });
});
