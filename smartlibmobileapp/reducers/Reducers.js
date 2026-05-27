import { AsyncStorage } from "react-native";

export const MyUserReducer = (current, action) => {
    switch (action.type) {
        case "LOGIN":
            return action.payload;
        case "LOGOUT":
            AsyncStorage.removeItem('token');
            return null;
    }

    return current;
}