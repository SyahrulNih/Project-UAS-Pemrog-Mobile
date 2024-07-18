import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors'; // Pastikan Colors diimport sesuai dengan kebutuhan Anda
import { getFirestore, collection, getDocs, DocumentData, query, where } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth'; // Pastikan auth diimport untuk logout
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

// Definisikan tipe untuk data pengajian
interface Pengajian {
  id: string;
  judulPengajian: string;
  jumlahUang: number;
  nama: string;
  tanggal: {
    seconds: number;
    nanoseconds: number;
  };
}

// Definisikan tipe untuk navigation props
type RootStackParamList = {
  UserDashboard: undefined;
  Login: undefined;
};

type UserDashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UserDashboard'
>;

const UserDashboard: React.FC = () => {
  const [pengajian, setPengajian] = useState<Pengajian[]>([]); // Gunakan tipe Pengajian[]
  const navigation = useNavigation<UserDashboardScreenNavigationProp>();

  useEffect(() => {
    const fetchPengajian = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const pengajianCollection = collection(firestore, 'pengajian');
        const pengajianSnapshot = await getDocs(
          query(pengajianCollection, where('userId', '==', user.uid))
        );
        const pengajianList = pengajianSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Pengajian[]; // Cast data as Pengajian
        setPengajian(pengajianList);
      }
    };

    fetchPengajian();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Logout berhasil
      console.log('User logged out successfully');
      navigation.navigate('Login'); // Gunakan navigation untuk navigate ke layar Login
      // Arahkan pengguna ke layar login atau layar awal setelah logout
    }).catch((error) => {
      // An error happened
      console.error('Error during logout:', error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Dashboard</Text>
      {pengajian.map((item) => (
        <View key={item.id} style={styles.pengajianItem}>
          <Text style={styles.pengajianText}>Judul Pengajian: {item.judulPengajian}</Text>
          <Text style={styles.pengajianText}>Jumlah Uang: {item.jumlahUang}</Text>
          <Text style={styles.pengajianText}>Nama: {item.nama}</Text>
          <Text style={styles.pengajianText}>Tanggal: {new Date(item.tanggal.seconds * 1000).toLocaleDateString()}</Text>
        </View>
      ))}
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
    backgroundColor: Colors.background, // Sesuaikan dengan warna latar belakang yang Anda inginkan
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pengajianItem: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '90%',
  },
  pengajianText: {
    fontSize: 16,
    color: Colors.white,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  logoutText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserDashboard;
