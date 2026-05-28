import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Text, Searchbar, DataTable } from "react-native-paper";
import Apis, { endpoints } from "../../configs/Apis"; 

const CompareDocument = ({ route }) => {
   
    const currentDoc = route.params?.currentDoc;
    
    const [compareDocs, setCompareDocs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [targetId, setTargetId] = useState("");

  
    const loadCompareDocs = async (idCompare) => {
        if (!idCompare) return;

        try {
            setLoading(true);
           
            let res = await Apis.get(endpoints['document-detail'](idCompare));
            
            if (res.data) {
              
                setCompareDocs([currentDoc, res.data]);
            } else {
                Alert.alert("Thông báo", "Không tìm thấy tài liệu phù hợp với mã ID này.");
            }
        } catch (ex) {
            console.error(ex);
            Alert.alert("Thông báo", "Không thể tải thông tin chi tiết học liệu để so sánh. Vui lòng kiểm tra lại mã ID.");
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        if (currentDoc) {
            setCompareDocs([currentDoc]);
        }
    }, [currentDoc]);

   
    if (!currentDoc) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ color: "red" }}>Không tìm thấy tài liệu gốc để đối sánh!</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.mainTitle}>Đối sánh Học liệu nghiên cứu</Text>
            
            
            <Searchbar
                placeholder="Nhập mã ID sách đối sánh (Ví dụ: 2)..."
                value={targetId}
                onChangeText={setTargetId}
                keyboardType="numeric"
                onSubmitEditing={() => targetId && loadCompareDocs(targetId)} 
                style={styles.searchBar}
            />

            {loading ? (
                <ActivityIndicator color="#1A237E" size="large" style={{ marginTop: 20 }} />
            ) : (
                <DataTable style={styles.table}>
                 
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title style={{ flex: 1.2 }}>
                            <Text style={styles.headerText}>Tiêu chí</Text>
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }} numberOfLines={2}>
                           
                            <Text style={styles.headerText}>Gốc: {currentDoc?.title}</Text>
                        </DataTable.Title>
                        <DataTable.Title style={{ flex: 2 }} numberOfLines={2}>
                            <Text style={styles.headerText}>
                                {compareDocs.length > 1 ? `Đối sánh: ${compareDocs[1]?.title}` : "Chưa chọn sách"}
                            </Text>
                        </DataTable.Title>
                    </DataTable.Header>

                  
                    <DataTable.Row style={styles.row}>
                        <DataTable.Cell style={{ flex: 1.2 }}><Text style={styles.boldCell}>Năm XB</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text>{currentDoc?.publish_year || "N/A"}</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text>{compareDocs[1]?.publish_year || "—"}</Text></DataTable.Cell>
                    </DataTable.Row>

                  
                    <DataTable.Row style={styles.row}>
                        <DataTable.Cell style={{ flex: 1.2 }}><Text style={styles.boldCell}>Lượt xem</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text>{currentDoc?.views || 0} views</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text>{compareDocs[1] ? `${compareDocs[1]?.views || 0} views` : "—"}</Text></DataTable.Cell>
                    </DataTable.Row>

                    
                    <DataTable.Row style={styles.row}>
                        <DataTable.Cell style={{ flex: 1.2 }}><Text style={styles.boldCell}>Bản quyền</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text>{currentDoc?.is_free ? "Miễn phí" : "Có phí"}</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}>
                            {compareDocs[1] ? (compareDocs[1]?.is_free ? "Miễn phí" : "Có phí") : "—"}
                        </DataTable.Cell>
                    </DataTable.Row>

                   
                    <DataTable.Row style={styles.row}>
                        <DataTable.Cell style={{ flex: 1.2 }}><Text style={styles.boldCell}>Tác giả</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text numberOfLines={2}>{currentDoc?.author}</Text></DataTable.Cell>
                        <DataTable.Cell style={{ flex: 2 }}><Text numberOfLines={2}>{compareDocs[1]?.author || "—"}</Text></DataTable.Cell>
                    </DataTable.Row>
                </DataTable>
            )}
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA", padding: 14 },
    mainTitle: { fontSize: 18, fontWeight: "bold", color: "#1A237E", marginBottom: 12 },
    searchBar: { marginBottom: 16, backgroundColor: "#FFF", borderRadius: 8 },
    table: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 6, backgroundColor: "#FFF", overflow: "hidden" },
    tableHeader: { backgroundColor: "#1A237E" },
    headerText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
    row: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0", minHeight: 52 },
    boldCell: { fontWeight: "bold", color: "#2C3E50" }
});

export default CompareDocument;