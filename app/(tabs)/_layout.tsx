import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return <Tabs>
  <Tabs.Screen name="index"
  options = {{headerTitle: "Página inicial",
  headerLeft: () => <></>}}/>
  <Tabs.Screen name="about" 
  options = {{headerTitle: "Sobre"}}/>
  <Tabs.Screen name = "not-found"/>
  <Tabs.Screen name="local-to-do"
  options = {{headerTitle: "Tarefas Local", tabBarIcon:({focused, color})=>
    (<Ionicons name= {focused ? "checkmark-circle" : "checkmark-circle-outline"} 
    color={color} 
    size={24}/>)}}/>
  </Tabs>
}