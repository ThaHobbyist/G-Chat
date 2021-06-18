/* eslint-disable */
<template>
    
<div class="container" id="container">
	<aside :class=" { close: open } ">
		<div class="user">
			<div class="img"><img :src= user.photoURL alt=""></div>
			<div class="heading"><h2> {{ user.displayName }} </h2>
			<button class="logout" @click="$store.dispatch('logout')"><i class="fa fa-sign-out" aria-hidden="true"></i></button></div>
			
		</div>
		<hr class="break">
		<header>
			<input type="text" id="mySearch" @change="search" @keyup="search" v-model="searchText" placeholder="Search names...">
		</header>
		<ul v-if="searchText.trim().length === 0">
			<li v-for="usr in users" :key="usr.displayName" >
				
				<div class="list" @click="openChat(usr)">
					<div class="img"><img :src = usr.photoURL alt=""></div>
					<div class="heading"><h3>{{ usr.displayName }} </h3></div>
				</div>
				<hr>
			</li>
		</ul>
		<ul v-else>
			<li v-for="usr in searchResult" :key="usr.displayName" >
				<div class="list" @click="openChat(usr)">
					<div class="img"><img :src = usr.photoURL alt=""></div>
					<div class="heading"><h3>{{ usr.displayName }} </h3></div>
					
				</div>
				<hr>
			</li>
		</ul>
	</aside>
	<main v-if="show" :class=" { closed: !open } ">
		<header >
			<div id="burger" :class="{ 'active' : active}" @click="toggleActive">
        		<button type="button" class="burger-button" title="Menu">
            		<span class="burger-bar burger-bar--1"></span>
            		<span class="burger-bar burger-bar--2"></span>
            		<span class="burger-bar burger-bar--3"></span>
        		</button>
    		</div>
			<img :src = s_usr.photoURL  alt="">
			<div class="heading">
				<h2>{{ s_usr.displayName }}</h2>
			</div>
		</header>
		<div class="messages" >
			<ul id="chat" ref="scrollable">
				<li v-for="(msg, index) in messages" :key="'index-'+index" :class="sentOrRecieved(msg.sender, msg.reciever)" >
					<h3 v-if="msg.text">{{ msg.text }}</h3>
					<img v-else class="image" :src= msg.downloadURL alt="">
				</li>
			</ul>
		</div>
		<footer>
      		<form v-on:submit.prevent="sendMessage">
        		<input class="text" v-model="message" type="text" placeholder="Type your message"/>
				<input class="file" type="file" @change="onFilePicked" hidden="hidden" ref="fileInput"/>
				<button type="button" @click="$refs.fileInput.click()" ><i class="fa fa-file-image-o fa-2x"></i></button>
				<span v-if="imageName" id="custom-text"> {{imageName}} </span>
        		<button v-if="!imageName" :disabled="!message" type="submit"><i class="fa fa-paper-plane fa-2x" aria-hidden=true></i></button>
				<button v-else  @click="onUpload"><i class="fa fa-upload" aria-hidden="true"></i></button>
      		</form>
		</footer>
	</main>
	<main class="text" v-else :class=" { closed: !open } ">
		<header>
			<div id="burger" :class="{ 'active' : active}" @click="toggleActive">
        		<button type="button" class="burger-button" title="Menu">
            		<span class="burger-bar burger-bar--1"></span>
            		<span class="burger-bar burger-bar--2"></span>
            		<span class="burger-bar burger-bar--3"></span>
        		</button>
    		</div>
			
		</header>
		<h2>Select an User to chat with!</h2>
	</main>
	<div class="right">
		<h1>About User</h1>
		<img :src= s_usr.photoURL alt="" class="image">
		<h2> {{s_usr.displayName}} </h2>
		<h3> {{s_usr.email}} </h3>
	</div>
</div>
</template>

<script>
import firebase from 'firebase'

