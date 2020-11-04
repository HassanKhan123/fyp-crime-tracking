import React, { Component } from 'react';
import { View, Image, StyleSheet, Button, Text, TouchableOpacity, ImageBackground,ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, EvilIcons } from '@expo/vector-icons';
import fire from '../config/firebase';
import * as Facebook from 'expo-facebook';
import * as Font from 'expo-font';

import * as firebase from 'firebase';
import Constants from 'expo-constants';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

class AuthScreen extends Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = { userName: '', UserId: '', ProfileURL: '', fontLoaded: false, picture: '',loading:true,userToken:'',deviceInfo:'' };
    }


    async componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                
                fire.database().ref('Users/' + user.uid).once('value',  (snapshot) => {
                    let snapShot = snapshot.val();
                    console.log(snapShot)
                    // console.log(user)
                    
                    this.props.navigation.navigate('CrimeInfo', { userId: user.uid, Name: snapShot.userName, userProfile: snapShot.ProfileURL, UserToken: snapShot.userToken, deviceinfo: snapShot.deviceInfo });
                    this.setState({loading:false})
                })
               
            }else{
                this.setState({loading:false})
            }
        });


        await Font.loadAsync({
            'ralewayRegular': require('../assets/fonts/Raleway-Regular.ttf'),
        });

        this.setState({ fontLoaded: true });
    }

    async loginWithFacebook() {
        this.setState({loading:true})
        await Facebook.initializeAsync('925470951182049');
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile','email'],
      });
        
        

        if (type === 'success') {
            // Build Firebase credential with the Facebook access token.
            const credential = firebase.auth.FacebookAuthProvider.credential(token);
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`
            );
            const userInfo = await response.json();

            firebase.auth().signInWithCredential(credential).then((res) => {
                
                const userName = res.additionalUserInfo.profile.name ;
                const UserUid = res.user.uid;
                const ProfileURL = `${res.user.photoURL}?type=large`;
               
                const deviceInfo = Constants.deviceName;
                fire.database().ref('Users/' + UserUid).update({
                    userName,
                    UserId:UserUid,
                    ProfileURL,
                    userToken:token, deviceInfo
                })
                    .then(() => {
                        fire.database().ref('Users/' + UserUid + '/' + 'devices/' + deviceInfo).set({ deviceInfo, token }).then(() => {
                            
                            this.props.navigation.navigate('Home', { userId: UserUid, Name: userName, userProfile: ProfileURL, UserToken: token, deviceinfo: deviceInfo });
                            this.setState({loading:false})
                        }).catch((e) => {
                            var errorMessage = error.message;
                            console.log(errorMessage);
                            this.setState({loading:false})
                        })
                    })
                    .catch(function (error) {
                      
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log(errorMessage);
                        this.setState({loading:false})
                       
                    });

            });

           
        }
    }


    render() {
        const {loading} = this.state
        return this.state.fontLoaded ? (
            <ImageBackground source={require('../assets/images/map.jpg')} style={styles.backgroundImg} imageStyle={{ opacity: 0.1 }}>
                <View style={styles.container}>
                    <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ marginRight: 0, paddingRight: 0 }}>
                                <MaterialIcons name="my-location" size={50} color="white" />
                            </View>
                            <View>
                                <Text style={{ fontSize: 28, fontWeight: 'bold', color: 'white', letterSpacing: 2, fontFamily: 'ralewayRegular' }}>CITIZEN</Text>
                            </View>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginLeft: 10, marginTop: 8 }}>
                            <Text style={{ color: '#7d888d', fontSize: 12, textAlign: 'center', fontFamily: 'ralewayRegular' }}>Making Logictics Human</Text>
                        </View>

                    </View>

                    <View style={{ flex: 2, flexDirection: 'column', justifyContent: 'space-evenly', alignContent: 'center' }}>
                     {loading ? <ActivityIndicator /> :   <TouchableOpacity style={{ backgroundColor: '#2e363d', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 18, padding: 15, width: 250, textAlign: 'çenter' }}
                            onPress={() => this.loginWithFacebook()}
                        >
                            <EvilIcons name="sc-facebook" size={25} color="white" />
                            <Text style={{ color: 'white', marginLeft: 5, fontFamily: 'ralewayRegular', fontSize: 18, textAlign: 'center' }}>Login with Facebook</Text>

                        </TouchableOpacity> }

                      
                    </View>
                </View>
            </ImageBackground>
        ) : null;
    }
}

const styles = StyleSheet.create({
    backgroundImg: {
        flex: 1,
        // remove width and height to override fixed static size
        width: null,
        height: null,
        resizeMode: 'cover',
        backgroundColor: '#22292e',
        marginTop: -20
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',


    },
    text: {

        color: 'red',
        fontSize: 15,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: 60,
        textAlign: 'center'
    },
    button: {
        color: 'white',
        backgroundColor: 'green',
        fontSize: 20,
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginTop: 30,
        textAlign: 'center',
        borderRadius: 5,
        padding: 10
    }

});

export default AuthScreen;