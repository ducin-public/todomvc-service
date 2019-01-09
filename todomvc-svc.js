const { randomGuid } = require('./utils')

const getStore = () => {
  let collection = []
  const getIdx = (id) => collection.findIndex(t => t.id === id)

  const init = (initialData) => {
    collection = initialData
    console.info(`SVC > Todos initilized, count: ${initialData.length}`)
  }

  const getAllItems = () => {
    console.info(`SVC > All todos fetched, count: ${collection.length}`)
    return collection
  }

  const addItem = (title) => {
    const newItem = {
      id: randomGuid(),
      title,
      completed: false
    }
    collection.unshift(newItem)
    console.info(`SVC > Todo ID:${newItem.id} added`)
    return newItem
  }

  const deleteItem = (id) => {
    const idx = getIdx(id)
    debugger
    if (idx == -1) {
      throw new Error('Invalid ID')
    }
    const item = collection.splice(idx, 1)
    console.info(`SVC > Todo ID:${id} removed`)
    return item[0]
  }

  const updateItem = (id, changes) => {
    const idx = getIdx(id)
    if (idx == -1) {
      throw new Error('Invalid ID')
    }
    collection[idx] = { ...collection[idx], ...changes }
    console.info(`SVC > Todo ID:${id} updated`)
    return collection[idx]
  }

  return {
    init,
    getAllItems,
    addItem,
    deleteItem,
    updateItem
  }
}

module.exports = {
  getStore
}
