const app = Vue.createApp({
    data() {
        return {
            list: {}
        }
    },
    computed:{
        listID(){
            return new URLSearchParams(window.location.search).get('id')
        },
       
        
    },
    methods: {
        GetList(){
            var a = {}
            const listSource = `https://openlibrary.azurewebsites.net/api/book/${this.listID}`
            console.log(listSource)
            axios.get(listSource)
            .then((response)=>{
                this.list = response.data
                console.log(this.list)
            })
            console.log(this.list)
            
        }
        
    },

    created: function(){
        this.GetList()
    }
});

// window.app.GetList()
