import React, { useState } from "react";
import { View, ScrollView, Alert, Image, StyleSheet, Linking } from "react-native";
import { Text, Button, Card, RadioButton, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import Styles from "../../styles/Styles";

const PaymentGateway = ({ route }) => {
    const document = route.params?.document; 
    const nav = useNavigation();
    const [method, setMethod] = useState("STRIPE"); 
    const [loading, setLoading] = useState(false);

    if (!document) {
        return (
            <View style={[Styles.padding, Styles.center]}>
                <Text style={{ color: 'red' }}>Lỗi: Không tìm thấy thông tin tài liệu cần thanh toán.</Text>
            </View>
        );
    }

   
   const processPayment = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert("Lỗi", "Vui lòng đăng nhập lại để thanh toán!");
                return;
            }

            console.info("Đang gửi yêu cầu thanh toán với phương thức:", method);
            let res = await authApis(token).post(endpoints['payments'], {
                id: document.id,
                amount: document.price,
                method: method
            });

            console.info("Dữ liệu phản hồi thực tế từ Django:", res.data);

            if (method === 'STRIPE') {
                
                const checkoutUrl = res.data?.payment_url; 

                if (checkoutUrl) {
                    
                    const supported = await Linking.canOpenURL(checkoutUrl);
                    if (supported) {
                        await Linking.openURL(checkoutUrl);
                    } else {
                        Alert.alert("Lỗi", "Không thể khởi chạy liên kết thanh toán này.");
                    }
                } else {
                    Alert.alert("Thanh toán thất bại", "Backend không trả về đường dẫn link thanh toán Stripe.");
                }
            } 
            else if (method === 'CASH') {
                Alert.alert(
                    "Đăng ký thành công", 
                    res.data?.msg || "Vui lòng đến thư viện để thanh toán tiền mặt trực tiếp và kích hoạt tài liệu.",
                    [{ text: "Đồng ý", onPress: () => nav.navigate("profile") }]
                );
            }
        } catch (ex) {
            console.error("Chi tiết lỗi thanh toán:", ex.response?.data || ex.message);
            Alert.alert("Thanh toán thất bại", "Hệ thống gặp sự cố kết nối với cổng thanh toán, vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <ScrollView style={Styles.container}>
            <Text style={Styles.pageTitle}>Cổng Thanh Toán Học Liệu</Text>
            
         
            <Card style={Styles.card}>
                <Card.Content>
                    <Text style={Styles.sectionTitle}>Thông tin đơn hàng</Text>
                    <View style={Styles.row}>
                        <Image 
                            source={document.image ? { uri: document.image } : null} 
                            style={[Styles.docImage, { width: 70, height: 90, borderRadius: 6, marginRight: 12 }]} 
                        />
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1A237E" }}>{document.title}</Text>
                            <Text style={{ color: "#7F8C8D", marginVertical: 4 }}>Tác giả: {document.author}</Text>
                            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#C62828" }}>
                                {parseInt(document.price).toLocaleString('vi-VN')} đ
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

        
            <Card style={Styles.card}>
                <Card.Content>
                    <Text style={Styles.sectionTitle}>Phương thức thanh toán</Text>
                    <RadioButton.Group onValueChange={value => setMethod(value)} value={method}>
                        
                        
                        <View style={[Styles.row, styles.radioRow]}>
                            <Text style={styles.radioLabel}>Thanh toán qua thẻ quốc tế (Stripe)</Text>
                            <RadioButton value="STRIPE" color="#1A237E" />
                        </View>
                        
                        <Divider style={Styles.divider} />
                        
                     
                        <View style={[Styles.row, styles.radioRow]}>
                            <Text style={styles.radioLabel}>Thanh toán tiền mặt trực tiếp tại thư viện</Text>
                            <RadioButton value="CASH" color="#1A237E" />
                        </View>

                    </RadioButton.Group>
                </Card.Content>
            </Card>

            <Button 
                mode="contained" 
                loading={loading} 
                disabled={loading} 
                style={[Styles.btn, { paddingVertical: 4, marginTop: 10 }]}
                onPress={processPayment}
            >
                {method === 'STRIPE' 
                    ? `THANH TOÁN STRIPE (${parseInt(document.price).toLocaleString('vi-VN')} đ)` 
                    : "XÁC NHẬN ĐĂNG KÝ MƯỢN"}
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    radioRow: { 
        flexDirection: 'row', 
        justifyContent: "space-between", 
        alignItems: "center", 
        paddingVertical: 8 
    },
    radioLabel: { 
        fontSize: 15, 
        color: '#2C3E50',
        flex: 1 
    }
});

export default PaymentGateway;