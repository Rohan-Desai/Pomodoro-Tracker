import React from 'react';

export default class AddTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.modalBox = React.createRef();

        this.state = {
            input: '',
            processing: false
        };
    }

    /*
     * LIFECYCLE METHODS
     */

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /*
     * STATE HANDLERS
     */

    /**
     * Hide the modal if clicked outside
     * @param e
     */
    handleClickOutside = (e) => {
        if (this.modalBox.current && !this.modalBox.current.contains(e.target)) {
            this.props.hideModal();
        }
    };

    /**
     * Function to turn the submit button into "processing." Can pass this to the modal action.
     */
    toggleProcessing = () => {
        this.setState({
            processing: !this.state.processing
        });
    };


    /**
     * Wrap the action we are passed via props and pass the hideModal method.
     */
    handleAction = () => {
        this.props.action(this.props.hideModal, this.toggleProcessing);
    };

    render() {
        return (
            this.props.modalVisible ?
                <div className="task-popout modal-container">
                    <div className="task-popout-box" ref={this.modalBox}>
                        <div className="task-popout-header">
                            <div className="task-popout-title">Task</div>
                            <div className="task-popout-close" onClick={this.props.hideModal}>X</div>
                        </div>
                        <textarea className="task-input" onChange={this.props.handleInput} value={this.props.value}> </textarea>
                        <button className="add-task" onClick={this.props.addTask}> Submit </button>
                        {/* <div className="cart-buttons">
                        { this.props.singleButton || <div className={`button light-gray large continue-shopping ${this.props.singleCancel ? 'single' : ''}`} onClick={this.props.hideModal}>{this.props.leftButtonText}</div> }
                        { this.props.singleCancel || <div className={`button green large checkout ${this.state.processing ? 'processing' : ''}`} onClick={this.handleAction}>{ this.state.processing && util.loadingRing }{this.props.rightButtonText}</div> }
                    </div> */}
                    </div>
                </div> : null
        );
    }
}