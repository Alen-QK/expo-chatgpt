import {LOGIN, LOGOUT} from "../../constants/cons";

const initState = {
    jwt: ''
}

function UserReducer(state= initState, action) {
    const {type, payload} = action;

    switch (type) {
        case LOGIN: {
            return {
                ...state,
                jwt: payload.jwt
            }
        }

        case LOGOUT: {
            return {
                ...state,
                initState
            }
        }
    }

    return state
}

export default UserReducer