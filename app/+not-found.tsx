import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
    <Stack.Screen options={{ title: "Ops! Página não encontrada" }} />
    <View style= {styles.container}>
      <Link href="/" style = {styles.button}>
        Retornar para página inicial
      </Link>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#a5c9f4",
  },

  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color:"#fff",
  }

});