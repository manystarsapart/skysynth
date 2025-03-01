// function signUpUser(email, password) {
//   // get data from browser storage
//         // volume setting is saved only in browser storage
//         const localTotalWaterRewards = parseInt(localStorage.getItem('totalWaterReward')) || 0;
//         const localSavedWaterLevel = parseInt(localStorage.getItem('savedWaterLevel')) || 0;
//         const localCumulativeKeypress = parseInt(localStorage.getItem('cumulativeKeypress')) || 0;
//         const localCumulativeTime = parseInt(localStorage.getItem('cumulativeTime')) || 0;
// }


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