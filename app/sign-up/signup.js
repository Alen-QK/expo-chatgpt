import React, {useState} from 'react';
import {Alert, Image, SafeAreaView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Stack, useRouter} from "expo-router";

import axios from "axios";
import {btoa} from "react-native-quick-base64";

import { PORT } from "@env";
import SignStyles from "../../styles/signup";
import {icon} from "../../constants";

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleUsername = (value) => {
        setUsername(value);
    };

    const handlePassword = (value) => {
        setPassword(value);
    };

    const handleOnPress = () => {
        let id = btoa(username);

        let data = {
            id: id,
            name: username,
            pwd: password
        };

        const AlertInfo = (res) => {
            Alert.alert('Register Info', res, [
                {
                    text: 'Login',
                    // 通过router.back()可以直接返回上一级页面
                    onPress: () => router.back(),
                    style: 'cancel',
                },
                {text: 'OK'},
            ]);
        };

        axios.post(`http://10.0.0.4:${PORT}/api.signup`, data)
            .then((response) => {
                if (response.status !== 200) {
                    AlertInfo("Error");
                } else {
                    if (response.data.code === 311) {
                        AlertInfo("User have existed");
                    } else {
                        AlertInfo("Registered!");
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

            <View style={SignStyles.container}>
                <Text style={SignStyles.sign_title}>Sign In</Text>

                <View style={SignStyles.search_container}>
                    <TextInput style={SignStyles.textinput} onChangeText={handleUsername} placeholder={'Username'}/>
                    <TextInput style={SignStyles.textinput} onChangeText={handlePassword} placeholder={'Password'}/>
                </View>

                <TouchableOpacity style={SignStyles.sign_button} onPress={handleOnPress}>
                    <Image source={icon.register}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default Signup;