import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(isDark);

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000000' : '#ffffff' }]}>
      <View style={[styles.header, { borderBottomColor: isDark ? '#2c2c2e' : '#e5e5ea' }]}>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Settings
        </Text>
      </View>

      {renderSection('Profile', (
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=1' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#ffffff' : '#000000' }]}>
              Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
                  color: isDark ? '#ffffff' : '#000000',
                },
              ]}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#ffffff' : '#000000' }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? '#2c2c2e' : '#f2f2f7',
                  color: isDark ? '#ffffff' : '#000000',
                },
              ]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      ))}

      {renderSection('Notifications', (
        <View style={styles.notificationsSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={24} color="#2A9D8F" />
              <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                Push Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notifications ? '#2A9D8F' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={24} color="#2A9D8F" />
              <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                Email Notifications
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={emailNotifications ? '#2A9D8F' : '#f4f3f4'}
            />
          </View>
        </View>
      ))}

      {renderSection('Appearance', (
        <View style={styles.appearanceSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              {isDark ? (
                <Ionicons name="moon-outline" size={24} color="#2A9D8F" />
              ) : (
                <Ionicons name="sunny-outline" size={24} color="#2A9D8F" />
              )}
              <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkMode ? '#2A9D8F' : '#f4f3f4'}
            />
          </View>
        </View>
      ))}

      {renderSection('About', (
        <View style={styles.aboutSection}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait-outline" size={24} color="#8e8e93" />
              <Text style={[styles.settingLabel, { color: isDark ? '#ffffff' : '#000000' }]}>
                Project Management App v1.0.0
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? '#2c2c2e' : '#e5e5ea' }]} />

          <Text style={styles.copyright}>
            © 2024 Project Management App. All rights reserved.
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  changePhotoButton: {
    padding: 8,
  },
  changePhotoText: {
    color: '#2A9D8F',
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#2A9D8F',
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  notificationsSection: {
    gap: 16,
  },
  appearanceSection: {
    gap: 16,
  },
  aboutSection: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#8e8e93',
  },
}); 