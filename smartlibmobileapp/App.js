import { View } from "react-native";
import Header from "./components/Header";
import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "react-native-paper";
import Register from "./screens/User/Register";
import { NavigationContainer } from "@react-navigation/native";
import Home from "./screens/Home/Home";
import Documents from "./screens/Document/Documents";
import DocumentDetails from "./screens/Document/DocumentDetails";
import Login from "./screens/User/Login";
import { MyUserReducer } from "./reducers/Reducers";




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
  const [user, ] = useContext(MyUSerContext);

  return(
    <Tab.Navigator>
      <Tab.Screen name="home" component={StackNavigator} options={{title: 'Màn hình chính', tabBarIcon:() => <Icon source="home" size={20} />}} />
      <Tab.Screen name="register" component={Register} options={{title: 'Đăng ký', tabBarIcon:() => <Icon source="account-plus" size={20} />}} />
      <Tab.Screen name="login" component={Login} options={{title: 'Màn hình chính', tabBarIcon:() => <Icon source="login" size={20} />}} />

    </Tab.Navigator>
  )
}




const App = () => { 

  const [user, dispatch] = useReducer(MyUserReducer, null);
  return(
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default App; 