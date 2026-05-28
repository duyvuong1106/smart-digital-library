import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Apis, { endpoints } from "../configs/Apis";
import { Chip } from "react-native-paper";
import Styles from "../styles/Styles";

const Header = ({cateId, setCateId}) => {
    const [categories, setCategories] = useState([]);

    const loadCategories = async () => {
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
        } catch (ex) {
            console.error(ex);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return (
        <View style={[Styles.row, Styles.wrap]}>
            <TouchableOpacity onPress={() => setCateId(null)} style={Styles.tagMargin}>
                <Chip mode={cateId === null ? "contained" : "flat"} icon="label">Tất cả</Chip>
            </TouchableOpacity>

            {categories.map(c => (
                <TouchableOpacity onPress={() => setCateId(c.id)} style={Styles.tagMargin} key={`c${c.id}`}>
                    <Chip mode={cateId === c.id ? "contained" : "flat"} icon="label">{c.name}</Chip>
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default Header;