import AsyncStorage from '@react-native-async-storage/async-storage';
import Apis, { authApis } from '../../configs/Apis';
import { View } from 'react-native';
import { HelperText } from 'react-native-paper';

const Login = () => {
    const userInfo = [{
        field: 'username',
        title: 'Tên đăng nhập',
        icon: 'account',
    }, {
        field: 'password',
        title: 'Mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }];
    
    const [user, setUser] = useState({});
    const [err , setErr] = useState(null);
    const nav = useNavigation();
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if(!user.username){
            setErr('Vui lòng điền tên đăng nhập');
        }else if (!user.password){
            setErr('Vui lòng điền mật khẩu');
        }else return true;
    }

    const login = async () => {
        if(!validate()){ 

            try {
                setLoading(true);

                let res = await Apis.post(endpoints['login'], { 
                    ...user, 
                    'client_id': '9q2ApGFsFHBaGucEFVUT5PU61WvCKzbIcwDBe92I', 
                    'client_secret': 'p8BDS8cumv5lMN2n2gAUTz7nXqWipJgCdoleOwdP6C9xDja7WlI7CXlMO0PZqKHjFRmYIR1muTJAlA1YiGntiKPM9pWaeQhLCWk13JZaJ7sxW8nEPdYPSYX1GbPn1hZY',
                    'grant_type': 'password'
                })

                await AsyncStorage.setItem('token', res.data.access_token); 

                setTimeout(async () => {
                    let user = await authApis(res.data.access_token).get(endpoints['current-user']);  
                    console.info(user.data);  
                }, 500);
            } catch (ex) {
                console.error(ex);
            }finally{ 
                setLoading(false);
            }
        }
    }

    return(
        <View>
            <HelperText style={Styles.margin} type="error" visible={!!err}>
                {err}
            </HelperText>

            {userInfo.map(u => <TextInput value={user[u.field]} key={u.field}
                                        onChangeText={(t) => setUser({...user, [u.field]: t})} 
                                        style={Styles.margin} label={u.title} placeholder={u.title} 
                                        secureTextEntry={u.secureTextEntry}
                                        right={<TextInput.Icon icon={u.icon} />} />)}

            
            <Button loading={loading} disabled={loading} mode="contained" onPress={login}>Đăng nhập</Button>


        </View>
    ); 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            

}

export default Login;