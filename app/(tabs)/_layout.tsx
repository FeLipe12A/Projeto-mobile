import { Stack } from "expo-router";

export default function TabsLayout() {
  return <Stack>
  <Stack.Screen name="index"
  options = {{headerTitle: "Página inicial",
  headerLeft: () => <></>}}/>
  <Stack.Screen name="about" 
  options = {{headerTitle: "Sobre"}}/>
  <Stack.Screen name = "not-found"/>
  </Stack>
}