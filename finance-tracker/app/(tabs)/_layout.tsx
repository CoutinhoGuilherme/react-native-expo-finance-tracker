import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={24} />
          )
        }} 
      />
      <Tabs.Screen 
        name="transactions" 
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" color={color} size={24} />
          )
        }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" color={color} size={24} />
          )
        }} 
      />
    </Tabs>
  );
}
