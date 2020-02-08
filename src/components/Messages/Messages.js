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
            currentPage: 1,
            lastVisible: Number.MAX_SAFE_INTEGER,
            limit: 5,
            lastItems: 5,
            itemsToFetch: 0,
            queriedMessages: [],
        };
    }

    componentDidMount() {
        this.onListenForMessages();
    }

    onListenForMessages() {
        this.setState({loading: true});
        const startIndex = this.state.currentPage * this.state.limit - this.state.limit;

        if (this.state.queriedMessages.length === 0) {
            this.props.firebase
                .messages()
                .orderByChild('createdAt')
                .endAt(this.state.lastVisible)
                .limitToLast(this.state.limit * 2)
                .on('value', snapshot => {
                    const messageObject = snapshot.val();
                    if (messageObject) {
                        // convert messages list from snapshot
                        const messageList = Object.keys(messageObject).map(key => ({
                            ...messageObject[key],
                            uid: key,
                        }));
                        messageList.reverse();
                        const messageListFiltered = messageList.slice(0, this.state.limit);
                        const listLength = messageList.length;
                        const filteredListLength = messageListFiltered.length;
                        const lastVisible = messageList[listLength - 1].createdAt;

                        this.setState({
                            messages: messageListFiltered,
                            lastVisible: lastVisible - 1,
                            itemsToFetch: listLength - filteredListLength,
                            queriedMessages: messageList,
                            loading: false,
                        });
                    } else {
                        this.setState({
                            messages: null,
                            loading: false
                        });
                    }
                });
        } else if (this.state.currentPage * this.state.limit >= this.state.queriedMessages.length) {
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
                        const listLength = messageList.length;
                        const lastVisible = messageList[listLength - 1].createdAt;

                        let extractedMessages = this.cycleThroughMessages(startIndex,
                            startIndex + this.state.limit, this.state.queriedMessages);

                        this.setState(state => ({
                            messages: extractedMessages,
                            lastVisible: lastVisible - 1,
                            lastItems: listLength,
                            itemsToFetch: listLength,
                            queriedMessages: [...state.queriedMessages, ...messageList],
                            loading: false,
                        }));
                    } else {
                        let extractedMessages = this.cycleThroughMessages(startIndex,
                            startIndex + this.state.lastItems, this.state.queriedMessages);

                        this.setState({
                            messages: extractedMessages,
                            itemsToFetch: 0,
                            loading: false,
                        });
                    }
                });
        } else {
            let extractedMessages = this.cycleThroughMessages(startIndex,
                startIndex + this.state.limit, this.state.queriedMessages);

            this.setState({
                messages: extractedMessages,
                itemsToFetch: this.state.limit,
                loading: false,
            });
        }
    }

    cycleThroughMessages(startIndex, finishIndex, arrayToFetch) {
        let extractedMessages = [];
        for (let i = startIndex; i < finishIndex; i++) {
            let arrayElement = arrayToFetch[i];
            extractedMessages = [...extractedMessages, arrayElement];
        }
        return extractedMessages;
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
        this.setState({
            text: '',
            currentPage: 1,
        });
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
            state => ({
                currentPage: state.currentPage + 1,
            }),
            this.onListenForMessages,
        );
    };

    onPrevPage = () => {
        this.setState(
            state => ({
                currentPage: state.currentPage - 1,
            }),
            this.onListenForMessages,
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
                                <button
                                    type="button"
                                    onClick={this.onPrevPage}
                                    disabled={this.state.currentPage === 1}
                                >
                                    Prev Page
                                </button>
                                <span>
                                    Page: {this.state.currentPage}
                                </span>
                                <button
                                    type="button"
                                    onClick={this.onNextPage}
                                    disabled={this.state.itemsToFetch === 0}
                                >
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