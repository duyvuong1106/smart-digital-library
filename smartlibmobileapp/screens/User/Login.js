import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { authApis, OAUTH2_CLIENT } from '../../configs/Apis';
import { ScrollView, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';
import { MyUSerContext } from '../../configs/Context';
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const Login = ({route}) => {
    const userInfo = [{
        field: 'username',
        label: 'Tên đăng nhập',
        icon: 'account',
    }, {
        field: 'password',
        label: 'Mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }];
    
    const [user, setUser] = useState({});
    const [err , setErr] = useState(null);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);
    const [, dispatch] = useContext(MyUSerContext);
    // const next = route.params?.next || 'home';


    const validate = () => {
        for (var i of userInfo)
            if (!(i.field in user) || !user[i.field]) {
                setErr(`Vui lòng nhập ${i.label}!`);
                return false;
            } 

        return true; 
    }

    const login = async () => {
        if(validate() === true){ 

            try {
                setLoading(true);

                let res = await Apis.post(endpoints['login'], { 
                    ...user, 
                    'client_id': OAUTH2_CLIENT.client_id, 
                    'client_secret': OAUTH2_CLIENT.client_secret,
                    'grant_type': 'password'
                })

                console.info(res.data);
                const token = res.data.access_token;
                await AsyncStorage.setItem('token', token); 

                let u = await authApis.get(res.data.access_token).get(endpoints['current-user']);
                console.info(u.data);
                dispatch({
                    "type": "LOGIN",
                    "payload": u.data
                });

                nav.navigate('home');
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        
        }
    }

    return(
        <ScrollView style={Styles?.padding || { padding: 10 }}>
            {err && <HelperText type="error" visible={err !== null}>{err}</HelperText>}
            
            {userInfo.map(i => (
                <TextInput 
                    key={i.field} 
                    style={Styles?.margin || { marginBottom: 10 }} 
                    value={user[i.field]} 
                    onChangeText={t => setUser({ ...user, [i.field]: t })}
                    label={i.label} 
                    mode="outlined"
                    secureTextEntry={i.secureTextEntry ? securePassword : false}
                    right={
                        i.secureTextEntry ? (
                            <TextInput.Icon 
                                icon={securePassword ? "eye" : "eye-off"} 
                                onPress={() => setSecurePassword(!securePassword)} 
                            />
                        ) : (
                            <TextInput.Icon icon={i.icon} />
                        )
                    } 
                />
            ))}

            <Button 
                loading={loading} 
                disabled={loading} 
                onPress={login} 
                style={Styles?.margin || { marginTop: 10 }} 
                mode="contained"
            >
                Đăng nhập
            </Button>
        </ScrollView>
    ); 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

}

export default Login;