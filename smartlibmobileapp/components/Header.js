import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Chip, List } from "react-native-paper";
import Styles from "../styles/Styles";
import Apis, { endpoints } from "../configs/Apis";


const Header = ({cateId, setCateId}) => { 
    const [categories, setCategories] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const loadCategories = async () => { 
        try {
            let res = await Apis.get(endpoints['categories']);
            setCategories(res.data);
            console.log(res.data);
        } catch (ex) {
            console.error(ex); 
        }
    }

    useEffect(() => {
        loadCategories();
    },[])

    return (
        <View style={[Styles.row, Styles.wrap, Styles.margin]}>
                <List.Accordion
                    title="Danh mục"
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}
                    left={props => <List.Icon {...props} icon="format-list-bulleted" />}
                >
                    <List.Item title="Tất cả" 
                               onPress={() => setCateId(null)}
                               left={props => <List.Icon {...props} icon="label" />}
                               right={props => cateId === null ? <List.Icon {...props} icon="check" /> : null
                    } />

                     {categories?.map(c => (
                    <List.Item
                        key={c.id}
                        title={c.name}
                        onPress={() => setCateId(c.id)}
                        left={props => <List.Icon {...props} icon="label" />}
                        right={props =>
                            cateId === c.id ? <List.Icon {...props} icon="check" /> : null
                        }
                    />
                ))}


                </List.Accordion>
        </View>
    ); 
}

export default Header;