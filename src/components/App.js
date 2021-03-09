import React from 'react';
import '../static/css/App.css';
import Header from './Header';
import Timer from './Timer';
import Tasks from './Tasks';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoggedIn: false, user: null, isPomodoroRunning: false};
  }

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:8080/auth/google/login/verify", {
        method: "GET",
        credentials: "include"
      });
      if (response.status === 401) {
        throw new Error("Unauthenticated");
      }

      const user = await response.json().then(json => json.user);
      console.log(user)
      this.setState({ isLoggedIn: true, user: user });
    } catch (error) {
      this.setState({ isLoggedIn: false });
    }
  }

  startPomodoro = () => {
    this.setState({isPomodoroRunning: true});
  }

  stopPomodoro = () => {
    this.setState({isPomodoroRunning: false});
  }

  render() {
    return (
      <div>
        <Header isLoggedIn={this.state.isLoggedIn} user={this.state.user} />
        <Timer startPomodoro={this.startPomodoro} stopPomodoro={this.stopPomodoro} />
        <Tasks isLoggedIn={this.state.isLoggedIn} isPomodoroRunning={this.state.isPomodoroRunning} />
      </div>
    );
  }
}


// (
//   <div className="App">
//     <header className="App-header">
//       <img src={logo} className="App-logo" alt="logo" />
//       <p>
//         Edit <code>src/App.js</code> and save to reload.
//     </p>
//       <a
//         className="App-link"
//         href="https://reactjs.org"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         Learn React
//     </a>
//     </header>
//   </div>);