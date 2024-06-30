import React, {useState, useRef} from "react";
import { Dimensions, Animated, SafeAreaView, Image, View, Pressable } from "react-native";
import { useSharedValue } from "react-native-reanimated";

const ImageCarousel = () => {

    const CARD_WIDTH = 300;
    const SCREEN_WIDTH = Dimensions.get("screen").width;

    // -------------------- Images ------------------------
    const carouselItems = [
      {
          image: require('../../assets/images/construction1.jpg'),
      },
      {
          image: require('../../assets/images/construction2.jpg'),
      },
      {
          image: require('../../assets/images/construction3.jpg'),
      },
    ];


    const scrollXOffset = useSharedValue(0);
    const scrollRef = useRef(null);

    const [isFirstCard, setIsFirstCard] = useState(scrollXOffset.value === 0);
    const [isLastCard, setIsLastCard] = useState(false);
    const [scrollViewWidth, setScrollViewWidth] = useState(0);

    // ------------------ Methods ----------------------
    const handleCarouselItemPress = (index) => {
      console.log("Pressed carousel item at index:", index);  // Handle carousel item press event
    };
    
    const handleContentSizeChange = (contentWidth, contentHeight) => {
      setScrollViewWidth(contentWidth);
    };
    
    const goToPrevious = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: scrollXOffset.value - CARD_WIDTH,
          animated: true,
        });
      }
    };
    
    const goToNext = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: scrollXOffset.value + CARD_WIDTH,
          animated: true,
        });
      }
    };
    
    const scrollHandler = (event) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      scrollXOffset.value = offsetX;
    
      const isFirst = offsetX === 0;
      const isLast = offsetX >= scrollViewWidth - SCREEN_WIDTH;
    
      setIsFirstCard(isFirst);
      setIsLastCard(isLast);
    };
    // -------------------------

    return (
        <SafeAreaView style={[{flex:1, justifyContent:'center', }]}>
            <View style={[{overflow: 'visible'}]}>
              
              <Animated.ScrollView
                ref={scrollRef}
                horizontal
                onScroll={scrollHandler}
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH}
                scrollEventThrottle={16}
                decelerationRate={0}
                contentContainerStyle={[{overflow: 'visible', }]}
                onContentSizeChange={handleContentSizeChange}
              >
                {/* --------------- Carousel Image ------------ */}
                {carouselItems.map((item, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleCarouselItemPress(index)}
                  style={{ width: CARD_WIDTH, height: 300, marginRight: 18 }}
                >
                  <Image
                    source={item.image}
                    style={{ width: CARD_WIDTH, height: CARD_WIDTH , borderRadius: 8 }}
                  />
                </Pressable>
                ))}
              </Animated.ScrollView>
              

              {/* --------------- previous and next arrow ---------------- */}
              {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between',}}>
                <Pressable
                  disabled={isFirstCard}
                  onPress={goToPrevious}
                  style={{ paddingTop: 10,}}
                >
                  <Image source={require('../../assets/images/previous.png')} style={{ height: 34, width: 34 }} />
                </Pressable>
                <Pressable
                  disabled={isLastCard}
                  onPress={goToNext}
                  style={{ paddingTop: 10,}}
                >
                  <Image source={require('../../assets/images/forward.png')} style={{ height: 34, width: 34 }} />
                </Pressable>
              </View> */}

            </View>

        </SafeAreaView>
    );
  };
  
  export default ImageCarousel;