import { Image, TouchableOpacity, View } from "react-native";
import { Chip, List } from "react-native-paper";
import Styles from "../styles/Styles";

const MyItem = ({item, next}) => {
    const leftComponent = () => { 
        return(
            <TouchableOpacity onPress={next}>
                <Image style={Styles.avatar} source={{uri: item.image}} /> 
            </TouchableOpacity>
        );
    }

    const rightComponent = () => {
        if (item.is_free) {
            return (
                <View style={{ justifyContent: 'center' }}>
                    <Chip mode="flat" selectedColor="green" style={{ backgroundColor: '#E8F5E9' }}>
                        Miễn phí
                    </Chip>
                </View>
            );
        }

        const formatPrice = parseInt(item.price || 0).toLocaleString('vi-VN'); 
        return ( 
            <View style={{ justifyContent: 'center' }}>
                <Chip mode="flat" selectedColor="red" style={{ backgroundColor: '#FFEBEE' }}>
                    {formatPrice} VND
                </Chip>
            </View>
        )
    }


    return ( 
        <List.Item 
            title={item.title}
            description={item.author}
            left={leftComponent}
            right={rightComponent}
            onPress={next}
        
        />
    )
}

export default MyItem;