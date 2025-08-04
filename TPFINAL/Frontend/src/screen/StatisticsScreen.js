import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
} from "react-native-chart-kit";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { getEstadisticasVecindario } from "../service/AlarmaService";
import BASE_URL, { USER_API } from '../config/apiConfig';

const { width, height } = Dimensions.get("window");

const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(13, 153, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#0D99FF",
  },
};

const pieChartConfig = {
  color: (opacity = 1) => `rgba(13, 153, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const colors = [
  "#0D99FF",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
];

export default function StatisticsScreen() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState("tipo"); // tipo, mes, usuario
  const { authData } = useAuth();

  useFocusEffect(
    useCallback(() => {
      fetchEstadisticas();
    }, [])
  );

  const fetchEstadisticas = async () => {
    try {
      setError(null);
      setLoading(true);

      const token = await AsyncStorage.getItem("userToken") || authData?.token;
      const userId = await AsyncStorage.getItem("usuarioId") || authData?.userId;

      if (!token || !userId) {
        setError("No se encontró información de autenticación");
        setLoading(false);
        return;
      }

      // Obtener información del usuario para conseguir el vecindarioId
      const userResponse = await axios.get(`${USER_API}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const userVecindarioId = userResponse.data.vecindarioId;
      if (!userVecindarioId) {
        setError("No se pudo determinar el vecindario del usuario");
        setLoading(false);
        return;
      }

      // Obtener estadísticas
      const data = await getEstadisticasVecindario(userVecindarioId, token);
      setEstadisticas(data);
    } catch (error) {
      console.error("Error fetching statistics:", error.response || error);
      setError(`Error al cargar las estadísticas: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatMes = (mesAnio) => {
    const [anio, mes] = mesAnio.split("-");
    const meses = [
      "Ene", "Feb", "Mar", "Abr", "May", "Jun",
      "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];
    return `${meses[parseInt(mes) - 1]} ${anio}`;
  };

  const renderChartSelector = () => (
    <View style={styles.chartSelector}>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          selectedChart === "tipo" && styles.selectorButtonActive,
        ]}
        onPress={() => setSelectedChart("tipo")}
      >
        <Text
          style={[
            styles.selectorButtonText,
            selectedChart === "tipo" && styles.selectorButtonTextActive,
          ]}
        >
          Por Tipo
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          selectedChart === "mes" && styles.selectorButtonActive,
        ]}
        onPress={() => setSelectedChart("mes")}
      >
        <Text
          style={[
            styles.selectorButtonText,
            selectedChart === "mes" && styles.selectorButtonTextActive,
          ]}
        >
          Por Mes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          selectedChart === "usuario" && styles.selectorButtonActive,
        ]}
        onPress={() => setSelectedChart("usuario")}
      >
        <Text
          style={[
            styles.selectorButtonText,
            selectedChart === "usuario" && styles.selectorButtonTextActive,
          ]}
        >
          Por Usuario
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderTipoChart = () => {
    if (!estadisticas?.datosPorTipo?.length) return null;

    const data = estadisticas.datosPorTipo.map((item, index) => ({
      name: item.tipo,
      population: item.cantidad,
      color: colors[index % colors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Alarmas por Tipo</Text>
        <PieChart
          data={data}
          width={width - 32}
          height={220}
          chartConfig={pieChartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    );
  };

  const renderMesChart = () => {
    if (!estadisticas?.datosPorMes?.length) return null;

    const data = {
      labels: estadisticas.datosPorMes.map(item => formatMes(item.mes)),
      datasets: [
        {
          data: estadisticas.datosPorMes.map(item => item.cantidad),
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Alarmas por Mes</Text>
        <LineChart
          data={data}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  const renderUsuarioChart = () => {
    if (!estadisticas?.datosPorUsuario?.length) return null;

    const data = {
      labels: estadisticas.datosPorUsuario.map(item => 
        item.usuario.length > 10 ? item.usuario.substring(0, 10) + "..." : item.usuario
      ),
      datasets: [
        {
          data: estadisticas.datosPorUsuario.map(item => item.cantidad),
        },
      ],
    };

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top Usuarios con Más Alarmas</Text>
        <BarChart
          data={data}
          width={width - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          verticalLabelRotation={45}
        />
      </View>
    );
  };

  const renderResumen = () => (
    <View style={styles.resumenContainer}>
      <Text style={styles.resumenTitle}>Resumen del Vecindario</Text>
      <View style={styles.resumenCards}>
        <View style={styles.resumenCard}>
          <Text style={styles.resumenNumber}>{estadisticas?.totalAlarmas || 0}</Text>
          <Text style={styles.resumenLabel}>Total Alarmas</Text>
        </View>
        <View style={styles.resumenCard}>
          <Text style={styles.resumenNumber}>
            {estadisticas?.datosPorTipo?.length || 0}
          </Text>
          <Text style={styles.resumenLabel}>Tipos Diferentes</Text>
        </View>
        <View style={styles.resumenCard}>
          <Text style={styles.resumenNumber}>
            {estadisticas?.datosPorUsuario?.length || 0}
          </Text>
          <Text style={styles.resumenLabel}>Usuarios Activos</Text>
        </View>
      </View>
    </View>
  );

  const renderAlarmasRecientes = () => (
    <View style={styles.recientesContainer}>
      <Text style={styles.recientesTitle}>Alarmas Más Recientes</Text>
      {estadisticas?.alarmasRecientes?.map((alarma, index) => (
        <View key={index} style={styles.alarmaItem}>
          <View style={styles.alarmaHeader}>
            <Text style={styles.alarmaTipo}>{alarma.tipo}</Text>
            <Text style={styles.alarmaFecha}>
              {new Date(alarma.fechaHora).toLocaleDateString("es-ES")}
            </Text>
          </View>
          <Text style={styles.alarmaUsuario}>
            Reportado por: {alarma.usuario.nombre} {alarma.usuario.apellido}
          </Text>
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0D99FF" />
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEstadisticas}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Estadísticas del Vecindario</Text>
      
      {renderResumen()}
      {renderChartSelector()}

      {selectedChart === "tipo" && renderTipoChart()}
      {selectedChart === "mes" && renderMesChart()}
      {selectedChart === "usuario" && renderUsuarioChart()}

      {renderAlarmasRecientes()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#0D99FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  resumenContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  resumenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  resumenCards: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resumenCard: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  resumenNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0D99FF",
  },
  resumenLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  chartSelector: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  selectorButtonActive: {
    backgroundColor: "#0D99FF",
  },
  selectorButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  selectorButtonTextActive: {
    color: "white",
  },
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recientesContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  recientesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  alarmaItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  alarmaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  alarmaTipo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0D99FF",
  },
  alarmaFecha: {
    fontSize: 12,
    color: "#666",
  },
  alarmaUsuario: {
    fontSize: 12,
    color: "#666",
  },
}); 