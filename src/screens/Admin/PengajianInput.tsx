import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

interface User {
  id: string;
  displayName: string;
}

interface Pengajian {
  id: string;
  judulPengajian: string;
  tanggal: Date;
  nama: string;
  jumlahUang: number;
}

const PengajianInput = () => {
  const [judulPengajian, setJudulPengajian] = useState('');
  const [tanggal, setTanggal] = useState(new Date());
  const [nama, setNama] = useState('');
  const [jumlahUang, setJumlahUang] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [pengajianData, setPengajianData] = useState<Pengajian[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(firestore, 'users'), (querySnapshot) => {
      const usersList: User[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setUsers(usersList);
    });

    const unsubscribePengajian = onSnapshot(collection(firestore, 'pengajian'), (querySnapshot) => {
      const pengajianList: Pengajian[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tanggal: doc.data().tanggal.toDate(), // Convert Firebase Timestamp to Date
      })) as Pengajian[];
      setPengajianData(pengajianList);
    });

    return () => {
      unsubscribeUsers();
      unsubscribePengajian();
    };
  }, []);

  const handleSubmit = async () => {
    if (!judulPengajian || !tanggal || !nama || !jumlahUang) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(firestore, 'pengajian', editingId), {
          judulPengajian,
          tanggal,
          nama,
          jumlahUang: parseFloat(jumlahUang),
        });
        setEditingId(null);
        console.log('Data updated');
        Alert.alert('Success', 'Data successfully updated');
      } else {
        await addDoc(collection(firestore, 'pengajian'), {
          judulPengajian,
          tanggal,
          nama,
          jumlahUang: parseFloat(jumlahUang),
        });
        console.log('Data submitted');
        Alert.alert('Success', 'Data successfully submitted');
      }

      setJudulPengajian('');
      setTanggal(new Date());
      setNama('');
      setJumlahUang('');
      setModalVisible(false); // Tutup modal setelah submit
    } catch (error) {
      console.error('Error submitting data:', error);
      Alert.alert('Error', 'Failed to submit data');
    }
  };

  const handleEdit = (item: Pengajian) => {
    setJudulPengajian(item.judulPengajian);
    setTanggal(item.tanggal);
    setNama(item.nama);
    setJumlahUang(item.jumlahUang.toString());
    setEditingId(item.id);
    setModalVisible(true); // Buka modal saat edit
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'pengajian', id));
      Alert.alert('Success', 'Data successfully deleted');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete data');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Add Pengajian" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.label}>Judul Pengajian</Text>
          <TextInput
            style={styles.input}
            placeholder="Judul Pengajian"
            value={judulPengajian}
            onChangeText={setJudulPengajian}
          />

          <Text style={styles.label}>Tanggal</Text>
          <Button onPress={() => setShowDatePicker(true)} title="Select Date" />
          {showDatePicker && (
            <DateTimePicker
              value={tanggal}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                setTanggal(selectedDate || tanggal);
              }}
            />
          )}
          <Text style={styles.text}>{tanggal.toDateString()}</Text>

          <Text style={styles.label}>Nama</Text>
          <Picker
            selectedValue={nama}
            onValueChange={(itemValue, itemIndex) => setNama(itemValue)}
            style={styles.input}
          >
            {users.map((user) => (
              <Picker.Item key={user.id} label={user.displayName} value={user.displayName} />
            ))}
          </Picker>

          <Text style={styles.label}>Jumlah Uang</Text>
          <TextInput
            style={styles.input}
            placeholder="Jumlah Uang"
            value={jumlahUang}
            onChangeText={setJumlahUang}
            keyboardType="numeric"
          />

          <Button title={editingId ? "Update" : "Submit"} onPress={handleSubmit} />
        </View>
      </Modal>

      <FlatList
        data={pengajianData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>{item.judulPengajian}</Text>
            <Text style={styles.listText}>{item.tanggal.toDateString()}</Text>
            <Text style={styles.listText}>{item.nama}</Text>
            <Text style={styles.listText}>{item.jumlahUang}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.button}>
                <Text>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.button}>
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  text: {
    marginBottom: 15,
    fontSize: 16,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 5,
  },
  button: {
    marginLeft: 10,
    padding: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
});

export default PengajianInput;
