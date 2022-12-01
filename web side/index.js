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
            }

        },


        methods: {
            //Finder en bog ved hjælp af et API kald ud fra dens ISBN nummer
            GetBookByIsbn(){
                const BookSource = `https://openlibrary.org/isbn/${this.isbn}.json`
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
                        //Gør voes oversigt i view delen er usynlig indtil der klikkes på knappen 
                        this.show = true
                    })
                    .catch(function(error){
                        console.log(error);
                    })
            },
            //Får fat i forfatterens navn ved at lave et nyt API kald med forfatter id for at få fat i navnet.
            GetAuthorName(){
                const AutherSource = `https://openlibrary.org/authors/${this.authorTrimmed}.json`
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
            OpenWebSocket(){
                let ip = "ws://192.168.14.102:12000"

                var ws = new WebSocket(ip)

                ws.onopen = function(){
                    alert("Connection is open")
                }

                ws.onmessage = (evt) => {
                    this.isbn = evt.data
                    this.GetBookByIsbn()
                }

                ws.onclose = function(){
                    alert("Scanner conection has been closed")
                }

                ws.onerror = function(evt){
                    console.log(evt)
                }
                window.addEventListener('beforeunload', (evt) =>{
                    ws.close()
                    evt.preventDefault()
                    evt.returnValue = ''
                    
                })
            }
        }
    },

);




