import React, {useState} from "react";
import { SafeAreaView, View, Image, Text, TextInput, ImageBackground, TouchableOpacity, } from "react-native";
import LinearGradient from 'react-native-linear-gradient'; // Install LinearGradient: https://github.com/react-native-linear-gradient/react-native-linear-gradient
export default (props) => {
	const [textInput1, onChangeTextInput1] = useState('');
	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<View 
				style={{
					flex: 1,
				}}>
				<View 
					style={{
						backgroundColor: "#FFFFFF",
						borderRadius: 99,
						paddingTop: 27,
					}}>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/9ft08cft_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							height: 111,
							marginBottom: 75,
							marginHorizontal: 95,
						}}
					/>
					<View 
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 51,
							marginLeft: 79,
							marginRight: 304,
						}}>
						<View 
							style={{
								flex: 1,
								marginRight: 32,
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 96,
									fontWeight: "bold",
									width: 254,
								}}>
								{"Hi!"}
							</Text>
							<View 
								style={{
									alignItems: "flex-end",
								}}>
								<Text 
									style={{
										color: "#02B786",
										fontSize: 96,
										fontWeight: "bold",
									}}>
									{"HOANG DIEU"}
								</Text>
							</View>
						</View>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/e6qzyl00_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 90,
								height: 90,
							}}
						/>
					</View>
					<View 
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							backgroundColor: "#FFFFFF",
							borderColor: "#D9D9D999",
							borderRadius: 24,
							borderWidth: 3,
							paddingRight: 58,
							marginBottom: 51,
							marginHorizontal: 84,
							shadowColor: "#0000001C",
							shadowOpacity: 0.1,
							shadowOffset: {
							    width: 6,
							    height: 8
							},
							shadowRadius: 4,
							elevation: 4,
						}}>
						<TextInput
							placeholder={"Search here"}
							value={textInput1}
							onChangeText={onChangeTextInput1}
							style={{
								color: "#BDBDBD",
								fontSize: 40,
								marginRight: 4,
								flex: 1,
								paddingVertical: 61,
								paddingLeft: 58,
							}}
						/>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/dphsb26w_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 84,
								height: 71,
							}}
						/>
					</View>
					<View 
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginBottom: 42,
							marginHorizontal: 87,
						}}>
						<Text 
							style={{
								color: "#000000",
								fontSize: 56,
								fontWeight: "bold",
							}}>
							{"Categories"}
						</Text>
						<Text 
							style={{
								color: "#44D65A",
								fontSize: 32,
								marginTop: 23,
							}}>
							{"See All"}
						</Text>
					</View>
					<Image
						source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/iuhupxsz_expires_30_days.png"}} 
						resizeMode = {"stretch"}
						style={{
							height: 236,
							marginBottom: 56,
							marginHorizontal: 84,
						}}
					/>
					<View 
						style={{
							paddingRight: 43,
							marginBottom: 56,
							marginLeft: 84,
							marginRight: 46,
						}}>
						<View 
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								marginBottom: 42,
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 56,
									fontWeight: "bold",
									width: 547,
								}}>
								{"#Expiry Alerts"}
							</Text>
							<Text 
								style={{
									color: "#44D65A",
									fontSize: 32,
									marginTop: 23,
								}}>
								{"See All"}
							</Text>
						</View>
						<View 
							style={{
								alignItems: "center",
							}}>
							<View 
								style={{
									alignSelf: "stretch",
									flexDirection: "row",
									alignItems: "center",
									marginBottom: 35,
								}}>
								<ImageBackground 
									source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/d88380uh_expires_30_days.png"}} 
									resizeMode = {'stretch'}
									style={{
										flex: 1,
										paddingBottom: 352,
										marginRight: 36,
									}}
									>
									<TouchableOpacity 
										style={{
											alignSelf: "flex-start",
											backgroundColor: "#B70900",
											borderTopLeftRadius: 24,
											borderBottomRightRadius: 24,
											paddingVertical: 18,
											paddingHorizontal: 33,
										}} onPress={()=>alert('Pressed!')}>
										<Text 
											style={{
												color: "#FFFFFF",
												fontSize: 32,
												fontWeight: "bold",
											}}>
											{"Expires in 2 days"}
										</Text>
									</TouchableOpacity>
								</ImageBackground>
								<ImageBackground 
									source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/rus84xg8_expires_30_days.png"}} 
									resizeMode = {'stretch'}
									style={{
										flex: 1,
										paddingBottom: 352,
									}}
									>
									<TouchableOpacity 
										style={{
											alignSelf: "flex-start",
											backgroundColor: "#33AD3E",
											borderTopLeftRadius: 24,
											borderBottomRightRadius: 24,
											paddingVertical: 22,
											paddingHorizontal: 32,
										}} onPress={()=>alert('Pressed!')}>
										<Text 
											style={{
												color: "#FFFFFF",
												fontSize: 32,
												fontWeight: "bold",
											}}>
											{"Fresh"}
										</Text>
									</TouchableOpacity>
								</ImageBackground>
							</View>
							<View 
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}>
								<View 
									style={{
										width: 24,
										height: 24,
										marginRight: 14,
									}}>
								</View>
								<View 
									style={{
										width: 240,
										height: 24,
										backgroundColor: "#D9D9D9",
										borderRadius: 100,
										marginRight: 14,
									}}>
								</View>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/di0rucuc_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 24,
										height: 24,
									}}
								/>
							</View>
						</View>
					</View>
					<View 
						style={{
							alignSelf: "flex-start",
							flexDirection: "row",
							alignItems: "center",
							marginBottom: 43,
							marginLeft: 87,
						}}>
						<Text 
							style={{
								color: "#44D65A",
								fontSize: 56,
								fontWeight: "bold",
								marginRight: 16,
							}}>
							{"Recipes from Your Fridge"}
						</Text>
						<TouchableOpacity onPress={()=>alert('Pressed!')}>
							<LinearGradient 
								start={{x:0, y:0}}
								end={{x:0, y:1}}
								colors={["#F2E7FE", "#DAEAFE"]}
								style={{
									flexDirection: "row",
									alignItems: "center",
									borderRadius: 20336000,
									paddingVertical: 6,
									paddingHorizontal: 13,
								}}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/1egw4swo_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 20,
										height: 20,
										marginRight: 4,
									}}
								/>
								<Text 
									style={{
										color: "#9810FA",
										fontSize: 20,
									}}>
									{"AI"}
								</Text>
							</LinearGradient>
						</TouchableOpacity>
					</View>
					<View 
						style={{
							marginBottom: 115,
							marginHorizontal: 85,
						}}>
						<ImageBackground 
							source={{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/yggchlob_expires_30_days.png"}} 
							resizeMode = {'stretch'}
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								paddingTop: 24,
								paddingBottom: 411,
								paddingHorizontal: 29,
							}}
							>
							<TouchableOpacity 
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: "#FFFFFF",
									borderRadius: 1000000000,
									paddingVertical: 13,
									paddingHorizontal: 25,
								}} onPress={()=>alert('Pressed!')}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/2tpoye2b_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 36,
										height: 36,
										marginRight: 3,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 32,
									}}>
									{"4.8 (500 Review)"}
								</Text>
							</TouchableOpacity>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/shv29bll_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 84,
									height: 84,
								}}
							/>
						</ImageBackground>
						<View 
							style={{
								position: "absolute",
								bottom: 0,
								right: 0,
								left: 0,
								backgroundColor: "#ECECECCC",
								borderBottomRightRadius: 24,
								borderBottomLeftRadius: 24,
								paddingVertical: 20,
								paddingLeft: 29,
							}}>
							<Text 
								style={{
									color: "#000000",
									fontSize: 32,
									fontWeight: "bold",
									marginBottom: 8,
								}}>
								{"Sandwich"}
							</Text>
							<View 
								style={{
									alignSelf: "flex-start",
									flexDirection: "row",
									alignItems: "center",
								}}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/inxdmajl_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 28,
										height: 28,
										marginRight: 6,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 20,
									}}>
									{"15 mins | Chef Hoang Dieu"}
								</Text>
							</View>
						</View>
					</View>
					<View 
						style={{
							paddingTop: 32,
						}}>
						<View 
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#FFFFFF",
								borderBottomRightRadius: 96,
								borderBottomLeftRadius: 96,
								paddingVertical: 82,
								shadowColor: "#0000006E",
								shadowOpacity: 0.4,
								shadowOffset: {
								    width: 16,
								    height: 3
								},
								shadowRadius: 41,
								elevation: 41,
							}}>
							<View 
								style={{
									flex: 1,
								}}>
							</View>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/lzt82oac_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 87,
									height: 91,
								}}
							/>
							<View 
								style={{
									flex: 1,
								}}>
							</View>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/83t3vqzu_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 812,
									height: 109,
								}}
							/>
							<View 
								style={{
									flex: 1,
								}}>
							</View>
						</View>
						<View 
							style={{
								position: "absolute",
								top: 0,
								right: 0,
								left: 0,
								alignItems: "center",
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/dR2fEpA69O/dk6cfc13_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 246,
									height: 246,
								}}
							/>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	)
}