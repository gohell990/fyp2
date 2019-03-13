import React, { Component } from 'react';
import {
  Picker,
  View,
  StyleSheet
} from 'react-native';

export default class CategoryPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
    }
  }

  render() {
    return (
      <View>
        <Picker
          style={styles.picker}
          mode={'dropdown'} // 'dialog' is default, try 'dropdown'
          prompt={'Select A Category'} // Android only, available in 'dialog' mode
          selectedValue={this.state.category}
          onValueChange={
          (itemValue, itemIndex) => this.setState({category: itemValue})
          }>
          <Picker.Item label="Furniture" value="Furniture" />
          <Picker.Item label="Groceries" value="Groceries" />
          <Picker.Item label="Text Book/Notes" value="Text Book/Notes" />
          <Picker.Item label="Clothing" value="Clothing" />
          <Picker.Item label="Transportation" value="Transportation" />

        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  picker: {
    color: 'maroon',
    margin: 10,
  }
})
