import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native'
import QRCode from 'react-native-qrcode-svg';
import { observer, inject } from "mobx-react";
import { SafeAreaView, View, Text, StyleSheet, Modal, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { WebView } from 'react-native-webview';
import IMP from 'iamport-react-native';

import MyButton from '../../Components/Button';

import {createConsumer, getPaymentInfo, useFetch} from '../../../Stores';
let Polar_logo = require('../../../Assets/Image/Polar_Logo.png');

const StyledText = styled.Text`
font-size: 30px;
`;

const QRPay = ({navigation}) =>{
	
	const [consumerId,setConsumerId] = useState('Loading now');
	//const [Data, setData] = useState(null)
	
	const result = AsyncStorage.getItem('consumerId').then(res => {
            if(res) {
				setConsumerId(res);
                return Promise.resolve(consumerId);
            } else {
				createConsumer();
                return Promise.reject("SELLERID_MISSING");
            }
        }, error => {
            console.log(error);
        }
		
	);
	
	const Data = getPaymentInfo(String(consumerId));
	//var Data = null;
	const [ShowPopup, setShowPopup]= useState(false);
	const [ShowWebView, setShowWebView] = useState(false);
	console.log(`data: ${String(Data)}`)
	return (
			
			<Container>
				<StyledText> Consumer Id : {String(consumerId)}</StyledText>
				<Text> </Text>
				<QRCode value = {String(consumerId)} logo={Polar_logo} logoSize={45} size = {150}/>
				<Text> </Text>
				<Text> </Text>
				<Text> </Text>
				{Data ? <MyButton title = "결제정보 확인" onPress = {() => setShowPopup(true)}  /> : <MyButton title = "No Payment Info" onPress = {()=>setShowPopup(true)} /> }
				<Modal visible = {ShowPopup} animationType="slide" transparent = {false} >
					<View style={styles.modalBackground}>
							<Container>
							{Data? <Text> 결제 번호: {Data[0].id} </Text> : <Text> </Text>}
							{Data? <Text>  가격 : {Data[0].price} </Text> : <Text> </Text>}
							{Data? <Text> 매장 ID : {Data[0].sellerId} </Text> : <Text> 결제 정보가 없습니다. </Text>}
							{Data? <Text> 소비자 ID : {Data[0].consumerId} </Text> : <Text>  </Text>}
							{Data? <Text> 요청 시각: {Data[0].createdAt} </Text> : <Text>  </Text>}
							{Data? <MyButton title = "결제 하기" onPress = {() => setShowWebView(true)} /> : <Text> </Text>}
								{ShowWebView? <Modal visible = {ShowWebView} animationType="slide" transparent = {false} >
									<MyButton title = "결제" onPress = {() => navigation.navigate("PaymentWebView")} />
									<MyButton title = "Close" onPress = {() => setShowWebView(false)} />
									
									
								</Modal> 
								: null}
							<MyButton title = "Close" onPress = {() => setShowPopup(false)} />
							
        					</Container>
      				</View>
				</Modal>
				
			</Container>
	);
	
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0)",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  modal: {
    width: "80%",
    height: "20%"
  }
});



const Container = styled.View`
flex: 1;
justify-content: center;
align-items: center;
`;


export default QRPay;