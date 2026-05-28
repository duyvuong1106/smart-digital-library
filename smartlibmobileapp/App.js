import React, { useReducer } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"; 
import { Icon } from "react-native-paper";

// Import các Màn hình theo đúng cấu trúc thư mục của bạn
import Home from "./screens/Home/Home";
import Documents from "./screens/Document/Documents";
import DocumentDetails from "./screens/Document/DocumentDetails";
import PaymentGateway from "./screens/Payment/PaymentGateway";
import Login from "./screens/User/Login";
import Register from "./screens/User/Register";
import Profile from "./screens/User/Profile";
import DashBoard from "./screens/Stats/DashBoard";
import CompareDocument from "./screens/Document/CompareDocument";

// Import Quản lý trạng thái toàn cục & Styles dùng chung
import { MyUserContext } from "./configs/Context";
import { MyUserReducer } from "./reducers/Reducers";
import Styles from "./styles/Styles"; // Tái sử dụng bảng màu và cấu trúc hệ thống

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Cấu trúc Stack điều hướng nội dung chi tiết
const StackNavigator = () => { 
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerTintColor: "#1A237E", // Màu chủ đạo từ Styles dùng chung
        headerTitleAlign: 'center',
        headerStyle: { backgroundColor: '#F8F9FA' }
      }}
    >
      <Stack.Screen name="index" component={Home} options={{ title: 'Khóa học', headerShown: false }} />
      <Stack.Screen name="documents" component={Documents} options={{ title: 'Học liệu' }} />
      <Stack.Screen name="document-details" component={DocumentDetails} options={{ title: 'Chi tiết học liệu' }} />
      <Stack.Screen name="payment" component={PaymentGateway} options={{ title: 'Thanh toán' }} />
      
      {/* ĐĂNG KÝ MÀN HÌNH ĐỐI SÁNH DÙNG CHUNG STYLES */}
      <Stack.Screen name="compare" component={CompareDocument} options={{ title: 'Đối sánh Học liệu' }} />
    </Stack.Navigator>
  );
};

// Cấu trúc Menu Tab chính ở đáy ứng dụng
const TabNavigator = () => {
  const [user] = React.useContext(MyUserContext);

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerTintColor: "#1A237E", 
        headerTitleAlign: 'center',
        tabBarActiveTintColor: "#1A237E",
        tabBarInactiveTintColor: "#7F8C8D"
      }}
    >
      <Tab.Screen 
        name="home" 
        component={StackNavigator} 
        options={{ 
          title: 'Trang chủ', 
          headerShown: false,
          tabBarIcon: ({color}) => <Icon source="home" size={22} color={color} /> 
        }} 
      />

      {user === null ? (
        <>
          <Tab.Screen 
            name="login" 
            component={Login} 
            options={{ 
              title: 'Đăng nhập', 
              tabBarIcon: ({color}) => <Icon source="login" size={22} color={color} /> 
            }} 
          />
          <Tab.Screen 
            name="register" 
            component={Register} 
            options={{ 
              title: 'Đăng ký', 
              tabBarIcon: ({color}) => <Icon source="account-plus" size={22} color={color} /> 
            }} 
          />
        </>
      ) : (
        <>
          <Tab.Screen 
            name="profile" 
            component={Profile} 
            options={{ 
              title: 'Tài khoản', 
              tabBarIcon: ({color}) => <Icon source="account-circle" size={22} color={color} /> 
            }} 
          />

          {(user.is_superuser || user.is_staff || user.role === "LIBRARIAN") && (
            <Tab.Screen 
              name="dashboard" 
              component={DashBoard} 
              options={{ 
                title: 'Thống kê', 
                tabBarIcon: ({color}) => <Icon source="chart-bar" size={22} color={color} /> 
              }} 
            />
          )}
        </>
      )}
    </Tab.Navigator>
  );
};

const App = () => { 
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </MyUserContext.Provider>
  );
};

export default App;