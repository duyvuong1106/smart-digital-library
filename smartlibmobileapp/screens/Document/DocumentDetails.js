import React, { useEffect, useState, useContext } from "react";
import { View, Text, ActivityIndicator, ScrollView, Alert } from "react-native";
import { Button, Card, Chip, Divider, Paragraph, Title } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import Styles from "../../styles/Styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyUserContext } from "../../configs/Context"; // Import context để check trạng thái đăng nhập

const DocumentDetails = ({ route, navigation }) => {
    const docId = route.params?.docId;
    const [document, setDocument] = useState(null);   
    const [loading, setLoading] = useState(false);
    const [user] = useContext(MyUserContext); // Lấy thông tin user hiện tại từ hệ thống

    const loadDetails = async () => {
        if (!docId) {
            Alert.alert("Lỗi", "Không tìm thấy thông tin tài liệu cần hiển thị.");
            navigation.goBack();
            return;
        }

        try { 
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            let res;
            
            
            if (token) {
               res = await authApis(token).get(endpoints['document-detail'](docId));
            } else { 
               res = await Apis.get(endpoints['document-detail'](docId));
            }

            const docData = res.data;

            if (docData && !docData.is_free && !user) {
                Alert.alert(
                    "Yêu cầu đăng nhập", 
                    "Tài liệu này yêu cầu trả phí. Vui lòng đăng nhập tài khoản để xem nội dung.",
                    [{ text: "Đăng nhập", onPress: () => navigation.navigate("login") }]
                );
                navigation.goBack(); 
                return;
            }

            setDocument(docData);
        } catch (ex) {
            console.error("Lỗi tải chi tiết sách:", ex);
            Alert.alert("Thông báo", "Không thể tải thông tin tài liệu lúc này.");
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadDetails();
    }, [docId, user]); 

    if (loading) return <View style={Styles.center}><ActivityIndicator size="large" color="#1A237E" /></View>;
    if (!document) return <View style={Styles.center}><Text>Không có dữ liệu tài liệu.</Text></View>;

    return (
        <ScrollView style={Styles.container}>
            <Card style={Styles.card}>
                <Card.Cover source={document.image ? { uri: document.image } : null} style={Styles.cover} />
                <Card.Content style={{ padding: 16 }}>
                    {/* Đã sửa dùng Title đảm bảo hiển thị đúng font UI */}
                    <Title style={Styles.mainTitle}>{document.title}</Title>
                    <Text style={{ fontSize: 16, fontStyle: "italic", color: "#555", marginBottom: 8 }}>
                        Tác giả: {document.author}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#7F8C8D" }}>
                        Lượt xem: {document.views} | Năm: {document.publish_year}
                    </Text>
                    
                    <View style={{ flexDirection: "row", marginTop: 8 }}>
                        <Chip style={document.is_free ? Styles.freeChip : Styles.payChip}>
                            {document.is_free ? "Miễn phí" : `${parseInt(document.price).toLocaleString('vi-VN')} đ`}
                        </Chip>
                    </View>

                    <Divider style={Styles.divider} />
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: "#1A237E", marginBottom: 6 }}>
                        Tóm tắt nội dung
                    </Text>
                    <Paragraph>{document.description || "Chưa có mô tả cho tài liệu này."}</Paragraph>
                </Card.Content>
                <Card.Actions>
                    
                    {!document.is_free && (
                        <Button mode="contained" onPress={() => navigation.navigate("payment", { document })} style={Styles.btn}>
                            Mua tài liệu
                        </Button>
                    )}
                    <Button 
                        mode="outlined" 
                        icon="compare" 
                        textColor="#1A237E"
                        style={Styles.btn}
                        onPress={() => navigation.navigate("compare", { currentDoc: document })}
                    >
                        So sánh
                    </Button>
                </Card.Actions>
            </Card>
        </ScrollView>
    );
};

export default DocumentDetails;