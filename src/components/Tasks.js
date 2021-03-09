import React from 'react';
import AddTaskModal from './AddTaskModal';
import Task from './Task'
import TaskService from '../api/TaskService.js';

export default class Tasks extends React.Component {

    constructor(props) {
        super(props);
        this.state = { tasks: [], modalVisible: false, newTaskInput: '', selectedTaskId: null };
    }

    showModal = () => {
        this.setState({ modalVisible: true });
    }

    hideModal = () => {
        this.setState({ modalVisible: false });
    }

    handleInput = (e) => {
        this.setState({ newTaskInput: e.target.value });
    }


    /*
    * LIFECYCLE METHODS
    */
    async componentDidMount() {
        if (!this.props.isLoggedIn) return;
        this.getTasks();
    }

    componentDidUpdate(prevProps) {
        if (Tasks.loggedIn(prevProps, this.props)) {
            this.getTasks();
        }

        if (Tasks.pomodoroStarted(prevProps, this.props)) { // detect pomdoro start
            this.startTask(this.state.selectedTaskId);
        }
        
        if (Tasks.pomodoroStopped(prevProps, this.props)) { // detect pomodoro stop
            this.stopTask(this.state.selectedTaskId);
        }
    }

    static loggedIn(prevProps, currProps) {
        return !prevProps.isLoggedIn && currProps.isLoggedIn;
    }

    static pomodoroStarted(prevProps, currProps) {
        return !prevProps.isPomodoroRunning && currProps.isPomodoroRunning;
    }

    static pomodoroStopped(prevProps, currProps) {
        return prevProps.isPomodoroRunning && !currProps.isPomodoroRunning;
    }

    /*
    * STATE HANDLERS
    */

    getTasks = async () => {
        try {
            const tasks = await TaskService.getTasks();
            this.setState({ tasks: tasks });
        } catch (error) {
            console.log(error);
        }
    }

    addTask = async () => {
        try {
            const newTask = await TaskService.createTask(this.state.newTaskInput);
            this.setState(state => ({ tasks: [...state.tasks, newTask], newTaskInput: '' }));
        }
        catch (error) {
            console.log(error);
        }
    }

    completeTask = async (id) => {
        try {
            const matchingTask = Tasks.findMatchingTask(id, this.state.tasks);
            matchingTask.completed = true;
            const updatedTask = await TaskService.updateTask(matchingTask);
            this.setState(state => {
                const taskClone = [...state.tasks];
                taskClone[taskClone.findIndex(task => task._id === id)] = updatedTask;
                return { tasks: taskClone };
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    deleteTask = async (id) => {
        try {
            const matchingTask = Tasks.findMatchingTask(id, this.state.tasks);
            const deletedTask = await TaskService.deleteTask(matchingTask);
            this.setState(state => {
                const taskClone = [...state.tasks].filter(task => task._id !== deletedTask._id);
                return { tasks: taskClone };
            });
        }
        catch (error) {
            console.log(error);
        }
    }


    toggleSelect = async (id) => {
        const matchingTask = Tasks.findMatchingTask(id, this.state.tasks);
        if (this.state.selectedTaskId && matchingTask._id === this.state.selectedTaskId) {
            this.setState({ selectedTaskId: null });
        }
        else {
            this.setState({ selectedTaskId: matchingTask._id });
        }
    }

    startTask = async (taskId) => {
        if (!this.state.selectedTaskId) return;
        this.setState({ selectedTaskId: taskId });

        this.timerId = setInterval(
            this.getIncrementTimeFunction(),
            1000
        );
    }

    stopTask = async (taskId) => {
        if (!this.state.selectedTaskId) return;
        clearInterval(this.timerId);
        const matchingTask = Tasks.findMatchingTask(taskId, this.state.tasks);
        try {
            await TaskService.updateTask(matchingTask);
        }
        catch (error) {
            console.log(error);
        }
    }

    // Closure. Returns function to increment time spent on selected task. Sends update to the server every 5 seconds.
    getIncrementTimeFunction = () => {
        let counter = 0;
        return async () => {
            if (!this.state.selectedTaskId) return;
            counter++;
            const taskClone = [...this.state.tasks];
            const matchingTask = { ...taskClone.find(task => task._id === this.state.selectedTaskId) };
            matchingTask.timeSpent += 1000;
            taskClone[taskClone.findIndex(task => task._id === this.state.selectedTaskId)] = matchingTask;
            if (counter % 5 === 0) {
                try {
                    await TaskService.updateTask(matchingTask);
                }
                catch (error) {
                    console.log(error);
                }
            }
            this.setState(
                { tasks: taskClone }
            )
        }
    }

    /*
    * HELPERS
    */
    static findMatchingTask(id, tasks) {
        return tasks.find(task => task._id === id);
    }



    render() {
        const pendingTasks = this.state.tasks.filter(task => !task.completed);
        const completedTasks = this.state.tasks.filter(task => task.completed);
        return (
            <div className="task-container">
                <AddTaskModal modalVisible={this.state.modalVisible} hideModal={this.hideModal} addTask={this.addTask} value={this.state.newTaskInput} handleInput={this.handleInput} />
                <button onClick={this.showModal}> Add Task </button>
                <div className="pending-tasks">
                    <h2>Pending Tasks</h2>
                    {pendingTasks.map(task => {
                        const isSelected = (task._id === this.state.selectedTaskId);
                        return (
                            <Task task={task}
                                isPending={true} isSelected={isSelected}
                                toggleSelect={this.toggleSelect}
                                deleteTask={this.deleteTask}
                                completeTask={this.completeTask}
                                key={task._id} />);
                    })}
                </div>
                <div className="completed-tasks">
                    <h2>Completed Tasks</h2>
                    {completedTasks.map(task => <Task task={task} isPending={false} key={task._id} />)}
                </div>
            </div>
        );
    }

}