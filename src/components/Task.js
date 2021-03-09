import React from 'react';

export default class Task extends React.Component {

    static formatTime = (ms) => {
        let seconds = ms / 1000;
        const minutes = Math.floor(seconds / 60)
        seconds = Math.floor(seconds - minutes * 60);
        const format2Digits = (num) => {
            return num < 10 ? '0' + num : num;
        }
        return minutes + ":" + format2Digits(seconds);
    }

    render() {
        return this.props.isPending ?
            (
                <div className="pending--task" >
                    <button onClick={() => this.props.deleteTask(this.props.task._id)}> Delete </button>
                    <button onClick={() => this.props.completeTask(this.props.task._id)}> Complete </button>
                    <li className={this.props.isSelected ? "selected" : ""} onClick={() => this.props.toggleSelect(this.props.task._id)}>
                        {this.props.task.description} {Task.formatTime(this.props.task.timeSpent)}
                    </li>
                </div>
            ) :
            (
                <div className="completed--task" >
                    <li>
                        {this.props.task.description} {Task.formatTime(this.props.task.timeSpent)}
                    </li>
                </div>
            )
            ;
    }
}

