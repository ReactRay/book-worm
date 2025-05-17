import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";



export default function Index() {
  return (
    <View style={styles.container}

    >
      <Text style={styles.title} >test</Text>
      <Image
        source={{ require: './assets/images/icon.png' }}
        style={{ width: 200, height: 200 }}

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
