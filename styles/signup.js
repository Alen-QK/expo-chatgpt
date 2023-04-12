import {StyleSheet} from "react-native-web";

const SignStyles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    sign_title: {
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

    sign_button: {
        marginTop: 5
    }
});

export default SignStyles