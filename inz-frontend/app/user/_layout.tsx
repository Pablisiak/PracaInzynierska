import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function UserTabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen name="index" 
      options={{
        title: 'Główna',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
      }}
      />
            <Tabs.Screen name="fakturyuser" 
      options={{
        title: 'Faktury',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="th" color={color} />,
      }}
      />
            <Tabs.Screen name="zgloszeniauser" 
      options={{
        title: 'Zgłoszenie stanu',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="pencil" color={color} />,
      }}
      />
                  <Tabs.Screen name="awarieuser" 
      options={{
        title: 'Zgłoś awarię',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="warning" color={color} />,
      }}
      />
            <Tabs.Screen name="menuuser" 
      options={{
        title: 'Menu',
        tabBarIcon: ({ color }) => <FontAwesome size={28} name="sliders" color={color} />,
      }}
      />
    </Tabs>
  );
}
