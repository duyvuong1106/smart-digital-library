import { StyleSheet } from "react-native";

export default StyleSheet.create({

    row: { flexDirection: "row", alignItems: "center" },
    wrap: { flexWrap: "wrap" }, 
    tagMargin: { margin: 4 },
   
    container: { flex: 1, backgroundColor: "#F8F9FA", padding: 12 },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    padding: { padding: 14, flex: 1, backgroundColor: "#F8F9FA" },
    margin: { marginBottom: 14 },
    row: { flexDirection: "row", alignItems: "center" },
    divider: { marginVertical: 14 },


    mainTitle: { fontSize: 18, fontWeight: "bold", color: "#1A237E", marginBottom: 12 },
    pageTitle: { fontSize: 22, fontWeight: "bold", color: "#1A237E", textAlign: "center", marginVertical: 16 },
    sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#2C3E50", marginBottom: 12 },
    welcomeText: { fontSize: 18, fontWeight: "bold", color: "#1A237E", marginTop: 10 },
    usernameText: { color: '#7F8C8D', fontSize: 14 },
    emptyText: { textAlign: 'center', color: '#7F8C8D', marginTop: 15, fontStyle: 'italic' },
    secureText: { textAlign: "center", color: "#7F8C8D", fontSize: 12, marginTop: 12, fontStyle: "italic" },

   
    uploadBtn: { padding: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#1A237E', borderRadius: 6, alignItems: 'center', marginVertical: 10 },
    btn: { marginTop: 10, borderColor: "#1A237E" },
    searchBar: { marginBottom: 12, backgroundColor: "#FFF", borderRadius: 8, elevation: 2 },

   
    card: { backgroundColor: "#FFF", borderRadius: 8, overflow: "hidden", marginBottom: 16, elevation: 1 },
    cover: { height: 260, resizeMode: "contain", backgroundColor: "#EAEAEA" },
    docImage: { width: 60, height: 80, borderRadius: 4, marginRight: 12 },
    previewAvatar: { width: 100, height: 100, borderRadius: 50, marginTop: 10 },
    avatar: { width: 100, height: 100, borderRadius: 50 },

    
    overviewRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    statCard: { flex: 1, marginHorizontal: 4, elevation: 2, borderRadius: 8 },
    centerCard: { alignItems: "center", paddingVertical: 10, paddingHorizontal: 4 },
    statValue: { fontSize: 20, fontWeight: "bold", color: "#1A237E", marginBottom: 4 },
    statLabel: { fontSize: 12, color: "#555", textAlign: "center" },

    
    table: { borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 6, backgroundColor: "#FFF", overflow: "hidden", marginTop: 8 },
    tableHeader: { backgroundColor: "#1A237E" },
    headerText: { color: "#FFF", fontWeight: "bold", fontSize: 13 },
    tableRow: { borderBottomWidth: 1, borderBottomColor: "#F0F0F0", minHeight: 52 },
    boldCell: { fontWeight: "bold", color: "#2C3E50" },
    amountText: { alignSelf: 'center', fontWeight: 'bold', color: '#C62828', marginRight: 10, fontSize: 15 },
    dropdownContainer: { backgroundColor: "#FFF", borderRadius: 8, borderWidth: 1, borderColor: "#E0E0E0", marginBottom: 16, maxHeight: 250, zIndex: 99, elevation: 3 },
    dropdownItem: { paddingHorizontal: 4 },
    emptySearchText: { padding: 16, textAlign: "center", color: "#7F8C8D", fontStyle: "italic" },

    
    freeChip: { backgroundColor: "#E8F5E9" },
    payChip: { backgroundColor: "#FFEBEE" }
});