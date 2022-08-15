// offline data
// db.enablePersistence().catch(err => {
//   // probably multible tabs open at once
//   if (err.code == 'failed-precondition') { console.log('persistence failed') }

//   //lack of browser support for the feature
//   else if (err.code == 'unimplemented') { console.log('persistence not available') }
// })

// real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  console.log(snapshot.docChanges())
  snapshot.docChanges().forEach(change => {
    console.log(change.type, change.doc.id, change.doc.data())
    // add the document data to the web page
    if (change.type === 'added') { renderRecipe(change.doc.data(), change.doc.id) }
    // remove the document data from the web page
    if (change.type === 'removed') { removeRecipe(change.doc.id) }
  })
})

// add new recipe
const form = document.querySelector('form')
form.addEventListener('submit', evt => {
  evt.preventDefault()
  const recipe = { title: form.title.value, ingredients: form.ingredients.value }
  db.collection('recipes').add(recipe).catch(err => console.log(err))
  form.title.value = ''
  form.ingredients.value = ''
})

// delete recipe
const recipeContainer = document.querySelector('.recipes')
recipeContainer.addEventListener('click', evt => {
  if (evt.target.tagName === 'I') {
    const id = evt.target.getAttribute('data-id')
    db.collection('recipes').doc(id).delete()
      .then(() => { removeRecipe(id) })
  }
})