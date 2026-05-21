import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#ffd33d" }}>
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Página inicial",
          headerLeft: () => <></>,
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          headerTitle: "Sobre",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "information-circle" : "information-circle-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen name="not-found" />
      <Tabs.Screen
        name="cloud-to-do"
        options={{
          headerTitle: "Tarefas",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "cloud" : "cloud-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
