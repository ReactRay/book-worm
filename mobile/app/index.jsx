import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";



export default function Index() {
  return (
    <View style={styles.container}

    >
      <Text style={styles.title} >test</Text>
      <Image
        source={{ uri: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" }}
        style={{ width: '100%', height: '100%' }}

      />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: 'red' }
})
