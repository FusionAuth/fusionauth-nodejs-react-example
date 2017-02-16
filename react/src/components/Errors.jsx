import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import Error from './Error';

import '../assets/Errors.css';

class Errors extends Component {
  constructor(props) {
    super(props);

    this.lookupMessage = this.lookupMessage.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  render() {
    return (
      <div>
        {this.props.errors.length > 0 ? (
          <div className="errors">
            <FontAwesome className="exclamation" name="exclamation-triangle" />
            {this.props.errors.map(this.renderError)}
          </div>
        ) : ('') }
      </div>
    );
  }

  lookupMessage(code) {
    if (this.props.messages[code]) {
      return this.props.messages[code];
    }

    return code;
  }

  renderError(code) {
    return <Error text={this.lookupMessage(code)} key={code} />
  }
}

Errors.defaultProps = {
  messages: {
    '[AuthenticatedNotRegistered]': 'You are not authorized to this application.',
    '[InvalidLogin]': 'Invalid Credentials. Try again.',
    '[PasswordMismatch]': 'Passwords do not match.',
    '[blank]user.email': 'Email is Required.',
    '[blank]user.password': 'Password is Required.',
    '[singleCase]user.password': 'Maybe throw in an upper case letter?',
    '[tooShort]user.password': 'The password is too short me thinks.'
  }
};

export default Errors;
