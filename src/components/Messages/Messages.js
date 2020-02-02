import React, {Component} from "react";
import {AuthUserContext} from "../Session";
import {withFirebase} from "../Firebase";
import MessageList from "./MessageList";

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            loading: false,
            messages: [],
            lastVisible: Number.MAX_SAFE_INTEGER,
            limit: 5,
        };
    }

    componentDidMount() {
        this.onListenForMessages();
    }

    onListenForMessages() {
        this.setState({loading: true});

        this.props.firebase
            .messages()
            .orderByChild('createdAt')
            .endAt(this.state.lastVisible)
            .limitToLast(this.state.limit)
            .on('value', snapshot => {
                const messageObject = snapshot.val();
                if (messageObject) {
                    // convert messages list from snapshot
                    const messageList = Object.keys(messageObject).map(key => ({
                        ...messageObject[key],
                        uid: key,
                    }));
                    messageList.reverse();
                    const lastVisible = messageList[messageList.length-1].createdAt;

                    this.setState({
                        messages: messageList,
                        loading: false,
                        lastVisible: lastVisible - 1,
                    });
                } else {
                    this.setState({
                        messages: null,
                        loading: false
                    });
                }
            });
    }

    componentWillUnmount() {
        this.props.firebase.messages().off();
    }

    onChangeText = event => {
        this.setState({ text: event.target.value });
    };

    onCreateMessage = (event, authUser) => {
        this.props.firebase.messages().push({
            text: this.state.text,
            userId: authUser.uid,
            createdAt: this.props.firebase.serverValue.TIMESTAMP,
        });
        this.setState({ text: '' });
        event.preventDefault();
    };

    onRemoveMessage = uid => {
        this.props.firebase.message(uid).remove();
    };

    onEditMessage = (message, text) => {
        const { uid, ...messageSnapshot } = message;
        this.props.firebase.message(message.uid).set({
            ...messageSnapshot,
            text,
            editedAt: this.props.firebase.serverValue.TIMESTAMP,
        });
    };

    onNextPage = () => {
        /*this.setState(
            state => ({ limit: state.limit + 5 }),
            this.onListenForMessages,
        );*/
        this.setState(
            state => ({ prevState: state.messages }),
            this.onListenForMessages,
        );
        //this.onListenForMessages();
    };

    onPrevPage = () => {
        this.setState(
            state => ({ messages: state.prevState }),
        );
    };

    render() {
        const { text, messages, loading } = this.state;
        return (
            <AuthUserContext.Consumer>
                {authUser => (
                    <div>
                        {!loading && messages && (
                            <div>
                                <button type="button" onClick={this.onPrevPage}>
                                    Prev Page
                                </button>
                                <button type="button" onClick={this.onNextPage}>
                                    Next Page
                                </button>
                            </div>
                        )}
                        {loading && <div>Loading ...</div>}

                        {messages ? (
                            <MessageList
                                authUser={authUser}
                                messages={messages}
                                onEditMessage={this.onEditMessage}
                                onRemoveMessage={this.onRemoveMessage}
                            />
                        ) : (
                            <div>There are no messages ...</div>
                        )}

                        <form onSubmit={event => this.onCreateMessage(event, authUser)}>
                            <input
                                type="text"
                                value={text}
                                onChange={this.onChangeText}
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                )}
            </AuthUserContext.Consumer>
        );
    }
}

export default withFirebase(Messages);