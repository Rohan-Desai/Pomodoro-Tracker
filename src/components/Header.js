import React from 'react';
import LoginControl from './LoginControl';
import Timer from './Timer';

export default class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <div className="title">
                    <h1>Pomodoro Tracker</h1>
                </div>
                <Timer/>
                <div className="sign-in">
                    <LoginControl isLoggedIn={this.props.isLoggedIn} />
                    {this.props.user ? <img src={this.props.user.thumbnail} alt={"Profile"} /> : null}
                </div>
            </div>
        );
    }
}