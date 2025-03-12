import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        height: 60,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={focused ? "#2A9D8F" : "#666"} 
              />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#2A9D8F', marginTop: 4 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? "stats-chart" : "stats-chart-outline"} 
                size={24} 
                color={focused ? "#2A9D8F" : "#666"} 
              />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#2A9D8F', marginTop: 4 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? "calendar" : "calendar-outline"} 
                size={24} 
                color={focused ? "#2A9D8F" : "#666"} 
              />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#2A9D8F', marginTop: 4 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons 
                name={focused ? "settings" : "settings-outline"} 
                size={24} 
                color={focused ? "#2A9D8F" : "#666"} 
              />
              {focused && <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#2A9D8F', marginTop: 4 }} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat-rooms"
        options={{
          title: 'Chat Rooms',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 