import { Stack } from "expo-router";
import {Provider} from "react-redux";
import {store} from "../redux/store";

const Layout = () => {
    return (
        // 在使用expo_router的环境下，如果希望对root进行任何装饰或者添加任何需要从root才能应用的库或者tag，就需要在_layout这个文件这里进行
        <Provider store={store}>
            <Stack />
        </Provider>
    )
}

export default Layout