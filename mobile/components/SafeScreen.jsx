import { View, Text, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
})

export default function SafeScreen({ children }) {
    const insets = useSafeAreaInsets();


    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            {children}

        </View>
    );
}