export default {
	  
    mounted() {
        this.db.collection('messages').orderBy('createdAt')
            .onSnapshot( querySnap => {
                this.messages = querySnap.docs.map(doc => doc.data())	
            })
        this.db.collection('users').where("email", "!=", this.user.email)
            .onSnapshot( querySnap => {
                this.users = querySnap.docs.map(doc => doc.data())
                console.log(this.users)
            })	
    },
    data() {
        return {
			user: this.$store.state.user,
			db: firebase.firestore(),
			message: '',
			messages: [],
			view_messages: [],
			users: [],
			s_usr: [],
			searchResult: [],
			searchText: "",
			show: false,
			open: true,
			active: false,
			photo: null, 
			photo_url: null,
			dialogue:false,
			imageName: "",
			imageFile: "",
			imageUrl: "",
			imageUrls: [],
        }
    },
    methods: {
		toggleActive() {
			this.active = !this.active
			this.open = !this.open
		},
        async sendMessage() {

			const messageInfo = {
				'sender': this.user.uid,
				'reciever': this.s_usr.userUID,
				'displayName': this.user.displayName,
				'photoURL': this.user.photoURL,
				'type': "text",
				'text': this.message,
				'createdAt': Date.now(),
			}

			await this.db.collection('messages').add(messageInfo)

			this.message = ''
			this.$refs['scrollable'].scrollIntoView({ behaviour: 'smooth'})
			
        },
        sentOrRecieved(senderID, recieverID) {
          if (senderID == this.s_usr.userUID && recieverID == this.user.uid){
            return "you"
          }
          else if (senderID == this.user.uid && recieverID == this.s_usr.userUID){
            return "me"
          }
		  else {
			return "none"
		  }
        },
        openChat(user) {
          	this.s_usr = user
        	console.log(user.email)
			this.show = true
			this.toggleActive()
			this.searchText = ""
			
			console.log(this.view_messages)
        },
		search() {
			console.log(this.searchText)
			this.searchResult = []
			this.users.map((usr) => {
				if (usr.displayName.toLowerCase().includes(this.searchText.trim()) ){
					this.searchResult.push(usr)
					
				}
				
			})
		},
		onFilePicked(event) {
			const files = event.target.files
			if(files[0] !== undefined) {
				this.imageName = files[0].name
				if (this.imageName.lastIndexOf(".") <= 0) {
					return
				}
				const fr = new FileReader()
				fr.readAsDataURL(files[0])
				fr.addEventListener("load", () => {
					this.imageUrl = fr.result
					this.imageFile = files[0]
				})
			}
			else {
				this.imageName = ""
				this.imageFile = ""
				this.imageUrl = ""
			}
		},
		onUpload() {
			var storageRef = firebase.storage().ref()
			var mountainsRef = storageRef.child(` images/${this.imageName} `)

			mountainsRef.put(this.imageFile).then(snapshot => {
				snapshot.ref.getDownloadURL().then(downloadURL => {
					console.log(downloadURL)
					this.db.collection("messages").add({
						'type':'image',
						'downloadURL': downloadURL,
						'createdAt': Date.now(),
						'sender': this.user.uid,
						'reciever': this.s_usr.userUID,
						'displayName': this.user.displayName,
						'photoURL': this.user.photoURL,
						'text': null,
					})
				})
			})

			this.imageName = ""
			this.imageFile = ""
			this.imageUrl = ""
		} 
    },
  }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Overlock+SC&display=swap');

*{
    box-sizing: border-box;
}

.toggle{
	display:none;
}

form.example input[type=text] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 70%;
  background: #f1f1f1;
}

/* Style the submit button */
form.example button {
  float: right;
  width: 10%;
  padding: 10px;
  background: #2196F3;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none; /* Prevent double borders */
  cursor: pointer;
}

form.example button:hover {
  background: #0b7dda;
}

/* Clear floats */
form.example::after {
  content: "";
  clear: both;
  display: table;
}
#container{
	width:100%;
	height:97vh;
	background:transparent;
	margin:0 auto;
	overflow:hidden;
}
aside{
	width:18%;
	height:100%;
	background-color:#3B4252;
	display:inline-block;
	border-radius: 10px;
	font-size:15px;
	overflow: hidden;
	transition: all 499ms ease;
}
main{
	width:60%;
	height:100%;
	display:inline-block;
	font-size:15px;
	vertical-align:top;
	border-radius: 10px;
	margin-left: 10px;
	background-color: #3B4252;
}

.right{
	display: inline-block;
	background-color: #3B4252;
	margin-left:10px;
	width: 20.5%;
	height: 100%;
	vertical-align: top;
	border-radius: 10px;
	text-align: center;
	font-family: 'Poppins', sans-serif;
}

.right h1{
	font-size: 30px;
	margin-left: 5%;
	text-decoration: underline;
	color: white;
	font-weight: 300;
	text-align: left;
	width: 100%;
}

.right img{
	border-radius: 50%;
	width: 40%;
	align-self: center;
	border: 4px solid #62708b ;
}

.right h2{
	font-size: 20px;
	color: white;
}

.right h3{
	font-size: 14px;
	color: white;
}
aside header{
	padding: 15px 20px;
}
aside input{
	width:100%;
	height:50px;
	line-height:50px;
	padding:0 50px 0 20px;
	background-color:#5e616a;
	border:none;
	border-radius: 20px;
	color:#fff;
	background-image:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_search.png);
	background-repeat:no-repeat;
	background-position-x: right;
	background-position-y: center;
	background-size:40px;
}

