import React, { useContext, useState } from 'react';
import { ScrollView } from 'react-native';
import { HelperText, TextInput, Button } from 'react-native-paper'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Apis, { authApis, endpoints, OAUTH2_CLIENT } from '../../configs/Apis'; 
import { MyUserContext } from '../../configs/Context';
import Styles from '../../styles/Styles'; 

const Login = ({route}) => {
    const userInfo = [
        { 
          field: 'username',
          label: 'Tên đăng nhập', 
          icon: 'account'
        },{ 
          field: 'password', 
          label: 'Mật khẩu',
          icon: 'eye', 
          secureTextEntry: true 
        }
    ];
    
    const [user, setUser] = useState({});
    const [err , setErr] = useState(null);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [, dispatch] = useContext(MyUserContext);
    const [securePassword, setSecurePassword] = useState(true);

    const next = route.params?.next;

    const validate = () => {
        if (!user.username) {
            setErr('Vui lòng nhập tên đăng nhập');
            return false;
        } else if (!user.password) {
            setErr('Vui lòng nhập mật khẩu!');
            return false;
        }
        return true;
    };

    const login = async () => {
        if (validate()) {
            try {
                setErr(null); 
                setLoading(true);

               
                const oauth2Params = new URLSearchParams();
                oauth2Params.append('username', user.username);
                oauth2Params.append('password', user.password);
                oauth2Params.append('client_id', OAUTH2_CLIENT.client_id);
                oauth2Params.append('client_secret', OAUTH2_CLIENT.client_secret);
                oauth2Params.append('grant_type', OAUTH2_CLIENT.grant_type || 'password');

             
                let res = await Apis.post(endpoints['login'], oauth2Params.toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                console.info("Đăng nhập thành công");
                
             
                await AsyncStorage.setItem('token', res.data.access_token);

              
                let u = await authApis(res.data.access_token).get(endpoints['current-user']);

          
                dispatch({
                    "type": "LOGIN",
                    "payload": u.data
                });

                
                if (route.params?.next) {
                    if (route.params?.params) {
                        nav.navigate(route.params.next, route.params.params);
                    } else {
                        nav.navigate(route.params.next);
                    }
                } else if (nav.canGoBack()) {
                    nav.goBack();
                } else {
                    nav.navigate("home"); 
                }

            } catch (ex) {
                console.error("Lỗi đăng nhập:", ex.response?.data || ex.message);
                
                if (ex.response?.data?.error_description) {
                    setErr(ex.response.data.error_description);
                } else {
                    setErr("Tên đăng nhập hoặc mật khẩu không chính xác.");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <ScrollView style={Styles.padding}>
            {err ? (
                <HelperText type="error" visible={err !== null}>
                    {err}
                </HelperText>
            ) : null}

            {userInfo.map(u => (
                <TextInput 
                    value={user[u.field] || ''} 
                    key={u.field}
                    onChangeText={(t) => setUser({ ...user, [u.field]: t })}
                    style={[Styles.margin, { marginBottom: 10 }]} 
                    label={u.label} 
                    placeholder={u.label} 
                    mode="outlined"
                    secureTextEntry={u.secureTextEntry ? securePassword : false}
                    right={
                        u.secureTextEntry ? (
                            <TextInput.Icon 
                                icon={securePassword ? "eye" : "eye-off"} 
                                onPress={() => setSecurePassword(!securePassword)} 
                            />
                        ) : (
                            <TextInput.Icon icon={u.icon} />
                        )
                    } 
                />
            ))}

            <Button 
                loading={loading} 
                disabled={loading} 
                mode="contained" 
                onPress={login}
                style={{ marginTop: 15, paddingVertical: 4 }}
            >
                Đăng nhập
            </Button>
        </ScrollView>
    );
};

export default Login;