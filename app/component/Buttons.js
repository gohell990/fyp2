import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const Buttons = ({onPress, children}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style= {styles.text}> {children} </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 15,
    borderWidth: 1,
    paddingTop: 10,
  },
  text: {
    fontSize: 20,
  }
});

export {Buttons}
