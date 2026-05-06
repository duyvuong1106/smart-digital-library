import { View } from "react-native";
import Header from "./components/Header";
import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-paper";
import Register from "./screens/User/Register";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home/Home";
import Documents from "./screens/Home/Documents";
import DocumentDetails from "./screens/Home/DocumentDetails";
import Login from "./screens/User/Login";




const Stack = createNativeStackNavigator();

const StackNavigator = () => { 
  return(
    <Stack.Navigator>
      <Stack.Screen name="index" component={Home} options={{ title: 'Khóa học' , headerShown: false}}  />
      <Stack.Screen name="documents" component={Documents} options={{ title: 'Tài liệu' }} />
      <Stack.Screen name="document-details" component={DocumentDetails} options={{ title: 'Chi tiết tài liệu' }} />
    </Stack.Navigator>
  )
}

const Tab = createNativeBottomTabNavigator();

const TabNavigator = () => {
  return(
    <Tab.Navigator>
      <Tab.Screen name="home" component={StackNavigator} options={{title: 'Màn hình chính', tabBarIcon:() => <Icon source="home" size={20} />}} />
      <Tab.Screen name="register" component={Register} options={{title: 'Đăng ký', tabBarIcon:() => <Icon source="account-plus" size={20} />}} />
      <Tab.Screen name="login" component={Login} options={{title: 'Màn hình chính', tabBarIcon:() => <Icon source="login" size={20} />}} />

    </Tab.Navigator>
  )
}




const App = () => { 
  return(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App; 