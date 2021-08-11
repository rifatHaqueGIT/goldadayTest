import React, {useState, useEffect, useRef} from 'react';
import {  Alert,TouchableHighlight , Button, FlatList, StyleSheet, Text, View, TextInput } from 'react-native';

const Flat = (props) => {
  //Comented out states are also a part of edit portion
  // const [showText, setShowText] = useState(false);
  // const [textInputValue, setTextInputValue] = React.useState('');
  let vals = props.datas.filter(data => data.restId == props.num);// nt the best place to filter the data as the prop is passed down multiple components, but it works.
  return (
    <View>
      <FlatList
        data = {vals}
        renderItem = {({item}) => 
        (
          <View>
            {
              //Show the ratings
            }
              <Text style={styles.buttonText}>
                  
                  {item.rating}          |       {item.date}
              
              </Text>
              {
                //This button is for the delete function
              }
               <Button 
                
                title = "Delete"
                onPress = { () => props.removeRating(item.id)}
              />
              
              
              {/* This portion is has the unfinished version of the edit function
              <Button 
                // CURRENTLY NOT DONE PROBABLY NEED TO ADD A TEXT INPUT PART
                style={styles.buttonText}
                title = "Edit"
                onPress = { () =>setShowText(true)}// props.editRating(item.rating, item.rID)
              />
             {showText ? 
             <TextInput
              value = {textInputValue}
              onChangeText ={text => setTextInputValue(text)}
              onKeyPress = {()=> props.editRating({textInputValue}, item.id)}
              />: null} */}
            </View>
        )
        }
      /> 
      </View>
  )
}
const Child = React.forwardRef((props, ref) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);//for hiding the flat list
  
  React.useImperativeHandle(ref, () => ({

    _onPress() {
      setShowMoreInfo(!showMoreInfo);//onPress event is given to parent
    }

  }))
  const {data,removeRating, editRating,num} = props;// destructing the prop
  return (
    <View >
      
      {showMoreInfo ? 
      <View >
        <Flat datas = {data} removeRating = {removeRating} editRating = {editRating} num = {num}/>
        </View> 
      : null}
    </View>
  )
});

//The restaurants
const rest = [
  {id: 1 , name: 'Bavarian Bar'},
  {id: 2 , name: 'Turkish Tavern'},
  {id: 3 , name: 'Pub By Halicarnassus'},
  {id: 4 , name:  'Australian BBQ'},
]
const App = () => {
//State of ratings
  const [datas, setData] = useState([
    {id: 1, restId: 1 , rating: 4, date: (new Date(99,5)).toDateString()},
    {id: 2,restId: 1 , rating: 5, date: (new Date(99,6)).toDateString()},
    {id: 3,restId: 1 , rating: 1.1, date: (new Date(2000,5)).toDateString() },
    {id: 4,restId: 2 , rating: 3.2, date: (new Date(99,2)).toDateString() },
    {id: 5,restId: 2 , rating: 2.6, date: (new Date(99,11)).toDateString()},
    {id: 6,restId: 2 , rating: 2.9, date: (new Date(2010,5)).toDateString() },
    {id: 7,restId: 3 , rating: 3.1, date: (new Date(2001,8)).toDateString() },
    {id: 8,restId: 3 , rating: 4.9, date: (new Date(2000,6)).toDateString() },
    {id: 9,restId: 3 , rating: 4.6, date: (new Date(2005,8)).toDateString() },
    {id: 10,restId: 4, rating: 2.9, date: (new Date(2010,7)).toDateString() },
    {id: 11,restId: 4, rating: 3.1, date: (new Date(2020,5)).toDateString() },
    {id: 12,restId: 4 , rating: 4.9, date: (new Date(2021,2)).toDateString() },
  ]);//making the reviews a state

  //Function to remove a rating
  const removeRating = id =>{
    const arr = datas.filter(data => data.id !== id);
    setData(arr);
  }

  
  // Function for editing is incorrect (causes the app to throw an error)
  const editRating = (val, ref)=>
  {
    setData(prevState => ({
      value: prevState.map(
          el => el.id === ref ? {...el, rating : val} : el
        )
    }))
  }

  //useEffect
  //State of averages
  const [avg, setAvg] = useState([
    {id: 1 , average: 0},
    {id: 2 , average: 0},
    {id: 3 , average: 0},
    {id: 4 , average: 0},
  ]);

  //Made a ref for each Child. TThis is the same number of refs as the number of restaurants
  const childRef = useRef();
  const childRef1 = useRef();
  const childRef2 = useRef();
  const childRef3 = useRef();


  const setAverages = () =>
  {
    let i = 1;//restId starts at 1
    let sum = 0;// each restauants reviews summed up
    let noObj = 0;//number of reviews
    const newAvg = [];//empty array to update with new values
    avg.forEach(elem => {
      datas.forEach(el => 
      {
        if(el.restId === i)// if the review and restaurant share the rest id
          {
            sum += el.rating;// add that review to the sum
            noObj++;//increment the number of reviews
          }
      })
      let v = sum/noObj;// the value to be added to averages
      if(noObj == 0)// when no reviews are left
        v = 0;// just put a value of 0 b/c NaN looks bad
      newAvg.push({id: i , average: v.toFixed(1)});// push that particular avg into a new array of averages
      // reset the sum and noObj aswell as increment i
      i = elem.id +1;
      sum = 0;
      noObj = 0;
  })
    setAvg(newAvg);// setting new averages
  }

//Use effect to call
  useEffect(()=>{
    setAverages();
    
    },[datas])// calls setAverages everytime a review is deleted

  return (
   // A touchable for each restaurant
<View style={styles.container}>
        <TouchableHighlight  onPress = {() => childRef.current._onPress()}> 
          <View>
            <Text style={styles.buttonText}>{rest[0].name}    Average Rating:  {avg[0].average}</Text>
         </View>
         </TouchableHighlight>
         <Child ref = {childRef} data = {datas} removeRating = {removeRating} editRating = {editRating} num = {1}/>
         <TouchableHighlight  onPress = {() => childRef1.current._onPress()}> 
          <View>
            <Text style={styles.buttonText}>{rest[1].name}      Average Rating:  {avg[1].average}</Text>
         </View>
         </TouchableHighlight>
         <Child  ref = {childRef1} data = {datas} removeRating = {removeRating} editRating ={editRating} num = {2}/>
         <TouchableHighlight  onPress = {() => childRef2.current._onPress()}> 
          <View>
            <Text style={styles.buttonText}>{rest[2].name}       Average Rating:  {avg[2].average}</Text>
         </View>
         </TouchableHighlight>
         <Child ref = {childRef2} data = {datas} removeRating = {removeRating} editRating ={editRating} num = {3} />
         <TouchableHighlight  onPress = {() => childRef3.current._onPress()}> 
          <View>
            <Text style={styles.buttonText}>{rest[3].name}      Average Rating:  {avg[3].average}</Text>
         </View>
         </TouchableHighlight>
         <Child ref = {childRef3} data = {datas} removeRating = {removeRating} editRating ={editRating} num = {4} />
         
    </View>
  );
}

//Some bad stylings
const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22,
   justifyContent: 'center',
   backgroundColor: '#fff',
   padding: 8,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  thing: {
    color: '#841584',
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'black'
  }
  
});
export default App;
