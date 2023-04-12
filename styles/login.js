import {StyleSheet} from "react-native-web";

const LoginStyles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    login_logo: {
        width: 60,
        height: 60,
        marginBottom: 30
    },

    login_title: {
        fontSize: 50,
        color: '#689B8D'
    },

    search_container: {
        marginTop: 30,
        justifyContent: "space-between",
        width: 250
    },

    textinput: {
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 22,
        marginBottom: 10,
        padding: 5
    },

    login_button: {
        marginTop: 5
    },

    signup_navi: {
        marginTop: 30,
        color: '#689B8D',
        fontSize: 16
    }
});

export default LoginStyles