import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import Apis, { endpoints } from "../../configs/Apis";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { HelperText, TextInput } from "react-native-paper";
import Styles from "../../styles/Styles";
import * as ImagePicker from 'expo-image-picker';



const Register = () => {
    const userInfo = [{
        field: 'first_name',
        title: 'Tên',
        icon: 'text',
    }, {
        field: 'last_name',
        title: 'Họ và tên lót',
        icon: 'text',
    }, {
        field: 'username',
        title: 'Tên đăng nhập',
        icon: 'account',
    }, {
        field: 'password',
        title: 'Mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }, {
        field: 'confirm',
        title: 'Xác nhận mật khẩu',
        icon: 'eye',
        secureTextEntry: true
    }];


    const [user, setUser] = useState({});
    const [err , setErr] = useState(null);
    const nav = useNavigation(); 
    const [loading, setLoading] = useState(false);


    const picker = async () => { 
        let {status} = await ImagePicker.requestMediaLibraryPermissionsAsync(); 

        if(status !== 'granted'){
            alert("Permission denied");
        }else{
            const result = await ImagePicker.launchImageLibraryAsync(); 
            if(!result.canceled){ 
                setUser({...user, 'avatar': result.assets[0] })
            }
        }

    }


    const validate = () => {
        if(!user.username){ 
            setErr('Vui lòng điền tên đăng nhập');
        }else if (!user.password || !user.confirm || user.password !== user.confirm){ 
            setErr('Mật khẩu không khớp');
        }else return true;
    }

    const register = async () => { 
        if(validate()===true){ 
            let form = new FormData(); 

            try {
                setLoading(true); 
                setErr(null);

                for(var key in Object.keys(user)){ 
                    if(key !== 'confirm'){ 
                        form.append(key, { 
                            uri: user.avatar.uri, 
                            name: user.avatar.fileName,
                            type: "image/jpeg"  //user.avatar.type//
                        }); 
                    }
                }

                let res = await Apis.post(endpoints['regisrter'], form, { 
                    headers: { 
                        'Content-Type': 'multipart/form-data'
                    }
                })


                if (res.status === 201){ 
                    nav.navigate('login');
                }else alert('Đăng ký thất bại');


            } catch (ex) {
                console.error(ex);
            }finally {
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
                                            right={<TextInput.Icon icon={u.icon} />}/>)}


            <TouchableOpacity onPress={picker}> 
                <Text style={Styles.margin}>Chọn ảnh đại diện...</Text>
            </TouchableOpacity>

            {user.avatar && <Image source={{uri: user.avatar.uri}} style={[Styles.avatar, Styles.margin]} />}

            <Button loading={loading} disabled={loading} mode="contained" onPress={register}>Đăng ký</Button>
        </View>
    ); 
}

export default Register;