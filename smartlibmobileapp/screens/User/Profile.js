import React, { useContext, useState, useEffect } from "react"; 
import { Text, View, ScrollView, ActivityIndicator } from "react-native"; 
import Styles from "../../styles/Styles";
import { MyUserContext } from "../../configs/Context"; 
import { Avatar, Card, Divider, List } from "react-native-paper"; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { authApis, endpoints } from "../../configs/Apis"; 

const Profile = () => { 
    const [user] = useContext(MyUserContext);   
    const [history, setHistory] = useState([]);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadProfileData = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const historyRes = await authApis(token).get(`${endpoints['payments']}history/`);
                setHistory(historyRes.data || []);

                const docsRes = await authApis(token).get(endpoints['documents']);
                const allDocs = docsRes.data.results || docsRes.data || [];
                const myDocs = allDocs.filter(doc => doc.uploaded_by === user.id || doc.author === user.username);
                setUploadedDocs(myDocs);
            }
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfileData();
    }, [user]);

    if (loading) return <View style={Styles.center}><ActivityIndicator size="large" color="#1A237E" /></View>;

    return (
        <ScrollView style={Styles.container}>
            {user && (
                <View style={{ paddingBottom: 20 }}>
                    <View style={Styles.centerCard}>
                        <Avatar.Image source={user.avatar ? { uri: user.avatar } : null} style={Styles.avatar} size={90} />
                        <Text style={Styles.welcomeText}>Xin chào, {user.first_name} {user.last_name}!</Text>
                        <Text style={Styles.usernameText}>@{user.username}</Text>
                    </View>
                    <Divider style={Styles.divider} />

                    <Text style={Styles.sectionTitle}>Lịch sử thanh toán</Text>
                    <Card style={Styles.card}>
                        {history.length > 0 ? (
                            history.map((item) => (
                                <List.Item
                                    key={item.id}
                                    title={item.document_title || `Học liệu #${item.document}`}
                                    description={`Ngày mua: ${new Date(item.created_date).toLocaleDateString('vi-VN')}`}
                                    right={() => <Text style={Styles.amountText}>-{parseInt(item.amount).toLocaleString('vi-VN')} đ</Text>}
                                />
                            ))
                        ) : null}
                    </Card>

                    <Text style={Styles.sectionTitle}>Tài liệu bạn đã đóng góp</Text>
                    <Card style={Styles.card}>
                        {uploadedDocs.length > 0 ? (
                            uploadedDocs.map((doc) => (
                                <List.Item
                                    key={doc.id}
                                    title={doc.title}
                                    description={`Tác giả: ${doc.author} • Lượt xem: ${doc.views}`}
                                    right={() => (
                                        <Text style={[Styles.amountText, { color: doc.is_free ? 'green' : '#E65100' }]}>
                                            {doc.is_free ? "Miễn phí" : "Có phí"}
                                        </Text>
                                    )}
                                />
                            ))
                        ) : null}
                    </Card>
                </View>
            )}
        </ScrollView>
    );
};

export default Profile;