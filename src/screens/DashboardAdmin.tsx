import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuthState } from 'react-firebase-hooks/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth, db } from '../firebase'; // Pastikan sesuai dengan struktur import Anda
import Colors from '../constants/Colors';
import { signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore'; // Import untuk mengambil dokumen dari Firestore

type Props = {
  navigation: StackNavigationProp<any, any>;
  route: any;
};

type UserData = {
  displayName: string;
  email: string;
  // Tambahkan field lain yang diperlukan dari dokumen pengguna
};

const AdminDashboardScreen: React.FC<Props> = ({ navigation, route }) => {
  const [userData, setUserData] = useState<UserData | null>(null); // State untuk menyimpan data pengguna

  // Mendapatkan status autentikasi dari Firebase
  const [user] = useAuthState(auth);
  console.log('User:', user?.uid);
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          console.log
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setUserData(data); // Menyimpan data pengguna ke dalam state
          } else {
            console.log('Dokumen tidak ditemukan!');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      }
    };

    fetchUserData();
  }, [user]); // Menggunakan user sebagai dependency untuk efek ini

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');

      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  const handleManageUsers = () => {
    // Navigasi ke layar manajemen pengguna (ganti 'ManageUsers' dengan nama layar yang sesuai)
    navigation.navigate('UserTable');
  };
  const kasPengajian = () => {
    // Navigasi ke layar manajemen pengguna (ganti 'ManageUsers' dengan nama layar yang sesuai)
    navigation.navigate('PengajianInput');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      {userData && (
        <View>
          <Text style={styles.greeting}>Halo, {userData.displayName}</Text>
          {/* Tambahkan field lain yang ingin ditampilkan */}
        </View>
      )}
      {/* Isi dengan komponen-komponen untuk dashboard admin */}
      <TouchableOpacity style={styles.button} onPress={handleManageUsers}>
        <Text style={styles.buttonText}>Data User</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={kasPengajian}>
        <Text style={styles.buttonText}>Input Kas Pengajian</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>View Reports</Text>
      </TouchableOpacity>
      {/* Tombol Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'transparent',
  },
  logoutText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;
