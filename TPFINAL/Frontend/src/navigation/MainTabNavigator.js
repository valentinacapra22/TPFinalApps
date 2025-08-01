import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import AlertScreen from "../screen/AlertScreen";
import ProfileScreen from "../screen/ProfileScreen";
import HistoryScreen from "../screen/HistoryScreen";
import { THEME } from "../theme/theme";

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Alertas"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Alertas: "alert-circle",
            Estadísticas: "bar-chart",
            Perfil: "person-circle",
            Historial: "time-outline",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME.colors.primary,
        tabBarInactiveTintColor: THEME.colors.inactive,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: THEME.headerStyle,
        headerTitleStyle: THEME.headerTitleStyle,
        headerTitleAlign: "center", 
      })}
    >
      <Tab.Screen name="Alertas" component={AlertScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}