import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { Text, Card, DataTable } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../configs/Apis";
import Styles from "../../styles/Styles";

const DashBoard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (token) {
                let res = await authApis(token).get(endpoints['statistics']);
                setStats(res.data);
            }
        } catch (ex) {
            console.error("Lỗi lấy dữ liệu thống kê:", ex);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading) {
        return (
            <View style={[Styles.padding, Styles.center]}>
                <ActivityIndicator size="large" color="#1A237E" />
                <Text style={{ marginTop: 10, color: '#1A237E' }}>Đang tổng hợp báo cáo...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={Styles.container}>
            <Text style={Styles.pageTitle}>Báo Cáo Toàn Diện Thư Viện</Text>
            
            <View style={Styles.overviewRow}>
                <Card style={Styles.statCard}>
                    <Card.Content style={Styles.centerCard}>
                        <Text style={Styles.statValue}>{stats?.total_documents || 0}</Text>
                        <Text style={Styles.statLabel}>Tổng học liệu</Text>
                    </Card.Content>
                </Card>
                <Card style={Styles.statCard}>
                    <Card.Content style={Styles.centerCard}>
                        <Text style={Styles.statValue}>{stats?.total_borrows || 0}</Text>
                        <Text style={Styles.statLabel}>Lượt mượn sách</Text>
                    </Card.Content>
                </Card>
                <Card style={Styles.statCard}>
                    <Card.Content style={Styles.centerCard}>
                        <Text style={[Styles.statValue, { color: '#2E7D32' }]}>
                            {stats?.total_revenue ? `${parseInt(stats.total_revenue).toLocaleString('vi-VN')}đ` : '0đ'}
                        </Text>
                        <Text style={Styles.statLabel}>Doanh thu</Text>
                    </Card.Content>
                </Card>
            </View>

            <Card style={Styles.card}>
                <Card.Content>
                    <Text style={Styles.sectionTitle}>Sách được quan tâm nhiều nhất</Text>
                    <DataTable>
                        <DataTable.Header style={Styles.tableHeader}>
                            <DataTable.Title style={{ flex: 2 }}><Text style={Styles.headerText}>Tên tài liệu</Text></DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 1 }}><Text style={Styles.headerText}>Lượt xem</Text></DataTable.Title>
                            <DataTable.Title numeric style={{ flex: 1 }}><Text style={Styles.headerText}>Lượt mượn</Text></DataTable.Title>
                        </DataTable.Header>
                        {stats?.top_documents?.map((doc) => (
                            <DataTable.Row key={doc.id} style={Styles.tableRow}>
                                <DataTable.Cell style={{ flex: 2 }}><Text numberOfLines={1}>{doc.title}</Text></DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 1 }}><Text>{doc.views}</Text></DataTable.Cell>
                                <DataTable.Cell numeric style={{ flex: 1 }}>
                                    <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>{doc.borrow_count}</Text>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

export default DashBoard;