onAuthStateChanged(auth, (user) => {
  if (user) {
    // signed in
    console.log('user is logged in:', user);
    const userDoc = db.collection('users').doc(user.uid);
    // update UI
    document.getElementById('logout-button').style.display = 'block';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'none';

    // get user data from firestore
    userDoc.get().then((doc) => {
      const dbData = doc.data();
      // volume setting is saved only in browser storage
      const localTotalWaterRewards = parseInt(localStorage.getItem('totalWaterReward')) || 0;
      const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
      const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
      const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;

      // compare for highest value
      const newTotalWaterRewards = Math.max(dbData.totalWaterRewards, localTotalWaterRewards);
      const newSavedWaterLevel = Math.max(dbData.savedWaterLevel, localSavedWaterLevel);
      const newCumulativeKeypress = Math.max(dbData.cumulativeKeypress, localCumulativeKeypress);   
      const newCumulativeTime = Math.max(dbData.cumulativeTime, localCumulativeTime);

      // update firestore & localStorage
      userDoc.update({ 
        totalWaterRewards: newTotalWaterRewards, 
        savedWaterLevel: newSavedWaterLevel,
        cumulativeKeypress: newCumulativeKeypress,
        cumulativeTime: newCumulativeTime,
      });
      localStorage.setItem('totalWaterReward', newTotalWaterRewards);
      localStorage.setItem('savedWaterLevel', newSavedWaterLevel);
      localStorage.setItem('cumulativeKeypress', newCumulativeKeypress);
      localStorage.setItem('cumulativeTime', newCumulativeTime);
    });
  } else {
    // signed out
    console.log('user is logged out');
    // update UI
    document.getElementById('logout-button').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'block';
  }
});


function signUpUser(email, password) {
  // get data from browser storage
        // volume setting is saved only in browser storage
        const localTotalWaterRewards = parseInt(localStorage.getItem('totalWaterReward')) || 0;
        const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
        const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
        const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;
}


function updateOnUnload() {
  if (user) {
    // signed in
    console.log('user is logged in:', user);
    console.log('updating db on unload...');
    const userDoc = db.collection('users').doc(user.uid);

    // get data from firestore
    userDoc.get().then((doc) => {
      const dbData = doc.data();
      // volume setting is saved only in browser storage
      const localTotalWaterRewards = parseInt(localStorage.getItem('totalWaterReward')) || 0;
      const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
      const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
      const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;

      // update firestore & localStorage
      userDoc.update({ 
        totalWaterRewards: localTotalWaterRewards, 
        savedWaterLevel: localSavedWaterLevel,
        cumulativeKeypress: localCumulativeKeypress,
        cumulativeTime: localCumulativeTime,
      });
    });
  }
  // else signed out: do nothing
}

export { updateOnUnload };