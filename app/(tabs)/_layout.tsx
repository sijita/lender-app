import React from 'react';
import { Tabs } from 'expo-router';
import TabIcon from '@/components/home/tab-icon';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          backgroundColor: '#FAFAFA',
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 35,
          height: 50,
          position: 'absolute',
          overflow: 'hidden',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="House" title="Inicio" />
          ),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clientes',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="UserRound" title="Clientes" />
          ),
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transacciones',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="ArrowUpDown"
              title="Transacciones"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="ChartNoAxesColumn"
              title="Reportes"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
