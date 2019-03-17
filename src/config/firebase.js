import firebase from 'firebase';

  var config = {
    apiKey: "AIzaSyBhCblsU0yU-u_q2c6uR9j_9_PidWb4eco",
    authDomain: "freightshipping-b7afe.firebaseapp.com",
    databaseURL: "https://freightshipping-b7afe.firebaseio.com",
    projectId: "freightshipping-b7afe",
    storageBucket: "freightshipping-b7afe.appspot.com",
    messagingSenderId: "919462313129"
  };

  const fire = firebase.initializeApp(config);
  
  export default fire;