aside input::placeholder{
	color:#fff;
}

aside .logout {
	height: 30%;
	width: 20%;
	float: right;
	margin-right: 15%;
	margin-top: 4%;
	cursor: pointer;
	background-color: transparent;
	border: 1px solid black;
	border-radius: 7px;
	color: white;
}

aside .user {
	font-family: 'Poppins', sans-serif;
	
	color: #ccc;
	padding: 20px 0px;
	text-align: left;
	display: flex;
}

aside .user .heading{
	width: 100%;
}

aside .user h2{
	padding: 10px;
	font-weight: 700;
	font-size: 19px;
	padding-right: 20px;
	vertical-align: top;
	margin-bottom: 0px;
	margin-top: 3%;
}

aside .user img{
	border-radius: 50%;
	border:2px solid rgb(255, 255, 255);
	width: 90px;
	height: 90px;
	margin-left: 10px;
}

aside .break {
	width: 100%;
	margin: 0px;
}

aside ul{
	padding-left:0;
	margin:0;
	height: 70%;
	list-style-type:none;
	overflow-y:scroll;
}

::-webkit-scrollbar{
	width:5px;
	transition: smooth;
}

::-webkit-scrollbar:hover{
	width:10px;
}

::-webkit-scrollbar-track{
	background: transparent;
}

::-webkit-slider-thumb{
	background: rgb(0, 87, 187);
}
::-webkit-scrollbar-thumb:hover{
	background: rgb(0, 102, 219);
}
aside li .list{
	padding:10px 10px;
	width: 100%;
	font-family: Roboto, sans-serif;
	font-weight: 100;
	font-size: 25px;
	cursor: pointer;
	display: flex;
}
aside li .list:hover{
	background-color:#5e616a;
}

aside li .list .heading{
	margin-left: 10px;
}

aside li hr {
	width: 80%;
	height: 1px;
	float:center;
	border: none;
	background-color: #475064;
}

aside li img{
	border-radius:50%;
	width: 50px;
	height: 50px;
	display: inline-block;
}
aside li div{
	display:inline-block;
	vertical-align:top;
}
aside li h2{
	font-size:14px;
	color:#fff;
	font-weight:normal;
	margin-bottom:5px;
}
aside li h3{
	font-size:18px;
	color:#c7c7c7;
	font-weight: 400;
	margin-top:4%
}

.text{
	background-color: none;
	text-align: center;
}

.text h2{
	font-family: 'Poppins', sans-serif;
	vertical-align: middle;
	font-weight: 800;
	color: white;
}

main .messages {
	height: 76.5%;
	background-color:#3B4252 ;
	padding-left: 1%;
	padding-right: 1%;
	padding-top: 2%;
}

main header{
	height:110px;
	padding:30px 20px 30px 40px;
	background-color: #434C5E;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
}

main header img{
	border-radius:50%;
	width: 50px;
	float: left;
	vertical-align: middle;
}
main header img:last-child{
	width:12px;
	margin-top:8px;
}
main header div{
	margin-left:5%;

}
main header h2{
	font-family: 'Poppins', sans-serif;
	color: white;
	font-size:20px;
	font-weight: 400;
	margin:5px;
	margin-left: 10px;
	vertical-align: middle;
	text-align: left;
}

#chat::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
#chat {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

#chat{
	padding-left:0;
	margin:0;
	list-style-type:none;
	overflow-y:scroll;
	height: 100%;
	width: 100%;
	color: white;
}
#chat li{
	display: inline-block;
	clear:both;
	padding: 15px;
	margin-bottom: 5px;
	border-radius: 5px;

}
#chat h2,#chat h3{
	display:inline-block;
	font-family: 'Lato', sans-serif;
	font-size: 18px;
	font-weight:normal;
	margin:0;
}
#chat .entete{
	margin-bottom:5px;
}

#chat .image{
	border-radius:5px;
	max-width: 500px;
	max-height: 500px;
}

#chat img{
	height: 100%;
	width: 100%;
	object-fit: cover;
	border-radius: 40px;
}

.me {
	text-align:right;
	background-color:#354194;
	float: right ;
}
.you {
	text-align: left ;
	float: left ;
	background-color:#434C5E ;
	border: 2px solid #4C566A ;
}

#chat .none{
	width: 0;
	height: 0;
	display: none;
}

.me:last-of-type {
	border-radius: 5px ;
  	border-bottom-right-radius: 10px ;
}

.you:last-of-type {
	border-radius: 5px ;
  	border-bottom-left-radius: 10px ;
}

.you + .me{
	border-radius: 5px ;
	border-top-right-radius: 10px ;
}

.me + .you {
	border-radius: 5px ;
	border-top-left-radius: 10px ;
}

