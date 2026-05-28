import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, ScrollView, StyleSheet } from "react-native"; 
import { TextInput, Button } from "react-native-paper"; 
import * as ImagePicker from 'expo-image-picker';
import Apis, { endpoints } from "../../configs/Apis";
import Styles from "../../styles/Styles";
import { useNavigation } from "@react-navigation/native"


const Register = () => {
    const userInfo = [
        { field: 'first_name', label: 'Tên', icon: 'text' }, 
        { field: 'last_name', label: 'Họ và tên lót', icon: 'text' }, 
        { field: 'username', label: 'Tên đăng nhập', icon: 'account' }, 
        { field: 'password', label: 'Mật khẩu', icon: 'eye', secureTextEntry: true }, 
        { field: 'confirm', label: 'Xác nhận mật khẩu', icon: 'eye', secureTextEntry: true }
    ];

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [securePassword, setSecurePassword] = useState(true);
    const nav = useNavigation();

    const picker = async () => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return;
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) setUser({ ...user, 'avatar': result.assets[0] });
    };

    const validate = () => {
        if (!user.username)
            setErr('Vui lòng nhập tên đăng nhập');
        else if (!user.password || !user.confirm || user.password !== user.confirm)
            setErr('Mật khẩu KHÔNG không khớp!');
        else
            return true;
    }

    const register = async () => {
        if (validate()) {
            let form = new FormData();

            try {
                setLoading(true);

                for (var key of Object.keys(user)) {
                    if (key !== 'confirm') {
                        if (key === 'avatar') {
                            form.append(key, {
                                uri: user.avatar.uri,
                                name: user.avatar.fileName,
                                type: "image/jpeg" // user.avatar.type // 
                            });
                        } else {
                            form.append(key, user[key]);
                        }
                    }
                }

                let res = await Apis.post(endpoints['register'], form, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.status === 201)
                    nav.navigate('login');
                else
                    alert("Hệ thống đang có lỗi!");
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <ScrollView style={Styles.padding}>
            {userInfo.map(i => (
                <TextInput 
                    key={i.field} 
                    style={Styles.margin} 
                    value={user[i.field] || ''} 
                    onChangeText={t => setUser({ ...user, [i.field]: t })}
                    label={i.label}
                    secureTextEntry={i.secureTextEntry}
                    mode="outlined"
                    right={<TextInput.Icon icon={i.icon} />} 
                />
            ))}

            <TouchableOpacity onPress={picker} style={Styles.uploadBtn}>
                <Text style={{ color: '#1A237E', fontWeight: 'bold' }}>Chọn ảnh đại diện...</Text>
            </TouchableOpacity>

            {user.avatar && (
                <View style={{ alignItems: 'center' }}>
                    <Image source={{ uri: user.avatar.uri }} style={Styles.previewAvatar} />
                </View>
            )}

            <Button loading={loading} onPress={register} disabled={loading} style={[Styles.btn, { marginTop: 15 }]} mode="contained">
                Đăng ký
            </Button>
        </ScrollView>
    ); 
}

export default Register;