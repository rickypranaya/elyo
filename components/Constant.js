import { Dimensions , StatusBar, Platform} from 'react-native';

class Constant {
    static STATUSBAR = Platform.OS === 'ios'? 44 :  StatusBar.currentHeight;
    static DEVICE_WIDTH = Dimensions.get('window').width;
    static DEVICE_HEIGHT = Dimensions.get('window').height;
    static PRIMARY_COLOR = '#2553F1';
    static LIGHT_GREY = '#CECECE';
    static GREY_BACKGROUND = '#F3F5F7';
    static GREY_PLACEHOLDER = "#CECECE";
    static MAIN_FONT_SIZE = 17;
    static SECONDARY_FONT_SIZE = 15;
    static TERTIARY_FONT_SIZE = 13;
    static TERTIARY_GREY_COLOR = '#999999';
    static PADDING_HORIZONTAL = 20; 

    // static BASE_URL = 'http://localhost:5000/api';
    static BASE_URL = 'https://elyoinput.herokuapp.com/api';
}

export default Constant;
