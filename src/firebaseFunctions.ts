import { UserCredential } from 'firebase/auth';
import { db } from './firebase'; // Pastikan Anda telah menginisialisasi db di firebase.ts
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Function to update additional user info (role and phone number)
const updateAdditionalUserInfo = async (displayName: string, role: string, phoneNumber: string, userCredential: UserCredential | null) => {
  if (userCredential && userCredential.user) {
    const { uid } = userCredential.user;
    try {
      // Menyimpan data pengguna ke Firestore
      await setDoc(doc(db, 'users', uid), {
        displayName,
        role,
        phoneNumber,
        createdAt: new Date(),
      });

      console.log('Informasi tambahan pengguna berhasil diperbarui dan disimpan di Firestore!');
    } catch (error) {
      console.error('Terjadi kesalahan saat memperbarui informasi tambahan pengguna:', (error as any).message);
      throw error; // Lempar error untuk penanganan di luar
    }
  }
};
const checkUserRole = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role; // Ambil peran dari data pengguna
        return role;
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      throw error;
    }
};
  

export { updateAdditionalUserInfo, checkUserRole };
