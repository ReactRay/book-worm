
import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import { useAuthStore } from '../../store/authStore'

export default function Home() {

    const { logout } = useAuthStore()

    return (
        <View>
            <Text>Home</Text>
            <TouchableOpacity onPress={logout}>
                <Text>logout</Text>
            </TouchableOpacity>
        </View>
    )
}