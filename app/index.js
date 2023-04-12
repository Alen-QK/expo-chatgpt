import {View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, Alert} from "react-native";
import {useState} from "react";
import {Link, Stack, useRouter} from "expo-router";
import {useDispatch} from "react-redux";

import axios from "axios";
import {btoa} from "react-native-quick-base64";
import uuid from "react-native-uuid";

import LoginStyles from "../styles/login";
import {icon} from "../constants";
import {INIT_MESSAGE, LOGIN} from "../constants/cons";
import {PORT} from "@env";

const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleUsername = (value) => {
        setUsername(value);
    };

    const handlePassword = (value) => {
        setPassword(value);
    };

    const handleLogin = () => {

        let id = btoa(username);

        let data = {
            id: id,
            name: username,
            pwd: password
        };

        const AlertInfo = (res) => {
            Alert.alert('Login Info', res, [
                {text: 'OK'},
            ]);
        }

        const ChatFormat = (item, idx) => {
            let NewFormat = {
                _id: idx + 1,
                text: item.content,
                user: {
                    _id: item.role === "user" ? 1 : 2,
                    name: item.role === "user" ? "You" : "ChatGPT",
                    avatar: icon.robot
                }
            }

            return NewFormat
        };

        axios.post(`http://10.0.0.4:${PORT}/api.login`, data)
            .then((response) => {
                if (response.status !== 200) {
                    console.log("Error");
                } else {
                    if (response.data.code === 311) {
                        AlertInfo(response.data.data);
                    } else if (response.data.code === 312) {
                        AlertInfo(response.data.data);
                    } else {
                        let chatHistory = new Array();
                        const getdata = {id: data.id};
                        const JWT = response.data.data;

                        axios.post(`http://10.0.0.4:${PORT}/api.gethis`, getdata)
                            .then((r) => {
                                if (r.status !== 200) {
                                    console.log('Error');
                                } else {
                                    if (r.data.code !== 200) {
                                        console.log('Select Error.');
                                    } else {
                                        chatHistory = r.data.data.map((item, index) => ChatFormat(item, index));

                                        // 记录当前用户username和userid
                                        const loginAction = {
                                            type: LOGIN,
                                            payload: {jwt: JWT}
                                        };

                                        dispatch(loginAction);
                                        // 初始化已经存在的当前用户的聊天记录
                                        const initAction = {
                                            type: INIT_MESSAGE,
                                            payload: chatHistory
                                        };

                                        dispatch(initAction);

                                        router.push('/chatroom/chatroom');
                                    }
                                }
                            })
                    }
                }
            })
    }

    return (

        <SafeAreaView style={{flex: 1, backgroundColor: '#FAFAFC'}}>
            {/*设置header的样式*/}
            <Stack.Screen
                options={{
                    headerStyle: {backgroundColor: '#FAFAFC'},
                    headerShadowVisible: false, // 去掉header和主视图之间的那条shadow分割线
                    headerTitle: "",
                    // headerLeft: () => (
                    //     Component
                    // ), 设置header左上方导航，一般来说返回一个Button型的Component
                    // headerRight: () => (
                    //     Component
                    // ) 设置右上方导航，同上
                }}
            />

            <View style={LoginStyles.container}>
                <Image source={icon.login_logo} style={LoginStyles.login_logo}/>
                <Text style={LoginStyles.login_title}>Login</Text>

                <View style={LoginStyles.search_container}>
                    <TextInput style={LoginStyles.textinput} onChangeText={handleUsername}
                               placeholder={'Username'}/>
                    <TextInput style={LoginStyles.textinput} onChangeText={handlePassword} placeholder={'Password'}
                               secureTextEntry={true}/>
                </View>

                <TouchableOpacity style={LoginStyles.login_button} onPress={handleLogin}>
                    <Image source={icon.login}/>
                </TouchableOpacity>

                <Link href={"/sign-up/signup"} style={LoginStyles.signup_navi}>Don't have account? Register
                    now!</Link>
            </View>
        </SafeAreaView>
    )
}

export default Login