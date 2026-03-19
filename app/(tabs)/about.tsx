import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e"
  },
  text: {
    color: "#fff",
  }
});

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aqui apresentamos as informações da nossa página.</Text>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
      }}>
        <Tabs.Screen name="about" options={{
          headerTitle: "Sobre",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "information-circle" : "information-circle-outline"} 
            size={24} color={color} />
          ),
        }} />
      </Tabs>
    </View>
  );
}