.me + .me{
	border-radius: 5px ;
  	
}

.you + .you{
	border-radius: 5px ;
}

#chat > .me:first-child{
	border-radius: 5px ;
	border-top-right-radius: 10px ;
}

#chat > .me:last-child{
	border-bottom-right-radius: 10px ;
}

#chat > .you:first-child{
	border-radius: 5px;
	border-top-left-radius: 10px ;
}

#chat > .you:last-child{
	border-bottom-left-radius: 10px ;
}

main footer{
	height:10%;
	padding: 20px;
	overflow: scroll;
	border-top: 2px solid white;
}

main footer form {
	display: flex;
}

main footer .text{
	text-align: left;
	resize:none;
	border:none;
	width:90%;
	float: left;
	height:55px;
	border-radius:3px;
	padding:20px;
	font-size:18px;
	margin-bottom:13px;
}
main footer input .text::placeholder{
	color:rgb(146, 146, 146);
}

main footer button{
	background-color: transparent;
	border: 1px solid black;
	color: white;
	border-radius: 3px;
	vertical-align:middle;
	margin-top:5px;
	float: right;
	padding: 0;
	cursor: pointer;
	width: 40px;
	height: 40px;
	margin-left: 2%;
}

#custom-text{
	margin-left: 10px;
	font-family: sans-serif;
	font-size: 18px;
	color: white;
}

main footer button:focus{
	color: rgb(201, 201, 201);
}

main footer button:hover{
	background-color: rgba(78, 78, 78, 0.171);
	color: rgb(201, 201, 201);
}

.burger-button{
	display:none;
}

@media screen and (max-width: 700px) {

	.third{
		display: none;
	}

	header{
		width: 100%;
	}
	#container {
		margin: auto;
		height: 97.5vh;
		vertical-align: middle;
		position: relative;
	}

	aside {
		position: relative;
		width: 80%;
		z-index: 99;
		opacity: 1;
		background-color: #333946;
	}

	main{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		margin-left: 0.5%;
	}

	.close{
		width: 0vw;
	}

    .hidden {
        visibility: hidden;
    }

    button {
        cursor: pointer;
    }

    /* remove blue outline */
    button:focus {
        outline: 0;
    }

	#burger{
		display: block;
		float: right;
		margin-right: 0;
	}

    .burger-button {
        position: relative;
        height: 30px;
        width: 40px;
		margin-top: 8px;
        display: block;
        z-index: 99;
        border: 0;
        border-radius: 0;
        background-color: transparent;
        pointer-events: all;
        transition: transform .6s cubic-bezier(.165, .84, .44, 1);
    }

    .burger-bar {
        background-color: #fff;
        position: absolute;
        top: 50%;
        right: 6px;
        left: 6px;
        height: 3px;
        width: auto;
        margin-top: -1px;
        transition: transform .6s cubic-bezier(.165, .84, .44, 1), opacity .3s cubic-bezier(.165, .84, .44, 1), background-color .6s cubic-bezier(.165, .84, .44, 1);
    }

    .burger-bar--1 {
        -webkit-transform: translateY(-6px);
        transform: translateY(-6px);
        top: 40%;
    }

    .burger-bar--2 {
        transform-origin: 100% 50%;
        transform: scaleX(1);
    }

    .burger-button:hover .burger-bar--2 {
        transform: scaleX(1);
    }

    .no-touchevents .burger-bar--2:hover {
        transform: scaleX(1);
    }

    .burger-bar--3 {
        transform: translateY(6px);
        top: 60%;
    }

    #burger.active .burger-button {
        transform: rotate(-180deg);
    }

    #burger.active .burger-bar {
        background-color: lighten(#2b2b68, 10);
    }

    #burger.active .burger-bar--1 {
        transform: rotate(45deg);
        top: 50%;
    }

    #burger.active .burger-bar--2 {
        opacity: 0;
    }

    #burger.active .burger-bar--3 {
        transform: rotate(-45deg);
        top: 50%;
    }

	main .messages {
		width: 100%;
	}

	main header{
		padding: 10px;
	}

	main header h2{
		margin-left: 5%;
		font-size: 20px;
	}

	main header img {
		margin: 5px;
	}
	main header .heading{
		text-align: center;
		margin: 0;
	}

	main .logout{
		float: bottom;
	}

	main .messages{
		height: 65%;
	}

	main #chat{
		height: 100%;
	}

	main footer{
		height: 20%;
	}

	main footer input{
		width: 80%;
		height: 60px;
	}

	main .messages h3{
		margin: 0;
		line-height: normal;
	}

	#chat .message {
		padding: 8px 20px;
	}

	#chat .image{
		max-width: 70%;
	}
}

</style>