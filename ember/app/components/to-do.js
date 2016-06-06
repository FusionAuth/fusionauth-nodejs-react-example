/*
 * Copyright (c) 2016, Inversoft Inc., All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

import Ember from 'ember';

export default Ember.Component.extend({
  didRender() {
    // Focus the input field on render
    this.$('input').focus();
  },
  actions: {
    complete(todo) {
      this.sendAction('complete', todo);
    },
    delete(todo) {
      this.sendAction('delete', todo);
    },
    edit() {
      this.toggleProperty('editing');
    },
    update(todo) {
      this.sendAction('update', todo);
      this.toggleProperty('editing');
    }
  },
  mouseLeave: function() {
    this.set('showAction', false);
  },
  mouseEnter: function() {
    this.set('showAction', true);
  },
  keyDown: function(event) {
    if (event.keyCode === 13)  {
      // Capture 'Enter' - send the 'update' action.
      this.send('update', this.attrs.todo.value);
      return false;
    } else if (event.keyCode === 27) {
      // Capture 'ESC' - Exit Edit mode, and send the 'rollback' action.
      this.sendAction('rollback', this.attrs.todo.value);
      this.toggleProperty('editing');
      return false;
    }
  }
});
