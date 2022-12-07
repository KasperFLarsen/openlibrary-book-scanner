const app = Vue.createApp({
    data() {
        return {
            isbn: "",
            title: "",
            author: "",
            subjects: "",
            numberOfPages: "",
            languages: "",
            publishDate: "",
            authorID: "",
            authorTrimmed: "",
            personalAuthorName: "",
            languageTrimmed:"",
            show: false,
            workTrimmed: "",
            listName: "",
            addToListProps: {
                listID: "",
                ISBN: ""
            }
            

            }

        },


        methods: {
            //Finder en bog ved hjælp af et API kald ud fra dens ISBN nummer
            GetBookByIsbn(){
                const BookSource = `https://openlibrary.org/isbn/${this.isbn}.json`
                inputfield = document.getElementById("inputField")
                inputfield.select()

                axios.get(BookSource)

            
                    .then( response =>{
                        this.title = response.data.title
                        this.author = response.data.authors
                        this.subjects = response.data.subjects
                        if (response.data.number_of_pages != null){
                            this.numberOfPages = response.data.number_of_pages
                        }
                        else if (response.data.pagination != null){
                            this.numberOfPages = response.data.pagination
                        }
                        this.languages = response.data.languages[0].key
                        this.publishDate = response.data.publish_date
                        this.authorID = this.author[0].key
                        this.languageTrimmed = this.languages.substring(11, this.languages.length)
                        this.authorTrimmed = this.authorID.substring(9, this.authorID.length)
                        this.workTrimmed = response.data.works[0].key.split("/")[2]

                        this.GetAuthorName()
                    })
                    .catch(function(error){
                        console.log(error);
                    })
            },

            GetBookLists(){
                const Listsource = `https://openlibrary.azurewebsites.net/api/book`   
                
                axios.get(Listsource)



            
                    .then( response =>{
                       this.ListName = response.data;
                       console.log(response);
                       console.log(this.ListName);
                       var listLength = this.ListName.length
                       for (var i = 0; i<listLength; i++){

                        console.log(this.ListName[i].list_Name);
                       }
                    })
                    .catch(function(error){
                        console.log(error);
                    })

            },

            AddBookToList(){
                const Listsource = `https://openlibrary.azurewebsites.net/api/book`   
                

                axios.post(`https://openlibrary.azurewebsites.net/api/book`, {
                    List_Name: this.addToListProps.listID,
                    isbn: this.addToListProps.ISBN
                })

                .then((response) => {
                    this.isbn = response.data;
                    console.log(response);
                    console.log(this.isbn)
                })

                .catch(function (error){
                    console.log(error);
                })

                
            },

                

            //Får fat i forfatterens navn ved at lave et nyt API kald med forfatter id for at få fat i navnet.
            GetAuthorName(){
                const AutherSource = `https://openlibrary.org/authors/${this.authorTrimmed}.json`
                console.log(this.authorTrimmed)
                axios.get(AutherSource)
                .then( response =>{
                      this.personalAuthorName = response.data.name
                })
                .catch(function(error){
                    console.log(error);
                })
            },

            GetWorkById(){
                const WorkSource = `https://openlibrary.org/works/${this.workTrimmed}.json`
                axios.get(WorkSource)
                .then( response =>{
                      this.personalAuthorName = response.data.name
                })
                .catch(function(error){
                    console.log(error);
                })
            },

            //Gør voes oversigt i view delen er usynlig indtil der klikkes på knappen 
            TurnTrue(){
                this.show=true
            }
        }
    },

);




function SetupWebSocket(){

    let ip = "ws://10.200.178.183:12000"

    var ws = new WebSocket(ip)

    ws.onopen = function(){
        alert("Connection is open")
    }

    ws.onmessage = function(evt){
        console.log(`isbn is: ${evt.data}`)
        
    }

    while (true){
        console.log(ws.readyState)
    }
}

//GetBookByIsbn()
//SetupWebSocket()

