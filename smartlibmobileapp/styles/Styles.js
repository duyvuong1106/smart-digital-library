import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
        padding: 10
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    wrap: {
        flexWrap: "wrap"
    },
    marginVertical: {
        marginVertical: 8
    },
    padding: {
        padding: 4
    },
    card: {
        marginBottom: 12,
        backgroundColor: "#fff",
        elevation: 2
    },
    image: {
        width: 80,
        height: 110,
        borderRadius: 4,
        marginRight: 12
    },
    detailImage: {
        width: "100%",
        height: 260,
        resizeMode: "contain",
        backgroundColor: "#e9ecef"
    },
    bold: {
        fontWeight: "bold"
    },
    price: {
        color: "#2e7d32",
        fontWeight: "bold"
    },
    free: {
        color: "#1565c0",
        fontWeight: "bold"
    },
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    starRow: {
        flexDirection: "row",
        marginVertical: 4
    },
    reviewBox: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#dee2e6",
        backgroundColor: "#fff"
    }
});