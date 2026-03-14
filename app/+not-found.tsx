import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style= {styles.container}>
      <Text style ={styles.text}>Página não encontrada!</Text>
      <Link href={"/../(tabs)/index"} style = {styles.link}>
        Retornar para página inicial
      </Link>
    </View>
  );
}

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
  }

});