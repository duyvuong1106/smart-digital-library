import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import Styles from "../../styles/Styles";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../configs/Apis";
import MyItem from "../../components/MyItem";

const Documents = ({route}) => {
    const docId = route.params?.docId ;
    const [documents, setDocuments] = useState([]);
    const nav = useNavigation();

    const loadDocuments = async () => { 
        let res = await Apis.get(endpoints['documents']);
        setDocuments(res.data.results);
    }

    useEffect(() => {
        loadDocuments();
    }, [docId]); 

    return(
        <View style={Styles.padding}> 
            <FlatList 
                data={documents} 
                renderItem={({item}) => (
                    <MyItem 
                        key={item.id} 
                        item={item} 
                        next={() => nav.navigate('document-details', {docId: item.id})}
                    />
                )}
            />
        </View>
    ); 
}

export default Documents;