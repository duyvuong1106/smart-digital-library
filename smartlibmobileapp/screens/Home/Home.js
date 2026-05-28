import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, View, FlatList } from "react-native";
import Header from "../../components/Header";
import { Searchbar } from "react-native-paper";
import MyItem from "../../components/MyItem";
import Styles from "../../styles/Styles";
import { MyUserContext } from "../../configs/Context";

const Home = () => { 
    const [cateId, setCateId] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1); 
    const [, dispatch] = useContext(MyUserContext);
    const nav = useNavigation(); 

    const loadDocuments = async () => { 
        try {
            setLoading(true);
            let url = `${endpoints['documents']}?page=${page}`;
            if(q) url = `${url}&search=${q}`;
            if(cateId) url = `${url}&category_id=${cateId}`;

            let res = await Apis.get(url);
            if (page === 1) {
                setDocuments(res.data.results);
            } else {
                setDocuments([...documents, ...res.data.results]);
            }
            if(res.data.next === null) setPage(0); 
        } catch (ex) {
            console.error(ex);
        } finally { 
            setTimeout(() => setLoading(false), 1000); 
        }
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            if(page > 0) loadDocuments();
        }, 500);
        return () => clearTimeout(timer);
    }, [cateId, q, page]);

    useEffect(() => {
        setPage(1);
    }, [q, cateId]);

    const loadMore = () => { 
        if(page > 0 && !loading) setPage(page + 1);
    }

    return(
        <View style={Styles.padding}> 
            <Header cateId={cateId} setCateId={setCateId} /> 
            <Searchbar value={q} onChangeText={setQ} placeholder="Tìm tài liệu" style={Styles.searchBar} /> 
            <FlatList 
                onEndReached={loadMore}
                data={documents} 
                ListFooterComponent={loading && <ActivityIndicator />}
                renderItem={({item}) => (
                    <MyItem key={item.id} item={item} next={() => nav.navigate('document-details', {docId: item.id})} />
                )}
            />
        </View>
    ); 
}

export default Home;