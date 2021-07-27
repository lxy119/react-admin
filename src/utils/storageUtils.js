import store from 'store'

const USER_KEY = 'data_key'
// eslint-disable-next-line
export default {
    saveUser(data){
        store.set(USER_KEY,data)
    },
    getUser(){
        return store.get(USER_KEY)||{}
    },
    removeUser(){
        store.remove(USER_KEY)
    }
}