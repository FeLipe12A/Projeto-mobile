import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style= {styles.container}>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image}/>
      </View>
      <Text style ={styles.text}>Página inicial</Text>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
          backgroundColor: "#25292e",
        },
        headerShadowVisible: false,
        headerTintColor: "#ff",
        tabBarStyle: {
          backgroundColor: "#25292e",
        }
      }}>
        <Tabs.Screen name="index" options={{ 
          headerTitle: "Projeto I",
          tabBarIcon: ({focused, color}) => 
          ( <Ionicons name={focused ? "home" : "home-outline"} 
          size={24} 
          color={color} /> ), 
        }} />
      </Tabs>
    </View>
  );
}

const PlaceholderImage = require("../../assets/images/background-image.png");

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#a5c9f4",
  },

  text:{
    color: "#342323",
  },

  link: {
    fontSize: 20,
    textDecorationLine: "underline",
    color:"#342323",
  },

  imageContainer: {
    flex: 1,
  },

  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  }
});