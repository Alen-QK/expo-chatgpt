import React, {useState, useCallback, useEffect} from 'react';
import {SafeAreaView, Text, TextInput, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {Stack} from "expo-router";
import {GiftedChat} from 'react-native-gifted-chat'

import ChatroomStyle from "../../styles/chatroom";
import {ADD_MESSAGE} from "../../constants/cons";
import axios from "axios";
import {PORT} from "@env";
import {icon} from "../../constants";

function Chatroom() {
    const JWT = useSelector(state => state.userInfo);
    const chatHistory = useSelector(state => state.chatInfo);
    let tempChat = chatHistory;
    const [rmessages, setMessages] = useState([]);

    const ConvertFormat = (item) => {
        return {
            role: item.user._id === 1 ? 'user' : 'assistant',
            content: item.text
        }
    };

    useEffect(() => {
        // 注意，这里需要考虑到原来的chatHistory如果直接渲染在chatroom当中，是倒叙展示的（原因暂时未确定），但是如果直接chatHistory.reverse()，会使得下面所有依赖tempChat[tempChat.length - 1]._id + 1的地方出现错误，因为这样最末尾的位置的id
        // 会变为1，这样id就会重复，然后聊天记录的渲染也会紊乱，导致从头开始重复渲染的错误。如果像让历史记录正常渲染又不影响当前聊天动作，那么需要将原始的chatHistory deep copy一份过来，然后effect渲染。
        const reverseChat = JSON.parse(JSON.stringify(chatHistory));
        setMessages(reverseChat.reverse());
    }, []);

    const onSend = useCallback((messages = []) => {
                // 将user发送的文本加入messages的序列
                setMessages(perviousMessages => GiftedChat.append(perviousMessages, messages));
                // 其实没什么用，只是不想改了，下面的tempChat其实直接可以调取messages.text,_id等等
                const userMessage = {
                    role: 'user',
                    content: messages[0].text,
                    id: messages[0]._id
                };
                // 这里实际就不再需要维护redux中的消息记录了，这个工作已经由tempChat在即时即环境下完成了，因为Giftchat的特性，这里我们就不需要借助redux来map渲染即时的聊天信息，只要更新state的message就可以了。
                // const userAction = {
                //     type: ADD_MESSAGE,
                //     payload: userMessage
                // };
                //
                // dispatch(userAction);

                // local的temp动态记录双方的聊天信息，其实有用的主要就是_id和text以及user里的id，因为这个temp主要是为了转换成chatgpt接口所需的格式
                tempChat.push({
                    _id: tempChat.length !== 0 ? tempChat[tempChat.length - 1]._id + 1 : 1,
                    text: userMessage.content,
                    user: {
                        _id: 1,
                        name: "You",
                        avatar: icon.robot
                    }
                });

                // 转换temp的格式，输出当前聊天的上下文状态
                const convertChat = tempChat.map((item) => ConvertFormat(item));
                const postBody = {
                    data: convertChat
                };

                const config = {
                    headers: {
                        jwt: JWT.jwt
                    }
                };

                axios.post(`http://localhost:${PORT}/api.chatgpt`, postBody, config)
                    .then((response) => {
                        let responseGPT = response.data.data;

                        // 给收到的回复format，加入temp的记录，便于接下来的对话依然保有完整的上下文语境
                        const formatRes = [{
                            _id: tempChat[tempChat.length - 1]._id + 1,
                            text: responseGPT.content,
                            user: {
                                _id: 2,
                                name: "ChatGPT",
                                avatar: icon.robot
                            }
                        }];

                        tempChat.push(formatRes[0]);
                        // 将chatgpt的回复加入聊天记录
                        setMessages(perviousMessages => GiftedChat.append(perviousMessages, formatRes));
                    })

            },
            []
        )
    ;

    return (
        <SafeAreaView style={{flex: 1, flexDirection: 'row', backgroundColor: '#FAFAFC'}}>
            <Stack.Screen
                options={{
                    headerStyle: {backgroundColor: '#689B8D'},
                    headerShadowVisible: false, // 去掉header和主视图之间的那条shadow分割线
                    headerTitle: "Talk to ChatGPT",
                    // 控制header的文字以及back键的基础特效
                    headerTintColor: 'white'
                    // headerLeft: () => (
                    //     Component
                    // ), 设置header左上方导航，一般来说返回一个Button型的Component
                    // headerRight: () => (
                    //     Component
                    // ) 设置右上方导航，同上
                }}
            />

            {/*<View style={ChatroomStyle.message_container}>*/}
            {/*    <TextInput placeholder={'Write something...'} style={ChatroomStyle.message_input}/>*/}
            {/*</View>*/}

            <GiftedChat
                messages={rmessages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        </SafeAreaView>
    );
}

export default Chatroom;