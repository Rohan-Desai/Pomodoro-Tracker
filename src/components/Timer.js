import React from 'react';

export default class Timer extends React.Component {
    // in seconds
    static timers = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 30 * 60
    };

    constructor(props) {
        super(props);
        this.state = { cycle: 'pomodoro', currentTime: Timer.timers.pomodoro };
        this.timerId = null;
    }

    setPomodoroTimer = () => {
        clearInterval(this.timerId);
        this.setState({ cycle: 'pomodoro', currentTime: Timer.timers.pomodoro });
    }

    setShortBreakTimer = () => {
        clearInterval(this.timerId);
        this.setState({ cycle: 'shortBreak', currentTime: Timer.timers.shortBreak });
    }

    setLongBreakTimer = () => {
        clearInterval(this.timerId);
        this.setState({ cycle: 'longBreak', currentTime: Timer.timers.longBreak });
    }

    startTimer = () => {
        if (this.timerExists()) return; // NOP if timer is set;
        if (this.state.cycle === 'pomodoro') {
            this.props.startPomodoro();
        }
        const countdown = () => {
            this.setState(state => ({ currentTime: --state.currentTime }));
        }

        this.timerId = setInterval(
            countdown,
            1000
        );
    }

    stopTimer = () => {
        if (this.state.cycle === 'pomodoro') {
            this.props.stopPomodoro();
        }
        clearInterval(this.timerId);
        this.timerId = null;
    }

    resetTimer = () => {
        clearInterval(this.timerId);
        this.timerId = null;
        this.setState(state => ({ currentTime: Timer.timers[state.cycle] }));

    }

    timerExists = () => {
        return this.timerId !== null;
    }

    render() {

        return (
            <div className="timer-container">
                <div className="timer">
                    <h1>{Timer.getFormattedTime(this.state.currentTime)}</h1>
                </div>
                <div className="timer-cycle">
                    <button onClick={this.setPomodoroTimer}> Pomodoro </button>
                    <button onClick={this.setShortBreakTimer}> Short Break </button>
                    <button onClick={this.setLongBreakTimer}> Long Break </button>
                    <br />
                </div>
                <div className="timer-control">
                    <button onClick={this.startTimer}> Start </button>
                    <button onClick={this.stopTimer}> Stop </button>
                    <button onClick={this.resetTimer}> Reset </button>
                </div>
            </div>
        );
    }

    static getFormattedTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secondsRemaining = seconds % 60;
        const format2Digits = (num) => {
            return num < 10 ? '0' + num : num;
        }
        return minutes + ':' + format2Digits(secondsRemaining);
    }
}