import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import AlertScreen from "../screen/AlertScreen";
import ProfileScreen from "../screen/ProfileScreen";
import EditProfileScreen from "../screen/EditProfileScreen";
import HistoryScreen from "../screen/HistoryScreen";
import StatisticsScreen from "../screen/StatisticsScreen";
import { THEME } from "../theme/theme";

const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

// Stack para el perfil que incluye la pantalla de edición
function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: THEME.headerStyle,
        headerTitleStyle: THEME.headerTitleStyle,
        headerTitleAlign: "center",
      }}
    >
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen}
        options={{ 
          title: "Editar Perfil",
          headerBackTitle: "Atrás"
        }}
      />
    </ProfileStack.Navigator>
  );
}

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
        headerTitleAlign: "center", // ✅ This centers the title
      })}
    >
      <Tab.Screen name="Alertas" component={AlertScreen} />
      <Tab.Screen name="Estadísticas" component={StatisticsScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
      <Tab.Screen name="Perfil" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}
