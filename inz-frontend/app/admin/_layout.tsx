import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AdminTabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen name="index" 
      options={{
        title: 'Główna',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
      />
            <Tabs.Screen name="uzytkownicy" 
      options={{
        title: 'Klienci',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
      }}
      />
            <Tabs.Screen name="faktury" 
      options={{
        title: 'Faktury',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="th" color={color} />,
      }}
      />
            <Tabs.Screen name="zgloszenia" 
      options={{
        title: 'Zgłoszenia',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="pencil" color={color} />,
      }}
      />
                  <Tabs.Screen name="awarie" 
      options={{
        title: 'Awarie',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="warning" color={color} />,
      }}
      />
            <Tabs.Screen name="ogloszenia" 
      options={{
        title: 'Ogłoszenia',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="sticky-note" color={color} />,
      }}
      />
            <Tabs.Screen name="menu" 
      options={{
        title: 'Menu',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="sliders" color={color} />,
      }}
      />
    </Tabs>
    
  );
}
