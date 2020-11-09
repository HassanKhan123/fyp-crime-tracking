import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  EvilIcons,
  FontAwesome5,
} from '@expo/vector-icons';
export default class OfficeLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      securityKey: '',
      loading: false,
    };
  }

  onClickListener = (viewId) => {
    Alert.alert('Alert', 'Button pressed ' + viewId);
  };

  render() {
    const { email, password, securityKey, loading } = this.state;
    return (
      <ImageBackground
        source={require('../assets/images/map.jpg')}
        style={styles.backgroundImg}
        imageStyle={{ opacity: 0.1 }}
      >
        <View style={styles.container}>
          <View style={styles.form}>
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{ fontSize: 24, color: '#fff', textAlign: 'center' }}
              >
                Welcome Officer!
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder='Email'
                keyboardType='email-address'
                underlineColorAndroid='transparent'
                onChangeText={(email) => this.setState({ email })}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder='Password'
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({ password })}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                placeholder='Security Key'
                secureTextEntry={true}
                underlineColorAndroid='transparent'
                onChangeText={(password) => this.setState({ password })}
              />
            </View>
            {loading ? (
              <ActivityIndicator />
            ) : (
              <TouchableHighlight
                style={[styles.buttonContainer, styles.loginButton]}
                onPress={() => this.onClickListener('login')}
              >
                <Text style={styles.loginText}>Login</Text>
              </TouchableHighlight>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  form: {
    marginTop: -50,
  },
  backgroundImg: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null,
    resizeMode: 'cover',
    backgroundColor: '#22292e',
    marginTop: -20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#000',
    borderRadius: 30,

    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 150,
    borderRadius: 30,
    alignSelf: 'center',
  },
  loginButton: {
    backgroundColor: '#000',
  },
  loginText: {
    color: 'white',
  },
});
