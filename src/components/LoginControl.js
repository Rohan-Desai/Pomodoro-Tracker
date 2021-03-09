import React from 'react';

export default class LoginControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false };
  }

  onGoogleLogin = () => {
    window.open("http://localhost:8080/auth/google/login", "_self");
  }

  onGoogleLogout = () => {
    window.open("http://localhost:8080/auth/logout", "_self");
  }

  render() {
    let button;
    if (this.props.isLoggedIn) {
      button = <button onClick={this.onGoogleLogout}> Logout </button>;
    } else {
      button = <button onClick={this.onGoogleLogin} > Sign in with Google </button>;
    }

    return (
      <div className="login-control">
        {button}
      </div>
    );
  }
}