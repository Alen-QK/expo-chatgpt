import {INIT_MESSAGE, ADD_MESSAGE} from "../../constants/cons";

const initState = [];

function ChatReducer(state= initState, action) {
    const {type, payload} = action;

    switch (type) {
        case INIT_MESSAGE: {
            state = payload;

            return state
        }

        case ADD_MESSAGE: {

            return [
                ...state,
                payload
            ]
        }
    }
    return state
}

export default ChatReducer