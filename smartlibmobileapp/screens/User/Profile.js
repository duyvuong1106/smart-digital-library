import { Text, View } from "react-native"
import Styles from "../../styles/Styles"
import { useContext } from "react";

const Profile = () => { 
    const user = useContext(UserContext);   


    return (
        <View style={Styles.padding}> 
            <Text style={Styles.subject}>THÔNG TIN NGƯỜI DÙNG</Text> 
        </View>
    );
}

export default Profile; 